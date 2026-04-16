'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import { PageTransition } from '@/src/components/PageTransition';
import { useJobQueries } from '@/src/hooks/queries/useJobQueries';
import { useJobStore } from '@/src/store/jobStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JobSearchHeader from '@/src/components/jobs/JobSearchHeader';
import JobCard from '@/src/components/jobs/JobCard';
import { Bookmark, List, Bell, PlayCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function JobsPage() {
  const { filters } = useJobStore();
  const { useJobs } = useJobQueries();
  const { data: jobsResponse, isLoading, isError } = useJobs();

  return (
    <ProtectedRoute>
      <PageTransition className="space-y-6">
        {/* Search Header */}
        <JobSearchHeader onSearch={() => {}} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-12">
          
          {/* Main Content */}
          <div className="md:col-span-8 space-y-6">
            
            <Card className="shadow-sm border-border/60">
               <CardHeader className="p-4 pb-0">
                 <CardTitle className="text-lg font-bold">Recommended for you</CardTitle>
                 <p className="text-sm text-muted-foreground font-normal">Based on your profile and search history</p>
               </CardHeader>
               <CardContent className="p-4 pt-4 space-y-4">
                  {isLoading ? (
                    [1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))
                  ) : isError ? (
                    <div className="p-10 text-center border-dashed border-destructive/40 bg-destructive/5 text-destructive font-bold text-xs uppercase tracking-widest">
                      SYSTEM_ERROR: SECURE_DATA_FETCH_FAILED
                    </div>
                  ) : jobsResponse?.items && jobsResponse.items.length > 0 ? (
                    jobsResponse.items.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))
                  ) : (
                    <div className="p-12 text-center text-muted-foreground border border-dashed rounded-lg">
                      <p className="font-bold">No jobs found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or search keywords.</p>
                    </div>
                  )}
               </CardContent>
            </Card>

            {jobsResponse?.items && jobsResponse.items.length > 3 && (
               <button className="text-[14px] font-bold text-muted-foreground hover:text-primary transition-colors w-full text-center border border-border/60 bg-card p-3 rounded-lg shadow-sm">
                 Show all {jobsResponse.totalCount} jobs →
               </button>
            )}
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4 space-y-4 sticky top-[72px]">
            {/* Shortcuts */}
            <Card className="shadow-sm border-border/60">
              <CardContent className="p-0">
                 <div className="p-4 space-y-5">
                   <div className="flex items-center gap-3 cursor-pointer group">
                      <Bookmark className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[14px] font-bold text-muted-foreground group-hover:text-primary transition-colors">My jobs</span>
                   </div>
                   <div className="flex items-center gap-3 cursor-pointer group">
                      <Bell className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[14px] font-bold text-muted-foreground group-hover:text-primary transition-colors">Job alerts</span>
                   </div>
                   <div className="flex items-center gap-3 cursor-pointer group">
                      <PlayCircle className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[14px] font-bold text-muted-foreground group-hover:text-primary transition-colors">Skill Assessments</span>
                   </div>
                 </div>
                 <hr className="border-border/60" />
                 <Button variant="ghost" className="w-full rounded-none justify-start px-4 h-11 text-[14px] font-bold text-primary hover:bg-primary/5">
                   <List className="size-4 mr-2" />
                   Interview prep
                 </Button>
              </CardContent>
            </Card>

            {/* Guidance Card */}
            <Card className="shadow-sm border-border/60">
              <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold">Job seeker guidance</CardTitle>
                <Info className="size-3.5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                 <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Recommended based on your activity</p>
                 <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="flex-1">
                      <p className="text-[13px] font-bold group-hover:text-primary group-hover:underline transition-colors">I want to improve my resume</p>
                      <p className="text-[11px] text-muted-foreground">Explore our AI resume evaluation tools.</p>
                    </div>
                    <div className="size-12 rounded bg-muted shrink-0" />
                 </div>
              </CardContent>
            </Card>
          </aside>

        </div>
      </PageTransition>
    </ProtectedRoute>
  );
}
