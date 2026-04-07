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
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230D1F3C"/><path d="M 30 15 L 70 15 L 85 30 L 85 70 L 70 85 L 30 85 L 15 70 L 15 30 Z" fill="none" stroke="%23A0845C" stroke-width="2"/><path d="M 32 18 L 68 18 L 82 32 L 82 68 L 68 82 L 32 82 L 18 68 L 18 32 Z" fill="none" stroke="%23C8A96E" stroke-width="2"/><rect x="38" y="32" width="6" height="40" fill="%23E2C98A" /><rect x="38" y="66" width="20" height="6" fill="%23E2C98A" /></svg>',
  },
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