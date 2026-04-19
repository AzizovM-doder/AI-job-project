'use client';

import { PostFeedItemDto } from '@/types/post';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ThumbsUp, MessageSquare, Share2, Send, MoreHorizontal, Globe, Pencil, Trash2, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuPortal,
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
import { motion, AnimatePresence } from 'framer-motion';

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
    toast.success('Signal Relayed Successfully');
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id, {
      onSuccess: () => {
        toast.success('Post purged from matrix');
        setIsDeleteDialogOpen(false);
      },
      onError: () => toast.error('Failed to purge signal')
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
    <motion.div
      whileHover={{ scale: 1.005 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group/card"
    >
      <Card className="glass-card bg-white/5 backdrop-blur-xl border-white/10 rounded-[2rem] overflow-visible shadow-2xl transition-all duration-500">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="size-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 p-0.5 shadow-inner">
                {post.authorAvatar ? (
                  <img src={post.authorAvatar} alt="" className="size-full object-cover rounded-[0.9rem]" />
                ) : (
                  <div className="size-full flex items-center justify-center font-black text-white/30 text-lg uppercase">
                    {post.authorName?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-heading font-black text-white tracking-tight uppercase leading-none">
                    {post.authorName || 'Collaborator'}
                  </span>
                  {post.authorHeadline && (
                    <span className="text-[8px] bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-black uppercase tracking-[0.2em]">VERIFIED</span>
                  )}
                </div>
                <p className="text-[11px] text-white/50 font-bold uppercase tracking-widest mt-1.5 leading-none">
                  {post.authorHeadline || 'Sector 7 Operative'}
                </p>
                <div className="flex items-center gap-2 mt-2 opacity-40 group-hover/card:opacity-100 transition-opacity">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                  <div className="size-1 rounded-full bg-primary" />
                  <Globe className="size-3 text-primary opacity-60" />
                </div>
              </div>
            </div>
            
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                    <MoreHorizontal className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent align="end" className="w-56 p-2 glass backdrop-blur-3xl border-white/10 rounded-3xl shadow-3xl z-[9999]">
                    <DropdownMenuItem
                      onClick={() => setIsEditDialogOpen(true)}
                      className="gap-3 py-3 px-4 focus:bg-white/10 rounded-2xl text-[10px] font-heading font-black uppercase tracking-widest cursor-pointer transition-all"
                    >
                      <Pencil className="size-4 text-primary" />
                      <span>Edit Signal</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="gap-3 py-3 px-4 text-destructive focus:bg-destructive/10 rounded-2xl text-[10px] font-heading font-black uppercase tracking-widest cursor-pointer transition-all"
                    >
                      <Trash2 className="size-4" />
                      <span>Purge Post</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
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
          title="Purge Signal?"
          description="De-authorizing this data fragment is irreversible. Proceed with extraction?"
          confirmText="Execute Purge"
          variant="destructive"
          isLoading={deleteMutation.isPending}
        />

        <CardContent className="px-6 py-2 space-y-4">
          <p className="text-[16px] leading-[1.6] text-white/90 whitespace-pre-wrap font-medium tracking-tight h-auto">
            {post.content}
          </p>

          {post.imageUrl && (
            <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20 group/image relative mt-4 shadow-3xl">
              <img
                src={post.imageUrl}
                alt="Post Content"
                className="w-full h-auto max-h-[600px] object-cover transition-transform duration-700 group-hover/image:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
            </div>
          )}
        </CardContent>

        <div className="px-6 py-4 flex items-center justify-between border-t border-white/5 mt-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
              <ThumbsUp className="size-3.5 text-primary fill-current" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{post.likeCount || 0} Uplinks</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/40">
            <button onClick={() => setShowComments(!showComments)} className="hover:text-primary transition-colors">{post.commentsCount || 0} Responses</button>
            <button onClick={handleRepost} className="hover:text-primary transition-colors">{post.repostCount || 0} Relays</button>
          </div>
        </div>

        <CardFooter className="p-2 flex items-center justify-between gap-2 border-t border-white/5">
          <Button
            variant="ghost"
            className={cn(
              "flex-1 h-12 rounded-2xl font-heading font-black uppercase text-[10px] tracking-[0.15em] transition-all duration-300",
              post.likedByMe ? "bg-primary/20 text-primary border-primary/20" : "text-white/40 hover:bg-white/5 hover:text-white"
            )}
            onClick={handleLike}
          >
            <ThumbsUp className={cn("size-4 mr-2.5", post.likedByMe && "fill-current")} />
            <span className="hidden sm:inline">Uplink</span>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "flex-1 h-12 rounded-2xl font-heading font-black uppercase text-[10px] tracking-[0.15em] transition-all duration-300 text-white/40 hover:bg-white/5 hover:text-white",
              showComments && "bg-white/10 text-white"
            )}
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="size-4 mr-2.5" />
            <span className="hidden sm:inline">Respond</span>
          </Button>

          <Button
            variant="ghost"
            className="flex-1 h-12 rounded-2xl font-heading font-black uppercase text-[10px] tracking-[0.15em] transition-all duration-300 text-white/40 hover:bg-white/5 hover:text-white"
            onClick={handleRepost}
          >
            <Share2 className="size-4 mr-2.5" />
            <span className="hidden sm:inline">Relay</span>
          </Button>

          <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-heading font-black uppercase text-[10px] tracking-[0.15em] transition-all duration-300 text-white/40 hover:bg-white/5 hover:text-white">
            <Send className="size-4 mr-2.5" />
            <span className="hidden sm:inline">Bridge</span>
          </Button>
        </CardFooter>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-black/20 border-t border-white/5"
            >
              <div className="p-6 space-y-6">
                {/* Add Comment Input */}
                <div className="flex gap-4">
                  <div className="size-10 rounded-xl bg-white/5 border border-white/10 shrink-0 overflow-hidden shadow-inner">
                    {(currentUser as any)?.avatarUrl ? (
                      <img src={(currentUser as any).avatarUrl} alt="Me" className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center font-bold text-white/20 text-xs">
                        {currentUser?.fullName?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleAddComment} className="flex-1 flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Open secure terminal for comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-[13px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20 shadow-inner"
                    />
                    {commentText.trim() && (
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          size="sm"
                          disabled={addCommentMutation.isPending}
                          className="rounded-xl h-9 px-6 font-heading font-black uppercase text-[9px] tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        >
                          {addCommentMutation.isPending ? <Loader2 className="animate-spin size-3" /> : 'Execute Signal'}
                        </Button>
                      </div>
                    )}
                  </form>
                </div>

                {/* Comments List */}
                <div className="space-y-4 pt-1">
                  {isLoadingComments ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="size-6 text-primary animate-spin opacity-40" />
                    </div>
                  ) : comments?.length === 0 ? (
                    null
                  ) : (
                    comments?.map((comment) => (
                      <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="size-9 rounded-lg bg-white/5 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center text-[10px] font-black text-white/20">
                          {comment.authorAvatar ? (
                            <img src={comment.authorAvatar} alt="" className="size-full object-cover" />
                          ) : (
                            comment.authorName?.[0] || 'U'
                          )}
                        </div>
                        <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl p-4 shadow-sm group/comment">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[12px] font-black uppercase tracking-tight text-white/90">{comment.authorName || 'User'}</span>
                            <span className="text-[9px] text-white/20 font-bold uppercase tracking-[0.1em]">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-[13px] leading-relaxed text-white/70 font-normal">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
