"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { PageTransition } from "@/components/PageTransition";
import ThreeColumnLayout from "@/components/layouts/ThreeColumnLayout";
import FeedIdentityCard from "@/components/feed/FeedIdentityCard";
import FeedSuggestionsCard from "@/components/feed/FeedSuggestionsCard";
import StartPostBox from "@/components/feed/StartPostBox";
import FeedPostCard from "@/components/feed/FeedPostCard";
import { useFeedQueries } from "@/hooks/queries/useFeedQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { useLocalPagination } from "@/hooks/useLocalPagination";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function FeedPage() {
  const { useGetFeed } = useFeedQueries();
  const { data: posts = [], isLoading, isError } = useGetFeed();

  // Local Pagination logic
  const { 
    paginatedItems, 
    currentPage, 
    totalPages, 
    setPage, 
    hasNext, 
    hasPrev 
  } = useLocalPagination(posts, 5); // 5 posts per page as requested/default

  const FeedContent = (
    <div className="space-y-6 pb-24">
      <StartPostBox />

      {/* Feed Divider / Sort */}
      <div className="flex items-center gap-4 py-2 px-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 hover:text-primary transition-colors">
          Priority: <span className="text-primary">Live_Feed</span>
        </button>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="glass-card bg-white/[0.03] backdrop-blur-3xl p-8 space-y-6 border-white/5 rounded-[2.5rem] shadow-2xl"
            >
              <div className="flex gap-6">
                <Skeleton className="size-14 rounded-2xl bg-white/5" />
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-4 w-32 bg-white/5" />
                  <Skeleton className="h-3 w-48 bg-white/5" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-white/5" />
                <Skeleton className="h-4 w-[90%] bg-white/5" />
              </div>
              <Skeleton className="h-64 w-full rounded-[2rem] bg-white/5" />
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="p-16 text-center glass-card bg-white/[0.02] border-white/5 rounded-[3rem] border-dashed">
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20 mb-2">
              <Terminal className="size-8 text-destructive opacity-40" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-destructive">
              SIGNAL_INTERFERENCE: SYNC_FAILED
            </p>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest max-w-xs">
              The uplink to Sector 7 has been compromised. Re-establishing link...
            </p>
          </div>
        </Card>
      ) : posts && posts.length > 0 ? (
        <>
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {paginatedItems.map((post) => (
                  <FeedPostCard key={post.id} post={post} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="pt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (hasPrev) setPage(currentPage - 1); }}
                      className={cn(!hasPrev && "opacity-50 pointer-events-none")}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink 
                        href="#" 
                        isActive={p === currentPage}
                        onClick={(e) => { e.preventDefault(); setPage(p); }}
                        className="rounded-xl"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (hasNext) setPage(currentPage + 1); }}
                      className={cn(!hasNext && "opacity-50 pointer-events-none")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <Card className="p-24 text-center glass-card bg-white/[0.02] border-white/5 border-dashed rounded-[3rem]">
          <div className="flex flex-col items-center gap-6">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Terminal className="size-10 text-white/20" />
            </div>
            <div className="space-y-2">
              <p className="font-heading font-black text-2xl text-white uppercase tracking-tighter">
                Sector_Void
              </p>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto">
                No professional signals detected in this sector. Initialize the first
                transmission.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <PageTransition className="py-8 md:py-12">
          <Container>
            <ThreeColumnLayout
              left={<FeedIdentityCard />}
              main={FeedContent}
              right={<FeedSuggestionsCard />}
            />
          </Container>
        </PageTransition>
      </div>
    </ProtectedRoute>
  );
}
