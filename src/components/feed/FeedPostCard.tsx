'use client';

import { PostFeedItemDto } from '@/src/types/post';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ThumbsUp, MessageSquare, Share2, Send, MoreHorizontal, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useFeedQueries } from '@/src/hooks/queries/useFeedQueries';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function FeedPostCard({ post }: { post: PostFeedItemDto }) {
  const { useLikePost, useRepost } = useFeedQueries();
  const likeMutation = useLikePost();
  const repostMutation = useRepost();
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    likeMutation.mutate(post.id);
  };

  const handleRepost = () => {
    repostMutation.mutate(post.id);
  };

  return (
    <Card className="shadow-sm border-border/60 hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2 space-y-0">
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            <div className="size-12 rounded-full bg-primary/10 overflow-hidden border">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.authorName || 'Author'} className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center font-bold text-primary bg-primary/5 uppercase text-sm">
                  {post.authorName?.[0] || 'U'}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-bold hover:text-primary hover:underline cursor-pointer">
                  {post.authorName || 'Collaborator'}
                </span>
                <span className="text-[14px] text-muted-foreground">• 1st</span>
              </div>
              <p className="text-[12px] text-muted-foreground line-clamp-1 max-w-[200px] sm:max-w-none">
                Software Engineer at AI-JOB Network
              </p>
              <div className="flex items-center gap-1 text-[12px] text-muted-foreground mt-0.5">
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <span>•</span>
                <Globe className="size-3" />
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="size-8 rounded-full">
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2">
        <p className="text-[14px] leading-[1.4] whitespace-pre-wrap">{post.content}</p>
        
        {post.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-border/50 bg-muted/20">
            <img src={post.imageUrl} alt="Post media" className="w-full h-auto max-h-[400px] object-cover" />
          </div>
        )}
      </CardContent>

      <div className="px-4 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-1 cursor-pointer hover:underline text-muted-foreground">
          <div className="flex -space-x-1">
            <div className="size-4 rounded-full bg-blue-500 flex items-center justify-center border-2 border-background">
              <ThumbsUp className="size-2 text-white fill-current" />
            </div>
          </div>
          <span className="text-[12px]">{post.likeCount || 0}</span>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
          <button className="hover:text-primary hover:underline">{post.commentsCount || 0} comments</button>
          <button className="hover:text-primary hover:underline">{post.repostCount || 0} reposts</button>
        </div>
      </div>

      <CardFooter className="px-1 py-1 mt-1 border-t flex items-center justify-between">
        <Button 
          variant="ghost" 
          className={cn(
            "flex-1 h-12 text-muted-foreground font-semibold hover:bg-black/5 hover:text-foreground group",
            post.likedByMe && "text-primary"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className={cn("size-5 mr-2", post.likedByMe && "fill-current")} />
          <span className="hidden sm:inline">Like</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex-1 h-12 text-muted-foreground font-semibold hover:bg-black/5 hover:text-foreground"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="size-5 mr-2" />
          <span className="hidden sm:inline">Comment</span>
        </Button>

        <Button 
          variant="ghost" 
          className="flex-1 h-12 text-muted-foreground font-semibold hover:bg-black/5 hover:text-foreground"
          onClick={handleRepost}
        >
          <Share2 className="size-5 mr-2" />
          <span className="hidden sm:inline">Repost</span>
        </Button>

        <Button variant="ghost" className="flex-1 h-12 text-muted-foreground font-semibold hover:bg-black/5 hover:text-foreground">
          <Send className="size-5 mr-2" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
