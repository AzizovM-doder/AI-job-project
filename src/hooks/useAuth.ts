'use client';

import { useAuthStore } from '../store/authStore';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { LoginCredentials, RegisterCredentials } from '../types/auth';
import axios from 'axios';

export const useAuth = () => {
  const router = useRouter();
  const { locale } = useParams();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login: storeLogin, 
    register: storeRegister, 
    logout: storeLogout 
  } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    try {
      await storeLogin(credentials);
      const currentUser = useAuthStore.getState().user;
      
      toast.success('System Access Granted', {
        description: 'Identity verified. Redirecting to portal...'
      });

      if (currentUser?.role === 'Organization') {
        router.push(`/${locale}/organization/dashboard`);
      } else {
        router.push(`/${locale}/candidate/dashboard`);
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.description?.[0] || 'Authentication failed'
        : err instanceof Error ? err.message : 'Authentication failed';
      toast.error('System Access Denied', {
        description: msg
      });
      throw err;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await storeRegister(credentials);
      // Auto-login after successful registration if desired
      await login({ email: credentials.email, password: credentials.password });
      
      toast.success('Registration Successful', {
        description: 'Identity created and authenticated.'
      });
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.description?.[0] || 'Registration failed'
        : err instanceof Error ? err.message : 'Registration failed';
      toast.error('Registration Failed', {
        description: msg
      });
      throw err;
    }
  };

  const logout = async () => {
    try {
      await storeLogout();
      toast.info('Session Terminated', {
        description: 'You have been safely logged out.'
      });
      router.push(`/${locale}/login`);
    } catch (err) {
      console.error('Logout error:', err);
      // Fallback redirect even if API logout fails
      router.push(`/${locale}/login`);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};
