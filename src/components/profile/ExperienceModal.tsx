'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
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
    if (experience) {
      onSave({ ...formData, id: experience.id } as Experience);
    } else {
      onSave({ ...formData, userId } as CreateExperienceDto);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={experience ? "Edit Experience" : "Add Experience"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold">Position</label>
          <Input
            value={formData.position || ''}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="e.g. Senior Software Engineer"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Company Name</label>
          <Input
            value={formData.companyName || ''}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g. Google"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Start Date</label>
            <Input
              type="date"
              value={formData.startDate ? formData.startDate.split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">End Date (Optional)</label>
            <Input
              type="date"
              value={formData.endDate ? formData.endDate.split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Appearance'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
