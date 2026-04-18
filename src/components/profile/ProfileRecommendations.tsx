'use client';

import { Recommendation } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUserQueries } from '@/hooks/queries/useUserQueries';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendationItemProps {
  recommendation: Recommendation;
  isOwnProfile: boolean;
  onDelete?: (id: number) => void;
}

function RecommendationItem({ recommendation, isOwnProfile, onDelete }: RecommendationItemProps) {
  const { useGetPublicProfile } = useUserQueries();
  const { data: author, isLoading } = useGetPublicProfile(recommendation.authorId);

  return (
    <div className="flex gap-4 py-6 first:pt-0 last:pb-0 border-b last:border-0 border-border/40">
      <div className="size-12 rounded-full bg-muted shrink-0 overflow-hidden border">
        {isLoading ? (
          <Skeleton className="size-full" />
        ) : author?.avatarUrl ? (
          <img src={author.avatarUrl} alt={author.fullName || 'Author'} className="size-full object-cover" />
        ) : (
          <div className="size-full flex items-center justify-center font-bold text-muted-foreground uppercase text-sm">
            {author?.fullName?.[0] || 'U'}
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold text-sm hover:text-primary hover:underline cursor-pointer">
              {isLoading ? <Skeleton className="h-4 w-24" /> : author?.fullName || 'Member'}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {isLoading ? <Skeleton className="h-3 w-32" /> : author?.headline || 'AI-JOB Network Member'}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">
              {formatDistanceToNow(new Date(recommendation.createdAt), { addSuffix: true })}
            </p>
          </div>
          {isOwnProfile && onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(recommendation.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
        <div className="mt-3 relative">
          <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            "{recommendation.content}"
          </p>
        </div>
      </div>
    </div>
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
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardHeader className="p-6 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <MessageSquare className="size-4" /> Recommendations
        </CardTitle>
        {!isOwnProfile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full font-bold px-4 border-primary text-primary hover:bg-primary/5"
            onClick={onAdd}
          >
            <Plus className="size-4 mr-1" /> Give recommendation
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-2">
        {recommendations?.length > 0 ? (
          <div className="divide-y divide-border/40">
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
          <div className="py-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground italic">No recommendations yet.</p>
            {!isOwnProfile && (
              <p className="text-xs text-muted-foreground">Be the first to recommend this person.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
