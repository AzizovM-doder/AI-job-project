import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, setTokens, logout } = useAuthStore.getState();
        
        if (!refreshToken) throw new Error('No refresh token available');

        // Use standard axios to avoid recursion
        const response = await axios.post(`${api.defaults.baseURL}/Auth/refresh-token`, { refreshToken });
        
        const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
        
        setTokens(newToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        
        // Use window.location as absolute fallback, but try to preserve locale if possible
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          const isAuthPage = path.includes('/login') || path.includes('/register');
          
          // ONLY redirect if we are not already on an auth page to prevent loop
          if (!isAuthPage) {
            const pathParts = path.split('/');
            const locale = ['en', 'ru', 'tj'].includes(pathParts[1]) ? pathParts[1] : 'tj';
            window.location.href = `/${locale}/login`;
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const customInstance = async <T>(config: import('axios').AxiosRequestConfig): Promise<T> => {
  const promise = api({ ...config });
  const response = await promise;
  // Fallback unpacking from nest response architectures
  return response.data?.data ?? response.data;
};
