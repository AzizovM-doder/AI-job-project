'use client';

import { useState, useMemo } from 'react';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { PageTransition } from '@/src/components/PageTransition';
import { useConnectionQueries } from '@/src/hooks/queries/useConnectionQueries';
import { useUserQueries } from '@/src/hooks/queries/useUserQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManageNetworkSidebar from '@/src/components/networking/ManageNetworkSidebar';
import InvitationCard from '@/src/components/networking/InvitationCard';
import { UserPlus, User, Building2, MoreHorizontal, X, Users, Globe, Mail, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import { useAuthStore } from '@/src/store/authStore';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TabType = 'suggestions' | 'invitations' | 'connections';

export default function NetworkingPage() {
  const t = useTranslations('Networking');
  const [activeTab, setActiveTab] = useState<TabType>('suggestions');
  const { user: authUser } = useAuthStore();
  const currentUserId = authUser ? Number(authUser.userId) : null;

  const { useGetPendingConnections, useGetMyConnections, useSendRequest } = useConnectionQueries();
  const { useGetDirectory, useGetPublicProfiles, useGetPublicProfile } = useUserQueries();

  const { data: invitations, isLoading: loadingInvs } = useGetPendingConnections();
  const { data: allConnections, isLoading: loadingConnections } = useGetMyConnections();
  const { data: directory, isLoading: loadingDir } = useGetDirectory();
  const sendRequestMutation = useSendRequest();

  const {
    acceptedConnections,
    suggestionUsers,
    allRelevantUserIds
  } = useMemo(() => {
    if (!directory || !allConnections || !currentUserId) {
      return { acceptedConnections: [], suggestionUsers: [], allRelevantUserIds: [] };
    }

    const accepted = allConnections.filter(c => c.status === 'Accepted');

    // Create a set of "already in process" user IDs to filter suggestions
    const busyUserIds = new Set([
      ...allConnections.map(c => c.addresseeId),
      ...allConnections.map(c => c.requesterId)
    ]);

    const suggestions = directory.filter(u => {
      const uId = u.userId ?? u.id;
      // Convert to number for comparison
      const numericId = Number(uId);
      return numericId && numericId !== currentUserId && !busyUserIds.has(numericId);
    });

    // Collect ALL IDs we need profiles for
    const invitationIds = invitations?.map(i => i.requesterId) || [];
    const connectionBuddyIds = accepted.map(c => Number(c.requesterId) === currentUserId ? Number(c.addresseeId) : Number(c.requesterId));

    const uniqueIds = Array.from(new Set([...invitationIds, ...connectionBuddyIds]));

    return {
      acceptedConnections: accepted,
      suggestionUsers: suggestions,
      allRelevantUserIds: uniqueIds
    };
  }, [directory, allConnections, invitations, currentUserId]);

  const { data: enrichedProfiles } = useGetPublicProfiles(allRelevantUserIds);

  // Create a map for easy lookup
  const profileMap = useMemo(() => {
    const map = new Map();
    if (enrichedProfiles) {
      enrichedProfiles.forEach(p => {
        const id = Number(p.userId ?? p.id);
        if (id) map.set(id, p);
      });
    }
    return map;
  }, [enrichedProfiles]);

  const handleConnect = (userId: number) => {
    sendRequestMutation.mutate(userId, {
      onSuccess: () => {
        toast.success(t('request_sent'));
      },
      onError: () => {
        toast.error(t('request_failed'));
      }
    });
  };

  const tabs: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: 'suggestions', label: t('tabs.suggestions'), icon: Globe },
    { id: 'invitations', label: t('tabs.invitations'), icon: Mail, count: invitations?.length },
    { id: 'connections', label: t('tabs.connections'), icon: UserCheck, count: acceptedConnections.length },
  ];

  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-12">

          {/* Left Sidebar */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-4 sticky top-[72px]">
            <ManageNetworkSidebar
              connectionsCount={acceptedConnections.length}
              pendingCount={invitations?.length}
            />
          </aside>

          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">

            {/* Tabs Header */}
            <div className="flex items-center gap-1 p-1 bg-muted/30 border border-border/40 rounded-2xl w-fit backdrop-blur-md">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative",
                    activeTab === tab.id
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                  )}
                >
                  <tab.icon className="size-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={cn(
                      "ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-primary/10 text-primary",
                      activeTab === tab.id ? "bg-primary text-primary-foreground" : ""
                    )}>
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full hidden md:block" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="min-h-[400px]">
              {/* SUGGESTIONS TAB */}
              {activeTab === 'suggestions' && (
                <div className="space-y-6">
                  <Card className="shadow-sm border-border/60 overflow-hidden bg-card/30">
                    <CardHeader className="p-6 border-b border-border/40">
                      <CardTitle className="text-xl font-black tracking-tight">{t('suggestions_title')}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{t('suggestions_desc')}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      {loadingDir || loadingConnections ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <Card key={i} className="overflow-hidden border-border/60 p-4 space-y-4 flex flex-col items-center bg-background/40">
                              <Skeleton className="size-20 rounded-full" />
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-full rounded-full" />
                            </Card>
                          ))}
                        </div>
                      ) : suggestionUsers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {suggestionUsers.map((person) => (
                            <Card key={person.userId} className="overflow-hidden border-border/60 shadow-sm flex flex-col items-center text-center relative hover:shadow-xl hover:border-primary/20 transition-all group bg-background/60 backdrop-blur-sm">
                              <div className="h-16 w-full bg-gradient-to-r from-primary/10 to-accent/10" />
                              <CardContent className="p-4 pt-0 -mt-10 flex flex-col items-center flex-1 w-full">
                                <div className="size-20 rounded-full border-2 border-background bg-muted overflow-hidden shrink-0 shadow-lg">
                                  {person.avatarUrl ? (
                                    <img src={person.avatarUrl} alt="User" className="size-full object-cover" />
                                  ) : (
                                    <div className="size-full flex items-center justify-center font-bold text-2xl text-muted-foreground/40 bg-muted uppercase">
                                      {person.fullName?.[0] || 'U'}
                                    </div>
                                  )}
                                </div>
                                <p className="text-[14px] font-bold line-clamp-1 hover:text-primary transition-colors cursor-pointer">{person.fullName}</p>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1 min-h-[16px]">{person.title || ''}</p>

                                <div className="mt-auto w-full pt-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleConnect(person.userId)}
                                    disabled={sendRequestMutation.isPending}
                                    className="w-full rounded-xl border-primary/20 text-primary font-bold hover:bg-primary hover:text-primary-foreground h-9 shadow-sm"
                                  >
                                    {sendRequestMutation.isPending && sendRequestMutation.variables === person.userId ? (
                                      <span className="flex items-center gap-1"><span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> ...</span>
                                    ) : (
                                      <><UserPlus className="size-4 mr-1.5" /> {t('connect_btn')}</>
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                          <Users className="size-16 mb-4" />
                          <p className="font-bold">{t('no_suggestions')}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* INVITATIONS TAB */}
              {activeTab === 'invitations' && (
                <Card className="shadow-sm border-border/60">
                  <CardHeader className="p-6 border-b border-border/40">
                    <CardTitle className="text-xl font-black tracking-tight">{t('invitations_title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingInvs ? (
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-20 w-full rounded-xl" />
                        <Skeleton className="h-20 w-full rounded-xl" />
                      </div>
                    ) : invitations && invitations.length > 0 ? (
                      <div className="divide-y divide-border/10">
                        {invitations.map((inv) => (
                          <InvitationCard
                            key={inv.id}
                            invitation={inv}
                            profile={profileMap.get(inv.requesterId)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                        <Mail className="size-16 mb-4" />
                        <p className="font-bold">{t('no_invitations')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* CONNECTIONS TAB */}
              {activeTab === 'connections' && (
                <Card className="shadow-sm border-border/60">
                  <CardHeader className="p-6 border-b border-border/40">
                    <CardTitle className="text-xl font-black tracking-tight">{t('network_title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingConnections ? (
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-20 w-full rounded-xl" />
                        <Skeleton className="h-20 w-full rounded-xl" />
                      </div>
                    ) : acceptedConnections.length > 0 ? (
                      <div className="grid grid-cols-1 divide-y divide-border/10">
                        {acceptedConnections.map((conn) => (
                          <ConnectionBuddyCard
                            key={conn.id}
                            connection={conn}
                            currentUserId={currentUserId}
                            initialProfile={profileMap.get(conn.requesterId === currentUserId ? conn.addresseeId : conn.requesterId)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                        <UserCheck className="size-16 mb-4" />
                        <p className="font-bold">{t('no_connections')}</p>
                        <Button variant="link" onClick={() => setActiveTab('suggestions')} className="mt-2 text-primary">{t('discover_people')}</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
}

function ConnectionBuddyCard({
  connection,
  currentUserId,
  initialProfile
}: {
  connection: Connection;
  currentUserId: number;
  initialProfile?: UserPublicProfileDto;
}) {
  const t = useTranslations('Networking');
  const locale = useLocale();
  const buddyId = connection.requesterId === currentUserId ? connection.addresseeId : connection.requesterId;

  const { useGetPublicProfile } = useUserQueries();
  const { useDeleteConnection } = useConnectionQueries();
  const { data: fetchedProfile, isLoading } = useGetPublicProfile(initialProfile ? 0 : buddyId);
  const deleteMutation = useDeleteConnection();

  const p = initialProfile || fetchedProfile;

  const handleRemove = () => {
    deleteMutation.mutate(connection.id, {
      onSuccess: () => {
        toast.success(t('remove_connection'));
      }
    });
  };

  return (
    <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors group">
      <Link href={`/${locale}/profile/${buddyId}`} className="flex items-center gap-4 text-left flex-1 min-w-0">
        <div className="size-14 rounded-full bg-muted border border-border/40 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
          {isLoading ? (
            <Skeleton className="size-full" />
          ) : p?.avatarUrl ? (
            <img src={p.avatarUrl} alt="User" className="size-full object-cover" />
          ) : (
            <div className="size-full flex items-center justify-center font-bold text-xl text-muted-foreground/40 bg-muted uppercase">
              {(p?.fullName || connection.requesterName || 'U')[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          ) : (
            <>
              <p className="text-base font-bold text-foreground transition-colors group-hover:text-primary leading-tight truncate">
                {p?.fullName || (connection.requesterId === currentUserId ? connection.addresseeName : connection.requesterName) || t('network_member')}
              </p>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1 line-clamp-1">
                {p?.title || ''}
              </p>
            </>
          )}
        </div>
      </Link>
      <div className="flex items-center gap-2 font-bold">
        <Button variant="ghost" size="sm" className="hidden sm:flex rounded-full font-bold h-9 border border-border/40" asChild>
          <Link href={`/${locale}/messages?userId=${buddyId}`}>
            {t('message_btn')}
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full size-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-bold">
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={deleteMutation.isPending}
              className="font-bold cursor-pointer"
            >
              <X className="size-4 mr-2" />
              {t('remove_connection')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
