'use client';

import { useAuthStore } from '@/src/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Video, Calendar, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useFeedQueries } from '@/src/hooks/queries/useFeedQueries';
import { toast } from 'sonner';

export default function StartPostBox() {
  const { user } = useAuthStore();
  const { useCreatePost } = useFeedQueries();
  const createPostMutation = useCreatePost();
  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const onSubmit = (data: { content: string }) => {
    if (!data.content.trim()) return;
    
    createPostMutation.mutate({ content: data.content, imageUrl: null }, {
      onSuccess: () => {
        reset();
        toast.success('Post created successfully');
      },
      onError: () => {
        toast.error('Failed to create post');
      }
    });
  };

  return (
    <Card className="shadow-sm border-border/60">
      <CardContent className="pt-4 px-4 pb-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-3">
            <div className="size-12 rounded-full bg-primary/10 shrink-0 overflow-hidden border">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Me" className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center font-bold text-primary">
                  {user?.fullName?.[0] || 'U'}
                </div>
              )}
            </div>
            <textarea
              {...register('content', { required: true })}
              className="flex-1 bg-background border border-border/60 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-[48px] overflow-hidden hover:bg-muted/50 transition-colors"
              placeholder="Start a post..."
            />
          </div>
          
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" type="button" className="text-muted-foreground hover:bg-primary/10 hover:text-primary h-12 flex-1 sm:flex-none">
                <ImageIcon className="size-5 mr-2 text-primary" />
                <span className="text-xs font-semibold">Media</span>
              </Button>
              <Button variant="ghost" size="sm" type="button" className="text-muted-foreground hover:bg-orange-100 hover:text-orange-600 h-12 flex-1 sm:flex-none hidden lg:flex">
                <Calendar className="size-5 mr-2 text-orange-500" />
                <span className="text-xs font-semibold">Event</span>
              </Button>
              <Button variant="ghost" size="sm" type="button" className="text-muted-foreground hover:bg-emerald-100 hover:text-emerald-700 h-12 flex-1 sm:flex-none">
                <Layout className="size-5 mr-2 text-emerald-600" />
                <span className="text-xs font-semibold">Write article</span>
              </Button>
            </div>
            
            <Button 
              type="submit" 
              size="sm" 
              disabled={createPostMutation.isPending}
              className="rounded-full px-4 h-8 font-bold"
            >
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
