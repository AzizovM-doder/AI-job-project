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
import { CreateProfileSkillDto } from '@/types/profile';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { Check, Search } from 'lucide-react';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProfileSkillDto) => void;
  isPending: boolean;
  profileId: number;
}

export default function SkillModal({ isOpen, onClose, onSave, isPending, profileId }: SkillModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { useSearchSkills } = useProfileQueries();
  const { data: searchResults, isLoading } = useSearchSkills(searchTerm);

  const [selectedSkill, setSelectedSkill] = useState<{ id: number, name: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;
    onSave({ 
      profileId, 
      skillId: selectedSkill.id 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl bg-background/95 backdrop-blur-xl rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Add Professional Skill
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-8 pt-0 space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Search Skill</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 bg-muted/30 border-border/10 rounded-xl h-12 focus-visible:ring-primary/10 font-bold"
                  placeholder="e.g. React, Python, Management..."
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[240px] overflow-y-auto border border-border/20 rounded-2xl divide-y bg-muted/5 custom-scrollbar">
              {isLoading && (
                <div className="flex flex-col items-center py-8 space-y-2 opacity-50">
                   <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                   <p className="text-[10px] font-bold uppercase tracking-widest">Searching Knowledge Base...</p>
                </div>
              )}
              {!isLoading && searchResults?.length === 0 && searchTerm.length > 1 && (
                <div className="p-8 text-center text-xs text-muted-foreground italic font-bold uppercase tracking-widest opacity-40">
                  No matching skills found.
                </div>
              )}
              {searchResults?.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => setSelectedSkill({ id: skill.id, name: skill.name || '' })}
                  className={`w-full p-4 text-left text-[15px] font-bold hover:bg-primary/5 transition-all flex items-center justify-between group/item ${selectedSkill?.id === skill.id ? 'bg-primary text-primary-foreground' : 'text-foreground/80'}`}
                >
                  <span>{skill.name}</span>
                  {selectedSkill?.id === skill.id ? (
                    <Check className="size-5" />
                  ) : (
                    <div className="size-5 rounded-full border-2 border-border/40 group-hover/item:border-primary/40 transition-colors" />
                  )}
                </button>
              ))}
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
              disabled={isPending || !selectedSkill}
              className="rounded-xl font-bold h-11 px-10 shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {isPending ? 'Adding...' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
