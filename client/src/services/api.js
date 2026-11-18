import axios from 'axios';

// Default production backend URL fallback
const PRODUCTION_API_ORIGIN = 'https://fit-track-ten-pi.vercel.app';

// Resolve and normalize the base API URL
const getBaseURL = () => {
  let envUrl = import.meta.env.VITE_API_URL;

  // In local development or when VITE_API_URL is unset, default according to environment
  if (!envUrl || !envUrl.trim()) {
    if (import.meta.env.DEV) {
      return '/api/v1';
    }
    // Safe production fallback if VITE_API_URL was omitted in Vercel settings
    return `${PRODUCTION_API_ORIGIN}/api/v1`;
  }

  // Strip wrapping quotes if any, trim whitespace, and remove trailing slashes
  let cleanUrl = envUrl.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '');

  if (!cleanUrl) {
    return import.meta.env.DEV ? '/api/v1' : `${PRODUCTION_API_ORIGIN}/api/v1`;
  }

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

// Request interceptor to attach JWT token and deduplicate paths
api.interceptors.request.use(
  (config) => {
    // Deduplicate /api/v1 if accidentally included by the caller
    if (config.url && config.url.startsWith('/api/v1/')) {
      config.url = config.url.replace(/^\/api\/v1/, '');
    } else if (config.url === '/api/v1') {
      config.url = '/';
    }

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
