'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { useJobQueries } from '@/src/hooks/queries/useJobQueries';
import { useMetadataQueries } from '@/src/hooks/queries/useMetadataQueries';
import { useOrganizationQueries } from '@/src/hooks/queries/useOrganizationQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { CreateJobDto, JobType, ExperienceLevel } from '@/src/types/job';
import { useAI } from '@/src/hooks/useAI';

export default function NewJobPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { useCreateJob } = useJobQueries();
  const { useJobCategories } = useMetadataQueries();
  const { useMyOrganizations } = useOrganizationQueries();
  const { useImproveJob } = useAI();

  const createJob = useCreateJob();
  const improveJob = useImproveJob();
  const { data: categories } = useJobCategories();
  const { data: myOrgs, isLoading: orgsLoading } = useMyOrganizations();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateJobDto>({
    defaultValues: {
      isRemote: false,
      experienceRequired: 1,
      salaryMin: 0,
      salaryMax: 0,
    },
  });

  // Auto-set organizationId from the user's first organization
  useEffect(() => {
    if (myOrgs?.length) {
      setValue('organizationId', myOrgs[0].id);
    }
  }, [myOrgs, setValue]);

  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const handleImprove = () => {
    const title = watch('title');
    const desc = watch('description');
    if (!title || !desc) return;
    improveJob.mutate(
      { jobTitle: title, currentDescription: desc },
      {
        onSuccess: (data) => {
          const suggestion = data?.data?.improvedDescription ?? data?.data ?? data;
          setAiSuggestion(typeof suggestion === 'string' ? suggestion : JSON.stringify(suggestion));
        },
      }
    );
  };

  const onSubmit = (data: CreateJobDto) => {
    createJob.mutate(data, {
      onSuccess: () => {
        router.push(`/${locale}/organization/dashboard`);
      },
    });
  };

  const inputCls = 'rounded-none bg-background border border-primary/20 focus:border-primary w-full px-3 py-2 text-sm';
  const selectCls = `${inputCls} appearance-none`;
  const labelCls = 'text-[10px] text-muted-foreground uppercase tracking-widest block mb-1';

  return (
    <ProtectedRoute allowedRoles={['Organization']}>
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex items-center gap-4 border-b border-primary/20 pb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-none"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <div className="h-[2px] w-8 bg-primary" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">NEW_VACANCY</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter terminal-glow">POST_JOB_LISTING</h1>
          </div>
        </header>

        {/* No organization warning */}
        {!orgsLoading && !myOrgs?.length && (
          <div className="flex items-center gap-3 border border-destructive/40 bg-destructive/10 p-4 text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            <p className="text-[11px] font-bold tracking-widest uppercase">
              NO_ORGANIZATION_FOUND — Please create an organization first from{' '}
              <button
                className="underline hover:opacity-70"
                onClick={() => router.push(`/${locale}/organization/profile`)}
              >
                ORG_SETTINGS
              </button>
            </p>
          </div>
        )}

        {/* Organization selector (if user has multiple orgs) */}
        {myOrgs && myOrgs.length > 1 && (
          <div className="border border-primary/20 p-4 bg-primary/5 space-y-2">
            <label className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">
              POST_AS_ORGANIZATION
            </label>
            <select
              className="rounded-none bg-background border border-primary/20 focus:border-primary w-full px-3 py-2 text-sm appearance-none"
              onChange={(e) => setValue('organizationId', Number(e.target.value))}
              defaultValue={myOrgs[0].id}
            >
              {myOrgs.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <section className="space-y-4 border border-primary/20 p-6 bg-primary/5">
            <h2 className="text-[10px] font-bold tracking-widest uppercase text-primary border-b border-primary/20 pb-2">
              CORE_PARAMETERS
            </h2>
            <div className="space-y-2">
              <label className={labelCls}>JOB_TITLE *</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className={inputCls}
                placeholder="SENIOR_BACKEND_ENGINEER"
              />
              {errors.title && (
                <p className="text-destructive text-[10px]">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>JOB_TYPE *</label>
                <select {...register('jobType', { required: true })} className={selectCls}>
                  {Object.values(JobType).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>EXPERIENCE_LEVEL *</label>
                <select {...register('experienceLevel', { required: true })} className={selectCls}>
                  {Object.values(ExperienceLevel).map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>LOCATION *</label>
                <input
                  {...register('location', { required: 'Location is required' })}
                  className={inputCls}
                  placeholder="DUSHANBE / REMOTE"
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>YEARS_EXPERIENCE *</label>
                <input
                  type="number"
                  {...register('experienceRequired', { required: true, min: 0 })}
                  className={inputCls}
                  min={0}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>CATEGORY</label>
                <select {...register('categoryId', { valueAsNumber: true })} className={selectCls}>
                  <option value="">SELECT_CATEGORY</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('isRemote')} className="rounded-none" />
                  <span className="text-[10px] tracking-widest uppercase">REMOTE_ELIGIBLE</span>
                </label>
              </div>
            </div>
          </section>

          {/* Salary */}
          <section className="space-y-4 border border-primary/20 p-6 bg-primary/5">
            <h2 className="text-[10px] font-bold tracking-widest uppercase text-primary border-b border-primary/20 pb-2">
              COMPENSATION_RANGE
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>MIN_SALARY ($)</label>
                <input
                  type="number"
                  {...register('salaryMin', { valueAsNumber: true, min: 0 })}
                  className={inputCls}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>MAX_SALARY ($)</label>
                <input
                  type="number"
                  {...register('salaryMax', { valueAsNumber: true, min: 0 })}
                  className={inputCls}
                  placeholder="0"
                />
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-4 border border-primary/20 p-6 bg-primary/5">
            <div className="flex items-center justify-between border-b border-primary/20 pb-2">
              <h2 className="text-[10px] font-bold tracking-widest uppercase text-primary">JOB_DESCRIPTION *</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] rounded-none hover:text-primary"
                onClick={handleImprove}
                disabled={improveJob.isPending}
              >
                {improveJob.isPending ? (
                  <Loader2 className="size-3 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="size-3 mr-1" />
                )}
                AI_IMPROVE
              </Button>
            </div>
            <textarea
              {...register('description', { required: 'Description is required' })}
              className="w-full bg-background border border-primary/20 p-4 text-xs font-mono focus:outline-none focus:border-primary min-h-[160px] resize-none"
              placeholder="DESCRIBE THE ROLE, RESPONSIBILITIES, AND REQUIREMENTS..."
            />
            {errors.description && (
              <p className="text-destructive text-[10px]">{errors.description.message}</p>
            )}
            {aiSuggestion && (
              <div className="border border-primary/40 bg-primary/10 p-4 space-y-2">
                <p className="text-[10px] font-bold text-primary tracking-widest">AI_SUGGESTION:</p>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{aiSuggestion}</p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-none text-[10px]"
                  onClick={() => {
                    setValue('description', aiSuggestion);
                    setAiSuggestion(null);
                  }}
                >
                  APPLY_SUGGESTION
                </Button>
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={() => router.back()}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="rounded-none terminal-glow px-8"
              disabled={createJob.isPending || !myOrgs?.length}
            >
              {createJob.isPending ? (
                <Loader2 className="animate-spin mr-2 size-4" />
              ) : null}
              PUBLISH_LISTING
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
