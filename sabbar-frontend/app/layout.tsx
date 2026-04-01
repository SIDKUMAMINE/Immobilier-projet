import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PublicFooter from '@/components/PublicFooter';
import PublicNavbarClient from '@/components/PublicNavbarClient';
import { AuthProvider } from '@/lib/auth/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LANDMARK ESTATE',
  description: 'Plateforme immobiliere Marocaine',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <PublicNavbarClient />
          {children}
          <PublicFooter />
        </AuthProvider>
      </body>
    </html>
  );
}