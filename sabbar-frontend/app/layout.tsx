'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import PublicFooter from '@/components/PublicFooter';
import PublicNavbarClient from '@/components/PublicNavbarClient';
import { AuthProvider } from '@/lib/auth/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LANDMARK ESTATE',
  description: 'Plateforme immobiliere Marocaine',
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <PublicNavbarClient />}
      {children}
      {!isAdminPage && <PublicFooter />}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}