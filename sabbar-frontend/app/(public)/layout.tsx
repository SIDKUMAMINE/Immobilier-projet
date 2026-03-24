
import React from 'react';
import PublicNavbarClient from '@/components/PublicNavbarClient';
import PublicFooter from '@/components/PublicFooter';


export const metadata = {
  title: 'Landmark Estate - Plateforme immobilière au Maroc',
  description:
    'Découvrez les meilleures propriétés au Maroc sur Landmark Estate. Accompagnement professionnel et service 24/7.',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navbar avec Hamburger Button */}
      <PublicNavbarClient />
      
      {/* Main Content */}
      <main className="min-h-screen">{children}</main>
      <PublicFooter />

    
    </>
  );
}