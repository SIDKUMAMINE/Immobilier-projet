'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, MessageSquare, Users, Settings, LogOut, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Vue d\'ensemble', href: '/dashboard',                    icon: LayoutDashboard },
  { label: 'Mes Annonces',   href: '/dashboard/properties',          icon: Building2 },
  { label: 'Conversations IA', href: '/dashboard/conversations',     icon: MessageSquare },
  { label: 'Mes Clients',    href: '/dashboard/leads',               icon: Users },
  { label: 'Paramètres',     href: '/dashboard/settings',            icon: Settings },
];

const T = {
  navy:      '#0D1F3C',
  navyLight: '#122440',
  navyBorder:'rgba(200,169,110,0.15)',
  gold:      '#C8A96E',
  goldLight: '#E2C98A',
  terra:     '#B5573A',
  ivory:     '#F9F5EF',
  muted:     'rgba(226,201,138,0.5)',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .lm-nav-item { transition: all 0.2s ease; }
        .lm-nav-item:hover { background: rgba(200,169,110,0.1) !important; color: #E2C98A !important; }
        .lm-nav-item.active { background: rgba(200,169,110,0.15) !important; color: #C8A96E !important; border-left: 2px solid #C8A96E; }
        .lm-btn-new:hover { background: linear-gradient(135deg, #E2C98A, #C8A96E) !important; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,169,110,0.3); }
        .lm-logout:hover { background: rgba(181,87,58,0.1) !important; color: #B5573A !important; }
        .lm-content-scroll::-webkit-scrollbar { width: 6px; }
        .lm-content-scroll::-webkit-scrollbar-track { background: transparent; }
        .lm-content-scroll::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.2); border-radius: 3px; }
        .lm-content-scroll::-webkit-scrollbar-thumb:hover { background: rgba(200,169,110,0.4); }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', background: '#F9F5EF', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: open ? '260px' : '72px',
          background: T.navy,
          borderRight: `1px solid ${T.navyBorder}`,
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.3s ease',
          flexShrink: 0,
          position: 'relative',
          boxShadow: '4px 0 24px rgba(13,31,60,0.3)',
        }}>

          {/* Logo */}
          <div style={{
            padding: open ? '28px 24px 24px' : '28px 16px 24px',
            borderBottom: `1px solid ${T.navyBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            {open && (
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 300, color: T.ivory, letterSpacing: '0.12em' }}>
                  LANDMARK
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 500, color: T.gold, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '2px' }}>
                  Estate · Dashboard
                </div>
              </div>
            )}
            {!open && (
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', fontWeight: 300, color: T.gold, letterSpacing: '0.05em', margin: '0 auto' }}>L</div>
            )}
            <button
              onClick={() => setOpen(!open)}
              style={{ background: 'rgba(200,169,110,0.1)', border: `1px solid ${T.navyBorder}`, borderRadius: '8px', padding: '6px', cursor: 'pointer', color: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,169,110,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,169,110,0.1)'; }}
            >
              <ChevronRight size={15} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </button>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: open ? '20px 12px' : '20px 8px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`lm-nav-item${isActive ? ' active' : ''}`}
                  title={!open ? item.label : ''}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: open ? '11px 14px' : '11px',
                    borderRadius: '10px', textDecoration: 'none',
                    color: isActive ? T.gold : T.muted,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px', fontWeight: isActive ? 500 : 400,
                    background: isActive ? 'rgba(200,169,110,0.12)' : 'transparent',
                    borderLeft: isActive ? `2px solid ${T.gold}` : '2px solid transparent',
                    justifyContent: open ? 'flex-start' : 'center',
                  }}
                >
                  <Icon size={17} style={{ flexShrink: 0, color: isActive ? T.gold : T.muted }} />
                  {open && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bouton Nouvelle annonce */}
          <div style={{ padding: open ? '0 12px 12px' : '0 8px 12px', borderTop: `1px solid ${T.navyBorder}`, paddingTop: '12px' }}>
            <Link
              href="/dashboard/properties/new"
              className="lm-btn-new"
              title={!open ? 'Nouvelle annonce' : ''}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', padding: '12px',
                background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldLight} 100%)`,
                color: T.navy, fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px', fontWeight: 600,
                borderRadius: '10px', textDecoration: 'none',
                transition: 'all 0.25s',
                letterSpacing: '0.03em',
              }}
            >
              <Plus size={16} />
              {open && <span>Nouvelle annonce</span>}
            </Link>
          </div>

          {/* Logout */}
          <div style={{ padding: open ? '0 12px 20px' : '0 8px 20px' }}>
            <button
              onClick={handleLogout}
              className="lm-logout"
              title="Déconnexion"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                width: '100%', padding: open ? '10px 14px' : '10px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'rgba(226,201,138,0.4)', fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px', borderRadius: '10px',
                justifyContent: open ? 'flex-start' : 'center',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={16} style={{ flexShrink: 0 }} />
              {open && <span>Déconnexion</span>}
            </button>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.ivory }}>

          {/* Top Bar */}
          <div style={{
            height: '64px', flexShrink: 0,
            background: '#fff',
            borderBottom: '1px solid rgba(200,169,110,0.15)',
            padding: '0 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 1px 8px rgba(13,31,60,0.06)',
          }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 300, color: T.navy, letterSpacing: '0.04em' }}>
              Tableau de bord <span style={{ color: T.gold, fontStyle: 'italic' }}>immobilier</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Badge utilisateur */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', background: 'rgba(13,31,60,0.04)', borderRadius: '100px', border: '1px solid rgba(200,169,110,0.2)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: T.navy, fontFamily: "'Cormorant Garamond', serif" }}>
                  A
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: T.navy }}>
                  Bienvenue, Amine 👋
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lm-content-scroll" style={{ flex: 1, overflowY: 'auto' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}