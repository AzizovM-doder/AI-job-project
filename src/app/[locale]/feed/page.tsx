'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import { PageTransition } from '@/src/components/PageTransition';
import ThreeColumnLayout from '@/src/components/layouts/ThreeColumnLayout';
import FeedIdentityCard from '@/src/components/feed/FeedIdentityCard';
import FeedSuggestionsCard from '@/src/components/feed/FeedSuggestionsCard';
import StartPostBox from '@/src/components/feed/StartPostBox';
import FeedPostCard from '@/src/components/feed/FeedPostCard';
import { useFeedQueries } from '@/src/hooks/queries/useFeedQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function FeedPage() {
  const { useGetFeed } = useFeedQueries();
  const { data: posts, isLoading, isError } = useGetFeed();

  const FeedContent = (
    <div className="space-y-3">
      <StartPostBox />
      
      {/* Feed Divider / Sort */}
      <div className="flex items-center gap-2 py-1">
        <hr className="flex-1 border-muted-foreground/20" />
        <button className="text-[12px] text-muted-foreground flex items-center gap-1 hover:text-foreground">
          Sort by: <span className="font-bold text-foreground">Top</span>
        </button>
      </div>

      {isLoading ? (
        [1, 2, 3].map(i => (
          <Card key={i} className="p-4 space-y-4 shadow-sm border-border/60">
            <div className="flex gap-3">
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
          </Card>
        ))
      ) : isError ? (
        <Card className="p-10 text-center border-dashed border-destructive/40 bg-destructive/5 text-destructive">
          <p className="text-sm font-bold uppercase tracking-widest">Feed Synchronization Failure</p>
          <p className="text-xs mt-1">Unable to connect to broadcast stream.</p>
        </Card>
      ) : posts && posts.length > 0 ? (
        posts.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))
      ) : (
        <Card className="p-16 text-center shadow-sm border-border/60">
          <p className="font-bold text-lg">No posts yet</p>
          <p className="text-muted-foreground text-sm mt-1">Start a post to share your thoughts with your network.</p>
        </Card>
      )}
    </div>
  );

  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="w-full">
           <ThreeColumnLayout 
             left={<FeedIdentityCard />}
             main={FeedContent}
             right={<FeedSuggestionsCard />}
           />
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
}
