'use client';

import { useParams, useRouter } from 'next/navigation';
import { useOrganizationQueries } from '@/src/hooks/queries/useOrganizationQueries';
import { useJobQueries } from '@/src/hooks/queries/useJobQueries';
import { useAuthStore } from '@/src/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Globe, MapPin, Briefcase, Mail, ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function OrganizationPublicProfile() {
  const { id, locale } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const t = useTranslations('Organization');
  const tJob = useTranslations('Job');
  const { useOrganization } = useOrganizationQueries();
  const { useJobsByOrganization } = useJobQueries();

  const orgId = id ? Number(id) : null;
  const { data: org, isLoading: orgLoading } = useOrganization(orgId);
  const { data: jobs, isLoading: jobsLoading } = useJobsByOrganization(orgId);

  const isOwner = user?.role === 'Organization' && user?.userId === org?.userId?.toString();

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary animate-pulse tracking-[0.4em] text-xs">SYNCHRONIZING_DATA...</div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-[0.2em]">404_DATA_NOT_FOUND</h2>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> BACK_TO_SAFETY
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header / Hero */}
      <header className="relative py-12 border-b border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Building2 className="size-6" />
            <span className="text-sm font-bold tracking-[0.3em] uppercase">{org.industry || 'ORGANIZATION'}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              {org.name.toUpperCase()}
            </h1>
            {isOwner && (
              <Button
                onClick={() => router.push(`/${locale}/organization/profile`)}
                className="h-10 px-6 font-bold tracking-widest uppercase transition-all hover:scale-105"
              >
                EDIT_ORGANIZATION
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-6 text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {org.location || 'GLOBAL_HQ'}
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
              {org.size || 'SIZE_UNKNOWN'}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Info */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight uppercase border-b border-primary/10 pb-2">
              {t('mission')}
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {org.description || 'No detailed mission statement provided by the organization.'}
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-primary/10 pb-2">
              <h2 className="text-2xl font-black tracking-tight uppercase">
                {tJob('active_vacancies') || 'Open Missions'}
              </h2>
            </div>
            <div className="grid gap-4">
              {jobsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-primary/5 animate-pulse border border-primary/10 rounded-lg" />
                ))
              ) : jobs?.length ? (
                jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="hover:border-primary transition-all cursor-pointer group hover:bg-primary/5"
                    onClick={() => router.push(`/${locale}/jobs/${job.id}`)}
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5" /> {job.location}
                          </span>
                          <span>•</span>
                          <span>{job.jobType}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="hidden sm:flex rounded-full group-hover:bg-primary group-hover:text-primary-foreground">
                        VIEW_DETAILS
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-primary/20 rounded-xl bg-muted/30">
                  <p className="text-muted-foreground font-medium tracking-widest uppercase">
                    NO_ACTIVE_MISSIONS_AT_THIS_TIME
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Side: Sidebar Info */}
        <div className="space-y-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Mail className="size-5" /> CONTACT_CHANNEL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-snug">
                Interested in working with us? Apply to an open mission or connect with our recruitment team.
              </p>
              <Button className="w-full font-bold uppercase tracking-widest h-11" variant="outline">
                MESSAGE_RECRUITER
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-50">
                SYSTEM_LOG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Calendar className="size-3" />
                ESTABLISHED: {new Date(org.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
