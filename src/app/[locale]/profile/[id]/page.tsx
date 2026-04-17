'use client';

import { useProfileQueries } from '@/src/hooks/queries/useProfileQueries';
import { useMessageQueries } from '@/src/hooks/queries/useMessageQueries';
import { useConnectionQueries } from '@/src/hooks/queries/useConnectionQueries';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin, Briefcase, Info, MessageSquare,
  ChevronLeft, Globe, UserPlus, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { PageTransition } from '@/src/components/PageTransition';

export default function UserProfilePage() {
  const { id, locale } = useParams();
  const router = useRouter();
  const t = useTranslations('Profile');
  const tm = useTranslations('Messages');

  const { useGetProfileByUserId } = useProfileQueries();
  const { useCreateConversation } = useMessageQueries();
  const { useSendRequest, useGetMyConnections } = useConnectionQueries();

  const userId = Number(id);
  const { data: profile, isLoading, error } = useGetProfileByUserId(userId);
  const { data: myConnections } = useGetMyConnections();

  const createConversation = useCreateConversation();
  const sendRequest = useSendRequest();

  // Check if already connected
  const isConnected = myConnections?.some(c =>
    (c.requesterId === userId || c.addresseeId === userId) && c.status === 'Accepted'
  );

  const handleMessage = async () => {
    try {
      const result = await createConversation.mutateAsync({ otherUserId: userId });
      // 1. Fix "New Conversation" State Flow
      if (result && result.id !== undefined && result.id !== null) {
        toast.success(tm('initiating'));
        router.push(`/${locale}/messages?id=${result.id}`);
      }
    } catch (err) {
      toast.error('Failed to start conversation');
    }
  };

  const handleConnect = async () => {
    try {
      await sendRequest.mutateAsync(userId);
      toast.success('Connection request sent');
    } catch (err) {
      toast.error('Failed to send connection request');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="flex gap-6">
          <Skeleton className="size-32 rounded-full -mt-16 border-4 border-background ml-8" />
          <div className="flex-1 space-y-2 pt-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
          <Info className="size-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Profile not found</h2>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <PageTransition className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2 hover:bg-muted"
      >
        <ChevronLeft className="size-4" />
        {t('back')}
      </Button>

      <Card className="overflow-hidden border-border/40 shadow-xl bg-card/50 backdrop-blur-sm">
        {/* Banner */}
        <div className="h-48 md:h-64 relative bg-muted">
          {profile.backgroundPhotoUrl ? (
            <img
              src={profile.backgroundPhotoUrl}
              alt="Banner"
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
          )}
        </div>

        <CardContent className="relative px-6 md:px-12 pb-12">
          {/* Avatar & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 -mt-16 md:-mt-20 mb-8">
            <div className="relative">
              <div className="size-32 md:size-40 rounded-full border-4 border-background bg-muted overflow-hidden shadow-2xl">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.firstName || 'User'}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center text-muted-foreground bg-muted">
                    <Globe className="size-16 opacity-20" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Button
                onClick={handleConnect}
                disabled={sendRequest.isPending || isConnected}
                variant={isConnected ? "outline" : "default"}
                className={cn(
                  "flex-1 md:flex-none gap-2 rounded-xl h-11 px-6 font-bold transition-all",
                  !isConnected && "shadow-lg shadow-primary/10"
                )}
              >
                {isConnected ? <Check className="size-4" /> : <UserPlus className="size-4" />}
                {isConnected ? 'Connected' : 'Connect'}
              </Button>

              <Button
                onClick={handleMessage}
                disabled={createConversation.isPending}
                variant="outline"
                className="flex-1 md:flex-none gap-2 rounded-xl h-11 px-8 font-bold hover:bg-muted"
              >
                <MessageSquare className="size-4" />
                {tm('message')}
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                {profile.firstName} {profile.lastName}
              </h1>
              {profile.headline && (
                <p className="text-lg md:text-xl text-muted-foreground font-medium mt-1">
                  {profile.headline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                  <MapPin className="size-4 text-primary" />
                  {profile.location}
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                <Briefcase className="size-4 text-primary" />
                {profile.experienceYears} {t('years_exp')}
              </div>
            </div>

            <div className="pt-6 border-t border-border/40">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
                {t('about')}
              </h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {profile.aboutMe || t('no_about')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
