'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, User, X, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { useUserQueries } from '@/src/hooks/queries/useUserQueries';
import { UserPublicProfileDto } from '@/src/types/user';
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
    // If we're filtering client-side, we don't strictly need debouncing for the API, 
    // but it keeps the UI smooth.
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Client-side Filter & Sort
  const processedUsers = useMemo(() => {
    if (!users) return [];
    
    // 1. Filter
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
    
    // 2. Sort: New users first, existing chat users last
    return [...filtered].sort((a, b) => {
      const aId = a.userId ?? a.id ?? 0;
      const bId = b.userId ?? b.id ?? 0;
      const aHas = existingUserIds.has(aId) ? 1 : 0;
      const bHas = existingUserIds.has(bId) ? 1 : 0;
      return aHas - bHas;
    });
  }, [users, debouncedTerm, existingUserIds]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setDebouncedTerm('');
    }
  }, [isOpen]);

  const handleSelectUser = (user: UserPublicProfileDto) => {
    // Normalize ID: The directory endpoint returns 'id', while the DTO expects 'userId'
    const normalizedUserId = user.userId ?? user.id;
    
    console.log('[UserSearchModal] CLICKED USER ID:', normalizedUserId);
    
    if (normalizedUserId === undefined || normalizedUserId === null) {
      console.warn('[UserSearchModal] Cannot select user: userId is missing', user);
      return;
    }

    // Pass the normalized user object
    onSelectUser({
      ...user,
      userId: normalizedUserId
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('new_message')}
      className="max-w-md bg-background border-border z-[100]"
    >
      <div className="space-y-4 pt-2 relative z-10">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={t('target_id')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 bg-muted/30 border-border focus-visible:ring-primary/20"
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
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
            >
              <X className="size-3 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Results */}
        <div className="border border-border/40 rounded-xl overflow-hidden bg-card/30 relative z-20">
          <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="size-10 rounded-full bg-muted animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isCreating ? (
              <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="size-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground font-medium">{t('initiating')}</p>
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
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevents focus loss before click
                        handleSelectUser(user);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left group cursor-pointer relative z-30 pointer-events-auto"
                    >
                      <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border/40 group-hover:border-primary/30">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName || ''}
                            className="size-full object-cover"
                          />
                        ) : (
                          <User className="size-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
                          {user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : (user.userName || 'User'))}
                        </p>
                        {user.title && (
                          <p className="text-[11px] text-muted-foreground truncate uppercase tracking-wider font-medium">
                            {user.title}
                          </p>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                         {hasExisting ? (
                           <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2 py-1 rounded">
                             In Chat
                           </span>
                         ) : (
                           <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                             <MessageCircle className="size-4" />
                           </div>
                         )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center space-y-2 opacity-50">
                <p className="text-sm font-medium">{t('void_detected')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
