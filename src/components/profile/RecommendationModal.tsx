'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { content: string }) => void;
  isPending: boolean;
  recipientName: string;
}

export default function RecommendationModal({ isOpen, onClose, onSave, isPending, recipientName }: RecommendationModalProps) {
  const { register, handleSubmit, reset, watch } = useForm<{ content: string }>();
  const content = watch('content', '');

  const onSubmit = (data: { content: string }) => {
    onSave(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Write a recommendation</DialogTitle>
          <p className="text-sm text-muted-foreground pt-1">
            Recommend <span className="font-bold text-foreground">{recipientName}</span> for their achievements and skills.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Textarea
              {...register('content', { required: true, minLength: 10 })}
              placeholder="What do you want to say about their work?"
              className="min-h-[150px] resize-none border-border/60 focus-visible:ring-primary/20"
            />
            <p className="text-[10px] text-muted-foreground text-right italic">
              Recommendations should be professional and highlighting specific strengths.
            </p>
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-full font-bold">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !content.trim() || content.length < 10} 
              className="rounded-full font-bold px-8 shadow-md"
            >
              {isPending ? 'Sending...' : 'Send Recommendation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
