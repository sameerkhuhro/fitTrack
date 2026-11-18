import axios from 'axios';

// Resolve and normalize the base API URL
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  // In local development or when VITE_API_URL is unset, default to relative /api/v1 (handled by Vite proxy)
  if (!envUrl || !envUrl.trim()) {
    return '/api/v1';
  }

  // Strip whitespace and any trailing slashes
  const cleanUrl = envUrl.trim().replace(/\/+$/, '');

  // If already ending with /api/v1, use directly
  if (cleanUrl.endsWith('/api/v1')) {
    return cleanUrl;
  }

  // If ending with /api, append /v1
  if (cleanUrl.endsWith('/api')) {
    return `${cleanUrl}/v1`;
  }

  // Otherwise append /api/v1 to root origin
  return `${cleanUrl}/api/v1`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fittrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login/register attempt failures
      const url = error.config?.url || '';
      const isAuthUrl = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthUrl) {
        localStorage.removeItem('fittrack_token');
        localStorage.removeItem('fittrack_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
