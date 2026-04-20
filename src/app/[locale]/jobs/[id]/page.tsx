'use client';

import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useJobQueries } from '@/hooks/queries/useJobQueries';
import { useJobMatchingQueries } from '@/hooks/queries/useJobMatchingQueries';
import { useMetadataQueries } from '@/hooks/queries/useMetadataQueries';
import { useAiQueries } from '@/hooks/queries/useAiQueries';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft, MapPin, Briefcase, DollarSign, Star, Loader2,
  Zap, FileText, Calendar
} from 'lucide-react';
import { ApplicationStatus } from '@/types/job';
import { AiDraftResultDto } from '@/types/ai';
import { useState } from 'react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const jobId = Number(params.id);

  const { user } = useAuthStore();
  const { useGetJob, useGetJobSkills, useApplyToJob } = useJobQueries();
  const { useMatchExplanation } = useJobMatchingQueries();
  const { useAiDraftCoverLetter } = useAiQueries();
  const { useMetadataQueries: _m } = { useMetadataQueries: useMetadataQueries };

  const { data: job, isLoading } = useGetJob(jobId);
  const { data: skills } = useGetJobSkills(jobId);
  const applyMutation = useApplyToJob();
  const draftCoverLetter = useAiDraftCoverLetter();

  const userId = user?.userId ? Number(user.userId) : null;
  const { data: matchExplanation, isLoading: matchLoading } = useMatchExplanation(userId, jobId);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);


  const handleApply = () => {
    if (!userId) return;
    applyMutation.mutate(
      { jobId, userId },
      {
        onSuccess: () => {
          setApplied(true);
          setShowApplyModal(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary animate-pulse tracking-[0.4em] text-xs">LOADING_JOB_DATA...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-sm">JOB_NOT_FOUND</p>
        <Button variant="outline" className="mt-4 rounded-none" onClick={() => router.back()}>
          GO_BACK
        </Button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-primary/20 pb-6 space-y-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-none text-[10px]">
            <ArrowLeft className="size-3 mr-1" /> BACK_TO_LISTINGS
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] border border-primary/40 px-2 py-0.5 text-primary font-bold tracking-widest">
                  {job.jobType?.toUpperCase() || 'N/A'}
                </span>
                <span className="text-[9px] border border-secondary/40 px-2 py-0.5 text-secondary font-bold tracking-widest">
                  {job.experienceLevel?.toUpperCase() || 'N/A'}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter terminal-glow">
                {job.title?.toUpperCase() || 'UNTITLED_JOB'}
              </h1>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="size-3" />
                  {`ORG_${job.organizationId}`}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" /> {job.location?.toUpperCase() || 'REMOTE'}
                </span>
                {job.salaryMin > 0 && (
                  <span className="flex items-center gap-1 text-primary font-bold">
                    <DollarSign className="size-3" />
                    {job.salaryMin.toLocaleString()} — {job.salaryMax.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {!applied ? (
                <Button
                  className="rounded-none terminal-glow h-11 px-6 font-bold tracking-[0.15em]"
                  onClick={() => setShowApplyModal(true)}
                >
                  APPLY_NOW
                </Button>
              ) : (
                <span className="inline-flex items-center px-4 h-11 border border-green-500/40 text-green-400 text-[10px] font-bold tracking-widest">
                  ✓ APPLICATION_SUBMITTED
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20 bg-primary/5 rounded-none">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-[10px] font-bold tracking-widest uppercase text-primary border-b border-primary/20 pb-2">
                  ROLE_DESCRIPTION
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {skills && skills.length > 0 && (
              <Card className="border-primary/20 bg-primary/5 rounded-none">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-[10px] font-bold tracking-widest uppercase text-primary border-b border-primary/20 pb-2">
                    REQUIRED_SKILLS
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: any) => (
                      <span
                        key={skill.id || skill.skillName}
                        className="px-3 py-1 border border-primary/30 text-primary text-[10px] font-bold tracking-widest"
                      >
                        {(skill.skillName || skill.name || skill).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Match Explanation */}
            {userId && (
              <Card className="border-primary/20 bg-primary/5 rounded-none">
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-[10px] font-bold tracking-widest uppercase text-primary border-b border-primary/20 pb-2 flex items-center gap-2">
                    <Zap className="size-3" /> AI_MATCH_ANALYSIS
                  </h2>
                  {matchLoading ? (
                    <div className="animate-pulse text-[10px] text-muted-foreground tracking-widest">ANALYZING_COMPATIBILITY...</div>
                  ) : matchExplanation ? (
                    <p className="text-xs text-muted-foreground leading-relaxed">{matchExplanation}</p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">COMPLETE_YOUR_PROFILE_FOR_AI_ANALYSIS</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Side Info */}
          <div className="space-y-4">
            <Card className="border-primary/20 rounded-none">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary">JOB_METADATA</h3>
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TYPE</span>
                    <span className="font-bold">{job.jobType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LEVEL</span>
                    <span className="font-bold">{job.experienceLevel || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EXP_REQUIRED</span>
                    <span className="font-bold">{job.experienceRequired}Y</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EXP_REQUIRED</span>
                    <span className="font-bold">{job.experienceRequired}Y</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">POSTED</span>
                    <span className="font-bold">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="w-full rounded-none text-[10px] h-10"
              onClick={() => setShowApplyModal(true)}
              disabled={applied}
            >
              <FileText className="size-3 mr-2" />
              {applied ? 'APPLIED' : 'QUICK_APPLY'}
            </Button>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg border-primary/40 rounded-none bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black tracking-widest uppercase terminal-glow">
                    SUBMIT_APPLICATION
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowApplyModal(false)} className="rounded-none">
                    ✕
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground tracking-widest leading-relaxed">
                  By clicking submit, you agree to share your profile details with the employer.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" className="rounded-none" onClick={() => setShowApplyModal(false)}>
                    CANCEL
                  </Button>
                  <Button
                    className="rounded-none terminal-glow"
                    onClick={handleApply}
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
                    SUBMIT_APPLICATION
                  </Button>
                </div>
                {applyMutation.isError && (
                  <p className="text-[10px] text-destructive">ERROR: FAILED_TO_SUBMIT_APPLICATION</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
