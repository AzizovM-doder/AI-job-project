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
    <div className="space-y-2 pb-12">
      <StartPostBox />

      {/* Feed Divider / Sort */}
      <div className="flex items-center gap-2 py-1">
        <hr className="flex-1 border-gray-200" />
        <button className="text-[12px] text-gray-500 flex items-center gap-1 hover:text-primary transition-colors">
          Sort by: <span className="font-bold text-gray-900">Top</span>
        </button>
      </div>

      {isLoading ? (
        [1, 2, 3].map(i => (
          <Card key={i} className="p-4 space-y-4 shadow-sm border-gray-200 bg-white rounded-xl">
            <div className="flex gap-3">
              <Skeleton className="size-12 rounded-full bg-gray-100" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32 bg-gray-100" />
                <Skeleton className="h-3 w-48 bg-gray-100" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-gray-100" />
              <Skeleton className="h-4 w-[90%] bg-gray-100" />
            </div>
            <Skeleton className="h-48 w-full rounded-lg bg-gray-100" />
            <div className="flex justify-between border-t border-gray-100 pt-3">
              <Skeleton className="h-8 w-20 bg-gray-100 rounded-md" />
              <Skeleton className="h-8 w-20 bg-gray-100 rounded-md" />
              <Skeleton className="h-8 w-20 bg-gray-100 rounded-md" />
            </div>
          </Card>
        ))
      ) : isError ? (
        <Card className="p-12 text-center border-gray-200 bg-white rounded-xl shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-bold text-gray-900">Unable to load feed</p>
            <p className="text-xs text-gray-500">Check your internet connection and try again.</p>
          </div>
        </Card>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-2">
          {posts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="p-20 text-center shadow-sm border-gray-200 bg-white rounded-xl">
          <p className="font-bold text-lg text-gray-900">No posts yet</p>
          <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Start a post to share your thoughts with your professional network.</p>
        </Card>
      )}
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PageTransition className="py-6">
          <Container>
            <ThreeColumnLayout
              left={<FeedIdentityCard />}
              main={FeedContent}
              right={<FeedSuggestionsCard />}
            />
          </Container>
        </PageTransition>
      </div>
    </ProtectedRoute>
  );
}
