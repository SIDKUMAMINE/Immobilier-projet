'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Ajouter l'attribut data-admin-page
    document.body.setAttribute('data-admin-page', 'true');
    
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);

    // Cleanup
    return () => {
      document.body.removeAttribute('data-admin-page');
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-white text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}