import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import { ME_QUERY } from '@/features/auth/graphql/mutations';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  employeeId?: string;
  phoneNumber?: string;
  role: string;
  roles?: string[];
  isActive: boolean;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('currentUser');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Verify and sync user profile with backend using token
  const { data, error, loading } = useQuery<any>(ME_QUERY, {
    skip: !token,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data?.me) {
      // Check if user account is deactivated
      if (!data.me.isActive) {
        logout();
        return;
      }
      setUser(data.me);
      localStorage.setItem('currentUser', JSON.stringify(data.me));
    }
  }, [data]);

  useEffect(() => {
    // If backend returns unauthorized or account inactive, clear session
    if (error && token) {
      logout();
    }
  }, [error]);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('accessToken', newToken);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('currentUser', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user?.isActive),
    isLoading: loading && Boolean(token) && !user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
