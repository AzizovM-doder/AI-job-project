'use client';

import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageTransition } from '@/components/PageTransition';
import { useJobQueries } from '@/hooks/queries/useJobQueries';
import { useJobMatchingQueries } from '@/hooks/queries/useJobMatchingQueries';
import { useConnectionQueries } from '@/hooks/queries/useConnectionQueries';
import { useNotificationQueries } from '@/hooks/queries/useNotificationQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Bell, ArrowRight, Star, MapPin, Eye, GraduationCap, ChevronRight, User } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function CandidateDashboard() {
  const { user } = useAuthStore();
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const router = useRouter();

  const { useMyApplications, useGetJob } = useJobQueries();
  const { useGetMyConnections } = useConnectionQueries();
  const { useGetNotificationsPaged } = useNotificationQueries();
  const { useRecommendedJobs } = useJobMatchingQueries();

  const { data: applications, isLoading: appsLoading } = useMyApplications();
  const { data: connections } = useGetMyConnections();
  const { data: notifications } = useGetNotificationsPaged({ PageSize: 5 });
  const { data: recommended, isLoading: matchLoading } = useRecommendedJobs(user?.userId ? Number(user.userId) : null, { PageSize: 5 });

  const unreadNotifs = notifications?.items?.filter(n => !n.isRead)?.length ?? 0;

  const stats = [
    { label: 'Active Applications', value: applications?.length || 0, icon: Briefcase, color: 'text-blue-600' },
    { label: 'Network Connections', value: connections?.length || 0, icon: Users, color: 'text-emerald-600' },
    { label: 'Potential Matches', value: recommended?.totalCount || 0, icon: Star, color: 'text-yellow-600' },
  ];

  return (
    <ProtectedRoute allowedRoles={['Candidate']}>
      <PageTransition className="space-y-8 pb-12">

        {/* Analytics Header */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Candidate Terminal</h1>
            <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
              ID: {user?.userId}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <Card key={i} className="shadow-sm border-border/60 hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm">
                <CardContent className="p-5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={cn("text-2xl font-bold", s.color)}>{s.value}</span>
                    <s.icon className="size-5 text-muted-foreground/40" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left/Main Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Recent Applications */}
            <Card className="shadow-sm border-border/60">
              <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-border/60">
                <CardTitle className="text-lg font-bold">Recent Applications</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary font-bold" onClick={() => router.push(`/${locale}/jobs`)}>
                  Browse more jobs
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {appsLoading ? (
                  <div className="p-5 space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : applications?.length ? (
                  applications.slice(0, 3).map((app) => (
                    <ApplicationRow key={app.id} application={app} useGetJob={useGetJob} />
                  ))
                ) : (
                  <div className="p-10 text-center text-muted-foreground italic text-sm">
                    No recent applications found in your history.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Matches */}
            <Card className="shadow-sm border-border/60">
              <CardHeader className="p-5 border-b border-border/60">
                <CardTitle className="text-lg font-bold">Top AI Matches</CardTitle>
                <p className="text-sm text-muted-foreground">Based on your decoded skill stack</p>
              </CardHeader>
              <CardContent className="p-0">
                {matchLoading ? (
                  <div className="p-5 space-y-4">
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : recommended?.items?.length ? (
                  recommended.items.slice(0, 3).map((match) => (
                    <div key={match.job.id} className="p-5 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                      <div className="flex gap-3 min-w-0">
                        <div className="size-12 bg-muted rounded border flex items-center justify-center shrink-0">
                          <Star className="size-6 text-yellow-500 fill-current" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-[14px] truncate group-hover:text-primary transition-colors cursor-pointer">{match.job.title}</h4>
                          <p className="text-[12px] text-muted-foreground">{match.job.location} • {match.job.jobType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold shrink-0">
                        {match.matchScore}% Match
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-muted-foreground italic text-sm">
                    Update your skills for better job matches.
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Quick Actions */}
            <Card className="shadow-sm border-border/60">
              <CardHeader className="p-5 border-b border-border/60">
                <CardTitle className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <button onClick={() => router.push(`/${locale}/profile`)} className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors border-b last:border-0 border-border/40">
                  <div className="flex items-center gap-3">
                    <User className="size-5 text-primary" />
                    <span className="text-[14px] font-medium font-sans">Update Profile</span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
                <button onClick={() => router.push(`/${locale}/networking`)} className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors border-b last:border-0 border-border/40">
                  <div className="flex items-center gap-3">
                    <Users className="size-5 text-accent" />
                    <span className="text-[14px] font-medium">Manage Network</span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
                <button onClick={() => router.push(`/${locale}/notifications`)} className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors border-b last:border-0 border-border/40">
                  <div className="flex items-center gap-3 relative">
                    <Bell className="size-5 text-primary" />
                    {unreadNotifs > 0 && <span className="absolute -top-1 -right-1 size-2 bg-primary rounded-full border border-background" />}
                    <span className="text-[14px] font-medium">Notifications</span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>

            {/* career Goal Card */}
            <Card className="shadow-sm border-border/60 bg-primary/5 border-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 size-24 bg-primary/10 rounded-full blur-3xl -mr-12 -mt-12" />
              <CardContent className="p-5 space-y-3 relative">
                <h3 className="font-bold text-sm">Boost candidate score</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Profiles with verified education history are prioritize by AI filters.
                </p>
                <Button
                  onClick={() => router.push(`/${locale}/profile`)}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full font-bold border-primary/40 text-primary hover:bg-primary/10"
                >
                  <GraduationCap className="size-4 mr-2" /> Add education history
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>

      </PageTransition>
    </ProtectedRoute>
  );
}

function ApplicationRow({ application, useGetJob }: { application: any, useGetJob: any }) {
  const { data: job, isLoading } = useGetJob(application.jobId);

  return (
    <div className="p-5 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors flex items-center justify-between group">
      <div className="flex gap-3">
        <div className="size-12 bg-muted rounded border flex items-center justify-center shrink-0">
          <Briefcase className="size-6 text-muted-foreground/40" />
        </div>
        <div>
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <h4 className="font-bold text-[14px] group-hover:text-primary transition-colors cursor-pointer">
              {job?.title || `Job #${application.jobId}`}
            </h4>
          )}
          <p className="text-[12px] text-muted-foreground">Applied {new Date(application.appliedAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className={cn(
        "px-3 py-1 rounded-full text-[11px] font-bold border",
        application.status === 'Accepted' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
          application.status === 'Rejected' ? "bg-red-50 text-red-600 border-red-200" :
            "bg-orange-50 text-orange-600 border-orange-200"
      )}>
        {application.status}
      </div>
    </div>
  );
}
