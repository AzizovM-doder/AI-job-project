'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateProfileSkillDto } from '@/types/profile';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { Check, Search, Skill } from 'lucide-react';

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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Professional Skill">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold">Search Skill</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              placeholder="e.g. React, Python, Project Management..."
              autoFocus
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[200px] overflow-y-auto border rounded-md divide-y bg-muted/5">
          {isLoading && <div className="p-4 text-center text-xs animate-pulse">Searching global skills...</div>}
          {!isLoading && searchResults?.length === 0 && searchTerm.length > 1 && (
            <div className="p-4 text-center text-xs text-muted-foreground italic">No matching skills found.</div>
          )}
          {searchResults?.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => setSelectedSkill({ id: skill.id, name: skill.name || '' })}
              className={`w-full p-3 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between ${selectedSkill?.id === skill.id ? 'bg-primary/5 text-primary' : ''}`}
            >
              <span>{skill.name}</span>
              {selectedSkill?.id === skill.id && <Check className="size-4" />}
            </button>
          ))}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !selectedSkill}>
            {isPending ? 'Adding...' : 'Add Skill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
