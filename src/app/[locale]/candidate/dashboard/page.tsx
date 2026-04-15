'use client';

import { useAuth } from '@/src/context/AuthContext';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/src/services/job.service';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, FileText, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const t = useTranslations('Dashboard');

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['recentJobs'],
    queryFn: () => jobService.getJobsPaged({ PageNumber: 1, PageSize: 4 }),
  });

  return (
    <ProtectedRoute allowedRoles={['Candidate']}>
      <div className="space-y-10">
        <header className="flex flex-col space-y-4 border-b border-primary/20 pb-8">
          <div className="flex items-center gap-2 text-primary">
            <div className="h-1 w-12 bg-primary" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{t('system_status')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter terminal-glow">
            {t('welcome').toUpperCase()}, {user?.fullName?.toUpperCase() || 'USER'}
          </h1>
          <p className="text-muted-foreground text-[10px] tracking-[0.2em]">
            {t('role_candidate')} | UID: {user?.id?.slice(0, 8).toUpperCase() || 'EXTERNAL_01'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'applications', icon: FileText, value: '12', trend: '+2 SINCE LAST LOGIN' },
            { label: 'connections', icon: Users, value: '128', trend: '+5 NEW REQUESTS' },
            { label: 'notifications', icon: Briefcase, value: '3', trend: 'UNREAD MESSAGES' }
          ].map((stat) => (
            <Card key={stat.label} className="border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                <stat.icon className="size-8" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{t(stat.label)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <p className="text-[9px] text-primary/70 font-mono tracking-tighter">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-primary/10 pb-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">{t('recommended_opps')}</h2>
              <p className="text-muted-foreground text-[10px] tracking-widest uppercase">MATCHING YOUR NEURAL PROFILE</p>
            </div>
            <Button variant="link" size="sm" className="text-[10px] h-auto p-0 hover:text-primary tracking-widest">
              {t('view_all')} <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-primary/5 animate-pulse border border-primary/10" />
              ))
            ) : jobs?.items.length ? (
              jobs.items.map((job) => (
                <Card key={job.id} className="hover:border-primary transition-all cursor-pointer group bg-card/50">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                        {job.title.toUpperCase()}
                      </h3>
                      <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                        {job.location.toUpperCase()} • {job.jobType.toUpperCase()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-none border-primary/50 hover:bg-primary hover:text-primary-foreground text-[10px] font-bold tracking-widest">
                      {t('apply')}
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 border border-dashed border-primary/20 bg-primary/5">
                <p className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase">ACCESSING_DATABASE... NO_RECORDS_FOUND</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
