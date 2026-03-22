'use client';

import { useState } from 'react';
import PublicNavbar from '@/components/PublicNavbar';
import PublicSidebar from '@/components/PublicSidebar';
import FloatingHamburgerButton from '@/components/FloatingHamburgerButton';

export default function PublicNavbarClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <PublicNavbar />
      <PublicSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
       {!sidebarOpen && <FloatingHamburgerButton onClick={() => setSidebarOpen(true)} />}    </>
  );
}