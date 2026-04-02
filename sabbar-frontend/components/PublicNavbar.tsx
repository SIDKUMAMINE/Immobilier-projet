'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import LandmarkLogo from '@/components/ui/LandmarkLogo';

export default function PublicNavbarClient() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // ✅ Cacher complètement la navbar sur les pages admin
  const isAdminPage = pathname?.startsWith('/dashboard');

  if (isAdminPage) {
    return null;
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const closeDropdownWithDelay = () => {
    setTimeout(() => {
      setOpenDropdown(null);
    }, 100);
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
          {/* Logo avec texte */}
          <Link
            href="/"
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
            {/* Accueil */}
            <Link
              href="/"
              className="px-4 py-2 transition-colors rounded-lg"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#E2C98A',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#C8A96E';
                e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#E2C98A';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={closeDropdown}
            >
              Accueil
            </Link>

            {/* À propos */}
            <Link
              href="/a-propos"
              className="px-4 py-2 transition-colors rounded-lg"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#E2C98A',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#C8A96E';
                e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#E2C98A';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={closeDropdown}
            >
              À propos
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="px-4 py-2 flex items-center gap-1 transition-colors rounded-lg"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  color: openDropdown === 'services' ? '#C8A96E' : '#E2C98A',
                  backgroundColor: openDropdown === 'services' ? 'rgba(200, 169, 110, 0.1)' : 'transparent',
                }}
                onClick={() => toggleDropdown('services')}
                onMouseEnter={(e) => {
                  if (openDropdown !== 'services') {
                    e.currentTarget.style.color = '#C8A96E';
                    e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (openDropdown !== 'services') {
                    e.currentTarget.style.color = '#E2C98A';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Services
                <ChevronDown
                  size={16}
                  style={{
                    transition: 'transform 0.3s ease',
                    transform: openDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
              {openDropdown === 'services' && (
                <div
                  className="absolute top-16 left-0 rounded-lg shadow-lg py-2 w-48 border z-50"
                  style={{
                    backgroundColor: '#162D4F',
                    borderColor: 'rgba(200, 169, 110, 0.3)',
                  }}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href="/services/intermediations"
                    className="block px-4 py-2 transition-colors"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontSize: '14px',
                      color: '#E2C98A',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)';
                      e.currentTarget.style.color = '#C8A96E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#E2C98A';
                    }}
                    onClick={closeDropdownWithDelay}
                  >
                    Intermédiations
                  </Link>
                  <Link
                    href="/services/commercialisation"
                    className="block px-4 py-2 transition-colors"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontSize: '14px',
                      color: '#E2C98A',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)';
                      e.currentTarget.style.color = '#C8A96E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#E2C98A';
                    }}
                    onClick={closeDropdownWithDelay}
                  >
                    Commercialisation
                  </Link>
                </div>
              )}
            </div>

            {/* Projets Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('projects')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="px-4 py-2 flex items-center gap-1 transition-colors rounded-lg"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  color: openDropdown === 'projects' ? '#C8A96E' : '#E2C98A',
                  backgroundColor: openDropdown === 'projects' ? 'rgba(200, 169, 110, 0.1)' : 'transparent',
                }}
                onClick={() => toggleDropdown('projects')}
                onMouseEnter={(e) => {
                  if (openDropdown !== 'projects') {
                    e.currentTarget.style.color = '#C8A96E';
                    e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (openDropdown !== 'projects') {
                    e.currentTarget.style.color = '#E2C98A';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Projets
                <ChevronDown
                  size={16}
                  style={{
                    transition: 'transform 0.3s ease',
                    transform: openDropdown === 'projects' ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
              {openDropdown === 'projects' && (
                <div
                  className="absolute top-16 left-0 rounded-lg shadow-lg py-2 w-48 border z-50"
                  style={{
                    backgroundColor: '#162D4F',
                    borderColor: 'rgba(200, 169, 110, 0.3)',
                  }}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href="/properties"
                    className="block px-4 py-2 transition-colors"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontSize: '14px',
                      color: '#E2C98A',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)';
                      e.currentTarget.style.color = '#C8A96E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#E2C98A';
                    }}
                    onClick={closeDropdownWithDelay}
                  >
                    Tous les Projets
                  </Link>
                  <Link
                    href="/properties"
                    className="block px-4 py-2 transition-colors"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontSize: '14px',
                      color: '#E2C98A',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)';
                      e.currentTarget.style.color = '#C8A96E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#E2C98A';
                    }}
                    onClick={closeDropdownWithDelay}
                  >
                    Récents
                  </Link>
                </div>
              )}
            </div>

            {/* Blog */}
            <Link
              href="/blog"
              className="px-4 py-2 transition-colors rounded-lg"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#E2C98A',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#C8A96E';
                e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#E2C98A';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={closeDropdown}
            >
              Blog
            </Link>

            {/* Consultation */}
            <Link
              href="/contact"
              className="px-4 py-2 transition-colors rounded-lg"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#E2C98A',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#C8A96E';
                e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#E2C98A';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={closeDropdown}
            >
              Consultation
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="hidden md:block px-6 py-2 font-bold rounded-lg transition-all"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: '#C8A96E',
              color: '#0D1F3C',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E2C98A';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(200, 169, 110, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C8A96E';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={closeDropdown}
          >
            Contactez-nous
          </Link>

          {/* Mobile Hamburger - Hidden on desktop */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{
              color: '#C8A96E',
              backgroundColor: 'rgba(200, 169, 110, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.1)';
            }}
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}