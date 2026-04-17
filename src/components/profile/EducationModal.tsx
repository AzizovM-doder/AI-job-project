'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Education, CreateUserEducationDto } from '@/src/types/profile';

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
      onSave({ ...formData, userId } as CreateEducationDto);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={education ? "Edit Education" : "Add Education"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold">Institution</label>
          <Input
            value={formData.institution || ''}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            placeholder="e.g. Tehran University"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Degree</label>
          <Input
            value={formData.degree || ''}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            placeholder="Bachelor's, Master's, etc."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Start Year</label>
            <Input
              type="number"
              min={1950}
              max={2100}
              value={formData.startYear || ''}
              onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">End Year</label>
            <Input
              type="number"
              min={1950}
              max={2100}
              value={formData.endYear || ''}
              onChange={(e) => setFormData({ ...formData, endYear: parseInt(e.target.value) })}
              required
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
