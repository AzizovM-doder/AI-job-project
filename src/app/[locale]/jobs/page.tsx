'use client';

import { useJobQueries } from '@/src/hooks/queries/useJobQueries';
import { useJobStore } from '@/src/store/jobStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function JobsPage() {
  const { filters, setFilter, setPage } = useJobStore();
  const { useJobs } = useJobQueries();
  const { data: jobsResponse, isLoading, isError, error } = useJobs();
  const router = useRouter();
  const { locale } = useParams();

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-black terminal-glow uppercase">AVAILABLE_OPPORTUNITIES</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
            <Input 
              placeholder="SEARCH_DATABASE..." 
              className="pl-10" 
              value={filters.title}
              onChange={(e) => setFilter('title', e.target.value)}
            />
          </div>
          <Button variant="outline" className="md:w-32">
            <Filter className="mr-2 size-4" /> FILTERS
          </Button>
        </div>
      </header>

      {isError && (
        <div className="border border-destructive/50 bg-destructive/10 text-destructive p-4 text-sm font-bold">
          [!] SYS_ERR: FAILED TO FETCH JOB DATABASE: {(error as any)?.message || 'Unknown Error'}
        </div>
      )}

      <div className="grid gap-6">
        {isLoading ? (
          [1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="animate-pulse border-primary/10 h-32" />
          ))
        ) : jobsResponse?.items?.length ? (
          jobsResponse.items.map((job) => (
            <Card key={job.id} className="group hover:border-primary transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {job.title.toUpperCase()}
                      </h2>
                      <span className="text-[10px] bg-primary/10 px-2 py-0.5 border border-primary/20">
                        {job.jobType}
                      </span>
                      <span className="text-[10px] bg-secondary/10 px-2 py-0.5 border border-secondary/20">
                        {job.experienceLevel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Briefcase className="mr-1 size-3" /> ORG_ID: {job.organizationId}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="mr-1 size-3" /> {job.location.toUpperCase()}
                      </span>
                      {job.salaryMin > 0 && job.salaryMax > 0 && (
                        <span className="flex items-center text-primary font-bold">
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/${locale}/jobs/${job.id}`)}>DETAILS</Button>
                    <Button size="sm" onClick={() => router.push(`/${locale}/jobs/${job.id}`)}>APPLY_NOW</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : !isError && (
          <div className="text-center py-20 border border-dashed border-primary/20">
            <p className="text-xs text-muted-foreground">NO MATCHING RECORDS FOUND</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {jobsResponse && jobsResponse.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={!jobsResponse.hasPrevious}
            onClick={() => setPage(jobsResponse.pageNumber - 1)}
          >
            PREV
          </Button>
          <div className="flex items-center px-4 text-xs font-bold border border-primary/20">
            {jobsResponse.pageNumber} / {jobsResponse.totalPages}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={!jobsResponse.hasNext}
            onClick={() => setPage(jobsResponse.pageNumber + 1)}
          >
            NEXT
          </Button>
        </div>
      )}
    </div>
  );
}
