'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mars_job_archived_conversations';

/**
 * Hook to manage archived conversation IDs in localStorage.
 * Provides functions to archive, unarchive, and check if a conversation is archived.
 */
export function useArchiveStore() {
  const [archivedIds, setArchivedIds] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setArchivedIds(new Set(parsed.map(Number)));
        }
      } catch (e) {
        console.error('Failed to parse archived conversation IDs', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever archivedIds changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(archivedIds)));
    }
  }, [archivedIds, isLoaded]);

  const archive = (id: number) => {
    setArchivedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const unarchive = (id: number) => {
    setArchivedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleArchive = (id: number) => {
    if (archivedIds.has(id)) {
      unarchive(id);
    } else {
      archive(id);
    }
  };

  const isArchived = (id: number) => archivedIds.has(id);

  return {
    archivedIds,
    archive,
    unarchive,
    toggleArchive,
    isArchived,
    isLoaded
  };
}
