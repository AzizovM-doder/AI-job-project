"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Building2, Loader2, X, Terminal, Radar } from "lucide-react";
import { useUserQueries } from "@/hooks/queries/useUserQueries";
import { useOrganizationQueries } from "@/hooks/queries/useOrganizationQueries";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const router = useRouter();
  const locale = useLocale();

  const { useGetDirectory } = useUserQueries();
  const { useSearchOrganizations } = useOrganizationQueries();

  // 1. Fetch ALL users once for synchronized client-side filtering
  const { data: allUsers = [], isLoading: loadingUsersInitial } = useGetDirectory("");

  // 2. Organization Search remains as a server-side request (debounced)
  const { data: orgData = [], isLoading: loadingOrgs } = useSearchOrganizations(debouncedSearch);

  // Synchronized Local Filter for Users (Personnel)
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return allUsers.filter(u => 
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.userName || '').toLowerCase().includes(q) ||
      (u.title || '').toLowerCase().includes(q)
    );
  }, [allUsers, searchQuery]);

  // Loading state only reflects the active server request for Orgs
  const isRequestInProgress = loadingOrgs && debouncedSearch.length > 0;

  // Merge synchronized filter results with debounced request results
  const results = useMemo(() => {
    if (!searchQuery && !debouncedSearch) return [];
    
    // Merge: [Local Users, Server Orgs]
    return [
      ...filteredUsers.map((u) => ({ ...u, type: "user", key: `u-${u.userId}` })),
      ...(Array.isArray(orgData) ? orgData : []).map((o) => ({
        ...o,
        type: "org",
        key: `o-${o.id}`,
      })),
    ].slice(0, 15);
  }, [filteredUsers, orgData, searchQuery, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (result: any) => {
    if (result.type === "user") {
      router.push(`/${locale}/profile/${result.userId}`);
    } else {
      router.push(`/${locale}/organizations/${result.id}`);
    }
    setShowResults(false);
    setIsExpanded(false);
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className="relative flex items-center z-[10001]">
      <motion.div
        initial={false}
        animate={{
          width: isExpanded ? "280px" : "48px",
          backgroundColor: isExpanded
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.03)",
        }}
        className={cn(
          "h-12 rounded-2xl border border-white/10 flex items-center transition-all duration-300",
          isExpanded
            ? "ring-2 ring-primary/20 bg-black/40"
            : "hover:bg-white/5 cursor-pointer"
        )}
        onClick={() => {
          if (!isExpanded) {
            setIsExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 150);
          }
        }}
      >
        <div className="size-12 shrink-0 flex items-center justify-center text-muted-foreground">
          <Search
            className={cn(
              "size-5 transition-colors",
              isExpanded && "text-primary"
            )}
          />
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
          placeholder="Search Matrix..."
          className="bg-transparent border-none outline-none text-[11px] font-bold w-full pr-4 text-foreground placeholder:text-white/20"
        />

        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery("");
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
        {isExpanded && showResults && (searchQuery.length > 0 || isRequestInProgress) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-14 left-0 w-[320px] glass-card backdrop-blur-[40px] border border-white/10 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden z-[100000]"
          >
            {/* Scanning Effect Overlay for active network requests */}
            {isRequestInProgress && (
              <motion.div 
                initial={{ top: "-100%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-[2px] bg-primary/20 z-10 pointer-events-none blur-[1px]"
              />
            )}

            <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar relative z-0">
              {/* Only show loading indicators when Orgs are being searched */}
              {isRequestInProgress && (
                <div className="flex flex-col gap-2">
                  <div className="px-4 py-3 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Radar className="size-3 text-primary animate-pulse" />
                        <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-primary/60">Scanning Sector...</span>
                     </div>
                     <Loader2 className="size-3 text-primary/40 animate-spin" />
                  </div>
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {/* No data state */}
                {!isRequestInProgress && results.length === 0 && searchQuery.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center text-muted-foreground flex flex-col items-center gap-3"
                  >
                     <Terminal className="size-8 opacity-10" />
                     <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">Void Signal Detected</p>
                  </motion.div>
                )}

                {/* Unified result list (Filtered Users + Requested Orgs) */}
                {results.map((result: any) => (
                  <motion.button
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
                      ) : result.type === "user" ? (
                        <User className="size-5 text-primary" />
                      ) : (
                        <Building2 className="size-5 text-primary" />
                      )}
                    </div>
                    <div className="flex flex-col items-start truncate">
                      <span className="text-[10px] font-bold truncate group-hover:text-primary transition-colors">
                        {result.fullName || result.name || result.userName}
                      </span>
                      <div className="flex items-center gap-1.5 opacity-50">
                        {result.type === "user" ? (
                          <>
                            <User className="size-2.5" />
                            <span className="text-[8px] font-bold tracking-wider">
                              {result.title || "Crew Member"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Building2 className="size-2.5" />
                            <span className="text-[8px] font-bold tracking-wider">
                              {result.location || "Hub"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between px-6">
              <span className="text-[8px] font-bold tracking-[0.3em] opacity-30 italic uppercase">
                Deciphering Stream v2.1
              </span>
              <div className="flex gap-2">
                 <div className="size-1.5 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
