'use client';

import { Education } from '@/src/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileEducationProps {
  educations: Education[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onEdit: (edu: Education) => void;
  onDelete: (id: number) => void;
}

export default function ProfileEducation({ educations, isOwnProfile, onAdd, onEdit, onDelete }: ProfileEducationProps) {
  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
        <CardTitle className="text-xl font-bold">Education</CardTitle>
        {isOwnProfile && (
          <Button variant="ghost" size="icon" className="rounded-full size-9" onClick={onAdd}>
            <Plus className="size-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2 space-y-6">
        {educations && educations.length > 0 ? (
          educations.sort((a, b) => b.startYear - a.startYear).map((edu, idx) => (
            <div key={edu.id} className="flex gap-3 group relative">
              <div className="size-12 rounded-sm bg-muted flex items-center justify-center border shrink-0">
                <GraduationCap className="size-6 text-muted-foreground/60" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-[14px] font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer">
                    {edu.institution}
                  </h3>
                  {isOwnProfile && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full"
                        onClick={() => onEdit(edu)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(edu.id)}
                      >
                        <span className="text-lg">×</span>
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-[14px] leading-tight">{edu.degree}</p>
                <p className="text-[12px] text-muted-foreground">
                  {edu.startYear} – {edu.endYear || 'Present'}
                </p>
              </div>
              {idx !== educations.length - 1 && (
                <div className="absolute left-[23px] top-12 bottom-[-24px] w-[1px] bg-border/40" />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">No education records found.</p>
        )}
      </CardContent>
    </Card>
  );
}
