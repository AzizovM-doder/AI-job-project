'use client';

import { useAuthStore } from '@/src/store/authStore';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganizationQueries } from '@/src/hooks/queries/useOrganizationQueries';
import { useApplicationQueries } from '@/src/hooks/queries/useApplicationQueries';
import { useJobQueries } from '@/src/hooks/queries/useJobQueries';
import { Button } from '@/components/ui/button';
import { Plus, Users, BarChart3, Settings, Building2, Loader2, Briefcase, ClipboardList } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Organization } from '@/src/types/organization';
import { ApplicationStatus } from '@/src/types/job';

export default function OrganizationDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations('Dashboard');
  const tJob = useTranslations('Job');

  const { useMyOrganizations } = useOrganizationQueries();
  const { useMyJobs } = useJobQueries();
  const { useApplicationsPaged } = useApplicationQueries();

  const { data: myOrgs, isLoading: orgsLoading } = useMyOrganizations();
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);

  useEffect(() => {
    if (myOrgs?.length && !activeOrg) {
      setActiveOrg(myOrgs[0]);
    }
  }, [myOrgs, activeOrg]);

  const { data: myJobs, isLoading: jobsLoading } = useMyJobs();
  const { data: pendingApps } = useApplicationsPaged({ status: ApplicationStatus.Pending });

  const stats = [
    { label: 'total_listings', value: myJobs?.length ?? 0 },
    { label: 'pending_apps', value: pendingApps?.totalCount ?? 0 },
    { label: 'active_offers', value: myJobs?.length ?? 0 },
    { label: 'system_health', value: '99%' },
  ];

  return (
    <ProtectedRoute allowedRoles={['Organization']}>
      <div className="space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between space-y-6 md:space-y-0 border-b border-primary/20 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <div className="h-1 w-12 bg-primary" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{t('role_org')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter terminal-glow">
              {orgsLoading ? (
                <Loader2 className="animate-spin size-8" />
              ) : (
                (activeOrg?.name?.toUpperCase() || user?.fullName?.toUpperCase() || 'ORG_PRO')
              )}
            </h1>
            {activeOrg?.industry && (
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">{activeOrg.industry}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/organization/profile`)}
              className="rounded-none h-12 px-6 font-bold tracking-[0.15em]"
            >
              <Building2 className="mr-2 h-4 w-4" /> ORG_SETTINGS
            </Button>
            <Button
              onClick={() => router.push(`/${locale}/organization/jobs/new`)}
              className="rounded-none h-12 px-8 font-bold tracking-[0.2em] terminal-glow"
            >
              <Plus className="mr-2 h-4 w-4" /> {t('post_new')}
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-primary/20 bg-card/50 rounded-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                  {t(stat.label)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Job Listings Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <h2 className="text-xl font-black tracking-widest uppercase">{t('active_vacancies')}</h2>
              <span className="text-[10px] text-muted-foreground font-mono">
                RECORDS_COUNT: {myJobs?.length || 0}
              </span>
            </div>

            <div className="border border-primary/20 bg-card/30 overflow-hidden">
              <table className="w-full text-left text-[10px] uppercase tracking-widest">
                <thead className="bg-primary/5 border-b border-primary/20">
                  <tr>
                    <th className="p-4 font-black">{tJob('title')}</th>
                    <th className="p-4 font-black hidden md:table-cell">{tJob('applicants')}</th>
                    <th className="p-4 font-black">{tJob('status')}</th>
                    <th className="p-4 text-right font-black">{tJob('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {jobsLoading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center animate-pulse tracking-[0.5em]">
                        {t('system_status')}...
                      </td>
                    </tr>
                  ) : myJobs?.length ? (
                    myJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="p-4 font-bold">{job.title.toUpperCase()}</td>
                        <td className="p-4 text-primary font-mono hidden md:table-cell">
                          <button
                            onClick={() => router.push(`/${locale}/organization/jobs/${job.id}/applicants`)}
                            className="hover:text-primary/70 transition-colors"
                          >
                            VIEW_APPS
                          </button>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-bold">
                            ACTIVE
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-3 rounded-none text-[9px] font-bold border border-transparent hover:border-primary/30"
                            onClick={() => router.push(`/${locale}/organization/jobs/${job.id}/applicants`)}
                          >
                            <ClipboardList className="size-3 mr-1" /> APPS
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-3 rounded-none text-[9px] font-bold border border-transparent hover:border-primary/30"
                            onClick={() => router.push(`/${locale}/organization/jobs/${job.id}/edit`)}
                          >
                            {tJob('edit')}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-muted-foreground tracking-widest">
                        NO_DATA_AVAILABLE
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Commands */}
          <div className="space-y-6">
            <h2 className="text-xl font-black tracking-widest uppercase pb-4 border-b border-primary/10">
              {t('quick_commands')}
            </h2>
            <div className="grid gap-2">
              {[
                { label: 'manage_team', icon: Users, route: `/${locale}/organization/team` },
                { label: 'analytics', icon: BarChart3, route: `/${locale}/organization/analytics` },
                { label: 'settings', icon: Settings, route: `/${locale}/organization/profile` },
              ].map((cmd) => (
                <Button
                  key={cmd.label}
                  variant="outline"
                  className="w-full justify-start h-14 rounded-none border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-[10px] font-bold tracking-widest group"
                  onClick={() => router.push(cmd.route)}
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
