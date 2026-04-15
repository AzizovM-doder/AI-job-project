'use client';

import { create } from 'zustand';

interface JobFilters {
  title?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  page: number;
  pageSize: number;
}

interface JobState {
  filters: JobFilters;
  setFilter: (key: keyof JobFilters, value: any) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
}

export const useJobStore = create<JobState>((set) => ({
  filters: {
    title: '',
    location: '',
    jobType: undefined,
    experienceLevel: undefined,
    page: 1,
    pageSize: 10,
  },

  setFilter: (key, value) => 
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 } // Reset to page 1 on filter change
    })),

  setPage: (page) => 
    set((state) => ({
      filters: { ...state.filters, page }
    })),

  resetFilters: () => 
    set({
      filters: {
        title: '',
        location: '',
        jobType: undefined,
        experienceLevel: undefined,
        page: 1,
        pageSize: 10,
      }
    }),
}));
