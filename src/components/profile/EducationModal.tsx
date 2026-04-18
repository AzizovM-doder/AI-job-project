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
import { Education, CreateUserEducationDto } from '@/types/profile';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education?: Education | null;
  onSave: (data: CreateUserEducationDto | Education) => void;
  isPending: boolean;
  userId: number;
}

export default function EducationModal({ isOpen, onClose, education, onSave, isPending, userId }: EducationModalProps) {
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
  });

  useEffect(() => {
    if (education) {
      setFormData(education);
    } else {
      setFormData({
        institution: '',
        degree: '',
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear(),
      });
    }
  }, [education, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (education) {
      onSave({ ...formData, id: education.id } as Education);
    } else {
      onSave({ ...formData, userId } as CreateUserEducationDto);
    }
  };

  return (
    <Dialog open={isOpen} onValueChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl bg-background/95 backdrop-blur-xl rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {education ? "Edit Education" : "Add Education"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-8 pt-0 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Institution</label>
              <Input
                value={formData.institution || ''}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. Tehran University"
                required
                className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Degree</label>
              <Input
                value={formData.degree || ''}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Bachelor's, Master's, etc."
                required
                className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Start Year</label>
                <Input
                  type="number"
                  min={1950}
                  max={2100}
                  value={formData.startYear || ''}
                  onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) })}
                  required
                  className="bg-muted/30 border-border/10 rounded-xl h-11 focus-visible:ring-primary/10 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">End Year</label>
                <Input
                  type="number"
                  min={1950}
                  max={2100}
                  value={formData.endYear || ''}
                  onChange={(e) => setFormData({ ...formData, endYear: parseInt(e.target.value) })}
                  required
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
              {isPending ? 'Saving...' : 'Save Education'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
