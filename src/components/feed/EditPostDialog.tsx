'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFeedQueries } from '@/hooks/queries/useFeedQueries';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { toast } from 'sonner';
import { PostFeedItemDto } from '@/types/post';
import { Image as ImageIcon, X } from 'lucide-react';
import ImagePickerModal from '@/components/profile/ImagePickerModal';

interface EditPostDialogProps {
  post: PostFeedItemDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditPostDialog({ post, open, onOpenChange }: EditPostDialogProps) {
  const [content, setContent] = useState(post.content || '');
  const [imageUrl, setImageUrl] = useState(post.imageUrl || '');
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { useUpdatePost } = useFeedQueries();
  const { useUploadPhoto } = useProfileQueries();

  const updatePostMutation = useUpdatePost(post.id);
  const uploadPhotoMutation = useUploadPhoto();

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

  const handleSave = () => {
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    updatePostMutation.mutate({ content, imageUrl: imageUrl || null }, {
      onSuccess: () => {
        toast.success('Post updated successfully');
        onOpenChange(false);
      },
      onError: () => {
        toast.error('Failed to update post');
      }
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px] border-none shadow-2xl bg-white sm:rounded-lg p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Edit Post
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[160px] text-[15px] bg-white border-gray-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary resize-none rounded-xl p-4 font-normal transition-all"
                placeholder="What's on your mind?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 block">Media Attachment</label>

              {imageUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                  <img src={imageUrl} alt="Post preview" className="w-full h-auto max-h-[300px] object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full shadow-lg font-bold"
                      onClick={() => setIsPhotoPickerOpen(true)}
                    >
                      Change
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full shadow-lg font-bold"
                      onClick={() => setImageUrl('')}
                    >
                      <X className="size-4 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsPhotoPickerOpen(true)}
                  className="w-full h-32 border-2 border-dashed border-gray-200 hover:border-primary hover:bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
                >
                  <div className="bg-gray-100 p-3 rounded-full">
                    <ImageIcon className="size-6 text-gray-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-500">Add an image to your post</span>
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="p-6 pt-4 border-t border-gray-100 gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-full font-bold h-10 px-6 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updatePostMutation.isPending || (content === post.content && imageUrl === post.imageUrl) || isUploading}
              className="rounded-full px-8 font-bold h-10 shadow-lg active:scale-95"
            >
              {updatePostMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImagePickerModal
        isOpen={isPhotoPickerOpen}
        onClose={() => setIsPhotoPickerOpen(false)}
        onSelect={handleImageSelect}
        title="Change Post Image"
      />
    </>
  );
}
