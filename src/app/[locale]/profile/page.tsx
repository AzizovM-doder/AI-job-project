'use client';

import { useAuth } from '@/src/context/AuthContext';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, UserProfile } from '@/src/services/profile.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { User, Mail, Briefcase, GraduationCap, Code, Save, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });

  const { register, handleSubmit, reset } = useForm<Partial<UserProfile>>();

  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) => profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
    },
  });

  const onSubmit = (data: Partial<UserProfile>) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary animate-pulse tracking-[0.4em] text-xs">SYNCHRONIZING_IDENTITY...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black terminal-glow uppercase">USER_IDENTITY: {profile?.firstName?.toUpperCase() || 'UNKNOWN'}</h1>
            <p className="text-xs text-muted-foreground tracking-widest">ENCRYPTED PROFILE ACCESS | STATUS: VERIFIED</p>
          </div>
          <Button 
            variant={isEditing ? 'destructive' : 'outline'} 
            onClick={() => {
              if (!isEditing) reset(profile!);
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? 'CANCEL_OVERRIDE' : 'MANUAL_OVERRIDE'}
          </Button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Info */}
            <Card className="md:col-span-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <User className="mr-2 size-4" /> CORE_METRICS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground">FIRST_NAME</label>
                    <Input {...register('firstName')} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground">LAST_NAME</label>
                    <Input {...register('lastName')} disabled={!isEditing} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground">PROFESSIONAL_TITLE</label>
                  <Input {...register('title')} disabled={!isEditing} placeholder="SENIOR SYSTEMS ARCHITECT" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground">BIOGRAPHY_LOG</label>
                  <textarea
                    {...register('bio')}
                    disabled={!isEditing}
                    className="w-full bg-background border border-primary/20 p-4 text-xs font-mono focus:outline-none focus:border-primary min-h-[100px] uppercase"
                    placeholder="DESCRIBE SYSTEM CAPABILITIES..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Side Info */}
            <div className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Mail className="mr-2 size-4" /> COMMS_LINK
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs font-bold text-primary">{profile?.email.toUpperCase()}</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Code className="mr-2 size-4" /> SKILL_STACK
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 text-[10px]">
                  {profile?.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 border border-primary text-primary">
                      {skill.toUpperCase()}
                    </span>
                  ))}
                  {isEditing && <Button variant="ghost" size="sm" className="h-6 text-[8px]">ADD_SKILL</Button>}
                </CardContent>
              </Card>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end sticky bottom-8">
              <Button type="submit" size="lg" className="terminal-glow shadow-[0_0_20px_rgba(0,255,0,0.3)]">
                {updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 size-4" />}
                EXECUTE_SYNC_COMMAND
              </Button>
            </div>
          )}
        </form>

        {/* Experience & Education sections could go here as sub-cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center"><Briefcase className="mr-2 size-4" /> EMPLOYMENT_HISTORY</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[10px] text-muted-foreground uppercase">NO_RECORDS_FOUND_IN_LOCAL_CACHE</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center"><GraduationCap className="mr-2 size-4" /> ACADEMIC_RECORDS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[10px] text-muted-foreground uppercase">NO_RECORDS_FOUND_IN_LOCAL_CACHE</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </ProtectedRoute>
  );
}
