'use client';

import { Connection } from '@/src/types/connection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, User } from 'lucide-react';
import { useConnectionQueries } from '@/src/hooks/queries/useConnectionQueries';
import { toast } from 'sonner';

export default function InvitationCard({ invitation }: { invitation: Connection }) {
  const { useRespondRequest } = useConnectionQueries();
  const respondMutation = useRespondRequest(invitation.id);

  const handleRespond = (isAccepted: boolean) => {
    respondMutation.mutate({ isAccepted }, {
      onSuccess: () => {
        toast.success(isAccepted ? 'Connection accepted' : 'Invitation ignored');
      }
    });
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border/40 hover:bg-muted/30 transition-colors group">
      <div className="flex gap-3 items-center">
        <div className="size-14 rounded-full bg-primary/10 overflow-hidden border shrink-0">
           {invitation.requesterName ? (
             <div className="size-full flex items-center justify-center font-bold text-primary bg-primary/5 uppercase">
               {invitation.requesterName[0]}
             </div>
           ) : (
             <User className="size-full p-3 text-muted-foreground/40" />
           )}
        </div>
        <div className="overflow-hidden">
          <p className="text-[14px] font-bold truncate leading-tight">{invitation.requesterName || 'Professional User'}</p>
          <p className="text-[12px] text-muted-foreground line-clamp-1">Software Engineer at TechLink</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Shared connection with Michael Chen</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 ml-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground font-bold hover:bg-black/5 h-9 px-3"
          onClick={() => handleRespond(false)}
          disabled={respondMutation.isPending}
        >
          Ignore
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full font-bold h-9 px-5 border-primary text-primary hover:bg-primary/5"
          onClick={() => handleRespond(true)}
          disabled={respondMutation.isPending}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
