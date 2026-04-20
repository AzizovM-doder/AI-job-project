"use client";

import { useNotificationQueries } from "@/hooks/queries/useNotificationQueries";
import { useAuthStore } from "@/store/authStore";
import { PageTransition } from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotificationItem from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const userId = user?.userId ? Number(user.userId) : 0;

  const { useGetNotificationsPaged, useMarkAsRead, useDeleteNotification } =
    useNotificationQueries();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const { data: notificationsPaged, isLoading } = useGetNotificationsPaged({
    userId,
    PageNumber: page,
    PageSize: pageSize,
  });

  const markAsRead = useMarkAsRead();
  const deleteNotification = useDeleteNotification();

  const handleMarkAllAsRead = () => {
    notificationsPaged?.items.forEach((n) => {
      if (!n.isRead) markAsRead.mutate(n.id);
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 pt-8">
        <Skeleton className="h-10 w-48 mb-6" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <PageTransition className="max-w-3xl mx-auto py-8 px-4 pb-24">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Bell className="size-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="rounded-full"
            >
              <CheckCheck className="size-4 mr-2" /> Mark all read
            </Button>
          </div>
        </header>

        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {notificationsPaged?.items.length ? (
                <div className="divide-y divide-border/40">
                  {notificationsPaged.items.map((n) => (
                    <div key={n.id} className="relative group">
                      <NotificationItem
                        notification={n}
                        onClick={(id) => markAsRead.mutate(id)}
                        className="hover:bg-muted/30"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification.mutate(n.id);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center flex flex-col items-center justify-center h-full">
                  <div className="bg-muted/30 size-20 rounded-full flex items-center justify-center mb-6">
                    <Bell className="size-10 text-muted-foreground/30" />
                  </div>
                  <h2 className="text-xl font-bold">All caught up!</h2>
                  <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                    No new notifications at the moment.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Improved Pagination UI */}
        {notificationsPaged && notificationsPaged.totalPages > 1 && (
          <div className="mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (notificationsPaged.hasPrevious) setPage(page - 1);
                    }}
                    className={cn(
                      !notificationsPaged.hasPrevious &&
                        "opacity-50 pointer-events-none"
                    )}
                  />
                </PaginationItem>

                {/* Intelligent Page Number Rendering */}
                {Array.from({ length: notificationsPaged.totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === notificationsPaged.totalPages || Math.abs(p - page) <= 1)
                  .map((p, index, array) => {
                    const prev = array[index - 1];
                    return (
                      <React.Fragment key={p}>
                        {prev && p - prev > 1 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            isActive={p === page}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(p);
                            }}
                            className="rounded-xl"
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (notificationsPaged.hasNext) setPage(page + 1);
                    }}
                    className={cn(
                      !notificationsPaged.hasNext &&
                        "opacity-50 pointer-events-none"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </PageTransition>
    </ProtectedRoute>
  );
}
