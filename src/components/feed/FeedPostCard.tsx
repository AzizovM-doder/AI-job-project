'use client';

import { PostFeedItemDto } from '@/types/post';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ThumbsUp, MessageSquare, Share2, Send, MoreHorizontal, Globe, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import EditPostDialog from './EditPostDialog';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useFeedQueries } from '@/hooks/queries/useFeedQueries';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function FeedPostCard({ post }: { post: PostFeedItemDto }) {
  const { user: currentUser } = useAuthStore();
  const { useLikePost, useRepost, useGetComments, useAddComment, useDeletePost } = useFeedQueries();

  const likeMutation = useLikePost(post.id);
  const repostMutation = useRepost(post.id);
  const deleteMutation = useDeletePost();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: comments, isLoading: isLoadingComments } = useGetComments(post.id, showComments);
  const addCommentMutation = useAddComment(post.id);

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleRepost = () => {
    repostMutation.mutate();
    toast.success('Post reposted successfully');
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id, {
      onSuccess: () => {
        toast.success('Post deleted successfully');
        setIsDeleteDialogOpen(false);
      },
      onError: () => toast.error('Failed to delete post')
    });
  };

  const isAuthor = Number(currentUser?.userId) === post.userId;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addCommentMutation.mutate({ content: commentText }, {
      onSuccess: () => {
        setCommentText('');
      }
    });
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow group/card">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex gap-2.5">
            <div className="size-12 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.authorName || 'User'} className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center font-bold text-gray-400 uppercase text-sm">
                  {post.authorName?.[0] || 'U'}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 min-h-[20px]">
                <span className="text-[14px] font-bold text-gray-900 hover:text-primary hover:underline transition-colors cursor-pointer decoration-2">
                  {post.authorName || 'Collaborator'}
                </span>
                {post.authorHeadline && (
                  <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">PRO</span>
                )}
              </div>
              <p className="text-[12px] text-gray-500 font-medium line-clamp-1">
                {post.authorHeadline || 'AI-JOB Network Member'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <span className="size-0.5 rounded-full bg-gray-300" />
                <Globe className="size-3" />
              </div>
            </div>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all">
                  <MoreHorizontal className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1 bg-white border border-gray-200 shadow-lg rounded-xl">
                <DropdownMenuItem
                  onClick={() => setIsEditDialogOpen(true)}
                  className="gap-2.5 cursor-pointer py-2 px-3 focus:bg-gray-50 rounded-lg transition-colors font-semibold text-sm"
                >
                  <Pencil className="size-4 text-gray-500" />
                  <span>Edit Post</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="gap-2.5 cursor-pointer py-2 px-3 text-destructive focus:bg-destructive/5 rounded-lg transition-colors font-semibold text-sm"
                >
                  <Trash2 className="size-4" />
                  <span>Delete Post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <EditPostDialog
        post={post}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <ConfirmModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        description="Are you sure you want to permanently delete this post?"
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />

      <CardContent className="px-4 py-2">
        <p className="text-[14px] leading-relaxed text-gray-800 whitespace-pre-wrap font-normal">{post.content}</p>

        {post.imageUrl && (
          <div className="mt-4 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 group/image relative">
            <img
              src={post.imageUrl}
              alt="Post Content"
              className="w-full h-auto max-h-[600px] object-cover transition-all duration-300 group-hover/image:opacity-95"
            />
          </div>
        )}
      </CardContent>

      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-1 cursor-pointer hover:underline group/likes">
          <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <ThumbsUp className="size-2.5 text-primary fill-current" />
          </div>
          <span className="text-[12px] text-gray-500 group-hover:text-primary transition-colors">{post.likeCount || 0}</span>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-gray-500">
          <button className="hover:text-primary hover:underline transition-colors">{post.commentsCount || 0} comments</button>
          <button className="hover:text-primary hover:underline transition-colors">{post.repostCount || 0} reposts</button>
        </div>
      </div>

      <CardFooter className="px-1 py-1 flex items-center justify-between gap-1">
        <Button
          variant="ghost"
          className={cn(
            "flex-1 h-10 text-gray-500 font-bold hover:bg-gray-100 hover:text-gray-900 transition-all rounded-lg group/btn",
            post.likedByMe && "text-primary hover:text-primary-foreground hover:bg-primary"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className={cn("size-5 mr-2", post.likedByMe && "fill-current")} />
          <span className="hidden sm:inline">Like</span>
        </Button>

        <Button
          variant="ghost"
          className="flex-1 h-10 text-gray-500 font-bold hover:bg-gray-100 hover:text-gray-900 transition-all rounded-lg group/btn"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="size-5 mr-2" />
          <span className="hidden sm:inline">Comment</span>
        </Button>

        <Button
          variant="ghost"
          className="flex-1 h-10 text-gray-500 font-bold hover:bg-gray-100 hover:text-gray-900 transition-all rounded-lg group/btn"
          onClick={handleRepost}
        >
          <Share2 className="size-5 mr-2" />
          <span className="hidden sm:inline">Repost</span>
        </Button>

        <Button variant="ghost" className="flex-1 h-10 text-gray-500 font-bold hover:bg-gray-100 hover:text-gray-900 transition-all rounded-lg group/btn">
          <Send className="size-5 mr-2" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </CardFooter>

      {showComments && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4 bg-gray-50/50">
          {/* Add Comment Input */}
          <div className="flex gap-2">
            <div className="size-10 rounded-full bg-gray-200 shrink-0 overflow-hidden border border-gray-100 shadow-sm">
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Me" className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center font-bold text-gray-400 text-xs">
                  {currentUser?.fullName?.[0] || 'U'}
                </div>
              )}
            </div>
            <form onSubmit={handleAddComment} className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
              />
              {commentText.trim() && (
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={addCommentMutation.isPending}
                    className="rounded-full h-8 px-4 font-bold text-[12px]"
                  >
                    Post
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-3 pt-1">
            {isLoadingComments ? (
              <div className="flex justify-center py-4">
                <div className="size-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              </div>
            ) : comments?.length === 0 ? (
              null
            ) : (
              comments?.map((comment) => (
                <div key={comment.id} className="flex gap-2 group/comment">
                  <div className="size-9 rounded-full bg-gray-200 shrink-0 overflow-hidden border border-gray-100 font-bold flex items-center justify-center text-[10px] text-gray-400">
                    {comment.authorAvatar ? (
                      <img src={comment.authorAvatar} alt="User" className="size-full object-cover" />
                    ) : (
                      comment.authorName?.[0] || 'U'
                    )}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-2xl p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[13px] font-bold text-gray-900">{comment.authorName || 'User'}</span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-gray-700 font-normal">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
