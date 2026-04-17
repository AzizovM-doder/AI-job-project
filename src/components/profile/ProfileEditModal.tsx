'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserProfile, UpdateProfileDto } from '@/types/profile';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  userId: number;
  onSave: (data: UpdateProfileDto) => void;
  isPending: boolean;
}

export default function ProfileEditModal({ isOpen, onClose, profile, userId, onSave, isPending }: ProfileEditModalProps) {
  const [formData, setFormData] = useState<Partial<UpdateProfileDto>>({
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
    onSave(formData as UpdateProfileDto);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Professional Identity">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">First Name</label>
            <Input
              value={formData.firstName || ''}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="e.g. Aziz"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Last Name</label>
            <Input
              value={formData.lastName || ''}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="e.g. Rahimov"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Professional Headline</label>
          <Input
            value={formData.headline || ''}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            placeholder="e.g. Full Stack Developer | Next.js Expert"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Location</label>
          <Input
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Dushanbe, Tajikistan"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">About / Summary</label>
          <textarea
            value={formData.about || ''}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            className="w-full min-h-[120px] p-3 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            placeholder="Describe your professional background and goals..."
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving Profile...' : 'Save Identity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
