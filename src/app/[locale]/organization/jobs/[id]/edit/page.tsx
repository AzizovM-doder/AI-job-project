'use client';

import { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useJobQueries } from '@/hooks/queries/useJobQueries';
import { useMetadataQueries } from '@/hooks/queries/useMetadataQueries';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { UpdateJobDto, JobType, ExperienceLevel } from '@/types/job';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const jobId = Number(params.id);

  const { useJobDetail, useUpdateJob, useDeleteJob } = useJobQueries();
  const { useJobCategories } = useMetadataQueries();

  const { data: job, isLoading } = useJobDetail(jobId);
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();
  const { data: categories } = useJobCategories();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateJobDto>();

  useEffect(() => {
    if (job) reset(job);
  }, [job, reset]);

  const onSubmit = (data: UpdateJobDto) => {
    updateJob.mutate({ id: jobId, data }, {
      onSuccess: () => router.push(`/${locale}/organization/dashboard`),
    });
  };

  const handleDelete = () => {
    if (!confirm('DELETE_THIS_JOB_LISTING? This cannot be undone.')) return;
    deleteJob.mutate(jobId, {
      onSuccess: () => router.push(`/${locale}/organization/dashboard`),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary animate-pulse tracking-[0.4em] text-xs">LOADING_JOB_DATA...</div>
      </div>
    );
  }

  const inputCls = 'rounded-none bg-background border border-primary/20 focus:border-primary w-full px-3 py-2 text-sm';
  const selectCls = `${inputCls} appearance-none`;
  const labelCls = 'text-[10px] text-muted-foreground uppercase tracking-widest block mb-1';

  return (
    <ProtectedRoute allowedRoles={['Organization']}>
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-primary/20 pb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-none">
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">
                EDIT_VACANCY / JOB_ID: {jobId}
              </span>
              <h1 className="text-2xl font-black tracking-tighter terminal-glow mt-1">
                {job?.title?.toUpperCase()}
              </h1>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-none"
            onClick={handleDelete}
            disabled={deleteJob.isPending}
          >
            {deleteJob.isPending ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3 mr-1" />}
            DELETE
          </Button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="border border-primary/20 p-6 bg-primary/5 space-y-4">
            <h2 className="text-[10px] font-bold tracking-widest uppercase text-primary border-b border-primary/20 pb-2">
              CORE_PARAMETERS
            </h2>
            <div className="space-y-2">
              <label className={labelCls}>JOB_TITLE</label>
              <input {...register('title')} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>JOB_TYPE</label>
                <select {...register('jobType')} className={selectCls}>
                  {Object.values(JobType).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>EXPERIENCE_LEVEL</label>
                <select {...register('experienceLevel')} className={selectCls}>
                  {Object.values(ExperienceLevel).map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>LOCATION</label>
                <input {...register('location')} className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>CATEGORY</label>
                <select {...register('categoryId', { valueAsNumber: true })} className={selectCls}>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border border-primary/20 p-6 bg-primary/5 space-y-4">
            <h2 className="text-[10px] font-bold tracking-widest uppercase text-primary border-b border-primary/20 pb-2">
              COMPENSATION
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>MIN_SALARY ($)</label>
                <input type="number" {...register('salaryMin', { valueAsNumber: true })} className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>MAX_SALARY ($)</label>
                <input type="number" {...register('salaryMax', { valueAsNumber: true })} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="border border-primary/20 p-6 bg-primary/5 space-y-4">
            <h2 className="text-[10px] font-bold tracking-widest uppercase text-primary border-b border-primary/20 pb-2">
              JOB_DESCRIPTION
            </h2>
            <textarea
              {...register('description')}
              className="w-full bg-background border border-primary/20 p-4 text-xs font-mono focus:outline-none focus:border-primary min-h-[160px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" className="rounded-none" onClick={() => router.back()}>
              CANCEL
            </Button>
            <Button type="submit" className="rounded-none terminal-glow px-8" disabled={updateJob.isPending}>
              {updateJob.isPending ? <Loader2 className="animate-spin mr-2 size-4" /> : null}
              SAVE_CHANGES
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
