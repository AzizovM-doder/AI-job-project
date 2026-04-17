import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';

// Extended interface to include custom retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

// Flag to track the refresh state
let isRefreshing = false;
// Queue to hold requests that fail while refreshing
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor for adding the bearer token
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

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for the token and retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken, setTokens } = useAuthStore.getState();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh token endpoint using a fresh axios instance to avoid recursion
        const response = await axios.post('/api/Auth/refresh-token', 
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        const data = response.data?.data ?? response.data;
        const newToken = data.token || data.accessToken;
        const newRefreshToken = data.refreshToken;
        
        if (!newToken) {
          throw new Error('Invalid refresh token response');
        }
        
        // Update the store and local storage via zustand persist
        setTokens(newToken, newRefreshToken || refreshToken);

        // Update default header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // Process the queue with the new token
        processQueue(null, newToken);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError, null);
        await useAuthStore.getState().logout();
        
        // Redirect to login if on the client side
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          if (!path.includes('/login') && !path.includes('/register')) {
            const loc = ['en', 'ru', 'tj'].includes(path.split('/')[1]) ? path.split('/')[1] : 'tj';
            window.location.href = `/${loc}/login`;
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const customInstance = async <T>(config: import('axios').AxiosRequestConfig): Promise<T> => {
  const promise = api({ ...config });
  const response = await promise;
  return response.data?.data ?? response.data;
};
