'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { PageTransition } from '@/components/PageTransition';
import { useJobQueries } from '@/hooks/queries/useJobQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JobSearchHeader from '@/components/jobs/JobSearchHeader';
import JobCard from '@/components/jobs/JobCard';
import { Bookmark, List, Bell, PlayCircle, Info, Sparkles, Terminal, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function JobsPage() {
  const { useJobs } = useJobQueries();
  const { data: jobsResponse, isLoading, isError } = useJobs();

  return (
    <ProtectedRoute>
      <PageTransition className={cn("space-y-8 pb-32", spaceGrotesk.className)}>
        {/* Search Header */}
        <JobSearchHeader onSearch={() => {}} />

        <Container className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Main Content */}
          <div className="md:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-4">
              <div className="space-y-1">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Priority missions</h2>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Tailored access based on your credentials</p>
              </div>
              <Sparkles className="size-5 text-primary opacity-40" />
            </div>

            <Card className="glass-card bg-white/[0.03] backdrop-blur-3xl border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
               <CardContent className="p-8 space-y-8">
                  {isLoading ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                        <Card key={i} className="p-8 flex gap-8 bg-white/5 border-white/5 rounded-[2rem]">
                          <Skeleton className="size-20 rounded-[1.5rem] bg-white/5 shrink-0" />
                          <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                              <Skeleton className="h-6 w-64 bg-white/5" />
                              <Skeleton className="size-10 rounded-xl bg-white/5" />
                            </div>
                            <Skeleton className="h-4 w-48 bg-white/5" />
                            <Skeleton className="h-4 w-32 bg-white/5" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : isError ? (
                    <div className="p-20 text-center glass-card bg-destructive/5 border-destructive/20 rounded-[2rem] border-dashed">
                       <Terminal className="size-12 text-destructive mx-auto mb-6 opacity-40" />
                       <p className="text-[11px] font-black uppercase tracking-[0.3em] text-destructive">SYSTEM_ERROR: REGISTRY_DENIED</p>
                       <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">The mission repository is currently offline for maintenance.</p>
                    </div>
                  ) : jobsResponse?.items && jobsResponse.items.length > 0 ? (
                    <div className="space-y-6">
                      {jobsResponse.items.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-24 text-center glass-card bg-white/5 rounded-[2.5rem] border-dashed border-white/10">
                      <Terminal className="size-12 text-white/20 mx-auto mb-6" />
                      <p className="text-xl font-heading font-black text-white uppercase tracking-tighter">Sector Void</p>
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">No missions currently recorded in this quadrant.</p>
                    </div>
                  )}
               </CardContent>
            </Card>

            {jobsResponse?.items && jobsResponse.items.length > 3 && (
               <button className="w-full h-16 rounded-[1.8rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 font-heading font-black text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-primary hover:border-primary/40 hover:bg-white/5 transition-all shadow-xl">
                 Decrypt All {jobsResponse.totalCount} Mission Profiles →
               </button>
            )}
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4 space-y-8 sticky top-[100px]">
            {/* Shortcuts */}
            <Card className="glass-card bg-white/[0.03] backdrop-blur-3xl border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                 <div className="p-8 space-y-8">
                   <div className="flex items-center gap-4 cursor-pointer group/nav">
                      <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/nav:bg-primary/20 group-hover/nav:border-primary/40 transition-all">
                        <Bookmark className="size-4 text-white/40 group-hover/nav:text-primary transition-colors" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/nav:text-white transition-colors">Stored Missions</span>
                   </div>
                   <div className="flex items-center gap-4 cursor-pointer group/nav">
                      <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/nav:bg-primary/20 group-hover/nav:border-primary/40 transition-all">
                        <Bell className="size-4 text-white/40 group-hover/nav:text-primary transition-colors" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/nav:text-white transition-colors">Sector Alerts</span>
                   </div>
                   <div className="flex items-center gap-4 cursor-pointer group/nav">
                      <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/nav:bg-primary/20 group-hover/nav:border-primary/40 transition-all">
                        <Activity className="size-4 text-white/40 group-hover/nav:text-primary transition-colors" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/nav:text-white transition-colors">Skill Assessments</span>
                   </div>
                 </div>
                 <div className="h-[1px] bg-white/5 mx-8" />
                 <Button variant="ghost" className="w-full h-16 rounded-none justify-center px-8 font-heading font-black uppercase tracking-[0.2em] text-[10px] text-primary hover:bg-primary/5 transition-all">
                   <Terminal className="size-4 mr-3" />
                   Interview Prep Terminal
                 </Button>
              </CardContent>
            </Card>

            {/* Guidance Card */}
            <Card className="glass-card bg-white/[0.03] backdrop-blur-3xl border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Ops_Guidance</h4>
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest leading-tight">Optimized based on biometric activity</p>
                </div>
                <Info className="size-3.5 text-white/20" />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer p-4 rounded-2xl border border-white/5 hover:bg-white/5 transition-all">
                  <div className="flex-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">Decrypt Resume Data</p>
                    <p className="text-[9px] text-white/30 font-bold uppercase tracking-tight mt-1">Explore AI evaluation protocols.</p>
                  </div>
                  <div className="size-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
                    <Sparkles className="size-6 text-primary" />
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </Container>
      </PageTransition>
    </ProtectedRoute>
  );
}
