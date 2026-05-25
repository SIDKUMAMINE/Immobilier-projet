'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

export default function FloatingHamburgerButton({ onClick }: { onClick: () => void }) {
  const pathname = usePathname();

  // Ne pas afficher le bouton dans le dashboard
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      aria-label="Menu"
      style={{
        position: 'fixed',
        top: '20px',
        right: '16px',
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        border: '1.5px solid rgba(200,169,110,0.4)',
        backgroundColor: 'rgba(13, 31, 60, 0.9)',
        color: '#C8A96E',
        cursor: 'pointer',
        outline: 'none',
        backdropFilter: 'blur(8px)',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      <Menu size={20} />
    </button>
  );
}