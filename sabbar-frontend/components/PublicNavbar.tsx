'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function PublicNavbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900 text-white sticky top-0 z-40 border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:text-yellow-400 transition">
            🏠 SABBAR IMMOBILIER
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className="px-4 py-2 hover:text-yellow-400 transition rounded-lg">
              Accueil
            </Link>
            <Link href="/about" className="px-4 py-2 hover:text-yellow-400 transition rounded-lg">
              À propos
            </Link>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="px-4 py-2 flex items-center gap-1 hover:text-yellow-400 transition rounded-lg">
                Services
                <ChevronDown size={16} className={`transition ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'services' && (
                <div className="absolute top-16 left-0 bg-teal-800 rounded-lg shadow-lg py-2 w-48 border border-yellow-500/20">
                  <Link href="/services/intermediation" className="block px-4 py-2 hover:bg-teal-700">
                    Intermédiaton
                  </Link>
                  <Link href="/services/commercialisation" className="block px-4 py-2 hover:bg-teal-700">
                    Commercialisation
                  </Link>
                </div>
              )}
            </div>

            {/* Projects Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('projects')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="px-4 py-2 flex items-center gap-1 hover:text-yellow-400 transition rounded-lg">
                Projets
                <ChevronDown size={16} className={`transition ${openDropdown === 'projects' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'projects' && (
                <div className="absolute top-16 left-0 bg-teal-800 rounded-lg shadow-lg py-2 w-48 border border-yellow-500/20">
                  <Link href="/projects/recent" className="block px-4 py-2 hover:bg-teal-700">
                    Récents
                  </Link>
                  <Link href="/projects/featured" className="block px-4 py-2 hover:bg-teal-700">
                    En Vedette
                  </Link>
                </div>
              )}
            </div>

            <Link href="/blog" className="px-4 py-2 hover:text-yellow-400 transition rounded-lg">
              Blog
            </Link>

            <Link href="/consultation" className="px-4 py-2 hover:text-yellow-400 transition rounded-lg">
              Consultation
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="hidden md:block px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </nav>
  );
}