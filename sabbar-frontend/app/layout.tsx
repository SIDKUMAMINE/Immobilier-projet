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
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  // Note: usePathname n'est pas disponible dans un Server Component
  // On va utiliser une approche différente
  return (
    <>
      <PublicNavbarClient />
      {children}
      <PublicFooter />
    </>
  );
}