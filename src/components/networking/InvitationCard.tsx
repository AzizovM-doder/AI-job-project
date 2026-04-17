'use client';

import { Connection, ConnectionStatus } from '@/src/types/connection';
import { UserPublicProfileDto } from '@/src/types/profile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, User } from 'lucide-react';
import { useConnectionQueries } from '@/src/hooks/queries/useConnectionQueries';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function InvitationCard({
  invitation,
  profile
}: {
  invitation: Connection;
  profile?: UserPublicProfileDto;
}) {
  const t = useTranslations('Networking');
  const { useRespondRequest } = useConnectionQueries();
  const respondMutation = useRespondRequest();

  const handleRespond = (status: ConnectionStatus) => {
    respondMutation.mutate({ connectionId: invitation.id, status }, {
      onSuccess: () => {
        const name = profile?.fullName || invitation.requesterName || t('network_member');
        toast.success(
          status === ConnectionStatus.Accepted
            ? t('connected_with', { name })
            : t('invitation_ignored')
        );
      }
    });
  };

  const displayName = profile?.fullName || invitation.requesterName || t('network_member');
  const displayAvatar = profile?.avatarUrl || null;
  const locale = useLocale();

  return (
    <div className="flex items-center justify-between p-4 border-b border-border/40 hover:bg-muted/30 transition-colors group">
      <Link href={`/${locale}/profile/${invitation.requesterId}`} className="flex gap-3 items-center flex-1 min-w-0">
        <div className="size-14 rounded-full bg-primary/10 overflow-hidden border shrink-0">
          {displayAvatar ? (
            <img src={displayAvatar} alt={displayName} className="size-full object-cover" />
          ) : displayName ? (
            <div className="size-full flex items-center justify-center font-bold text-primary bg-primary/5 uppercase">
              {displayName[0]}
            </div>
          ) : (
            <User className="size-full p-3 text-muted-foreground/40" />
          )}
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-[14px] font-bold truncate leading-tight group-hover:text-primary transition-colors">{displayName}</p>
          <p className="text-[12px] text-muted-foreground line-clamp-1">{profile?.title || ''}</p>
        </div>
      </Link>

      <div className="flex items-center gap-1 sm:gap-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground font-bold hover:bg-black/5 h-9 px-3"
          onClick={() => handleRespond(ConnectionStatus.Declined)}
          disabled={respondMutation.isPending}
        >
          {t('ignore_btn')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full font-bold h-9 px-5 border-primary text-primary hover:bg-primary/5"
          onClick={() => handleRespond(ConnectionStatus.Accepted)}
          disabled={respondMutation.isPending}
        >
          {t('accept_btn')}
        </Button>
      </div>
    </div>
  );
}
