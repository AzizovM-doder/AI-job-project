"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function MutationToastHandler() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();
  const t = useTranslations("Notifications");

  useEffect(() => {
    const unsubscribe = mutationCache.subscribe((event) => {
      // We only care about mutations that have meta.toast === true
      const meta = event.mutation?.meta as { toast?: boolean; action?: string } | undefined;
      
      if (!meta?.toast) return;

      const mutationId = event.mutation.mutationId;
      const action = meta.action || "sync"; // default to sync

      // Map mutation status to toast states
      if (event.type === "updated" && event.action.type === "loading") {
        toast.loading(t(`${action}_loading`), { id: mutationId });
      }

      if (event.type === "updated" && event.action.type === "success") {
        toast.success(t(`${action}_success`), { id: mutationId });
      }

      if (event.type === "updated" && event.action.type === "error") {
        toast.error(t(`${action}_error`), { id: mutationId });
      }
    });

    return () => unsubscribe();
  }, [mutationCache, t]);

  return null;
}
