'use client';

import { useAuthStore } from '@/src/store/authStore';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/src/hooks/useProfile';
import { UserProfile } from '@/src/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { User, Mail, Briefcase, GraduationCap, Code, Globe, Save, Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { ProfileSkill, ProfileLanguage } from '@/src/types/skill';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const { user: authUser } = useAuthStore();
  const {
    useGetProfile,
    useUpdateProfile,
    useGetProfileSkills,
    useAddProfileSkill,
    useDeleteProfileSkill,
    useGetProfileLanguages,
    useAddProfileLanguage,
    useDeleteProfileLanguage,
  } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newLangLevel, setNewLangLevel] = useState('Intermediate');

  const { data: profile, isLoading } = useGetProfile();
  const { data: profileSkills } = useGetProfileSkills();
  const { data: profileLanguages } = useGetProfileLanguages();
  const updateMutation = useUpdateProfile();
  const addSkill = useAddProfileSkill();
  const deleteSkill = useDeleteProfileSkill();
  const addLang = useAddProfileLanguage();
  const deleteLang = useDeleteProfileLanguage();

  const { register, handleSubmit, reset } = useForm<Partial<UserProfile>>();

  const onSubmit = (data: Partial<UserProfile>) => {
    updateMutation.mutate(data, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    addSkill.mutate({ skillName: newSkill.trim() }, { onSuccess: () => setNewSkill('') });
  };

  const handleAddLanguage = () => {
    if (!newLang.trim()) return;
    addLang.mutate(
      { languageName: newLang.trim(), proficiencyLevel: newLangLevel },
      { onSuccess: () => setNewLang('') }
    );
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
            <h1 className="text-3xl font-bold">
              {t('title_prefix')}: {profile?.firstName || ''} {profile?.lastName || ''}
            </h1>
            <p className="text-sm text-muted-foreground">{t('status_verified')}</p>
          </div>
          <Button
            variant={isEditing ? 'destructive' : 'outline'}
            onClick={() => {
              if (!isEditing) reset(profile!);
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? t('cancel_override') : t('manual_override')}
          </Button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <User className="mr-2 size-5" /> {t('core_metrics')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t('first_name')}</label>
                    <Input {...register('firstName')} disabled={!isEditing} className="text-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t('last_name')}</label>
                    <Input {...register('lastName')} disabled={!isEditing} className="text-base" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('professional_title')}</label>
                  <Input {...register('title')} disabled={!isEditing} className="text-base" placeholder="Senior Architect" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('biography')}</label>
                  <textarea
                    {...register('bio')}
                    disabled={!isEditing}
                    className="w-full bg-background border border-primary/20 p-4 text-base focus:outline-none focus:border-primary min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Mail className="mr-2 size-5" /> {t('comms_link')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base font-medium text-primary">{profile?.email}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end sticky bottom-8">
              <Button
                type="submit"
                size="lg"
                className="shadow-sm"
              >
                {updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 size-4" />}
                {t('execute_sync')}
              </Button>
            </div>
          )}
        </form>

        {/* Skills Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="border-b border-primary/10 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Code className="mr-2 size-5" /> {t('skill_stack')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {profileSkills?.map((skill: ProfileSkill) => (
                <span
                  key={skill.id}
                  className="flex items-center gap-1 px-3 py-1.5 border border-primary/40 bg-primary/5 text-primary text-sm font-medium rounded-md group"
                >
                  {skill.skillName}
                  {skill.endorsementCount ? (
                    <sup className="text-[8px] text-primary/70">+{skill.endorsementCount}</sup>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => deleteSkill.mutate(skill.id)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    disabled={deleteSkill.isPending}
                  >
                    <X className="size-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder={t('add_skill')}
                className="text-base"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-none"
                onClick={handleAddSkill}
                disabled={addSkill.isPending || !newSkill.trim()}
              >
                {addSkill.isPending ? <Loader2 className="size-3 animate-spin" /> : <Plus className="size-3" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Languages Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="border-b border-primary/10 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Globe className="mr-2 size-5" /> {t('language_protocols')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              {profileLanguages?.map((lang: ProfileLanguage) => (
                <div
                  key={lang.id}
                  className="flex items-center justify-between px-3 py-2 border border-primary/20 group"
                >
                  <div className="flex-1">
                    <span className="text-sm font-semibold">{lang.languageName}</span>
                    {lang.proficiencyLevel && (
                      <span className="ml-3 text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full">{lang.proficiencyLevel}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteLang.mutate(lang.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    disabled={deleteLang.isPending}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newLang}
                onChange={(e) => setNewLang(e.target.value)}
                placeholder={t('language_name')}
                className="text-base flex-1"
              />
              <select
                value={newLangLevel}
                onChange={(e) => setNewLangLevel(e.target.value)}
                className="bg-background border border-primary/20 px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                {['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Native'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-none"
                onClick={handleAddLanguage}
                disabled={addLang.isPending || !newLang.trim()}
              >
                {addLang.isPending ? <Loader2 className="size-3 animate-spin" /> : <Plus className="size-3" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Experience & Education sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="border-b border-primary/10 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center"><Briefcase className="mr-2 size-5" /> {t('employment_history')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {profile?.experiences && profile.experiences.length > 0 ? (
                profile.experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-primary/50 pl-4 space-y-1 relative h-full">
                    <h3 className="text-base font-semibold text-primary">{exp.title}</h3>
                    <p className="text-sm font-medium">{exp.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(exp.startDate).toLocaleDateString()} -{' '}
                      {exp.isCurrent ? t('present') : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''}
                    </p>
                    {exp.description && (
                      <p className="text-sm pt-2 text-muted-foreground whitespace-pre-wrap">{exp.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t('no_records')}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="border-b border-primary/10 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center"><GraduationCap className="mr-2 size-5" /> {t('academic_records')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {profile?.educations && profile.educations.length > 0 ? (
                profile.educations.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-primary/50 pl-4 space-y-1 relative h-full">
                    <h3 className="text-base font-semibold text-primary">{edu.degree}</h3>
                    <p className="text-sm font-medium">{edu.school} — {edu.fieldOfStudy}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(edu.startDate).toLocaleDateString()} -{' '}
                      {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : t('present')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t('no_records')}</p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </ProtectedRoute>
  );
}
