'use client';

import LandmarkLogo from '@/components/ui/LandmarkLogo';

export default function PublicFooter() {
  return (
    <footer 
      className="py-16 border-t"
      style={{
        background: 'linear-gradient(to bottom, #0D1F3C, #050D1A)',
        borderColor: '#C8A96E',
        color: '#5A5A5A'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LandmarkLogo size="md" />
              <div>
                <span 
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: '300',
                    fontSize: '24px',
                    color: '#F9F5EF'
                  }}
                >
                  Landmark Estate
                </span>
                <p 
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: '500',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: '#C8A96E',
                    margin: '0',
                    letterSpacing: '0.05em'
                  }}
                >
                </p>
              </div>
            </div>
            <p 
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#8A8A8A',
                fontFamily: "'DM Sans', system-ui, sans-serif"
              }}
            >
              Votre partenaire immobilier de confiance pour un accompagnement clair et sécurisé au Maroc.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: '300',
                fontSize: '20px',
                color: '#F9F5EF',
                margin: '0 0 1rem 0'
              }}
            >
              Navigation
            </h4>
            <ul className="space-y-2 text-sm" style={{ listStyle: 'none', padding: '0', margin: '0' }}>
              <li>
                <a 
                  href="/" 
                  style={{
                    color: '#8A8A8A',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C8A96E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8A8A8A';
                  }}
                >
                  Accueil
                </a>
              </li>
              <li>
                <a 
                  href="/properties" 
                  style={{
                    color: '#8A8A8A',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C8A96E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8A8A8A';
                  }}
                >
                  Propriétés
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  style={{
                    color: '#8A8A8A',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C8A96E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8A8A8A';
                  }}
                >
                  À propos
                </a>
              </li>
              <li>
                <a 
                  href="/a-propos" 
                  style={{
                    color: '#8A8A8A',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C8A96E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8A8A8A';
                  }}
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: '300',
                fontSize: '20px',
                color: '#F9F5EF',
                margin: '0 0 1rem 0'
              }}
            >
              Légal
            </h4>
            <ul className="space-y-2 text-sm" style={{ listStyle: 'none', padding: '0', margin: '0' }}>
              <li>
                <a 
                  href="#" 
                  style={{
                    color: '#8A8A8A',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C8A96E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8A8A8A';
                  }}
                >
                  Mentions légales
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  style={{
                    color: '#8A8A8A',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C8A96E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8A8A8A';
                  }}
                >
                  Confidentialité
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  style={{
                    color: '#8A8A8A',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C8A96E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8A8A8A';
                  }}
                >
                  Conditions d'utilisation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: '300',
                fontSize: '20px',
                color: '#F9F5EF',
                margin: '0 0 1rem 0'
              }}
            >
              Contact
            </h4>
            <ul className="space-y-3 text-sm" style={{ listStyle: 'none', padding: '0', margin: '0' }}>
              <li className="flex gap-2">
                <span style={{ color: '#C8A96E', fontSize: '16px' }}>📧</span>
                <a 
                  href="mailto:Landmarkestate3@gmail.com" 
                  style={{
                    color: '#8A8A8A',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C8A96E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8A8A8A';
                  }}
                >
                  Landmarkestate3@gmail.com
                </a>
              </li>
              <li className="flex gap-2">
                <span style={{ color: '#C8A96E', fontSize: '16px' }}>💬</span>
                <a 
                  href="https://wa.me/212605585720" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#8A8A8A',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C8A96E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8A8A8A';
                  }}
                >
                  +212 6 05 58 57 20
                </a>
              </li>
              <li className="flex gap-2">
                <span style={{ color: '#C8A96E', fontSize: '16px' }}>📍</span>
                <span style={{ color: '#8A8A8A', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', fontWeight: '400' }}>
                  Casablanca, Maroc
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(200, 169, 110, 0.2)', margin: '2rem 0' }}></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs" style={{ color: '#5A5A5A', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          <p style={{ margin: '0', fontSize: '12px', fontWeight: '400' }}>&copy; 2026 LANDMARK ESTATE. Tous droits réservés.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/profile.php?id=61580887480793" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded transition"
              style={{
                color: '#C8A96E',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'color 0.3s ease, background-color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Facebook
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/mohamedimmobilier12?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded transition"
              style={{
                color: '#C8A96E',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'color 0.3s ease, background-color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Instagram
            </a>

            {/* TikTok */}
            <a 
              href="https://l.instagram.com/?u=https%3A%2F%2Fwww.tiktok.com%2F%40immohamed122%3F_t%3DZS-90KVLRYYHDk%26_r%3D1%26fbclid%3DPAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnI1WgdmSYHgdBgWnAl2kWzGvoLazbMyZbT6w-0QWdP6B6Tqa6xjiqkm8Iqqo_aem_qSPOZN5pgQvvUOCR-FvtfQ&e=AT5rpQ7gK5kN_HRFxYuFyP6rawoBJKMj_UMqQJVh9KE_MfXUSItnVkB4bHDFHVI_YipesN-cOvw2k9ZEnFNTmsHkovya3vC-K5iTDPA_6w" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded transition"
              style={{
                color: '#C8A96E',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'color 0.3s ease, background-color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              TikTok
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/mohammed-amine-rakehi-b140402a5/" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded transition"
              style={{
                color: '#C8A96E',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'color 0.3s ease, background-color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}