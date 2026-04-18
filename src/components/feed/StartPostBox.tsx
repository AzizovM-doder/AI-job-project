'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Video, Calendar, Layout, X, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeedQueries } from '@/hooks/queries/useFeedQueries';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { toast } from 'sonner';
import ImagePickerModal from '@/components/profile/ImagePickerModal';
import { cn } from '@/lib/utils';

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
      const loadingToast = toast.loading('Uploading image...');
      uploadPhotoMutation.mutate(value, {
        onSuccess: (url) => {
          setImageUrl(url);
          toast.success('Image uploaded', { id: loadingToast });
        },
        onError: () => {
          toast.error('Failed to upload image', { id: loadingToast });
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
        toast.success('Post created successfully!');
      },
      onError: () => {
        toast.error('Failed to create post');
      }
    });
  };

  return (
    <Card className="shadow-sm border-gray-200 bg-white rounded-xl overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="size-12 rounded-full bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Me" className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center font-bold text-gray-400 bg-gray-50 uppercase text-sm">
                  {user?.fullName?.[0] || 'U'}
                </div>
              )}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-white border border-gray-300 rounded-full px-5 py-3 text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none h-[48px] min-h-[48px] overflow-hidden hover:bg-gray-50 transition-all placeholder:text-gray-500"
              placeholder="Start a post..."
            />
          </div>

          {imageUrl && (
            <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
              <img src={imageUrl} alt="Post preview" className="w-full h-auto max-h-[300px] object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-full shadow-lg font-bold"
                  onClick={() => setImageUrl(null)}
                >
                  <X className="size-4 mr-2" /> Remove
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setIsPhotoPickerOpen(true)}
                className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 h-12 px-3 flex items-center gap-2 rounded-lg transition-all"
              >
                <ImageIcon className="size-5 text-blue-500 fill-current" />
                <span className="text-[14px] font-bold">Media</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 h-12 px-3 flex items-center gap-2 rounded-lg transition-all hidden lg:flex"
              >
                <Calendar className="size-5 text-orange-400 fill-current" />
                <span className="text-[14px] font-bold">Event</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 h-12 px-3 flex items-center gap-2 rounded-lg transition-all"
              >
                <Layout className="size-5 text-emerald-500 fill-current" />
                <span className="text-[14px] font-bold">Article</span>
              </Button>
            </div>

            {content.trim() && (
              <Button
                onClick={handlePost}
                disabled={createPostMutation.isPending || (content.trim() === '' && !imageUrl) || isUploading}
                className="rounded-full px-6 font-bold h-8 transition-all active:scale-95"
              >
                {createPostMutation.isPending ? 'Posting...' : 'Post'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <ImagePickerModal
        isOpen={isPhotoPickerOpen}
        onClose={() => setIsPhotoPickerOpen(false)}
        onSelect={handleImageSelect}
        title="Add Image to Post"
      />
    </Card>
  );
}
