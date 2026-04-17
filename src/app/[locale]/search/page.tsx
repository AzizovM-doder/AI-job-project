'use client';

import { useSearchParams } from 'next/navigation';
import { useUserQueries } from '@/hooks/queries/useUserQueries';
import { useJobQueries } from '@/hooks/queries/useJobQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Briefcase, MapPin, Search as SearchIcon, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { PageTransition } from '@/components/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const locale = useLocale();
  const t = useTranslations('Nav'); // Reusing some keys

  const { useGetDirectory } = useUserQueries();
  const { useSearchJobs } = useJobQueries();

  const { data: people, isLoading: loadingPeople } = useGetDirectory(query);
  const { data: jobs, isLoading: loadingJobs } = useSearchJobs({ SearchTerm: query });

  return (
    <PageTransition className="space-y-6 pb-20">
      <div className="flex items-center gap-3 border-b pb-6">
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
          <SearchIcon className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Search Results</h1>
          <p className="text-muted-foreground">
            Showing results for <span className="text-foreground font-bold">"{query}"</span>
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-xl mb-8">
          <TabsTrigger value="all" className="rounded-lg px-6">All Results</TabsTrigger>
          <TabsTrigger value="people" className="rounded-lg px-6">People ({people?.length || 0})</TabsTrigger>
          <TabsTrigger value="jobs" className="rounded-lg px-6">Jobs ({jobs?.totalCount || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8 animate-in fade-in duration-500">
          {/* People Preview */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users className="size-5 text-primary" /> People
              </h2>
              {people && people.length > 3 && (
                <TabsTrigger value="people" asChild>
                  <Button variant="ghost" size="sm" className="text-primary font-bold">View all</Button>
                </TabsTrigger>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loadingPeople ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
              ) : people && people.length > 0 ? (
                people.slice(0, 3).map((person) => (
                  <PeopleCard key={person.userId} person={person} locale={locale} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic col-span-full">No people found matching your search.</p>
              )}
            </div>
          </section>

          {/* Jobs Preview */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="size-5 text-primary" /> Jobs
              </h2>
              {jobs && jobs.totalCount > 3 && (
                <TabsTrigger value="jobs" asChild>
                  <Button variant="ghost" size="sm" className="text-primary font-bold">View all</Button>
                </TabsTrigger>
              )}
            </div>

            <div className="space-y-4">
              {loadingJobs ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
              ) : jobs?.items && jobs.items.length > 0 ? (
                jobs.items.slice(0, 3).map((job) => (
                  <JobResultCard key={job.id} job={job} locale={locale} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic col-span-full">No jobs found matching your search.</p>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="people" className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {people?.map((person) => (
              <PeopleCard key={person.userId} person={person} locale={locale} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          {jobs?.items.map((job) => (
            <JobResultCard key={job.id} job={job} locale={locale} />
          ))}
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}

function PeopleCard({ person, locale }: { person: any, locale: string }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-border/60">
      <div className="h-16 bg-gradient-to-r from-primary/10 to-accent/10" />
      <CardContent className="p-4 pt-0 -mt-8 flex flex-col items-center text-center">
        <div className="size-16 rounded-full border-4 border-background bg-muted overflow-hidden mb-3">
          {person.avatarUrl ? (
            <img src={person.avatarUrl} alt={person.fullName} className="size-full object-cover" />
          ) : (
            <User className="size-full p-4 text-muted-foreground/40" />
          )}
        </div>
        <Link href={`/${locale}/profile/${person.userId}`} className="font-bold hover:text-primary hover:underline transition-colors line-clamp-1">
          {person.fullName}
        </Link>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1 line-clamp-1">
          {person.title || 'AI-JOB Member'}
        </p>
        <Button variant="outline" size="sm" className="mt-4 w-full rounded-full h-8 font-bold text-xs" asChild>
          <Link href={`/${locale}/profile/${person.userId}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function JobResultCard({ job, locale }: { job: any, locale: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow border-border/60">
      <CardContent className="p-4 flex gap-4">
        <div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0 border">
          <Briefcase className="size-6 text-muted-foreground/40" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <Link href={`/${locale}/jobs/${job.id}`} className="font-bold text-primary hover:underline line-clamp-1">
              {job.title}
            </Link>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase shrink-0">
              {job.jobType}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><MapPin className="size-3" /> {job.location}</span>
            <span>•</span>
            <span>Org ID: {job.organizationId}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0 rounded-full" asChild>
          <Link href={`/${locale}/jobs/${job.id}`}><ArrowRight className="size-4" /></Link>
        </Button>
      </CardContent>
    </Card>
  );
}
