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
  const { useGetMyOrganizations, useCreateOrganization, useUpdateOrganization } = useOrganizationQueries();
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
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-primary/20 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">
              {org?.name || t('create')}
            </h1>
            <p className="text-sm text-muted-foreground">{t('settings')}</p>
          </div>
          <Button
            variant={isEditing ? 'destructive' : 'outline'}
            onClick={() => {
              if (!isEditing && org) reset(org);
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? <><X className="mr-2 size-4" /> {t('cancel')}</> : <><Edit2 className="mr-2 size-4" /> {t('edit_profile')}</>}
          </Button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="size-5" /> {t('identity')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('name')} *</label>
                  <Input
                    {...register('name', { required: true })}
                    disabled={!isEditing}
                    placeholder="Acme Corporation"
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('industry')}</label>
                  <Input
                    {...register('industry')}
                    disabled={!isEditing}
                    placeholder="Technology"
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('team_size')}</label>
                  <Input
                    {...register('size')}
                    disabled={!isEditing}
                    placeholder="11-50, 51-200..."
                    className="text-base"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="size-5" /> {t('contact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('website')}</label>
                  <Input
                    {...register('website')}
                    disabled={!isEditing}
                    placeholder="https://company.com"
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-4" /> {t('location')}
                  </label>
                  <Input
                    {...register('location')}
                    disabled={!isEditing}
                    placeholder="Dushanbe, Tajikistan"
                    className="text-base"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('mission')}</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                {...register('description')}
                disabled={!isEditing}
                className="w-full bg-background border border-primary/20 p-4 text-base focus:outline-none focus:border-primary min-h-[120px] resize-y rounded-md"
                placeholder="Describe your organization's mission and values..."
              />
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="shadow-sm"
                disabled={createOrg.isPending || updateOrg.isPending}
              >
                {(createOrg.isPending || updateOrg.isPending) ? (
                  <Loader2 className="animate-spin mr-2 size-4" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {org ? t('save') : t('create')}
              </Button>
            </div>
          )}
        </form>
      </div>
    </ProtectedRoute>
  );
}
