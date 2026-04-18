'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Experience, CreateUserExperienceDto } from '@/types/profile';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience | null;
  onSave: (data: CreateUserExperienceDto | Experience) => void;
  isPending: boolean;
  userId: number;
}

export default function ExperienceModal({ isOpen, onClose, experience, onSave, isPending, userId }: ExperienceModalProps) {
  const [formData, setFormData] = useState<Partial<Experience>>({
    companyName: '',
    position: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (experience) {
      setFormData(experience);
    } else {
      setFormData({
        companyName: '',
        position: '',
        startDate: '',
        endDate: '',
      });
    }
  }, [experience, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize dates to ISO string for backend compatibility
    const submissionData = {
      ...formData,
      userId,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    };

    if (experience) {
      onSave({ ...submissionData, id: experience.id } as Experience);
    } else {
      onSave(submissionData as CreateUserExperienceDto);
    }
  };

  return (
    <Dialog open={isOpen} onValueChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl bg-background/95 backdrop-blur-xl rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {experience ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-8 pt-0 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Position</label>
              <Input
                value={formData.position || ''}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                required
                className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Company Name</label>
              <Input
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Google"
                required
                className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">End Date (Optional)</label>
                <Input
                  type="date"
                  value={formData.endDate ? formData.endDate.split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
                />
              </div>
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
              {isPending ? 'Saving...' : 'Save Experience'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
