'use client';

import { useAuthStore } from '@/src/store/authStore';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { PageTransition } from '@/src/components/PageTransition';
import { useOrganizationQueries } from '@/src/hooks/queries/useOrganizationQueries';
import { useJobQueries } from '@/src/hooks/queries/useJobQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, BarChart3, Settings, Building2, Briefcase, ChevronRight, ClipboardList, Filter } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Organization } from '@/src/types/organization';
import { ApplicationStatus } from '@/src/types/job';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function OrganizationDashboard() {
   const { user } = useAuthStore();
   const router = useRouter();
   const locale = useLocale();
   const t = useTranslations('Dashboard');

   const { useGetMyOrganizations } = useOrganizationQueries();
   const { useGetMyJobs, useGetApplicationsPaged } = useJobQueries();

   const { data: myOrgs, isLoading: orgsLoading } = useGetMyOrganizations();
   const [activeOrg, setActiveOrg] = useState<Organization | null>(null);

   useEffect(() => {
      if (myOrgs?.length && !activeOrg) {
         setActiveOrg(myOrgs[0]);
      }
   }, [myOrgs, activeOrg]);

   const { data: myJobs, isLoading: jobsLoading } = useGetMyJobs();
   const { data: pendingApps } = useGetApplicationsPaged({ PageSize: 5 });

   const analytics = [
      { label: 'Total Applicants', value: pendingApps?.totalCount || 0, icon: Users, trend: '+12% from last week' },
      { label: 'Active Jobs', value: myJobs?.length || 0, icon: Briefcase, trend: 'Stable' },
      { label: 'Avg. Match Score', value: '84%', icon: BarChart3, trend: '+2% better fit' },
   ];

   return (
      <ProtectedRoute allowedRoles={['Organization']}>
         <PageTransition className="space-y-8 pb-12">

            {/* Organization Hero */}
            <section className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
               <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/5 to-accent/10" />
               <div className="p-6 pt-0 -mt-12 flex flex-col md:flex-row items-end justify-between gap-6">
                  <div className="flex gap-4 items-end">
                     <div className="size-24 rounded-lg bg-background border-[4px] border-background shadow-lg flex items-center justify-center overflow-hidden">
                        {activeOrg?.logoUrl ? (
                           <img src={activeOrg.logoUrl} alt="Logo" className="size-full object-cover" />
                        ) : (
                           <div className="size-full bg-muted flex items-center justify-center font-bold text-3xl text-primary/40 uppercase">
                              {activeOrg?.name?.[0] || 'O'}
                           </div>
                        )}
                     </div>
                     <div className="pb-1">
                        <h1 className="text-2xl font-bold leading-tight">{activeOrg?.name || 'My Organization'}</h1>
                        <p className="text-sm text-muted-foreground">{activeOrg?.type} • {activeOrg?.location}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="outline" className="rounded-full font-bold px-6 h-9" onClick={() => router.push(`/${locale}/organization/profile`)}>
                        <Settings className="size-4 mr-2" /> Admin tools
                     </Button>
                     <Button className="rounded-full font-bold px-8 h-9 shadow-lg shadow-primary/20" onClick={() => router.push(`/${locale}/organization/jobs/new`)}>
                        <Plus className="size-4 mr-2" /> Post a job
                     </Button>
                  </div>
               </div>
            </section>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {analytics.map((stat, i) => (
                  <Card key={i} className="shadow-sm border-border/60">
                     <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <p className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</p>
                              <h3 className="text-3xl font-bold">{stat.value}</h3>
                           </div>
                           <stat.icon className="size-6 text-primary/30" />
                        </div>
                        <p className="text-[11px] text-emerald-600 font-bold mt-3 leading-none flex items-center gap-1">
                           {stat.trend}
                        </p>
                     </CardContent>
                  </Card>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
               {/* Main Column */}
               <div className="lg:col-span-8 space-y-6">

                  {/* Job Management */}
                  <Card className="shadow-sm border-border/60">
                     <CardHeader className="p-5 border-b border-border/60 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold">Active Jobs</CardTitle>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-black/5 h-8 gap-2">
                           <Filter className="size-3.5" /> All jobs
                        </Button>
                     </CardHeader>
                     <CardContent className="p-0">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left text-sm">
                              <thead className="bg-muted/30 border-b border-border/40 text-[11px] text-muted-foreground uppercase font-bold">
                                 <tr>
                                    <th className="px-5 py-3">Job Title</th>
                                    <th className="px-5 py-3 text-center">Applicants</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-border/40">
                                 {jobsLoading ? (
                                    [1, 2, 3].map(i => (
                                       <tr key={i}><td colSpan={4} className="p-4"><Skeleton className="h-10 w-full" /></td></tr>
                                    ))
                                 ) : myJobs?.length ? (
                                    myJobs.map((job) => (
                                       <tr key={job.id} className="hover:bg-muted/30 transition-colors group">
                                          <td className="px-5 py-4 font-bold text-foreground/90">{job.title}</td>
                                          <td className="px-5 py-4 text-center">
                                             <button
                                                className="text-primary font-bold hover:underline"
                                                onClick={() => router.push(`/${locale}/organization/jobs/${job.id}/applicants`)}
                                             >
                                                View
                                             </button>
                                          </td>
                                          <td className="px-5 py-4">
                                             <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                Active
                                             </span>
                                          </td>
                                          <td className="px-5 py-4 text-right">
                                             <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => router.push(`/${locale}/organization/jobs/${job.id}/edit`)}>
                                                   <Settings className="size-4" />
                                                </Button>
                                             </div>
                                          </td>
                                       </tr>
                                    ))
                                 ) : (
                                    <tr><td colSpan={4} className="p-12 text-center text-muted-foreground italic">No active vacancies.</td></tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </CardContent>
                  </Card>

               </div>

               {/* Sidebar */}
               <div className="lg:col-span-4 space-y-6">

                  {/* Hiring Tools */}
                  <Card className="shadow-sm border-border/60">
                     <CardHeader className="p-5 border-b border-border/60">
                        <CardTitle className="text-sm font-bold">Hiring Resources</CardTitle>
                     </CardHeader>
                     <CardContent className="p-0">
                        <div className="py-2">
                           <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                              <div className="flex items-center gap-3">
                                 <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <Plus className="size-5 text-orange-600" />
                                 </div>
                                 <div className="text-left">
                                    <p className="text-sm font-bold">Write a job description</p>
                                    <p className="text-[11px] text-muted-foreground italic">AI-assisted templates</p>
                                 </div>
                              </div>
                              <ChevronRight className="size-4 text-muted-foreground" />
                           </button>
                           <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group border-t border-border/40">
                              <div className="flex items-center gap-3">
                                 <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Users className="size-5 text-blue-600" />
                                 </div>
                                 <div className="text-left">
                                    <p className="text-sm font-bold">Manage Hiring Team</p>
                                    <p className="text-[11px] text-muted-foreground">Collaborate on candidates</p>
                                 </div>
                              </div>
                              <ChevronRight className="size-4 text-muted-foreground" />
                           </button>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Organization Health */}
                  <Card className="shadow-sm border-border/60 bg-emerald-50/10 border-emerald-200/50">
                     <CardContent className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                           <BarChart3 className="size-4" />
                           Hiring Efficiency
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                           Your time-to-hire is 15% faster than industry standard. Keep using the AI Filter to maintain high quality matches.
                        </p>
                     </CardContent>
                  </Card>

               </div>
            </div>

         </PageTransition>
      </ProtectedRoute>
   );
}
