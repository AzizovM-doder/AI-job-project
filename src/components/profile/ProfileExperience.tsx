'use client';

import { Experience } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileExperienceProps {
  experiences: Experience[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onEdit: (exp: Experience) => void;
  onDelete: (id: number) => void;
}

export default function ProfileExperience({ experiences, isOwnProfile, onAdd, onEdit, onDelete }: ProfileExperienceProps) {
  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
        <CardTitle className="text-xl font-bold">Experience</CardTitle>
        {isOwnProfile && (
          <Button variant="ghost" size="icon" className="rounded-full size-9" onClick={onAdd}>
            <Plus className="size-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2 space-y-6">
        {experiences && experiences.length > 0 ? (
          experiences.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((exp, idx) => (
            <div key={exp.id} className="flex gap-3 group relative">
              <div className="size-12 rounded-sm bg-muted flex items-center justify-center border shrink-0">
                <Briefcase className="size-6 text-muted-foreground/60" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-[14px] font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer">
                    {exp.position}
                  </h3>
                  {isOwnProfile && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full"
                        onClick={() => onEdit(exp)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(exp.id)}
                      >
                        <span className="text-lg">×</span>
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-[14px] font-medium leading-tight">{exp.companyName}</p>
                <p className="text-[12px] text-muted-foreground">
                  {format(new Date(exp.startDate), 'MMM yyyy')} – {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}
                </p>
              </div>
              {idx !== experiences.length - 1 && (
                <div className="absolute left-[23px] top-12 bottom-[-24px] w-[1px] bg-border/40" />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">No experience records found.</p>
        )}
      </CardContent>
    </Card>
  );
}
