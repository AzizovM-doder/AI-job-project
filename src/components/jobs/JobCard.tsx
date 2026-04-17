'use client';

import { Job } from '@/types/job';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, MapPin, Sparkles, Building2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function JobCard({ job }: { job: Job }) {
  const locale = useLocale();
  const router = useRouter();

  return (
    <Card
      className="group shadow-sm border-border/60 hover:shadow-md transition-shadow cursor-pointer p-0 overflow-hidden"
      onClick={() => router.push(`/${locale}/jobs/${job.id}`)}
    >
      <CardContent className="p-4 flex gap-4">
        <div className="size-14 bg-muted rounded-sm border flex items-center justify-center shrink-0">
          <Building2 className="size-8 text-muted-foreground/40" />
        </div>

        <div className="flex-1 space-y-1 overflow-hidden">
          <div className="flex items-start justify-between">
            <h2 className="text-[16px] font-bold text-primary group-hover:underline leading-tight truncate">
              {job.title}
            </h2>
            <Button variant="ghost" size="icon" className="size-8 rounded-full -mt-1 -mr-2 text-muted-foreground hover:bg-muted" onClick={(e) => e.stopPropagation()}>
              <Bookmark className="size-5" />
            </Button>
          </div>

          <p className="text-[14px] text-foreground font-medium leading-tight">Org ID: {job.organizationId}</p>
          <p className="text-[14px] text-muted-foreground">{job.location}</p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 font-bold text-[12px]">
              <Sparkles className="size-3.5 fill-current" />
              <span>Actively recruiting</span>
            </div>
            <span className="text-muted-foreground text-[12px]">•</span>
            <span className="text-muted-foreground text-[12px] font-medium">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
          </div>

          <div className="flex items-center gap-2 pt-3">
            <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold border border-primary/20">
              {job.jobType}
            </div>
            <div className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[11px] font-bold border border-border/40">
              {job.experienceLevel}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
