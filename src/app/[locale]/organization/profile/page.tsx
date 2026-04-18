'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganizationQueries } from '@/hooks/queries/useOrganizationQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Building2, Globe, MapPin, Users, Save, Loader2, Edit2, X } from 'lucide-react';
import { Organization, UpdateOrganizationDto } from '@/types/organization';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';

export default function OrganizationProfilePage() {
  const t = useTranslations('Organization');
  const router = useRouter();
  const { locale } = useParams();
  const { useGetMyOrganizations, useCreateOrganization, useUpdateOrganization, useDeleteOrganization } = useOrganizationQueries();
  const { data: orgs, isLoading } = useGetMyOrganizations();
  const createOrg = useCreateOrganization();
  const updateOrg = useUpdateOrganization();
  const [isEditing, setIsEditing] = useState(false);

  const org = orgs?.[0] ?? null;

  const { register, handleSubmit, reset } = useForm<UpdateOrganizationDto>({
    defaultValues: org ?? {},
  });

  const onSubmit = (data: UpdateOrganizationDto) => {
    if (org) {
      updateOrg.mutate({ id: org.id, data }, { onSuccess: () => setIsEditing(false) });
    } else {
      createOrg.mutate(data as any, {
        onSuccess: () => {
          setIsEditing(false);
          router.push(`/${locale}/organization/dashboard`);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary animate-pulse tracking-[0.4em] text-xs">LOADING_ORG_DATA...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['Organization']}>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <header className="relative py-12 px-8 rounded-[3rem] bg-primary/5 border border-primary/10 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 size-64 bg-primary/10 blur-[100px] rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                <Settings className="size-4" /> Management Console
              </div>
              <h1 className="text-5xl font-black tracking-tighter">
                {org?.name?.toUpperCase() || t('create').toUpperCase()}
              </h1>
              <p className="text-muted-foreground font-medium text-lg">{t('settings')}</p>
            </div>
            <Button
              className="h-12 px-8 rounded-2xl font-black tracking-widest uppercase transition-all hover:scale-105 shadow-xl"
              variant={isEditing ? 'destructive' : 'default'}
              onClick={() => {
                if (!isEditing && org) reset(org);
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? <><X className="mr-2 size-4" /> {t('cancel')}</> : <><Edit2 className="mr-2 size-4" /> {t('edit_profile')}</>}
            </Button>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="rounded-[3rem] border border-border/60 bg-card shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b bg-muted/20">
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <Building2 className="size-6 text-primary" /> {t('identity')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{t('name')} *</label>
                  <Input
                    {...register('name', { required: true })}
                    disabled={!isEditing}
                    placeholder="Acme Corporation"
                    className="h-14 rounded-2xl border-2 text-lg font-bold px-6 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{t('industry')}</label>
                  <Input
                    {...register('industry')}
                    disabled={!isEditing}
                    placeholder="Technology"
                    className="h-14 rounded-2xl border-2 font-bold px-6 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{t('team_size')}</label>
                  <Input
                    {...register('size')}
                    disabled={!isEditing}
                    placeholder="11-50, 51-200..."
                    className="h-14 rounded-2xl border-2 font-bold px-6 focus-visible:ring-primary/20"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[3rem] border border-border/60 bg-card shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b bg-muted/20">
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <Globe className="size-6 text-primary" /> {t('contact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{t('website')}</label>
                  <Input
                    {...register('website')}
                    disabled={!isEditing}
                    placeholder="https://company.com"
                    className="h-14 rounded-2xl border-2 font-bold px-6 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-1">
                    <MapPin className="size-4" /> {t('location')}
                  </label>
                  <Input
                    {...register('location')}
                    disabled={!isEditing}
                    placeholder="Dushanbe, Tajikistan"
                    className="h-14 rounded-2xl border-2 font-bold px-6 focus-visible:ring-primary/20"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[3rem] border border-border/60 bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b bg-muted/20">
              <CardTitle className="text-xl font-black uppercase tracking-tight">{t('mission')}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <textarea
                {...register('description')}
                disabled={!isEditing}
                className="w-full bg-background border-2 border-border/60 p-6 text-lg font-medium focus:outline-none focus:border-primary/40 min-h-[160px] resize-y rounded-[2rem] transition-colors"
                placeholder="Describe your organization's mission and values..."
              />
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-border/50">
              {org && (
                <Button
                  type="button"
                  variant="destructive"
                  className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-none rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8"
                  onClick={() => {
                    if (confirm('DANGER: This will permanently delete your organization. Action cannot be undone. Proceed?')) {
                      useDeleteOrganization().mutate(org.id, {
                        onSuccess: () => router.push(`/${locale}/organizations`)
                      });
                    }
                  }}
                >
                  Terminate Entity
                </Button>
              )}
              <div className="flex gap-4 ml-auto">
                <Button
                  type="submit"
                  size="lg"
                  className="shadow-2xl shadow-primary/30 rounded-2xl font-black px-12 h-14 uppercase tracking-widest text-xs"
                  disabled={createOrg.isPending || updateOrg.isPending}
                >
                  {(createOrg.isPending || updateOrg.isPending) ? (
                    <Loader2 className="animate-spin mr-2 size-5" />
                  ) : (
                    <Save className="mr-2 size-5" />
                  )}
                  {org ? t('save') : t('create')}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </ProtectedRoute>
  );
}
