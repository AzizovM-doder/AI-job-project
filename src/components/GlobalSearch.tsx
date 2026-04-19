'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Building2, Loader2, X } from 'lucide-react';
import { useUserQueries } from '@/hooks/queries/useUserQueries';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export default function GlobalSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const locale = useLocale();

  const { useGetDirectory } = useUserQueries();

  // Fetch all users once for local filtering
  const { data: allUsers = [], isLoading: loadingUsers } = useGetDirectory('');

  // Organization Search using specific absolute URL
  const { data: orgData = [], isLoading: loadingOrgs } = useQuery({
    queryKey: ['organizations', 'external-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const res = await axios.get(`http://157.180.29.248:8090/api/Organization/search?name=${searchQuery.toLowerCase()}`);
      return res.data?.data ?? res.data ?? [];
    },
    enabled: searchQuery.length > 0,
  });

  const isLoading = loadingUsers || loadingOrgs;

  // Local filtering for users
  const filteredUsers = searchQuery.length > 0
    ? allUsers.filter(u => 
        (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.userName || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const results = [
    ...filteredUsers.map(u => ({ ...u, type: 'user', key: `u-${u.userId}` })),
    ...(Array.isArray(orgData) ? orgData : []).map(o => ({ ...o, type: 'org', key: `o-${o.id}` }))
  ].slice(0, 15); // Increased limit as we have scroll now

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: any) => {
    if (result.type === 'user') {
      router.push(`/${locale}/profile/${result.userId}`);
    } else {
      router.push(`/${locale}/organizations/${result.id}`);
    }
    setShowResults(false);
    setIsExpanded(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className="relative flex items-center z-[10001]">
      <motion.div
        initial={false}
        animate={{
          width: isExpanded ? '280px' : '48px',
          backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.03)',
        }}
        className={cn(
          "h-12 rounded-2xl border border-white/10 flex items-center transition-all duration-300",
          isExpanded ? "ring-2 ring-primary/20 bg-black/40" : "hover:bg-white/5 cursor-pointer"
        )}
        onClick={() => {
          if (!isExpanded) {
            setIsExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 150);
          }
        }}
      >
        <div className="size-12 shrink-0 flex items-center justify-center text-muted-foreground">
          <Search className={cn("size-5 transition-colors", isExpanded && "text-primary")} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search Sector..."
          className="bg-transparent border-none outline-none text-[11px] font-heading font-bold w-full pr-4 text-foreground placeholder:text-white/20"
        />

        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="mr-3 p-1 hover:bg-white/10 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isExpanded && showResults && (searchQuery.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-14 left-0 w-[320px] glass backdrop-blur-[40px] border border-white/10 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden z-[100000]"
          >
            <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-5 text-primary animate-spin" />
                </div>
              )}

              {!isLoading && results.length === 0 && searchQuery.length > 0 && (
                <div className="py-8 text-center">
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground">No Entities Found</p>
                </div>
              )}

              {!isLoading && results.map((result: any) => (
                <button
                  key={result.key}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                >
                  <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/5">
                    {result.avatarUrl || result.logoUrl ? (
                      <img 
                        src={result.avatarUrl || result.logoUrl} 
                        className="size-full object-cover group-hover:scale-110 transition-transform" 
                        alt=""
                      />
                    ) : (
                      result.type === 'user' ? <User className="size-5 text-primary" /> : <Building2 className="size-5 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-col items-start truncate">
                    <span className="text-[10px] font-heading font-bold truncate group-hover:text-primary transition-colors">
                      {result.fullName || result.name || result.userName}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-50">
                      {result.type === 'user' ? (
                        <>
                          <User className="size-2.5" />
                          <span className="text-[8px] font-bold tracking-wider">{result.title || 'Crew Member'}</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="size-2.5" />
                          <span className="text-[8px] font-bold tracking-wider">{result.location || 'Hub'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-3 bg-white/5 border-t border-white/5 text-center">
              <span className="text-[8px] font-bold tracking-[0.3em] opacity-30 italic">Mars Identity Matrix v2.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
