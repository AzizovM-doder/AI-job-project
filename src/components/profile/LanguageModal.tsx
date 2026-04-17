'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Language">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold">Select Language</label>
          {isLoading ? (
            <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
          ) : (
            <select
              value={selectedLanguageId}
              onChange={(e) => setSelectedLanguageId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              required
            >
              <option value="" disabled>Select a language...</option>
              {languages?.map((lang) => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Proficiency Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as LanguageLevel)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          >
            {Object.values(LanguageLevel).map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !selectedLanguageId}>
            {isPending ? 'Adding...' : 'Add Language'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
