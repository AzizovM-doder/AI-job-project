'use client';

import { useAuthStore } from '@/src/store/authStore';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJobQueries } from '@/src/hooks/queries/useJobQueries';
import { useJobMatchingQueries } from '@/src/hooks/queries/useJobMatchingQueries';
import { useConnections } from '@/src/hooks/useConnections';
import { useNotifications } from '@/src/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Bell, ArrowRight, Star, MapPin, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';

export default function CandidateDashboard() {
  const { user } = useAuthStore();
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const { locale } = useParams();
  const { useMyApplications } = useJobQueries();
  const { useGetMyConnections } = useConnections();
  const { useGetNotifications } = useNotifications();
  const { useRecommendedJobs } = useJobMatchingQueries();

  const { data: applications, isLoading: appsLoading } = useMyApplications();
  const { data: connections } = useGetMyConnections();
  const { data: notifications } = useGetNotifications(1, 20);
  const userId = user?.userId ? Number(user.userId) : null;
  const { data: recommended, isLoading: matchLoading } = useRecommendedJobs(userId, { PageSize: 5 });

  const unreadNotifs = notifications?.items?.filter((n: any) => !n.isRead)?.length ?? 0;

  const stats = [
    { label: 'applications', icon: Briefcase, value: applications?.length ?? 0, trend: 'TOTAL_SUBMITTED' },
    { label: 'connections', icon: Users, value: connections?.length ?? 0, trend: 'ACTIVE_LINKS' },
    { label: 'notifications', icon: Bell, value: unreadNotifs, trend: 'UNREAD_ALERTS' },
  ];

  return (
    <ProtectedRoute allowedRoles={['Candidate']}>
      <div className="space-y-10">
        <header className="flex flex-col space-y-4 border-b border-primary/20 pb-8">
          <div className="flex items-center gap-2 text-primary">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <span className="text-sm font-semibold text-muted-foreground">{t('system_status')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            {t('welcome')}, {user?.fullName || 'User'}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {t('role_candidate')} | UID: {user?.userId?.slice(0, 8) || 'External'}
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="size-16" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  {t(stat.label)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-1">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Applications */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-primary/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold">{t('applications')}</h2>
                <p className="text-muted-foreground text-sm">{t('recent_stats')} deployments</p>
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-sm h-auto p-0 hover:text-primary"
                onClick={() => router.push(`/${locale}/jobs`)}
              >
                {t('view_all')} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3">
              {appsLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-primary/5 animate-pulse border border-primary/10 rounded-md" />
                ))
              ) : applications?.length ? (
                applications.slice(0, 5).map((app: any) => (
                  <Card
                    key={app.id}
                    className="hover:border-primary transition-all cursor-pointer group bg-card/50"
                    onClick={() => router.push(`/${locale}/jobs/${app.jobId}`)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                          {app.jobTitle || `Job #${app.jobId}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {app.organizationName || '—'} •{' '}
                          {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 font-medium rounded-full border ${
                        app.status === 'Accepted' ? 'border-green-500/40 text-green-500 bg-green-500/10' :
                        app.status === 'Rejected' ? 'border-red-500/40 text-red-500 bg-red-500/10' :
                        'border-yellow-500/40 text-yellow-500 bg-yellow-500/10'
                      }`}>
                        {app.status || 'Pending'}
                      </span>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16 border border-dashed border-primary/20 rounded-md">
                  <p className="text-muted-foreground text-sm">No applications yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push(`/${locale}/jobs`)}
                  >
                    Browse Opportunities
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Recommended Jobs */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-primary/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold">{t('recommended_opps')}</h2>
                <p className="text-muted-foreground text-sm">Personalized for you</p>
              </div>
            </div>
            <div className="grid gap-3">
              {matchLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-primary/5 animate-pulse border border-primary/10 rounded-md" />
                ))
              ) : recommended?.items?.length ? (
                recommended.items.map((job) => (
                  <Card
                    key={job.id}
                    className="hover:border-primary transition-all cursor-pointer group bg-card/50"
                    onClick={() => router.push(`/${locale}/jobs/${job.id}`)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1 flex-1 min-w-0">
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5" /> {job.location}
                          </span>
                          <span>{job.jobType}</span>
                        </div>
                      </div>
                      <div className="ml-3 shrink-0 flex items-center gap-1.5 text-sm font-bold bg-primary/5 px-2 py-1 rounded-md">
                        <Star className="size-4 text-yellow-500" />
                        <span className={job.matchPercentage >= 70 ? 'text-green-500' : job.matchPercentage >= 40 ? 'text-yellow-500' : 'text-muted-foreground'}>
                          {job.matchPercentage}% Match
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16 border border-dashed border-primary/20 rounded-md">
                  <p className="text-muted-foreground text-sm">
                    Complete profile for AI matches
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push(`/${locale}/profile`)}
                  >
                    Update Profile
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
