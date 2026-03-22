/**
 * Composant Protection Admin
 * Gère l'authentification et redirection
 * Fichier: components/layout/AdminProtectedLayout.tsx
 */
'use client';  // ← CRUCIAL! Force le rendu CLIENT

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminProtectedLayoutProps {
  children: React.ReactNode;
}

export function AdminProtectedLayout({ children }: AdminProtectedLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ✅ Maintenant localStorage existe (côté client)
    console.log('=== AdminProtectedLayout ===');
    
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    console.log('localStorage user:', user);
    console.log('localStorage accessToken:', token ? '✅ Présent' : '❌ Absent');

    // Si pas de token → redirection login
    if (!token) {
      console.log('🔴 Pas de token → redirection /login');
      setIsAuthenticated(false);
      setIsLoading(false);
      router.push('/login');
      return;
    }

    // Si token → authentifié
    console.log('🟢 Token trouvé → authentification OK');
    setIsAuthenticated(true);
    setIsLoading(false);

  }, [router]);

  // Phase 1: Chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-white text-sm">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Phase 2: Non authentifié (la redirection se fait dans useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Phase 3: Authentifié → affiche les enfants
  return <>{children}</>;
}