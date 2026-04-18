'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreateProfileLanguageDto, LanguageLevel } from '@/types/profile';
import { useMetadataQueries } from '@/hooks/queries/useMetadataQueries';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProfileLanguageDto) => void;
  isPending: boolean;
  profileId: number;
}

export default function LanguageModal({ isOpen, onClose, onSave, isPending, profileId }: LanguageModalProps) {
  const { useLanguages } = useMetadataQueries();
  const { data: languages, isLoading } = useLanguages();
  
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
  const [level, setLevel] = useState<LanguageLevel>(LanguageLevel.Beginner);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLanguageId) return;
    
    onSave({
      profileId,
      languageId: parseInt(selectedLanguageId),
      level,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] border-none shadow-2xl bg-background/95 backdrop-blur-xl sm:rounded-lg p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Add Language
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-8 pt-0 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Select Language</label>
              {isLoading ? (
                <div className="h-11 w-full bg-muted/30 animate-pulse rounded-xl" />
              ) : (
                <div className="relative group">
                  <select
                    value={selectedLanguageId}
                    onChange={(e) => setSelectedLanguageId(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border/10 bg-muted/30 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-[15px] font-bold appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select a language...</option>
                    {languages?.map((lang) => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Proficiency Level</label>
              <div className="relative group">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as LanguageLevel)}
                  className="w-full h-11 px-4 rounded-xl border border-border/10 bg-muted/30 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-[15px] font-bold appearance-none cursor-pointer"
                >
                  {Object.values(LanguageLevel).map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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
              disabled={isPending || !selectedLanguageId}
              className="rounded-xl font-bold h-11 px-10 shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {isPending ? 'Adding...' : 'Add Language'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
