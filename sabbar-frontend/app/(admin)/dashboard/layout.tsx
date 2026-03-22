  'use client';

  import Link from 'next/link';
  import { useRouter, usePathname } from 'next/navigation';
  import { LayoutDashboard, Home, Users, Settings, LogOut, ChevronRight, Building2, MessageSquare } from 'lucide-react';
  import { useState } from 'react';

  const NAV_ITEMS = [
    { label: 'Vue d\'ensemble', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Mes Annonces', href: '/dashboard/properties', icon: Building2 },
    { label: 'Conversations IA', href: '/dashboard/conversations', icon: MessageSquare },
    { label: 'Mes Clients', href: '/dashboard/leads', icon: Users },
    { label: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ];

  export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      router.push('/login');
    };

    return (
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 flex flex-col`}>
          {/* Logo */}
          <div className="px-6 py-6 border-b border-blue-700 flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">SABBAR</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-blue-700 rounded-lg transition"
            >
              <ChevronRight size={18} className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-blue-700/50'
                  }`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <Icon size={18} className="shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bouton Nouvelle annonce */}
          <div className="px-3 py-4 border-t border-blue-700">
            <Link
              href="/dashboard/properties/new"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
              title={!sidebarOpen ? 'Nouvelle annonce' : ''}
            >
              <span className="text-lg">+</span>
              {sidebarOpen && <span>Nouvelle annonce</span>}
            </Link>
          </div>

          {/* Logout */}
          <div className="px-3 py-3 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-blue-100 hover:bg-blue-700/50 rounded-lg transition"
              title="Déconnexion"
            >
              <LogOut size={18} className="shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Tableau de bord immobilier</h2>
            <div className="text-sm text-slate-500">
              Bienvenue, Amine 👋
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }