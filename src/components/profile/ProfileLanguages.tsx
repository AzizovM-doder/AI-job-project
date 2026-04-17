'use client';

import { ProfileLanguage } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Globe, Trash2 } from 'lucide-react';

interface ProfileLanguagesProps {
  languages: ProfileLanguage[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

export default function ProfileLanguages({ languages, isOwnProfile, onAdd, onDelete }: ProfileLanguagesProps) {
  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
        <CardTitle className="text-xl font-bold">Languages</CardTitle>
        {isOwnProfile && (
          <Button variant="ghost" size="icon" className="rounded-full size-9" onClick={onAdd}>
            <Plus className="size-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2 space-y-4">
        {languages && languages.length > 0 ? (
          languages.map((lang) => (
            <div key={lang.id} className="flex items-center justify-between group border-b border-border/40 pb-4 last:border-0 last:pb-0">
              <div>
                <h3 className="text-[14px] font-bold">{lang.languageName}</h3>
                <p className="text-[12px] text-muted-foreground">{lang.level}</p>
              </div>
              {isOwnProfile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  onClick={() => onDelete(lang.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">No languages added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

