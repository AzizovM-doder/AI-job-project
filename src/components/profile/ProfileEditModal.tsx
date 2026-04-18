'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserProfile, UpdateUserProfileDto } from '@/types/profile';
import { Textarea } from '@/components/ui/textarea';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  userId: number;
  onSave: (data: UpdateUserProfileDto) => void;
  isPending: boolean;
}

export default function ProfileEditModal({ isOpen, onClose, profile, userId, onSave, isPending }: ProfileEditModalProps) {
  const [formData, setFormData] = useState<UpdateUserProfileDto>({
    id: profile?.id || 0,
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    headline: profile?.headline || '',
    about: profile?.about || '',
    location: profile?.location || '',
    photoUrl: profile?.photoUrl || null,
    backgroundPhotoUrl: profile?.backgroundPhotoUrl || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] border-none shadow-2xl bg-background/95 backdrop-blur-xl rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Edit Professional Identity
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-8 pt-0 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">First Name</label>
                <Input
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Aziz"
                  required
                  className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Last Name</label>
                <Input
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Rahimov"
                  required
                  className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Professional Headline</label>
              <Input
                value={formData.headline || ''}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g. Full Stack Developer | Next.js Expert"
                className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Location</label>
              <Input
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Dushanbe, Tajikistan"
                className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">About / Summary</label>
              <Textarea
                value={formData.about || ''}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="min-h-[160px] bg-muted/30 border-border/10 rounded-xl p-4 focus-visible:ring-primary/10 transition-all font-medium"
                placeholder="Describe your professional background and goals..."
              />
            </div>
          </div>

          <DialogFooter className="p-8 pt-4 gap-3 bg-muted/10">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              disabled={isPending}
              className="rounded-xl font-bold h-11 px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="rounded-xl font-bold h-11 px-10 shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {isPending ? 'Saving...' : 'Save Identity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
