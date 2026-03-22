/**
 * AuthProvider - Context provider pour l'authentification
 */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthContextType {
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (accessToken: string, refreshToken: string) => {
    setIsLoading(true);
    try {
      // Sauvegarder les tokens
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{ login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}