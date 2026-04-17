'use client';

import { UserProfile } from '@/src/types/profile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, Link as LinkIcon, Pencil, UserPlus, Send, MessageSquare, Briefcase } from 'lucide-react';

interface ProfileHeroProps {
  profile: UserProfile;
  candidate?: any; // UserCandidateProfile
  isOwnProfile: boolean;
  onEdit: () => void;
  onOpenPhotoPicker: () => void;
  onOpenBackgroundPicker: () => void;
}

import { useRef } from 'react';

export default function ProfileHero({ profile, candidate, isOwnProfile, onEdit, onOpenPhotoPicker, onOpenBackgroundPicker }: ProfileHeroProps) {
  // Use a fallback object for missing profile
  const p = profile || {
    firstName: 'New',
    lastName: 'Member',
    headline: 'Incomplete Profile',
    location: '',
    photoUrl: null,
    backgroundPhotoUrl: null
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/20 group overflow-hidden">
        {p.backgroundPhotoUrl ? (
          <img src={p.backgroundPhotoUrl} className="size-full object-cover" alt="Cover" />
        ) : (
          <div className="size-full bg-gradient-to-r from-primary/30 via-accent/20 to-primary/20" />
        )}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full bg-background/80 hover:bg-background shadow-lg backdrop-blur-sm border-0 font-bold"
              onClick={onOpenBackgroundPicker}
            >
              <Camera className="size-4 mr-2" /> Change Cover
            </Button>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 pt-0 relative">
        {/* Avatar */}
        <div className="absolute -top-16 sm:-top-24 left-6">
          <div className="relative group/avatar">
            <div className="size-32 sm:size-40 rounded-full bg-background border-[4px] border-background overflow-hidden shadow-xl ring-1 ring-black/5">
              {p.photoUrl ? (
                <img src={p.photoUrl} alt={p.firstName || 'User'} className="size-full object-cover" />
              ) : (
                <div className="size-full bg-muted flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-bold text-muted-foreground/40 uppercase">
                    {p.firstName?.[0] || 'U'}
                  </span>
                </div>
              )}
            </div>

            {isOwnProfile && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
                onClick={onOpenPhotoPicker}
              >
                <Camera className="size-8 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 gap-2">
          {isOwnProfile ? (
            <>
              <Button onClick={onEdit} variant="outline" className="rounded-full font-bold px-6 border-primary text-primary hover:bg-primary/5">
                <Pencil className="size-4 mr-2" /> {profile ? 'Edit profile' : 'Create profile'}
              </Button>
            </>
          ) : (
            <>
              <Button className="rounded-full font-bold px-6">
                <UserPlus className="size-4 mr-2" /> Connect
              </Button>
              <Button variant="outline" className="rounded-full font-bold px-6 border-primary text-primary">
                <MessageSquare className="size-4 mr-2" /> Message
              </Button>
            </>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 sm:mt-12 space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {p.firstName} {p.lastName}
            </h1>
          </div>
          <p className="text-lg text-foreground/90 font-medium">
            {p.headline || 'Member of AI-JOB Network'}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm text-muted-foreground">
            {p.location && (
              <div className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {p.location}
              </div>
            )}
            {(candidate?.experienceYears !== undefined || p.experienceYears !== undefined) && (
              <div className="flex items-center gap-1">
                <Briefcase className="size-3.5" />
                {candidate?.experienceYears ?? p.experienceYears} years experience
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
