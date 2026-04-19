'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Video, Calendar, Layout, X, Plus, Sparkles, Send, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeedQueries } from '@/hooks/queries/useFeedQueries';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { toast } from 'sonner';
import ImagePickerModal from '@/components/profile/ImagePickerModal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function StartPostBox() {
  const { user } = useAuthStore();
  const { useCreatePost } = useFeedQueries();
  const { useUploadPhoto } = useProfileQueries();

  const createPostMutation = useCreatePost();
  const uploadPhotoMutation = useUploadPhoto();

  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = async (value: File | string) => {
    if (typeof value === 'string') {
      setImageUrl(value);
    } else {
      setIsUploading(true);
      const loadingToast = toast.loading('Broadcasting image to relay nodes...');
      uploadPhotoMutation.mutate(value, {
        onSuccess: (url) => {
          setImageUrl(url);
          toast.success('Image signal established', { id: loadingToast });
        },
        onError: () => {
          toast.error('Signal interference: Upload failed', { id: loadingToast });
        },
        onSettled: () => setIsUploading(false)
      });
    }
  };

  const handlePost = () => {
    if (!content.trim()) return;

    createPostMutation.mutate({ content, imageUrl }, {
      onSuccess: () => {
        setContent('');
        setImageUrl(null);
        toast.success('Transmission Successful');
      },
      onError: () => {
        toast.error('Transmission Blocked');
      }
    });
  };

  return (
    <Card className="glass-card bg-white/[0.03] backdrop-blur-2xl border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-primary/20">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="size-14 rounded-2xl bg-black border border-white/10 shrink-0 overflow-hidden shadow-2xl">
              {(user as any)?.avatarUrl ? (
                <img src={(user as any).avatarUrl} alt="Me" className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center font-black text-white/20 bg-white/5 uppercase text-lg">
                  {user?.fullName?.[0] || 'U'}
                </div>
              )}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[14px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20 resize-none h-14 min-h-[56px] overflow-hidden hover:bg-white/[0.07]"
              placeholder="Initialize new professional signal..."
            />
          </div>

          <AnimatePresence>
            {imageUrl && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-black/20 group"
              >
                <img src={imageUrl} alt="Post preview" className="w-full h-auto max-h-[400px] object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-xl shadow-2xl font-black uppercase text-[10px] tracking-widest px-6 h-10"
                    onClick={() => setImageUrl(null)}
                  >
                    <X className="size-4 mr-2" /> De-authorize Media
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-1">
              {[
                { icon: ImageIcon, label: 'Media', color: 'text-blue-500', onClick: () => setIsPhotoPickerOpen(true) },
                { icon: Calendar, label: 'Event', color: 'text-orange-400', hideOnMobile: true },
                { icon: Layout, label: 'Article', color: 'text-emerald-500' }
              ].map((item, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  onClick={item.onClick}
                  className={cn(
                    "text-white/40 hover:bg-white/5 hover:text-white h-12 px-4 flex items-center gap-3 rounded-xl transition-all",
                    item.hideOnMobile && "hidden lg:flex"
                  )}
                >
                  <item.icon className={cn("size-5", item.color, "fill-current opacity-60")} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                </Button>
              ))}
            </div>

            <AnimatePresence>
              {content.trim() && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                  <Button
                    onClick={handlePost}
                    disabled={createPostMutation.isPending || isUploading}
                    className="rounded-2xl px-8 font-heading font-black uppercase text-[10px] tracking-[0.2em] h-11 bg-primary text-primary-foreground shadow-2xl shadow-primary/20 transition-all active:scale-95 hover:scale-105"
                  >
                    {createPostMutation.isPending ? 'Broadcasting...' : 'Post Signal'}
                    <Send className="size-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>

      <ImagePickerModal
        isOpen={isPhotoPickerOpen}
        onClose={() => setIsPhotoPickerOpen(false)}
        onSelect={handleImageSelect}
        title="Source Local Media"
      />
    </Card>
  );
}
