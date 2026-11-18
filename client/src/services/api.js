import axios from 'axios';

// Default production backend URL fallback
const PRODUCTION_API_ORIGIN = 'https://fit-track-ten-pi.vercel.app';

// Resolve and normalize the base API URL
export const getBaseURL = () => {
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

  // In production, ensure relative paths target the backend origin rather than frontend SPA domain
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    if (cleanUrl.startsWith('/')) {
      if (import.meta.env.DEV) return cleanUrl;
      cleanUrl = `${PRODUCTION_API_ORIGIN}${cleanUrl}`;
    } else {
      cleanUrl = `https://${cleanUrl}`;
    }
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

// Canonical Centralized API Endpoint Mapping
export const ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password',
    PROFILE: '/auth/profile',
  },
  PLANS: {
    BASE: '/plans',
    BY_ID: (id) => `/plans/${id}`,
  },
  TRAINERS: {
    BASE: '/trainers',
    BY_ID: (id) => `/trainers/${id}`,
  },
  CONTACT: {
    PUBLIC: '/public/contact',
    ADMIN: '/contact',
    BY_ID: (id) => `/contact/${id}`,
  },
  MEMBERS: {
    BASE: '/members',
    BY_ID: (id) => `/members/${id}`,
    ASSIGN_TRAINER: (id) => `/members/${id}/assign-trainer`,
  },
  MEMBERSHIPS: {
    BASE: '/memberships',
    BY_ID: (id) => `/memberships/${id}`,
    MY: '/memberships/my',
    REQUEST: '/memberships/request',
    RENEW: (id) => `/memberships/${id}/renew`,
    ACTIVATE: (id) => `/memberships/${id}/activate`,
  },
  PAYMENTS: {
    BASE: '/payments',
    BY_ID: (id) => `/payments/${id}`,
    MY: '/payments/my',
    CONFIG: '/payments/config/account-details',
    VERIFY: (id) => `/payments/${id}/verify`,
    REJECT: (id) => `/payments/${id}/reject`,
    CASH_RECEIVED: '/payments/cash-received',
  },
  ATTENDANCE: {
    BASE: '/attendance',
    MY: '/attendance/my',
    MEMBER: (id) => `/attendance/member/${id}`,
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: (id) => `/attendance/${id}/check-out`,
  },
  WORKOUTS: {
    BASE: '/workouts',
    MY: '/workouts/my',
    BY_ID: (id) => `/workouts/${id}`,
  },
  EXERCISES: {
    BASE: '/exercises',
    BY_ID: (id) => `/exercises/${id}`,
  },
  SESSIONS: {
    BASE: '/sessions',
    BY_ID: (id) => `/sessions/${id}`,
    STATUS: (id) => `/sessions/${id}/status`,
  },
  SALARIES: {
    BASE: '/salaries',
    MY: '/salaries/my',
    BY_ID: (id) => `/salaries/${id}`,
    MARK_PAID: (id) => `/salaries/${id}/mark-paid`,
    CONFIRM_RECEIVED: (id) => `/salaries/${id}/confirm-received`,
    DISPUTE: (id) => `/salaries/${id}/dispute`,
  },
  PROGRESS: {
    BASE: '/progress',
    ME: '/progress/me',
    MEMBER: (id) => `/progress/member/${id}`,
    BY_ID: (id) => `/progress/${id}`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_ALL_READ: '/notifications/mark-all-read',
    READ: (id) => `/notifications/${id}/read`,
    SEND: '/notifications/send',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    REVENUE: '/dashboard/revenue',
    MEMBERSHIP_STATS: '/dashboard/membership-stats',
    ATTENDANCE_STATS: '/dashboard/attendance-stats',
    MEMBER_SUMMARY: '/dashboard/member-summary',
    TRAINER_SUMMARY: '/dashboard/trainer-summary',
  },
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
