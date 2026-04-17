'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, User, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useUserQueries } from '@/src/hooks/queries/useUserQueries';
import { UserPublicProfileDto } from '@/src/types/user';

interface UserSearchProps {
  onSelectUser: (user: UserPublicProfileDto) => void;
  className?: string;
}

export default function UserSearch({ onSelectUser, className }: UserSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { useGetDirectory } = useUserQueries();
  const { data: users, isLoading } = useGetDirectory(debouncedTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setDebouncedTerm('');
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelectUser = (user: UserPublicProfileDto) => {
    onSelectUser(user);
    setIsOpen(false);
    setSearchTerm('');
    setDebouncedTerm('');
  };

  return (
    <div className={cn("relative", className)} ref={searchRef}>
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 font-semibold"
        size="sm"
      >
        <MessageCircle className="size-4" />
        New Message
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-popover border rounded-lg shadow-lg overflow-hidden z-50">
          {/* Search Header */}
          <div className="p-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
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
                  className="h-6 w-6 p-0 shrink-0"
                >
                  <X className="size-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : users && users.length > 0 ? (
              <div className="py-2">
                {users.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => handleSelectUser(user)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName || ''}
                          className="size-full object-cover"
                        />
                      ) : (
                        <User className="size-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : (user.userName || 'User'))}
                      </p>
                      {user.title && (
                        <p className="text-xs text-muted-foreground truncate">
                          {user.title}
                        </p>
                      )}
                    </div>
                    <MessageCircle className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : debouncedTerm ? (
              <div className="p-6 text-center">
                <User className="size-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No users found</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="p-6 text-center">
                <Search className="size-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Search for users</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Type to find people to message
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
