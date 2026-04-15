'use client';

import { useAuthStore } from '@/src/store/authStore';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useFeed } from '@/src/hooks/useFeed';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2, Send, Terminal, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Post } from '@/src/types/post';

export default function ActivityFeed() {
  const { user } = useAuthStore();
  const { useGetFeed, useCreatePost, useLikePost } = useFeed();
  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const { data: posts, isLoading } = useGetFeed();
  const createPostMutation = useCreatePost();
  const likeMutation = useLikePost();

  const onPostSubmit = (data: { content: string }) => {
    if (data.content.trim()) {
      createPostMutation.mutate(data.content, {
        onSuccess: () => reset()
      });
    }
  };

  const handleLike = (postId: number) => {
    likeMutation.mutate(postId);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-black terminal-glow uppercase">GLOBAL_FEED_v2.2</h1>
          <p className="text-xs text-muted-foreground tracking-[0.2em]">BROADCASTING TO NETWORK...</p>
        </header>

        {/* Create Post */}
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center">
              <Terminal className="size-3 mr-2" /> NEW_BROADCAST
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onPostSubmit)} className="space-y-4">
              <textarea
                {...register('content', { required: true })}
                className="w-full bg-background border border-primary/20 p-4 text-xs font-mono focus:outline-none focus:border-primary min-h-[100px] uppercase placeholder:opacity-50"
                placeholder="WHAT IS ON YOUR MIND, SYSTEM_USER?"
              />
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  type="submit" 
                  disabled={createPostMutation.isPending}
                  className="terminal-glow"
                >
                  {createPostMutation.isPending ? <Loader2 className="animate-spin mr-2 size-3" /> : <Send className="mr-2 size-3" />} 
                  TRANSMIT
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="space-y-6">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse border-primary/10 h-40 bg-primary/5" />
            ))
          ) : posts?.length ? (
            posts.map((post: Post) => (
              <Card key={post.id} className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader className="pb-2 flex flex-row items-center space-x-3">
                  <div className="size-8 bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-xs">
                    {post.authorName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <CardTitle className="text-sm">{post.authorName?.toUpperCase()}</CardTitle>
                    <p className="text-[10px] text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </CardHeader>
                <CardContent className="py-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </CardContent>
                <CardFooter className="pt-2 border-t border-primary/10 flex items-center space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center text-[10px] hover:text-primary transition-colors ${post.isLikedByMe ? 'text-primary' : ''}`}
                  >
                    <Heart className={`size-3 mr-1 ${post.isLikedByMe ? 'fill-current' : ''}`} /> 
                    {post.likesCount || 0} LIKES
                  </button>
                  <button className="flex items-center text-[10px] hover:text-primary transition-colors">
                    <MessageSquare className="size-3 mr-1" /> {post.commentsCount || 0} COMMENTS
                  </button>
                  <button className="flex items-center text-[10px] hover:text-primary transition-colors ml-auto">
                    <Share2 className="size-3 mr-1" /> SHARE
                  </button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center p-20 border border-dashed border-primary/20 bg-primary/5">
              <p className="text-xs text-muted-foreground tracking-widest uppercase">NO BROADCASTS DETECTED IN THIS SECTOR</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
