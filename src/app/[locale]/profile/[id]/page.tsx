'use client';

import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { useMessageQueries } from '@/hooks/queries/useMessageQueries';
import { useConnectionQueries } from '@/hooks/queries/useConnectionQueries';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin, Briefcase, Info, MessageSquare,
  ChevronLeft, Globe, UserPlus, Check, Sparkles, Terminal, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { PageTransition } from '@/components/PageTransition';
import ProfileRecommendations from '@/components/profile/ProfileRecommendations';
import RecommendationModal from '@/components/profile/RecommendationModal';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function UserProfilePage() {
  const { id, locale } = useParams();
  const router = useRouter();
  const t = useTranslations('Profile');
  const tm = useTranslations('Messages');

  const { useGetProfileByUserId, useGetRecommendations, useAddRecommendation, useDeleteRecommendation } = useProfileQueries();
  const { useCreateConversation } = useMessageQueries();
  const { useSendRequest, useGetMyConnections } = useConnectionQueries();

  const userId = Number(id);
  const { data: profile, isLoading, error } = useGetProfileByUserId(userId);
  const { data: myConnections } = useGetMyConnections();
  const { data: recommendations } = useGetRecommendations(userId);
 
  const createConversation = useCreateConversation();
  const sendRequest = useSendRequest();
  const addRecMutation = useAddRecommendation();
  const deleteRecMutation = useDeleteRecommendation(userId);

  const [isRecModalOpen, setIsRecModalOpen] = useState(false);

  const isConnected = myConnections?.some(c =>
    (c.requesterId === userId || c.addresseeId === userId) && c.status === 'Accepted'
  );

  const handleMessage = async () => {
    try {
      const result = await createConversation.mutateAsync({ otherUserId: userId });
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
      <div className="max-w-6xl mx-auto p-8 space-y-12 pb-32">
        <Skeleton className="h-64 w-full rounded-[3rem] bg-white/5" />
        <div className="flex flex-col md:flex-row gap-12 items-end -mt-24 px-12">
          <Skeleton className="size-48 rounded-[3rem] border-8 border-background bg-white/5 shadow-2xl" />
          <div className="flex-1 space-y-4 pb-4">
            <Skeleton className="h-12 w-64 bg-white/5 rounded-2xl" />
            <Skeleton className="h-6 w-96 bg-white/5 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-8">
           <div className="md:col-span-8 space-y-8">
              <Skeleton className="h-96 w-full rounded-[2.5rem] bg-white/5" />
           </div>
           <div className="md:col-span-4 space-y-8">
              <Skeleton className="h-64 w-full rounded-[2.5rem] bg-white/5" />
           </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <div className="size-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
          <Info className="size-12 text-white/20" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading font-black uppercase tracking-tighter text-white">Target Operative Not Found</h2>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">The requested identity fragment is corrupted or missing.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="rounded-2xl border-white/10 text-white/60 hover:bg-white/5 h-12 px-8">ABORT & RETURN</Button>
      </div>
    );
  }

  return (
    <PageTransition className={cn("max-w-6xl mx-auto p-4 md:p-8 pb-32", spaceGrotesk.className)}>
      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="mb-12">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-3 hover:bg-white/5 text-white/40 hover:text-white rounded-2xl px-6 h-12 border border-transparent hover:border-white/5 transition-all"
        >
          <ChevronLeft className="size-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('back')}</span>
        </Button>
      </motion.div>

      <div className="space-y-12">
        {/* Profile Identity Card */}
        <Card className="glass-card bg-white/[0.03] backdrop-blur-3xl border-white/10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-b-primary/20">
          <div className="h-64 md:h-80 relative overflow-hidden group/banner">
            {profile.backgroundPhotoUrl ? (
              <img
                src={profile.backgroundPhotoUrl}
                alt="Banner"
                className="size-full object-cover transition-transform duration-1000 group-hover/banner:scale-110"
              />
            ) : (
              <div className="size-full bg-gradient-to-br from-primary/30 via-black/40 to-black/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Status Beacon */}
            <div className="absolute top-6 right-8 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
              <div className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <div className="size-2 rounded-full bg-emerald-500 absolute left-4" />
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white">LINK_ACTIVE</span>
            </div>
          </div>

          <CardContent className="relative px-8 md:px-16 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 -mt-24 md:-mt-32 mb-12">
              <motion.div 
                whileHover={{ scale: 1.02, rotate: -2 }}
                className="relative z-10"
              >
                <div className="size-44 md:size-56 rounded-[3.5rem] border-8 border-background bg-black/40 overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.6)] border-white/5 relative group/avatar">
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={profile.firstName || 'User'}
                      className="size-full object-cover transition-all duration-700 group-hover/avatar:scale-110"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-white/10">
                      <Globe className="size-24 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </motion.div>

              <div className="flex flex-wrap gap-4 w-full md:w-auto z-10">
                <Button
                  onClick={handleConnect}
                  disabled={sendRequest.isPending || isConnected}
                  variant={isConnected ? "outline" : "default"}
                  className={cn(
                    "flex-1 md:flex-none h-14 px-10 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] transition-all",
                    isConnected 
                      ? "bg-white/5 border-white/10 text-white/40" 
                      : "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95"
                  )}
                >
                  {isConnected ? <Check className="size-4 mr-3" /> : <UserPlus className="size-4 mr-3" />}
                  {isConnected ? 'Signal Established' : 'Initialize Link'}
                </Button>

                <Button
                  onClick={handleMessage}
                  disabled={createConversation.isPending}
                  variant="outline"
                  className="flex-1 md:flex-none h-14 px-10 rounded-2xl glass-card bg-white/5 border-white/10 text-white font-black uppercase tracking-[0.15em] text-[11px] hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageSquare className="size-4 mr-3 text-primary" />
                  Direct Comms
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <Sparkles className="size-8 text-primary opacity-40" />
                  </div>
                  {profile.headline && (
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl inline-block">
                      <p className="text-lg text-primary font-bold tracking-tight">
                        {profile.headline}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-6">
                  {profile.location && (
                    <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 shadow-inner">
                      <MapPin className="size-4 text-primary" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-white/60">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 shadow-inner">
                    <Activity className="size-4 text-emerald-500" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-white/60">{(profile as any).experienceYears} Sols Active</span>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5 space-y-6">
                  <div className="flex items-center gap-3 opacity-30">
                    <Terminal className="size-4 text-primary" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Operative_Intel</h3>
                  </div>
                  <p className="text-[16px] leading-relaxed text-white/60 font-medium tracking-tight whitespace-pre-wrap max-w-3xl">
                    {(profile as any).aboutMe || profile.about || "Data fragments empty for this operative. No Dossier available."}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                {/* Side Stats/Info */}
                <Card className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 border-b border-white/5 pb-4">Verification_Data</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[10px] font-bold text-white/40 group-hover:text-primary transition-colors">ENDORSEMENTS</span>
                      <span className="text-sm font-black text-white">--</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[10px] font-bold text-white/40 group-hover:text-primary transition-colors">PROJECTS</span>
                      <span className="text-sm font-black text-white">--</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="text-[10px] font-bold text-white/40 group-hover:text-primary transition-colors">CORE_SYNC</span>
                      <span className="text-sm font-black text-emerald-500">98% Match</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Section */}
        <AnimatePresence>
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ProfileRecommendations 
              recommendations={recommendations || []}
              isOwnProfile={false}
              onAdd={() => setIsRecModalOpen(true)}
              onDelete={(recId) => deleteRecMutation.mutate(recId)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <RecommendationModal 
        isOpen={isRecModalOpen}
        onClose={() => setIsRecModalOpen(false)}
        recipientName={profile.firstName + ' ' + (profile.lastName || '')}
        isPending={addRecMutation.isPending}
        onSave={(data) => {
          addRecMutation.mutate({ ...data, recipientId: userId }, {
            onSuccess: () => setIsRecModalOpen(false)
          });
        }}
      />
    </PageTransition>
  );
}
