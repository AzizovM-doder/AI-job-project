'use client';

import { useAuth } from '@/src/context/AuthContext';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/src/services/post.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageSquare, Share2, Send, Terminal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function ActivityFeed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const { data: feedData, isLoading } = useQuery({
    queryKey: ['feed'],
    queryFn: () => postService.getFeed(1, 10),
  });

  const createPostMutation = useMutation({
    mutationFn: (content: string) => postService.createPost(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      reset();
    },
  });

  const onPostSubmit = (data: { content: string }) => {
    if (data.content.trim()) {
      createPostMutation.mutate(data.content);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-black terminal-glow uppercase">GLOBAL_FEED_v2.1</h1>
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
                  <Send className="mr-2 size-3" /> TRANSMIT
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="space-y-6">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse border-primary/10">
                <div className="h-40" />
              </Card>
            ))
          ) : feedData?.items?.length ? (
            feedData.items.map((post: any) => (
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
                <CardContent className="py-2">
                  <p className="text-sm leading-relaxed">{post.content}</p>
                </CardContent>
                <CardFooter className="pt-2 border-t border-primary/10 flex items-center space-x-6">
                  <button className="flex items-center text-[10px] hover:text-primary transition-colors">
                    <Heart className="size-3 mr-1" /> {post.likesCount || 0} LIKES
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
            <div className="text-center p-20 border border-dashed border-primary/20">
              <p className="text-xs text-muted-foreground tracking-widest">NO BROADCASTS DETECTED IN THIS SECTOR</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
