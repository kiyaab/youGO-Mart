'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  switchDemo: (role: 'buyer' | 'seller' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  switchDemo: async () => {},
  refreshUser: async () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('yougo_token') : null;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.auth.getCurrentUser();
      if (res && res.is_authenticated && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
        localStorage.removeItem('yougo_token');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('yougo_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (data: { email: string; password: string }) => {
    const res = await api.auth.login(data);
    if (res.token) {
      localStorage.setItem('yougo_token', res.token);
      setUser(res.user);
    }
  };

  const register = async (data: any) => {
    const res = await api.auth.register(data);
    if (res.token) {
      localStorage.setItem('yougo_token', res.token);
      setUser(res.user);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('yougo_token');
    setUser(null);
  };

  const switchDemo = async (role: 'buyer' | 'seller' | 'admin') => {
    const res = await api.auth.switchDemo(role);
    if (res.token) {
      localStorage.setItem('yougo_token', res.token);
      setUser(res.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        switchDemo,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
