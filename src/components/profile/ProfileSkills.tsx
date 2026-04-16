'use client';

import { ProfileSkill } from '@/src/types/skill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Code, UserCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProfileSkillsProps {
  skills: ProfileSkill[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onDelete: (id: number) => void;
  onEndorse: (id: number) => void;
}

export default function ProfileSkills({ skills, isOwnProfile, onAdd, onDelete, onEndorse }: ProfileSkillsProps) {
  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
        <CardTitle className="text-xl font-bold">Skills</CardTitle>
        {isOwnProfile && (
          <Button variant="ghost" size="icon" className="rounded-full size-9" onClick={onAdd}>
            <Plus className="size-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="space-y-6">
          {skills && skills.length > 0 ? (
            skills.sort((a,b) => (b.endorsementCount || 0) - (a.endorsementCount || 0)).map((skill) => (
              <div key={skill.id} className="group border-b border-border/40 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <h3 className="text-[14px] font-bold hover:text-primary hover:underline cursor-pointer">
                      {skill.skillName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground font-medium">
                      <UserCheck className="size-3.5 text-primary" />
                      <span>{skill.endorsementCount || 0} endorsements</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     {!isOwnProfile && (
                       <Button 
                         variant="outline" 
                         size="sm" 
                         className="rounded-full h-8 px-4 font-bold border-primary text-primary hover:bg-primary/5"
                         onClick={() => onEndorse(skill.id)}
                       >
                         Endorse
                       </Button>
                     )}
                     {isOwnProfile && (
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                         onClick={() => onDelete(skill.id)}
                       >
                         <Trash2 className="size-4" />
                       </Button>
                     )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
          )}
        </div>
        
        {isOwnProfile && skills?.length > 0 && (
          <button className="text-[14px] font-bold text-muted-foreground hover:text-primary transition-colors mt-6 w-full text-center border-t border-border/40 pt-4">
            Show all {skills.length} skills →
          </button>
        )}
      </CardContent>
    </Card>
  );
}
