'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Check, 
  X, 
  MoreHorizontal, 
  UserMinus, 
  MessageSquare,
  Loader2,
  Zap,
  Signal,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConnectionState } from '@/hooks/useConnectionState';
import { useConnectionQueries } from '@/hooks/queries/useConnectionQueries';
import { ConnectionStatus } from '@/types/connection';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ConnectionActionProps {
  targetUserId: number;
  className?: string;
}

export default function ConnectionAction({ targetUserId, className }: ConnectionActionProps) {
  const { state, connectionId, isLoading, myUserId } = useConnectionState(targetUserId);
  const { useSendRequest, useRespondRequest, useDeleteConnection } = useConnectionQueries();
  
  const sendMutation = useSendRequest();
  const respondMutation = useRespondRequest();
  const deleteMutation = useDeleteConnection();

  if (isLoading) {
    return (
      <Button disabled variant="outline" className={cn("h-14 px-10 rounded-2xl bg-white/5 border-white/10", className)}>
        <Loader2 className="size-4 animate-spin mr-3 opacity-20" />
        <span className="text-[11px] font-black uppercase tracking-widest opacity-20">Scanning...</span>
      </Button>
    );
  }

  if (state === 'SELF') return null;

  const handleConnect = async () => {
    try {
      await sendMutation.mutateAsync(targetUserId);
      toast.success('Signal Transmitted', { description: 'Connection request sent to operative.' });
    } catch (err) {
      toast.error('Transmission Failure', { description: 'Failed to initialize link.' });
    }
  };

  const handleAccept = async () => {
    if (!connectionId) return;
    try {
      await respondMutation.mutateAsync({ connectionId, status: ConnectionStatus.Accepted });
      toast.success('Link Established', { description: 'Connection synchronized successfully.' });
    } catch (err) {
      toast.error('Sync Failure', { description: 'Could not establish secure link.' });
    }
  };

  const handleDecline = async () => {
    if (!connectionId) return;
    try {
      await respondMutation.mutateAsync({ connectionId, status: ConnectionStatus.Declined });
      toast.info('Link Terminated', { description: 'Incoming request was declined.' });
    } catch (err) {
      toast.error('Protocol Error', { description: 'Failed to process decline signal.' });
    }
  };

  const handleDelete = async () => {
    if (!connectionId) return;
    try {
      await deleteMutation.mutateAsync(connectionId);
      toast.info('Connection Severed', { description: 'The link has been removed.' });
    } catch (err) {
      toast.error('System Error', { description: 'Failed to terminate connection.' });
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <AnimatePresence mode="wait">
        {state === 'NONE' && (
          <motion.div
            key="none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Button
              onClick={handleConnect}
              disabled={sendMutation.isPending}
              className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.15em] text-[11px] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
            >
              {sendMutation.isPending ? (
                <Loader2 className="size-4 mr-3 animate-spin" />
              ) : (
                <UserPlus className="size-4 mr-3 group-hover:rotate-12 transition-transform" />
              )}
              {sendMutation.isPending ? 'Requesting...' : 'Initialize Link'}
            </Button>
          </motion.div>
        )}

        {state === 'PENDING_SENT' && (
          <motion.div
            key="pending-sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button
              disabled
              variant="outline"
              className="h-14 px-10 rounded-2xl bg-white/5 border-white/10 text-white/40 font-black uppercase tracking-[0.15em] text-[11px] cursor-wait"
            >
              <Signal className="size-4 mr-3 animate-pulse text-primary" />
              Signal Pending
            </Button>
          </motion.div>
        )}

        {state === 'PENDING_RECEIVED' && (
          <motion.div
            key="pending-received"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3"
          >
            <Button
              onClick={handleAccept}
              disabled={respondMutation.isPending}
              className="h-14 px-8 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-[0.15em] text-[11px] shadow-2xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              {respondMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4 mr-2" />}
              Accept Link
            </Button>
            <Button
              onClick={handleDecline}
              disabled={respondMutation.isPending}
              variant="outline"
              className="h-14 px-6 rounded-2xl bg-white/5 border-white/10 text-white/60 font-black uppercase tracking-[0.15em] text-[11px] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all"
            >
              {respondMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            </Button>
          </motion.div>
        )}

        {state === 'CONNECTED' && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-3"
          >
            <Button
              variant="outline"
              className="h-14 px-10 rounded-2xl glass-card bg-white/5 border-white/10 text-white font-black uppercase tracking-[0.15em] text-[11px] hover:bg-white/10 transition-all cursor-default"
            >
              <CheckCircle2 className="size-4 mr-3 text-emerald-500" />
              Synchronized
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-14 w-12 rounded-2xl bg-white/5 border-white/10 p-0">
                  <MoreHorizontal className="size-5 text-white/40" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card bg-black border-white/10 rounded-2xl p-2 min-w-[200px]">
                <DropdownMenuItem className="p-3 focus:bg-white/5 rounded-xl cursor-pointer group">
                  <MessageSquare className="size-4 mr-3 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Send Signal</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="p-3 focus:bg-rose-500/10 rounded-xl cursor-pointer group"
                >
                  <UserMinus className="size-4 mr-3 text-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Terminate Link</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
