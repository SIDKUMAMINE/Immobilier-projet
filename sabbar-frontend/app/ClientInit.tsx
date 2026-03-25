'use client';

import { ReactNode } from 'react';

export function ClientInit({ children }: { children: ReactNode }) {
  // Aucune initialisation requise au demarrage
  // Les agents et tokens sont initialises on-demand
  
  return <>{children}</>;
}