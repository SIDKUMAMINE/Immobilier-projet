import React from 'react';
import PublicNavbarClient from '@/components/PublicNavbarClient';

export const metadata = {
  title: 'SABBAR Immobilier - Plateforme immobilière au Maroc',
  description:
    'Découvrez les meilleures propriétés au Maroc sur SABBAR Immobilier. Accompagnement professionnel et service 24/7.',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navbar avec Hamburger Button */}
      <PublicNavbarClient />
      
      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-teal-950 to-black text-gray-300 py-16 border-t border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg
                  className="w-8 h-8 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2.393-7.179A2 2 0 015.416 3h13.168a2 2 0 011.923 1.821L21 12M3 12a9 9 0 0118 0m0 0a9 9 0 00-18 0m9 9v-6m0-6V3m0 0h.01"
                  />
                </svg>
                <div>
                  <span className="font-bold text-white">SABBAR</span>
                  <p className="text-xs text-yellow-400 tracking-widest">IMMOBILIER</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Votre partenaire immobilier de confiance pour un accompagnement clair et sécurisé au Maroc.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:text-yellow-400 transition">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="/properties" className="hover:text-yellow-400 transition">
                    Propriétés
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-yellow-400 transition">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-yellow-400 transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-yellow-400 transition">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition">
                    Conditions d'utilisation
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span>📧</span>
                  <a href="mailto:contact@sabbar.ma" className="hover:text-yellow-400 transition">
                    contact@sabbar.ma
                  </a>
                </li>
                <li className="flex gap-2">
                  <span>📞</span>
                  <a href="tel:+212561511251" className="hover:text-yellow-400 transition">
                    +212 5 61 51 12 51
                  </a>
                </li>
                <li className="flex gap-2">
                  <span>📍</span>
                  <span>Casablanca, Maroc</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-yellow-500/20 my-8"></div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
            <p>&copy; 2026 SABBAR Immobilier. Tous droits réservés.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-yellow-400 transition">
                Facebook
              </a>
              <a href="#" className="hover:text-yellow-400 transition">
                Instagram
              </a>
              <a href="#" className="hover:text-yellow-400 transition">
                TikTok
              </a>
              <a href="#" className="hover:text-yellow-400 transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}