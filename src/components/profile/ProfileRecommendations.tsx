'use client';

import { Recommendation } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2, Plus, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUserQueries } from '@/hooks/queries/useUserQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RecommendationItemProps {
  recommendation: Recommendation;
  isOwnProfile: boolean;
  onDelete?: (id: number) => void;
}

function RecommendationItem({ recommendation, isOwnProfile, onDelete }: RecommendationItemProps) {
  const { useGetPublicProfile } = useUserQueries();
  const { data: author, isLoading } = useGetPublicProfile(recommendation.authorId);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-5 py-8 first:pt-4 last:pb-4 border-b last:border-0 border-white/5 group/rec"
    >
      <div className="size-14 rounded-2xl bg-white/5 shrink-0 overflow-hidden border border-white/10 p-0.5 shadow-xl">
        {isLoading ? (
          <Skeleton className="size-full bg-white/5" />
        ) : author?.avatarUrl ? (
          <img src={author.avatarUrl} alt="" className="size-full object-cover rounded-[0.9rem]" />
        ) : (
          <div className="size-full flex items-center justify-center font-black text-white/20 uppercase text-lg">
            {author?.fullName?.[0] || 'U'}
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-heading font-black text-[13px] uppercase tracking-tight text-white group-hover/rec:text-primary transition-colors cursor-pointer">
              {isLoading ? <Skeleton className="h-4 w-32 bg-white/5" /> : author?.fullName || 'Collaborator'}
            </h4>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
              {isLoading ? <Skeleton className="h-3 w-48 bg-white/5" /> : author?.headline || 'Sector 7 Operative'}
            </p>
            <div className="flex items-center gap-2 mt-2 opacity-30">
              <span className="text-[9px] font-black uppercase tracking-widest">
                {formatDistanceToNow(new Date(recommendation.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          {isOwnProfile && onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-10 rounded-xl bg-white/5 text-white/40 hover:text-destructive hover:bg-destructive/10 transition-all"
              onClick={() => onDelete(recommendation.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
        <div className="relative pt-2">
          <div className="absolute top-0 left-0 w-8 h-[1px] bg-primary/30" />
          <p className="text-[14px] leading-relaxed text-white/70 italic font-medium">
            "{recommendation.content}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface ProfileRecommendationsProps {
  recommendations: Recommendation[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

export default function ProfileRecommendations({ recommendations, isOwnProfile, onAdd, onDelete }: ProfileRecommendationsProps) {
  return (
    <Card className="glass-card bg-white/[0.03] backdrop-blur-2xl border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
            <MessageSquare className="size-4" /> Commendations
          </CardTitle>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Verified Multi-Sector Endorsements</p>
        </div>
        {!isOwnProfile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl font-heading font-black uppercase text-[9px] tracking-widest h-10 px-6 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-all shadow-lg shadow-primary/5"
            onClick={onAdd}
          >
            <Plus className="size-4 mr-2" /> Give Recommendation
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-8">
        {recommendations?.length > 0 ? (
          <div className="divide-y divide-white/5 -mt-4">
            {recommendations.map((rec) => (
              <RecommendationItem 
                key={rec.id} 
                recommendation={rec} 
                isOwnProfile={isOwnProfile}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4">
            <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
              <Radio className="size-6 text-white/20" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-widest text-white/40 italic">Signal Void Detected</p>
              {!isOwnProfile && (
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Initialize the first commendation for this operative.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const Radio = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
  </svg>
);
