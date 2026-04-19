'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Terminal, Send, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <DialogContent className="sm:max-w-[500px] glass-card bg-black/40 backdrop-blur-3xl border-white/10 rounded-[2.5rem] p-0 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <DialogHeader className="p-8 pb-4 relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                <Terminal className="size-5 text-primary" />
             </div>
             <DialogTitle className="text-sm font-heading font-black uppercase tracking-[0.3em] text-white">Commendation_Protocol</DialogTitle>
          </div>
          <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
            Initializing formal endorsement for <span className="text-primary">{recipientName}</span>. Signal clarity is mandatory.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-6 relative z-10">
          <div className="space-y-3">
            <Textarea
              {...register('content', { required: true, minLength: 10 })}
              placeholder="What do you want to say about their work? Open communication lines..."
              className="min-h-[180px] bg-white/5 border-white/10 rounded-2xl p-5 text-[14px] font-medium text-white focus-visible:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-white/20 resize-none shadow-inner"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 opacity-30">
                <Sparkles className="size-3 text-primary" />
                <span className="text-[8px] font-black uppercase tracking-widest">Aesthetic_Logic: Professionalism Required</span>
              </div>
              <p className={cn(
                "text-[8px] font-black uppercase tracking-widest transition-colors",
                content.length < 10 ? "text-white/20" : "text-emerald-500"
              )}>
                Chars: {content.length} / 10 Min
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-3 border-t border-white/5 pt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              className="rounded-xl h-11 px-6 font-heading font-black uppercase text-[9px] tracking-widest text-white/40 hover:bg-white/5 hover:text-white"
            >
              Abort Link
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !content.trim() || content.length < 10} 
              className="rounded-xl h-11 px-8 font-heading font-black uppercase text-[9px] tracking-widest bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              {isPending ? 'Broadcasting...' : 'Authenticate & Send'}
              <Send className="size-3.5" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
