'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthResponse, JwtPayload, UserRole } from '@/src/types/auth';

export interface AuthUser {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

// Decode JWT without external library
function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (accessToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as AuthUser;
        setUser(parsed);
        setRole(parsed.role);
      } catch {
        // Corrupted storage — clear it
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (data: AuthResponse) => {
    const claims = decodeJwt(data.token);
    if (!claims) return;

    const roleValue = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as UserRole;
    const fullName = claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

    const authUser: AuthUser = {
      userId: claims.UserId,
      email: claims.email,
      fullName,
      role: roleValue,
    };

    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(authUser));

    setUser(authUser);
    setRole(roleValue);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setRole(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
