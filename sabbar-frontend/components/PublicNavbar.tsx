'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, X, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import LandmarkLogo from '@/components/ui/LandmarkLogo';

export default function PublicNavbarClient() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isAdminPage = pathname?.startsWith('/dashboard');
  if (isAdminPage) return null;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const NAV_LINKS = [
    { href: '/', label: 'Accueil' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/Blog', label: 'Blog' },
    { href: '/calculateur-roi', label: 'ROI' },
    { href: '/estimation', label: 'Estimation' },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'linear-gradient(to right, #0D1F3C, #162D4F, #0D1F3C)',
        borderBottom: '1px solid rgba(200, 169, 110, 0.2)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 80, gap: 16 }}>

          {/* ── MOBILE : hamburger à GAUCHE ── */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: 46,
                height: 46,
                borderRadius: 10,
                border: '1.5px solid rgba(200,169,110,0.4)',
                backgroundColor: mobileMenuOpen ? 'rgba(200,169,110,0.2)' : 'rgba(200,169,110,0.1)',
                color: '#C8A96E',
                cursor: 'pointer',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none' as any,
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}

          {/* ── Logo — centré sur mobile, à gauche sur desktop ── */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: 22,
              color: '#F9F5EF',
              textDecoration: 'none',
              // Sur mobile : centrer le logo dans l'espace restant
              flex: isMobile ? 1 : 'none',
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
          >
            <LandmarkLogo size="sm" />
            LANDMARK ESTATE
          </Link>

          {/* ── DESKTOP : liens du milieu ── */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ padding: '8px 14px', color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C8A96E'; e.currentTarget.style.backgroundColor = 'rgba(200,169,110,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#E2C98A'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {label}
                </Link>
              ))}

              {/* Services dropdown */}
              <div style={{ position: 'relative' }} onMouseEnter={() => setOpenDropdown('services')} onMouseLeave={() => setOpenDropdown(null)}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', color: openDropdown === 'services' ? '#C8A96E' : '#E2C98A', backgroundColor: openDropdown === 'services' ? 'rgba(200,169,110,0.1)' : 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                  Services
                  <ChevronDown size={15} style={{ transition: 'transform 0.3s', transform: openDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                {openDropdown === 'services' && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#162D4F', border: '1px solid rgba(200,169,110,0.3)', borderRadius: 10, padding: '8px 0', width: 200, zIndex: 50 }}>
                    {[{ href: '/services/intermediations', label: 'Intermédiation' }, { href: '/services/commercialisation', label: 'Commercialisation' }].map(({ href, label }) => (
                      <Link key={href} href={href} style={{ display: 'block', padding: '10px 16px', color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(200,169,110,0.15)'; e.currentTarget.style.color = '#C8A96E'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E2C98A'; }}
                      >{label}</Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Projets dropdown */}
              <div style={{ position: 'relative' }} onMouseEnter={() => setOpenDropdown('projects')} onMouseLeave={() => setOpenDropdown(null)}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', color: openDropdown === 'projects' ? '#C8A96E' : '#E2C98A', backgroundColor: openDropdown === 'projects' ? 'rgba(200,169,110,0.1)' : 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                  Projets
                  <ChevronDown size={15} style={{ transition: 'transform 0.3s', transform: openDropdown === 'projects' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                {openDropdown === 'projects' && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#162D4F', border: '1px solid rgba(200,169,110,0.3)', borderRadius: 10, padding: '8px 0', width: 200, zIndex: 50 }}>
                    {[{ href: '/properties', label: 'Tous les Projets' }, { href: '/properties?filter=recent', label: 'Récents' }].map(({ href, label }) => (
                      <Link key={href} href={href} style={{ display: 'block', padding: '10px 16px', color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(200,169,110,0.15)'; e.currentTarget.style.color = '#C8A96E'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E2C98A'; }}
                      >{label}</Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── DESKTOP : CTA à droite ── */}
          {!isMobile && (
            <Link
              href="/contact"
              style={{ flexShrink: 0, padding: '10px 22px', backgroundColor: '#C8A96E', color: '#0D1F3C', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 8, textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E2C98A'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(200,169,110,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C8A96E'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Contactez-nous
            </Link>
          )}

          {/* ── MOBILE : espace vide à droite pour équilibrer le hamburger à gauche ── */}
          {isMobile && <div style={{ width: 46, flexShrink: 0 }} />}

        </div>
      </div>

      {/* ══════════════════════════════════════
          MENU MOBILE DÉROULANT
      ══════════════════════════════════════ */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            background: 'linear-gradient(180deg, #162D4F 0%, #0D1F3C 100%)',
            borderTop: '1px solid rgba(200,169,110,0.15)',
            padding: '8px 16px 24px',
          }}
        >
          {/* Liens simples */}
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMobileMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 14px',
                color: '#E2C98A',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                borderRadius: 10,
                textDecoration: 'none',
                borderBottom: '1px solid rgba(200,169,110,0.08)',
              }}
            >
              {label}
            </Link>
          ))}

          {/* Services accordion */}
          <div style={{ borderBottom: '1px solid rgba(200,169,110,0.08)' }}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 14px', color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, background: 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer' }}
            >
              Services
              <ChevronDown size={16} style={{ color: '#C8A96E', transform: openDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </button>
            {openDropdown === 'services' && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                <Link href="/services/intermediations" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 14px', color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontSize: 14, textDecoration: 'none', borderLeft: '2px solid rgba(200,169,110,0.4)' }}>Intermédiation</Link>
                <Link href="/services/commercialisation" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 14px', color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontSize: 14, textDecoration: 'none', borderLeft: '2px solid rgba(200,169,110,0.4)' }}>Commercialisation</Link>
              </div>
            )}
          </div>

          {/* Projets accordion */}
          <div style={{ borderBottom: '1px solid rgba(200,169,110,0.08)' }}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'projects' ? null : 'projects')}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 14px', color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, background: 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer' }}
            >
              Projets
              <ChevronDown size={16} style={{ color: '#C8A96E', transform: openDropdown === 'projects' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </button>
            {openDropdown === 'projects' && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                <Link href="/properties" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 14px', color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontSize: 14, textDecoration: 'none', borderLeft: '2px solid rgba(200,169,110,0.4)' }}>Tous les Projets</Link>
                <Link href="/properties?filter=recent" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 14px', color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontSize: 14, textDecoration: 'none', borderLeft: '2px solid rgba(200,169,110,0.4)' }}>Récents</Link>
              </div>
            )}
          </div>

          {/* CTA doré */}
          <div style={{ paddingTop: 20 }}>
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '15px 24px',
                backgroundColor: '#C8A96E',
                color: '#0D1F3C',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}