'use client';

import { useParams, useRouter } from 'next/navigation';
import { useOrganizationQueries } from '@/hooks/queries/useOrganizationQueries';
import { useJobQueries } from '@/hooks/queries/useJobQueries';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Briefcase, 
  Mail, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink, 
  Calendar 
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrganizationPublicProfile() {
  const { id, locale } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const t = useTranslations('Organization');
  const tJob = useTranslations('Job');
  const { useGetOrganization } = useOrganizationQueries();
  const { useGetJobsByOrganization } = useJobQueries();

  const orgId = id ? Number(id) : null;
  const { data: org, isLoading: orgLoading } = useGetOrganization(orgId as number);
  const { data: jobs, isLoading: jobsLoading } = useGetJobsByOrganization(orgId as number);

  const isOwner = user?.role === 'Organization' && user?.userId === org?.userId?.toString();

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary animate-pulse tracking-[0.4em] text-xs">LOADING_DATA...</div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-[0.2em]">ENTITY_NOT_FOUND</h2>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> GO_BACK
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header / Hero */}
      <header className="relative py-16 px-8 rounded-[3rem] bg-primary/5 border border-primary/10 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 size-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <div className="size-12 rounded-2xl bg-background border border-primary/10 flex items-center justify-center shadow-sm">
              <Building2 className="size-6" />
            </div>
            <span className="text-xs font-black tracking-[0.3em] uppercase opacity-70">{org.industry || t('industry')}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              {org.name?.toUpperCase()}
            </h1>
            {isOwner && (
              <Button
                onClick={() => router.push(`/${locale}/organization/profile`)}
                className="h-12 px-8 rounded-2xl font-black tracking-widest uppercase transition-all hover:scale-105 shadow-xl shadow-primary/20"
              >
                {t('edit_organization')}
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-8 text-muted-foreground text-sm font-bold pt-4 border-t border-primary/5">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {org.location || t('location')}
            </div>
            {org.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Globe className="size-4" />
                {org.website.replace(/^https?:\/\//, '')}
                <ExternalLink className="size-3" />
              </a>
            )}
            <div className="flex items-center gap-2">
              <Briefcase className="size-4" />
              {org.size || t('team_size')}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Info */}
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-6 px-4">
            <h2 className="text-3xl font-black tracking-tight uppercase border-l-4 border-primary pl-4">
              {t('mission')}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                {org.description || 'No detailed mission statement provided by the organization.'}
              </p>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-border/50 pb-4 px-4">
              <h2 className="text-2xl font-black tracking-tight uppercase">
                {tJob('active_vacancies')}
              </h2>
            </div>
            <div className="grid gap-6">
              {jobsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-[2rem]" />
                ))
              ) : jobs?.length ? (
                jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="rounded-[2.5rem] border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer group hover:bg-primary/5 overflow-hidden"
                    onClick={() => router.push(`/${locale}/jobs/${job.id}`)}
                  >
                    <CardContent className="p-8 flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="font-black text-2xl tracking-tight group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-muted">
                            <MapPin className="size-3.5 text-primary" /> {job.location}
                          </span>
                          <span className="opacity-30">•</span>
                          <span>{job.jobType}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="hidden sm:flex rounded-full px-6 h-10 font-bold group-hover:bg-primary group-hover:text-primary-foreground border-2">
                        {t('view_details')} <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-[3rem] bg-muted/20">
                  <p className="text-muted-foreground font-bold tracking-[0.2em] uppercase">
                    {tJob('no_records') || 'No active vacancies'}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Side: Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 shadow-xl shadow-primary/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Mail className="size-20 -rotate-12" />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Mail className="size-5 text-primary" /> {t('contact_channel')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Interested in working with us? Apply to an open mission or connect with our recruitment team for upcoming opportunities.
              </p>
              <Button className="w-full font-black uppercase tracking-widest h-12 rounded-2xl shadow-lg shadow-primary/20" variant="default">
                {t('message_recruiter')}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="pb-2 bg-muted/30">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                {t('system_log')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <Calendar className="size-4 text-primary" />
                {t('established')}: <span className="text-foreground">{org.createdAt ? new Date(org.createdAt).toLocaleDateString() : '—'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
