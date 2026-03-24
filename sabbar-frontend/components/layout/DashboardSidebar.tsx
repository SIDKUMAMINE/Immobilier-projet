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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;600&display=swap');
        
        .cormorant-display {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
        }
        
        .cormorant-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
        }
        
        .dm-sans {
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        
        .dm-sans-label {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 500;
          font-size: 11px;
          text-transform: uppercase;
        }
      `}</style>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
        style={{
          backgroundColor: '#C8A96E',
          boxShadow: '0 10px 25px rgba(200, 169, 110, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#E2C98A';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#C8A96E';
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 z-30 transition-all duration-300 transform md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(to bottom, #0D1F3C, #0A1629)',
          borderRight: '1px solid rgba(200, 169, 110, 0.15)'
        }}
      >
        {/* Logo */}
        <div 
          className="p-6 border-b"
          style={{
            borderColor: 'rgba(200, 169, 110, 0.15)',
            backgroundColor: 'rgba(200, 169, 110, 0.04)'
          }}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <MapPin 
              size={32} 
              className="transition-colors"
              style={{ color: '#C8A96E' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#E2C98A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#C8A96E';
              }}
            />
            <div>
              <div className="font-bold transition-colors" style={{ color: '#F9F5EF' }}>
                <span className="cormorant-title text-xl">LANDMARK</span>
              </div>
              <div className="dm-sans-label" style={{ color: '#C8A96E' }}>Dashboard</div>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-6 space-y-2 dm-sans">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group"
                style={{
                  backgroundColor: item.active ? '#C8A96E' : 'transparent',
                  color: item.active ? '#0D1F3C' : '#A8A8A8',
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.color = '#F9F5EF';
                    e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.color = '#A8A8A8';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.active && (
                  <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: '#0D1F3C' }}></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div 
          className="mx-6 h-px"
          style={{ backgroundColor: 'rgba(200, 169, 110, 0.15)' }}
        ></div>

        {/* Footer */}
        <div 
          className="absolute bottom-0 left-0 right-0 p-6 border-t"
          style={{
            borderColor: 'rgba(200, 169, 110, 0.15)',
            backgroundColor: 'rgba(200, 169, 110, 0.02)'
          }}
        >
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 text-[#A8A8A8] rounded-lg transition-all duration-300 group dm-sans"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#C8A96E';
              e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A8A8A8';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>

          {/* User Info */}
          <div 
            className="mt-4 p-4 border rounded-lg dm-sans"
            style={{
              backgroundColor: 'rgba(200, 169, 110, 0.04)',
              borderColor: 'rgba(200, 169, 110, 0.15)'
            }}
          >
            <p className="dm-sans-label" style={{ color: '#A8A8A8', marginBottom: '0.25rem' }}>
              Connecté en tant que
            </p>
            <p className="font-semibold" style={{ color: '#F9F5EF' }}>Mohammed A.</p>
            <p className="text-xs" style={{ color: '#A8A8A8' }}>Agent Immobilier</p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        ></div>
      )}
    </>
  );
}