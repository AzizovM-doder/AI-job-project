'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { PageTransition } from '@/components/PageTransition';
import ThreeColumnLayout from '@/components/layouts/ThreeColumnLayout';
import FeedIdentityCard from '@/components/feed/FeedIdentityCard';
import FeedSuggestionsCard from '@/components/feed/FeedSuggestionsCard';
import StartPostBox from '@/components/feed/StartPostBox';
import FeedPostCard from '@/components/feed/FeedPostCard';
import { useFeedQueries } from '@/hooks/queries/useFeedQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

import { Container } from '@/components/ui/Container';

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
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="flex justify-between border-t pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
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
      <PageTransition className="py-6">
        <Container>
          <ThreeColumnLayout
            left={<FeedIdentityCard />}
            main={FeedContent}
            right={<FeedSuggestionsCard />}
          />
        </Container>
      </PageTransition>
    </ProtectedRoute>
  );
}
