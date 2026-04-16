'use client';

import { UserProfile } from '@/src/types/profile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, Link as LinkIcon, Pencil, UserPlus, Send, MessageSquare } from 'lucide-react';

interface ProfileHeroProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  onEdit: () => void;
}

export default function ProfileHero({ profile, isOwnProfile, onEdit }: ProfileHeroProps) {
  return (
    <Card className="overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/20 group">
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOwnProfile && (
           <Button variant="secondary" size="icon" className="absolute top-4 right-4 rounded-full size-10 shadow-lg">
             <Camera className="size-5" />
           </Button>
        )}
      </div>

      <div className="px-6 pb-6 pt-0 relative">
        {/* Avatar */}
        <div className="absolute -top-16 sm:-top-24 left-6">
          <div className="size-32 sm:size-40 rounded-full bg-background border-[4px] border-background overflow-hidden shadow-xl ring-1 ring-black/5">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.firstName || 'User'} className="size-full object-cover" />
            ) : (
              <div className="size-full bg-muted flex items-center justify-center">
                <span className="text-4xl sm:text-5xl font-bold text-muted-foreground/40 uppercase">
                  {profile.firstName?.[0] || 'U'}
                </span>
              </div>
            )}
            {isOwnProfile && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
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
                <Pencil className="size-4 mr-2" /> Edit profile
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
              {profile.firstName} {profile.lastName}
            </h1>
            <span className="text-muted-foreground font-normal text-lg">(He/Him)</span>
          </div>
          <p className="text-lg text-foreground/90 font-medium">
            {profile.title || 'Professional at AI-JOB Network'}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5">
               <MapPin className="size-4" />
               <span>Dushanbe, Tajikistan</span>
             </div>
             <div className="flex items-center gap-1.5 font-bold text-primary hover:underline cursor-pointer">
               <span>500+ connections</span>
             </div>
             <div className="flex items-center gap-1.5 font-bold text-primary hover:underline cursor-pointer">
               <LinkIcon className="size-3.5" />
               <span>Contact info</span>
             </div>
          </div>
        </div>

        {/* Unified Banner */}
        <div className="mt-6 flex flex-wrap gap-2">
           <div className="bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-bold border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">
             Open to work
           </div>
           <div className="bg-muted text-foreground px-3 py-1 rounded-md text-xs font-bold border border-border/60 cursor-pointer hover:bg-muted/80 transition-colors flex items-center gap-2">
             Share that you're hiring
             <div className="size-4 rounded-full bg-primary/20 flex items-center justify-center"><Pencil className="size-2 text-primary" /></div>
           </div>
        </div>
      </div>
    </Card>
  );
}
