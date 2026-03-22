/**
 * Layout racine - Site PUBLIC (pas d'authentification)
 * Fichier: app/layout.tsx
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SABBAR - Plateforme Immobilière Marocaine',
  description: 'Trouvez votre bien immobilier idéal au Maroc avec notre plateforme IA',
  keywords: 'immobilier, Maroc, Casablanca, Rabat, Marrakech, propriétés, vente, location',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}