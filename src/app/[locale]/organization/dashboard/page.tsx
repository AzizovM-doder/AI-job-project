'use client';

import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageTransition } from '@/components/PageTransition';
import { useOrganizationQueries } from '@/hooks/queries/useOrganizationQueries';
import { useJobQueries } from '@/hooks/queries/useJobQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, BarChart3, Settings, Building2, Briefcase, ChevronRight, ClipboardList, Filter } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Organization } from '@/types/organization';
import { ApplicationStatus } from '@/types/job';
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
         <PageTransition className="space-y-12 pb-20 max-w-7xl mx-auto">

            {/* Organization Hero */}
            <section className="bg-card border border-border/60 rounded-[3rem] overflow-hidden shadow-sm relative">
               <div className="h-40 bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-end px-12 pb-16">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <Building2 className="size-48" />
                  </div>
               </div>
               <div className="px-12 pb-8 flex flex-col md:flex-row items-end justify-between gap-8 -mt-12 relative z-10">
                  <div className="flex gap-6 items-end">
                     <div className="size-32 rounded-[2.5rem] bg-background border-[6px] border-background shadow-2xl flex items-center justify-center overflow-hidden transition-transform hover:scale-105 duration-500">
                        {activeOrg?.logoUrl ? (
                           <img src={activeOrg.logoUrl} alt="Logo" className="size-full object-cover" />
                        ) : (
                           <div className="size-full bg-muted flex items-center justify-center font-bold text-4xl text-primary/40 uppercase">
                              {activeOrg?.name?.[0] || 'O'}
                           </div>
                        )}
                     </div>
                     <div className="pb-2 space-y-1">
                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                           <ShieldCheck className="size-3" /> Certified Organization
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter leading-tight">{activeOrg?.name || 'My Organization'}</h1>
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{activeOrg?.type} • {activeOrg?.location}</p>
                     </div>
                  </div>
                  <div className="flex gap-3 mb-2">
                     <Button variant="outline" className="rounded-2xl font-black px-6 h-12 border-2 uppercase tracking-widest text-[10px]" onClick={() => router.push(`/${locale}/organization/profile`)}>
                        <Settings className="size-4 mr-2" /> Admin Tools
                     </Button>
                     <Button className="rounded-2xl font-black px-8 h-12 shadow-xl shadow-primary/20 uppercase tracking-widest text-[10px]" onClick={() => router.push(`/${locale}/organization/jobs/new`)}>
                        <Plus className="size-4 mr-2" /> Post Mission
                     </Button>
                  </div>
               </div>
            </section>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {analytics.map((stat, i) => (
                  <Card key={i} className="rounded-[2rem] shadow-xl shadow-primary/5 border-border/60 group hover:border-primary/30 transition-all duration-500 overflow-hidden relative">
                     <CardContent className="p-8">
                        <div className="flex justify-between items-start">
                           <div className="space-y-2">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                              <h3 className="text-4xl font-black tracking-tight">{stat.value}</h3>
                           </div>
                           <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <stat.icon className="size-6 text-primary" />
                           </div>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                           <p className="text-[11px] text-emerald-600 font-black uppercase tracking-widest leading-none flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md">
                              {stat.trend}
                           </p>
                           <ArrowRight className="size-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Main Column */}
               <div className="lg:col-span-8 space-y-10">

                  {/* Job Management */}
                  <Card className="rounded-[2.5rem] shadow-sm border-border/60 overflow-hidden">
                     <CardHeader className="p-8 border-b border-border/60 flex flex-row items-center justify-between bg-muted/20">
                        <div className="space-y-1">
                           <CardTitle className="text-xl font-black tracking-tight uppercase">Active Positions</CardTitle>
                           <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Ongoing deployment missions</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-black/5 h-10 px-4 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] border">
                           <Filter className="size-3.5" /> Filter Base
                        </Button>
                     </CardHeader>
                     <CardContent className="p-0">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left text-sm">
                              <thead className="bg-muted/10 border-b border-border/40 text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
                                 <tr>
                                    <th className="pl-8 py-4">Designation</th>
                                    <th className="px-5 py-4 text-center">Personnel</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="pr-8 py-4 text-right">Ops</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-border/40">
                                 {jobsLoading ? (
                                    [1, 2, 3].map(i => (
                                       <tr key={i}><td colSpan={4} className="p-8"><Skeleton className="h-10 w-full rounded-xl" /></td></tr>
                                    ))
                                 ) : myJobs?.length ? (
                                    myJobs.map((job) => (
                                       <tr key={job.id} className="hover:bg-muted/30 transition-all group">
                                          <td className="pl-8 py-6">
                                             <div className="font-black text-lg text-foreground/90 tracking-tight">{job.title}</div>
                                             <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{job.location}</div>
                                          </td>
                                          <td className="px-5 py-6 text-center">
                                             <button
                                                className="text-primary font-black hover:scale-105 transition-transform inline-block bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 text-xs uppercase tracking-widest"
                                                onClick={() => router.push(`/${locale}/organization/jobs/${job.id}/applicants`)}
                                              >
                                                Analyze List
                                             </button>
                                          </td>
                                          <td className="px-5 py-6">
                                             <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border-2 border-emerald-100">
                                                Operational
                                             </span>
                                          </td>
                                          <td className="pr-8 py-6 text-right">
                                             <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <Button variant="ghost" size="icon" className="size-10 rounded-2xl bg-muted/50 hover:bg-primary hover:text-primary-foreground border" onClick={() => router.push(`/${locale}/organization/jobs/${job.id}/edit`)}>
                                                   <Settings className="size-5" />
                                                </Button>
                                             </div>
                                          </td>
                                       </tr>
                                    ))
                                 ) : (
                                    <tr><td colSpan={4} className="p-20 text-center text-muted-foreground font-bold tracking-widest uppercase text-xs">No active deployments found.</td></tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </CardContent>
                  </Card>

               </div>

               {/* Sidebar */}
               <div className="lg:col-span-4 space-y-10">

                  {/* Hiring Tools */}
                  <Card className="rounded-[2.5rem] shadow-xl shadow-primary/5 border-border/60 overflow-hidden bg-card">
                     <CardHeader className="p-8 border-b border-border/60 bg-muted/20">
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Tactical Resources</CardTitle>
                     </CardHeader>
                     <CardContent className="p-0">
                        <div className="py-2">
                           <button className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-all group">
                              <div className="flex items-center gap-4">
                                 <div className="size-12 rounded-2xl bg-orange-100 flex items-center justify-center group-hover:rotate-6 transition-transform">
                                    <Plus className="size-6 text-orange-600" />
                                 </div>
                                 <div className="text-left">
                                    <p className="text-sm font-black uppercase tracking-wider">Draft Mission</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">AI-Assisted Protocol</p>
                                 </div>
                              </div>
                              <ChevronRight className="size-5 text-muted-foreground/40 group-hover:translate-x-1 transition-all" />
                           </button>
                           <button 
                              className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-all group border-t border-border/40"
                              onClick={() => router.push(`/${locale}/organization/team`)}
                           >
                              <div className="flex items-center gap-4">
                                 <div className="size-12 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:rotate-6 transition-transform">
                                    <Users className="size-6 text-blue-600" />
                                 </div>
                                 <div className="text-left">
                                    <p className="text-sm font-black uppercase tracking-wider">Manage Squad</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Personnel Management</p>
                                 </div>
                              </div>
                              <ChevronRight className="size-5 text-muted-foreground/40 group-hover:translate-x-1 transition-all" />
                           </button>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Organization Health */}
                  <Card className="rounded-[2rem] shadow-2xl shadow-emerald-500/5 bg-emerald-500/5 border-2 border-emerald-500/10 overflow-hidden relative group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <BarChart3 className="size-20 text-emerald-600" />
                     </div>
                     <CardContent className="p-8 space-y-4 relative z-10">
                        <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-[0.2em]">
                           <BarChart3 className="size-4" />
                           Metrics Report
                        </div>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                           Strategic efficiency detected. Deployment speed is <span className="text-emerald-600 font-black">15% optimal</span> compared to sector averages.
                        </p>
                     </CardContent>
                  </Card>

               </div>
            </div>

         </PageTransition>
      </ProtectedRoute>
   );
}
