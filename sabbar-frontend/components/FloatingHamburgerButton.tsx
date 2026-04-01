'use client';

import { usePathname } from 'next/navigation';

export default function FloatingHamburgerButton({ onClick }: { onClick: () => void }) {
  const pathname = usePathname();

  // Ne pas afficher le bouton dans le dashboard
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 z-50 p-3 bg-gradient-to-r from-teal-700 to-teal-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-500 transition-all duration-300 transform hover:scale-110 flex flex-col gap-1.5"
      aria-label="Menu"
    >
      <span className="w-6 h-0.5 bg-white"></span>
      <span className="w-6 h-0.5 bg-white"></span>
      <span className="w-6 h-0.5 bg-white"></span>
    </button>
  );
}