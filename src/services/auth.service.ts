import api from '@/src/lib/api';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/src/types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/Auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/Auth/register', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    await api.post('/Auth/Logout', { refreshToken });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/Auth/ForgotPassword', { email });
  },

  resetPassword: async (data: any): Promise<void> => {
    await api.post('/Auth/ResetPassword', data);
  },
};
