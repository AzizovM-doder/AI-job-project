'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAiQueries } from '@/src/hooks/queries/useAiQueries';
import { useProfileQueries } from '@/src/hooks/queries/useProfileQueries';
import { toast } from 'sonner';

interface ProfileAboutProps {
  bio: string | null;
  isOwnProfile: boolean;
  userId: number;
}

export default function ProfileAbout({ bio, isOwnProfile, userId }: ProfileAboutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(bio || '');
  const { useUpdateProfile } = useProfileQueries();
  const { useAiAsk } = useAiQueries();
  
  const updateMutation = useUpdateProfile();
  const aiMutation = useAiAsk();

  const handleSave = () => {
    updateMutation.mutate({ bio: editedBio }, {
      onSuccess: () => {
        setIsEditing(false);
        toast.success('About section updated');
      }
    });
  };

  const handleAiImprove = () => {
    aiMutation.mutate({ 
      prompt: `Rewrite this professional "About" section to be more engaging and professional for a LinkedIn profile: "${editedBio || bio || ''}"` 
    }, {
      onSuccess: (data) => {
        setEditedBio(data);
        setIsEditing(true);
        toast.success('AI refinement applied');
      }
    });
  };

  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
        <CardTitle className="text-xl font-bold">About</CardTitle>
        {isOwnProfile && (
          <div className="flex items-center gap-2">
             <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary font-bold gap-1.5 h-8 bg-primary/5 hover:bg-primary/10"
                onClick={handleAiImprove}
                disabled={aiMutation.isPending}
             >
               {aiMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
               Improve with AI
             </Button>
             <Button variant="ghost" size="icon" className="rounded-full size-9" onClick={() => setIsEditing(!isEditing)}>
               <Pencil className="size-5" />
             </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              className="w-full bg-background border rounded-lg p-4 text-[14px] leading-relaxed min-h-[160px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              placeholder="What are you passionate about? What are your key achievements?"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="rounded-full font-bold">Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending} className="rounded-full font-bold px-6">
                {updateMutation.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-foreground/90">
            {bio || "Add a summary to tell people about your professional experience and key skills."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
