'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthResponse, JwtPayload, UserRole, LoginCredentials, RegisterCredentials } from '@/types/auth';
import api from '@/lib/api';

export interface AuthUser {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setTokens: (token: string, refreshToken: string) => void;
}

// Internal JWT decoder
const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/Auth/login', credentials);
          const data: AuthResponse = response.data;
          
          const claims = decodeJwt(data.token);
          if (!claims) throw new Error('Invalid authentication token received');

          const role = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as UserRole;
          const user: AuthUser = {
            userId: claims.UserId,
            email: claims.email,
            fullName: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            role,
          };

          set({
            user,
            token: data.token,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true });
        try {
          await api.post('/Auth/register', credentials);
          // After register, we usually want them to login or we auto-login
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        try {
          if (refreshToken) {
            // Non-blocking logout call — if it fails, we still want to log out locally
            await api.post('/Auth/logout', { refreshToken }).catch(() => {});
          }
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          // Final safety clear of persisted storage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('aijob-auth-storage');
          }
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setTokens: (token, refreshToken) => set({ 
        token, 
        refreshToken: refreshToken || get().refreshToken, // Preserve old refresh if new one not provided
        isAuthenticated: true 
      }),
    }),
    {
      name: 'aijob-auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false);
      },
      // Only persist user and tokens, not the loading state
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
