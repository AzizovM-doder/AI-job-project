'use client';

import { useAuth } from '@/src/context/AuthContext';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/src/services/job.service';
import { Button } from '@/components/ui/button';
import { Plus, Users, BarChart3, Settings } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations('Dashboard');
  const tJob = useTranslations('Job');

  const { data: myJobs, isLoading } = useQuery({
    queryKey: ['myJobs'],
    queryFn: () => jobService.getMyJobs(),
  });

  return (
    <ProtectedRoute allowedRoles={['Organization']}>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between space-y-6 md:space-y-0 border-b border-primary/20 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <div className="h-1 w-12 bg-primary" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{t('role_org')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter terminal-glow">
              {user?.organizationName?.toUpperCase() || 'ORG_PRO'}
            </h1>
          </div>
          <Button 
            onClick={() => router.push(`/${locale}/organization/jobs/new`)} 
            className="rounded-none h-12 px-8 font-bold tracking-[0.2em] terminal-glow"
          >
            <Plus className="mr-2 h-4 w-4" /> {t('post_new')}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'total_listings', value: myJobs?.length || '0', color: 'primary' },
            { label: 'pending_apps', value: '42', color: 'primary' },
            { label: 'active_offers', value: '3', color: 'primary' },
            { label: 'system_health', value: '99%', color: 'primary' }
          ].map((stat) => (
            <Card key={stat.label} className="border-primary/20 bg-card/50 rounded-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">{t(stat.label)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <h2 className="text-xl font-black tracking-widest uppercase">{t('active_vacancies')}</h2>
              <span className="text-[10px] text-muted-foreground font-mono">RECORDS_COUNT: {myJobs?.length || 0}</span>
            </div>
            
            <div className="border border-primary/20 bg-card/30 overflow-hidden">
              <table className="w-full text-left text-[10px] uppercase tracking-widest">
                <thead className="bg-primary/5 border-b border-primary/20">
                  <tr>
                    <th className="p-4 font-black">{tJob('title')}</th>
                    <th className="p-4 font-black">{tJob('applicants')}</th>
                    <th className="p-4 font-black">{tJob('status')}</th>
                    <th className="p-4 text-right font-black">{tJob('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {isLoading ? (
                    <tr><td colSpan={4} className="p-12 text-center animate-pulse tracking-[0.5em]">{t('system_status')}...</td></tr>
                  ) : myJobs?.length ? (
                    myJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="p-4 font-bold">{job.title.toUpperCase()}</td>
                        <td className="p-4 text-primary font-mono text-xs">12_APP</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-bold">
                            ACTIVE
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="h-7 px-3 rounded-none text-[9px] font-bold border border-transparent hover:border-primary/30">
                            {tJob('edit')}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="p-12 text-center text-muted-foreground tracking-widest">NO_DATA_AVAILABLE</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black tracking-widest uppercase pb-4 border-b border-primary/10">{t('quick_commands')}</h2>
            <div className="grid gap-2">
              {[
                { label: 'manage_team', icon: Users },
                { label: 'analytics', icon: BarChart3 },
                { label: 'settings', icon: Settings }
              ].map((cmd) => (
                <Button 
                  key={cmd.label}
                  variant="outline" 
                  className="w-full justify-start h-14 rounded-none border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-[10px] font-bold tracking-widest group"
                >
                  <cmd.icon className="mr-3 size-4 text-primary group-hover:scale-110 transition-transform" /> 
                  {t(cmd.label).toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
