'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, X, Menu } from 'lucide-react';
import { useState } from 'react';
import LandmarkLogo from '@/components/ui/LandmarkLogo';

export default function PublicNavbarClient() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ AJOUTÉ

  const isAdminPage = pathname?.startsWith('/dashboard');
  if (isAdminPage) return null;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav
      className="sticky top-0 z-40 border-b"
      style={{
        background: 'linear-gradient(to right, #0D1F3C, #162D4F, #0D1F3C)',
        borderColor: 'rgba(200, 169, 110, 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 font-bold transition-colors hover:text-[#C8A96E]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: '22px',
              color: '#F9F5EF',
            }}
          >
            <LandmarkLogo size="sm" />
            LANDMARK ESTATE
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">

            <Link href="/" className="px-4 py-2 transition-colors rounded-lg" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', fontWeight: 500, color: '#E2C98A' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#C8A96E'; e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#E2C98A'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >Accueil</Link>

            <Link href="/a-propos" className="px-4 py-2 transition-colors rounded-lg" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', fontWeight: 500, color: '#E2C98A' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#C8A96E'; e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#E2C98A'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >À propos</Link>

            {/* Services Dropdown */}
            <div className="relative" onMouseEnter={() => setOpenDropdown('services')} onMouseLeave={() => setOpenDropdown(null)}>
              <button className="px-4 py-2 flex items-center gap-1 transition-colors rounded-lg"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', fontWeight: 500, color: openDropdown === 'services' ? '#C8A96E' : '#E2C98A', backgroundColor: openDropdown === 'services' ? 'rgba(200, 169, 110, 0.1)' : 'transparent' }}
              >
                Services
                <ChevronDown size={16} style={{ transition: 'transform 0.3s ease', transform: openDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {openDropdown === 'services' && (
                <div className="absolute top-full left-0 rounded-lg shadow-lg py-2 w-48 border z-50 mt-0" style={{ backgroundColor: '#162D4F', borderColor: 'rgba(200, 169, 110, 0.3)' }}>
                  <Link href="/services/intermediations" className="block px-4 py-2 transition-colors" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', color: '#E2C98A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)'; e.currentTarget.style.color = '#C8A96E'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E2C98A'; }}
                  >Intermédiation</Link>
                  <Link href="/services/commercialisation" className="block px-4 py-2 transition-colors" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', color: '#E2C98A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)'; e.currentTarget.style.color = '#C8A96E'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E2C98A'; }}
                  >Commercialisation</Link>
                </div>
              )}
            </div>

            {/* Projets Dropdown */}
            <div className="relative" onMouseEnter={() => setOpenDropdown('projects')} onMouseLeave={() => setOpenDropdown(null)}>
              <button className="px-4 py-2 flex items-center gap-1 transition-colors rounded-lg"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', fontWeight: 500, color: openDropdown === 'projects' ? '#C8A96E' : '#E2C98A', backgroundColor: openDropdown === 'projects' ? 'rgba(200, 169, 110, 0.1)' : 'transparent' }}
              >
                Projets
                <ChevronDown size={16} style={{ transition: 'transform 0.3s ease', transform: openDropdown === 'projects' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {openDropdown === 'projects' && (
                <div className="absolute top-full left-0 rounded-lg shadow-lg py-2 w-48 border z-50 mt-0" style={{ backgroundColor: '#162D4F', borderColor: 'rgba(200, 169, 110, 0.3)' }}>
                  <Link href="/properties" className="block px-4 py-2 transition-colors" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', color: '#E2C98A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)'; e.currentTarget.style.color = '#C8A96E'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E2C98A'; }}
                  >Tous les Projets</Link>
                  <Link href="/properties" className="block px-4 py-2 transition-colors" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', color: '#E2C98A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)'; e.currentTarget.style.color = '#C8A96E'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E2C98A'; }}
                  >Récents</Link>
                </div>
              )}
            </div>

            <Link href="/blog" className="px-4 py-2 transition-colors rounded-lg" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', fontWeight: 500, color: '#E2C98A' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#C8A96E'; e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#E2C98A'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >Blog</Link>

            <Link href="/calculateur-roi" className="px-4 py-2 transition-colors rounded-lg" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', fontWeight: 500, color: '#E2C98A' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#C8A96E'; e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#E2C98A'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >ROI</Link>

            <Link href="/estimation" className="px-4 py-2 transition-colors rounded-lg" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', fontWeight: 500, color: '#E2C98A' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#C8A96E'; e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#E2C98A'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >Estimation</Link>
          </div>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden md:block px-6 py-2 font-bold rounded-lg transition-all"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', fontWeight: 500, backgroundColor: '#C8A96E', color: '#0D1F3C', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E2C98A'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(200, 169, 110, 0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#C8A96E'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Contactez-nous
          </Link>

          {/* ✅ Mobile Hamburger — maintenant connecté à l'état */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Ouvrir le menu"
            style={{ color: '#C8A96E', backgroundColor: 'rgba(200, 169, 110, 0.1)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ✅ MENU MOBILE — complètement nouveau */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'linear-gradient(to bottom, #162D4F, #0D1F3C)',
            borderTop: '1px solid rgba(200, 169, 110, 0.2)',
            padding: '16px 0 24px',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-1">

            {/* Liens simples */}
            {[
              { href: '/', label: 'Accueil' },
              { href: '/a-propos', label: 'À propos' },
              { href: '/blog', label: 'Blog' },
              { href: '/calculateur-roi', label: 'ROI' },
              { href: '/estimation', label: 'Estimation' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobileMenu}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  color: '#E2C98A',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '15px',
                  fontWeight: 500,
                  borderRadius: 10,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {label}
              </Link>
            ))}

            {/* Services accordion mobile */}
            <div>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  color: '#E2C98A',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '15px',
                  fontWeight: 500,
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                Services
                <ChevronDown size={16} style={{ transform: openDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
              </button>
              {openDropdown === 'services' && (
                <div style={{ paddingLeft: 16 }}>
                  <Link href="/services/intermediations" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 16px', color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', borderLeft: '2px solid rgba(200,169,110,0.4)' }}>Intermédiation</Link>
                  <Link href="/services/commercialisation" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 16px', color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', borderLeft: '2px solid rgba(200,169,110,0.4)' }}>Commercialisation</Link>
                </div>
              )}
            </div>

            {/* Projets accordion mobile */}
            <div>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'projects' ? null : 'projects')}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  color: '#E2C98A',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '15px',
                  fontWeight: 500,
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                Projets
                <ChevronDown size={16} style={{ transform: openDropdown === 'projects' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
              </button>
              {openDropdown === 'projects' && (
                <div style={{ paddingLeft: 16 }}>
                  <Link href="/properties" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 16px', color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', borderLeft: '2px solid rgba(200,169,110,0.4)' }}>Tous les Projets</Link>
                  <Link href="/properties" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 16px', color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', borderLeft: '2px solid rgba(200,169,110,0.4)' }}>Récents</Link>
                </div>
              )}
            </div>

            {/* CTA mobile */}
            <div style={{ padding: '12px 16px 0' }}>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '14px 24px',
                  backgroundColor: '#C8A96E',
                  color: '#0D1F3C',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRadius: 10,
                  textDecoration: 'none',
                }}
              >
                Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}