'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import { PageTransition } from '@/src/components/PageTransition';
import { useProfileQueries } from '@/src/hooks/queries/useProfileQueries';
import { useAuthStore } from '@/src/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileHero from '@/src/components/profile/ProfileHero';
import ProfileAbout from '@/src/components/profile/ProfileAbout';
import ProfileExperience from '@/src/components/profile/ProfileExperience';
import ProfileEducation from '@/src/components/profile/ProfileEducation';
import ProfileSkills from '@/src/components/profile/ProfileSkills';
import ProfileLanguages from '@/src/components/profile/ProfileLanguages';
import { Button } from '@/components/ui/button';
import { Sparkles, Settings, ExternalLink, Pencil } from 'lucide-react';

export default function ProfilePage() {
  const { user: authUser } = useAuthStore();
  
  const { 
    useGetProfile, 
    useGetProfileSkills, 
    useGetProfileLanguages,
    useDeleteProfileSkill,
    useDeleteProfileLanguage,
    useAddEndorsement
  } = useProfileQueries();

  const { data: profile, isLoading } = useGetProfile(authUser?.userId ? Number(authUser.userId) : 0);
  const { data: skills } = useGetProfileSkills(profile?.id || 0);
  const { data: languages } = useGetProfileLanguages(profile?.id || 0);
  
  const deleteSkill = useDeleteProfileSkill();
  const deleteLang = useDeleteProfileLanguage();
  const endorseSkill = useAddEndorsement();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <PageTransition className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Header/Hero Section */}
        <ProfileHero profile={profile} isOwnProfile={true} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <ProfileAbout about={profile?.bio} />
            <ProfileExperience profileId={profile?.id} />
            <ProfileEducation profileId={profile?.id} />
            <ProfileSkills 
              skills={skills} 
              onDelete={(id) => deleteSkill.mutate(id)}
              onEndorse={(skillId) => endorseSkill.mutate({ skillId, profileId: profile?.id || 0 })}
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="shadow-sm border-border/60">
              <CardHeader className="p-5 border-b border-border/60 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold">Profile Language</CardTitle>
                <Pencil className="size-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-[14px] font-medium">English</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/60">
              <CardHeader className="p-5 border-b border-border/60 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold">Public Profile & URL</CardTitle>
                <Pencil className="size-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-[14px] text-muted-foreground truncate font-sans">
                  www.ai-job.tj/in/{profile?.fullName?.toLowerCase().replace(' ', '-') || 'user'}
                </p>
              </CardContent>
            </Card>

            <ProfileLanguages 
              languages={languages} 
              onDelete={(id) => deleteLang.mutate(id)}
            />

            <Card className="shadow-sm border-border/60 bg-primary/5 border-primary/20">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="size-5" />
                  <h3 className="font-bold text-sm text-foreground">AI Optimization</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your profile is missing 3 key skills for "Senior Frontend Engineer" roles in Dushanbe.
                </p>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 rounded-full h-8 font-bold text-[11px]">
                  Boost Match Score
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
}
