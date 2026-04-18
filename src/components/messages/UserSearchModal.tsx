'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, User as UserIcon, X, MessageCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useUserQueries } from '@/hooks/queries/useUserQueries';
import { UserPublicProfileDto } from '@/types/user';
import { useTranslations } from 'next-intl';

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserPublicProfileDto) => void;
  isCreating?: boolean;
  existingUserIds?: Set<number>;
}

export default function UserSearchModal({ 
  isOpen, 
  onClose, 
  onSelectUser,
  isCreating,
  existingUserIds = new Set()
}: UserSearchModalProps) {
  const t = useTranslations('Messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { useGetDirectory } = useUserQueries();
  const { data: users, isLoading } = useGetDirectory(debouncedTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Client-side Filter & Sort
  const processedUsers = useMemo(() => {
    if (!users) return [];
    
    let filtered = users;
    if (debouncedTerm) {
      const term = debouncedTerm.toLowerCase();
      filtered = users.filter(u => 
        u.fullName?.toLowerCase().includes(term) || 
        u.userName?.toLowerCase().includes(term) ||
        u.firstName?.toLowerCase().includes(term) ||
        u.lastName?.toLowerCase().includes(term)
      );
    }
    
    return [...filtered].sort((a, b) => {
      const aId = a.userId ?? a.id ?? 0;
      const bId = b.userId ?? b.id ?? 0;
      const aHas = existingUserIds.has(aId) ? 1 : 0;
      const bHas = existingUserIds.has(bId) ? 1 : 0;
      return aHas - bHas;
    });
  }, [users, debouncedTerm, existingUserIds]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setDebouncedTerm('');
    }
  }, [isOpen]);

  const handleSelectUser = (user: UserPublicProfileDto) => {
    const normalizedUserId = user.userId ?? user.id;
    
    if (normalizedUserId === undefined || normalizedUserId === null) {
      return;
    }

    onSelectUser({
      ...user,
      userId: normalizedUserId
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] border-none shadow-2xl bg-background/95 backdrop-blur-xl rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-3">
          <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('new_message')}
          </DialogTitle>
        </DialogHeader>

        <div className="p-8 pt-0 space-y-6">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={t('target_id')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-11 bg-muted/30 border-border/10 rounded-xl h-12 focus-visible:ring-primary/10 font-bold"
              autoFocus
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setDebouncedTerm('');
                  inputRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
              >
                <X className="size-4 text-muted-foreground" />
              </Button>
            )}
          </div>

          {/* Results */}
          <div className="border border-border/20 rounded-2xl overflow-hidden bg-muted/5">
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="size-11 rounded-full bg-muted/50 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-muted/50 rounded" />
                        <div className="h-3 w-20 bg-muted/50 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isCreating ? (
                <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="size-10 text-primary animate-spin" />
                  <p className="text-xs font-black uppercase tracking-widest opacity-50">{t('initiating')}</p>
                </div>
              ) : processedUsers.length > 0 ? (
                <div className="divide-y divide-border/10">
                  {processedUsers.map((user, index) => {
                    const uId = user.userId ?? user.id;
                    const hasExisting = uId ? existingUserIds.has(uId) : false;
                    
                    return (
                      <button
                        key={uId ?? index}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-primary/5 transition-all text-left group"
                      >
                        <div className="size-11 rounded-full bg-primary/5 flex items-center justify-center shrink-0 overflow-hidden border border-border/20 group-hover:border-primary/40 ring-2 ring-transparent group-hover:ring-primary/10">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName || ''}
                              className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <UserIcon className="size-5 text-primary/40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : (user.userName || 'User'))}
                          </p>
                          {user.title && (
                            <p className="text-[11px] text-muted-foreground/60 truncate uppercase tracking-[0.1em] font-black mt-0.5">
                              {user.title}
                            </p>
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                           {hasExisting ? (
                             <span className="text-[9px] font-black text-white uppercase bg-muted-foreground/30 px-2 py-1 rounded-md">
                               In Chat
                             </span>
                           ) : (
                             <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                               <MessageCircle className="size-5" />
                             </div>
                           )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-16 text-center space-y-2 opacity-50">
                  <p className="text-xs font-black uppercase tracking-widest">{t('void_detected')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
