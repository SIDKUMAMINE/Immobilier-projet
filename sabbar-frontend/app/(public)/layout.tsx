
import React from 'react';


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
      
      
      {/* Main Content */}
      <main className="min-h-screen">{children}</main>
 

    
    </>
  );
}