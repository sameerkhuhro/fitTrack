import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('fittrack_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fittrack_user');
    const storedToken = localStorage.getItem('fittrack_token');
    if (!saved || !storedToken) return null;
    try {
      const parsed = JSON.parse(saved);
      return (parsed && parsed.role) ? parsed : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('fittrack_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('fittrack_user', JSON.stringify(res.data.user));
          } else {
            throw new Error('Session invalid');
          }
        } catch (err) {
          localStorage.removeItem('fittrack_token');
          localStorage.removeItem('fittrack_user');
          setUser(null);
          setToken(null);
        }
      } else {
        localStorage.removeItem('fittrack_user');
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('fittrack_token', newToken);
      localStorage.setItem('fittrack_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return newUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const demoLogin = async (role) => {
    const res = await api.post('/auth/demo-login', { role });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('fittrack_token', newToken);
      localStorage.setItem('fittrack_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return newUser;
    }
    throw new Error(res.data.message || 'Demo login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('fittrack_token', newToken);
      localStorage.setItem('fittrack_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return newUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('fittrack_token');
      localStorage.removeItem('fittrack_user');
      setToken(null);
      setUser(null);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.patch('/auth/change-password', { currentPassword, newPassword });
    if (user) {
      const updated = { ...user, mustChangePassword: false };
      setUser(updated);
      localStorage.setItem('fittrack_user', JSON.stringify(updated));
    }
    return res.data;
  };

  const updateProfile = async (formData) => {
    const res = await api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res.data.success) {
      const updated = { ...user, ...res.data.user };
      setUser(updated);
      localStorage.setItem('fittrack_user', JSON.stringify(updated));
    }
    return res.data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isTrainer: user?.role === 'trainer',
    isMember: user?.role === 'member',
    login,
    demoLogin,
    register,
    logout,
    changePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

