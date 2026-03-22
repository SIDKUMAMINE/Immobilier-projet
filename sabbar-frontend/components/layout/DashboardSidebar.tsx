'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, BarChart3, Settings, LogOut, Menu, X, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      label: 'Tableau de Bord',
      href: '/dashboard',
      icon: Home,
      active: pathname === '/dashboard'
    },
    {
      label: 'Mes Annonces',
      href: '/dashboard/properties',
      icon: FileText,
      active: pathname.startsWith('/dashboard/properties')
    },
    {
      label: 'Mes Clients',
      href: '/dashboard/leads',
      icon: Users,
      active: pathname === '/dashboard/leads'
    },
    {
      label: 'Statistiques',
      href: '/dashboard/analytics',
      icon: BarChart3,
      active: pathname === '/dashboard/analytics'
    },
    {
      label: 'Paramètres',
      href: '/dashboard/settings',
      icon: Settings,
      active: pathname === '/dashboard/settings'
    }
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center transition-all duration-300"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-black border-r border-amber-600 z-30 transition-all duration-300 transform md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-amber-600/30">
          <Link href="/" className="flex items-center gap-2 group">
            <MapPin size={32} className="text-amber-500" />
            <div>
              <div className="text-white font-bold">Immobilier</div>
              <div className="text-amber-500 text-sm font-semibold">Dashboard</div>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  item.active
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Icon
                  size={20}
                  className={item.active ? 'text-white' : 'group-hover:text-amber-500'}
                />
                <span className="font-medium">{item.label}</span>
                {item.active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-6 h-px bg-gray-800"></div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-amber-600/30">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-all duration-300 group">
            <LogOut size={20} className="group-hover:text-red-500" />
            <span className="font-medium">Déconnexion</span>
          </button>

          {/* User Info */}
          <div className="mt-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Connecté en tant que</p>
            <p className="text-white font-semibold">Mohammed A.</p>
            <p className="text-xs text-gray-400">Agent Immobilier</p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}