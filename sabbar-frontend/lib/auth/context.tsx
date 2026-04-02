/**
 * AuthContext - Gestion de l'authentification
 * Fichier: lib/auth/context.tsx
 */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  full_name: string;
  agency_name?: string;
  phone_number?: string;
  role?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // ✅ Suppression de useRouter — c'était la cause du crash ligne 19
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Initialiser l'authentification au montage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedAccessToken && storedRefreshToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (newAccessToken: string, newRefreshToken: string, user: User) => {
    try {
      // Stocker les tokens
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('access_token', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('refresh_token', newRefreshToken);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);


      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ window.location.href = navigation hard, évite les bugs React Router
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (accessToken) {
        try {
          await fetch('http://localhost:8000/api/v1/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }).catch(() => null);
        } catch (err) {
          console.warn('Server logout failed:', err);
        }
      }

      // Nettoyer le state local
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      // ✅ Navigation hard vers login
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  const refreshTokenFn = async (): Promise<boolean> => {
    if (!refreshToken) {
      await logout();
      return false;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        await logout();
        return false;
      }

      const data = await response.json();
      await login(data.access_token, data.refresh_token);
      return true;
    } catch (err) {
      console.error('Token refresh error:', err);
      await logout();
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken: refreshTokenFn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}