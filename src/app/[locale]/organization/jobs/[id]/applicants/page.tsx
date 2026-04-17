'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useJobMatchingQueries } from '@/hooks/queries/useJobMatchingQueries';
import { useJobQueries } from '@/hooks/queries/useJobQueries';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, Star, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { ApplicationStatus } from '@/types/job';

const statusColors: Record<string, string> = {
  [ApplicationStatus.Pending]: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
  [ApplicationStatus.Reviewing]: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  [ApplicationStatus.Accepted]: 'border-green-500/30 text-green-400 bg-green-500/10',
  [ApplicationStatus.Rejected]: 'border-red-500/30 text-red-400 bg-red-500/10',
  [ApplicationStatus.Withdrawn]: 'border-gray-500/30 text-gray-400 bg-gray-500/10',
};

export default function ApplicantsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const jobId = Number(params.id);

  const { useGetJob, useGetApplicationsByJob, useUpdateApplication } = useJobQueries();
  const { useRecommendedApplicants } = useJobMatchingQueries();

  const { data: job } = useGetJob(jobId);
  const { data: applications, isLoading } = useGetApplicationsByJob(jobId);
  const { data: recommended } = useRecommendedApplicants(jobId);
  const updateStatus = useUpdateApplication();

  const handleStatus = (app: any, status: ApplicationStatus) => {
    updateStatus.mutate({ 
      ...app,
      status 
    });
  };

  const getMatchScore = (userId: number) => {
    return recommended?.items?.find((r) => r.application.userId === userId)?.matchScore;
  };

  return (
    <ProtectedRoute allowedRoles={['Organization']}>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center gap-4 border-b border-primary/20 pb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-none">
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">
              APPLICANTS / JOB_ID: {jobId}
            </span>
            <h1 className="text-2xl font-black tracking-tighter terminal-glow mt-1">
              {job?.title?.toUpperCase() || 'LOADING...'}
            </h1>
          </div>
          <span className="ml-auto text-[10px] font-mono text-muted-foreground">
            TOTAL: {applications?.length ?? 0} CANDIDATES
          </span>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-primary/5 border border-primary/10 animate-pulse" />
            ))}
          </div>
        ) : applications?.length ? (
          <div className="border border-primary/20 overflow-hidden">
            <table className="w-full text-[10px] uppercase tracking-widest">
              <thead className="bg-primary/5 border-b border-primary/20">
                <tr>
                  <th className="p-4 text-left font-black">CANDIDATE</th>
                  <th className="p-4 text-left font-black hidden md:table-cell">EMAIL</th>
                  <th className="p-4 text-center font-black hidden md:table-cell">AI_MATCH</th>
                  <th className="p-4 text-center font-black">STATUS</th>
                  <th className="p-4 text-right font-black">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {applications.map((app) => {
                  const match = getMatchScore(app.userId);
                  return (
                    <tr key={app.id} className="hover:bg-primary/5 transition-colors">
                      <td className="p-4 font-bold">
                        {`CANDIDATE_${app.userId}`}
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        {`UID_${app.userId}`}
                      </td>
                      <td className="p-4 text-center hidden md:table-cell">
                        {match !== undefined ? (
                          <span className={`inline-flex items-center gap-1 font-mono font-bold ${match >= 70 ? 'text-green-400' : match >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                            <Star className="size-3" /> {match}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2 py-0.5 text-[8px] font-bold border ${statusColors[app.status] ?? ''}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {app.status === ApplicationStatus.Pending || app.status === ApplicationStatus.Reviewing ? (
                            <>
                              <Button
                                size="sm"
                                className="h-7 px-2 rounded-none text-[9px] bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatus(app, ApplicationStatus.Accepted)}
                                disabled={updateStatus.isPending}
                              >
                                <Check className="size-3 mr-1" /> ACCEPT
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 px-2 rounded-none text-[9px]"
                                onClick={() => handleStatus(app, ApplicationStatus.Rejected)}
                                disabled={updateStatus.isPending}
                              >
                                <X className="size-3 mr-1" /> REJECT
                              </Button>
                            </>
                          ) : (
                            <span className="text-[9px] text-muted-foreground italic">FINAL</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-primary/20">
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
              NO_APPLICATIONS_RECEIVED_YET
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
