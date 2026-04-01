'use client';

import { usePathname } from 'next/navigation';
import { X, MapPin, Phone, Mail, Send, Facebook, Instagram, Youtube, Music } from 'lucide-react';
import { useState } from 'react';
import LandmarkLogo from '@/components/ui/LandmarkLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PublicSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // ✅ Cacher le sidebar sur les pages admin/dashboard
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

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

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 backdrop-blur-sm" 
          onClick={onClose}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed right-0 top-0 h-screen w-full sm:w-[420px] z-50 transform transition-transform duration-300 overflow-hidden flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ backgroundColor: '#F9F5EF' }}
      >
        
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-12 dm-sans">
          
          {/* Logo with text */}
          <div className="text-center mt-8 flex flex-col items-center gap-4">
            <LandmarkLogo size="md" />
            <h2 className="cormorant-display text-4xl font-bold" style={{ color: '#0D1F3C' }}>
              LANDMARK ESTATE
            </h2>
            <div className="h-1 w-20" style={{
              background: 'linear-gradient(to right, #0D1F3C, #C8A96E)'
            }}></div>
          </div>

          {/* Brand Description */}
          <div className="text-center">
            <p className="text-sm leading-relaxed" style={{ color: '#5A5A5A' }}>
              Votre partenaire immobilier de confiance pour un accompagnement clair et sécurisé au Maroc. Intermédiaton et commercialisation de qualité.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="cormorant-title text-2xl font-semibold mb-6" style={{ color: '#0D1F3C' }}>
              Nous Contacter
            </h3>
            <div className="space-y-5">
              
              {/* Address */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg" style={{
                    background: 'linear-gradient(to bottom right, rgba(200, 169, 110, 0.15), rgba(200, 169, 110, 0.05))'
                  }}>
                    <MapPin size={20} style={{ color: '#0D1F3C' }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#0D1F3C' }}>Adresse</p>
                  <p className="text-sm mt-1" style={{ color: '#5A5A5A' }}>Casablanca, Maroc</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg" style={{
                    background: 'linear-gradient(to bottom right, rgba(200, 169, 110, 0.2), rgba(200, 169, 110, 0.08))'
                  }}>
                    <Phone size={20} style={{ color: '#C8A96E' }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#0D1F3C' }}>Téléphone</p>
                  <a href="tel:+212605585720" className="text-sm mt-1 transition-colors hover:font-semibold" style={{ color: '#0D1F3C' }}>
                    +212 6 05 58 57 20
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg" style={{
                    background: 'linear-gradient(to bottom right, rgba(181, 87, 58, 0.15), rgba(181, 87, 58, 0.05))'
                  }}>
                    <Mail size={20} style={{ color: '#B5573A' }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#0D1F3C' }}>Email</p>
                  <a href="mailto:Landmarkestate3@gmail.com" className="text-sm mt-1 transition-colors hover:font-semibold" style={{ color: '#0D1F3C' }}>
                    Landmarkestate3@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="cormorant-title text-2xl font-semibold mb-4" style={{ color: '#0D1F3C' }}>
              Inscrivez-vous
            </h3>
            <p className="text-sm mb-4" style={{ color: '#5A5A5A' }}>
              Soyez informés de nos projets exclusifs et offres spéciales
            </p>
            
            {!subscribed ? (
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email" 
                  className="flex-1 px-4 py-3 border-2 rounded-lg text-sm focus:outline-none transition dm-sans"
                  style={{
                    borderColor: '#D4D4D4',
                    color: '#0D1F3C',
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0D1F3C';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D4D4D4';
                  }}
                />
                <button 
                  onClick={() => {
                    if (email) {
                      setSubscribed(true);
                      setTimeout(() => setSubscribed(false), 3000);
                    }
                  }}
                  className="px-4 py-3 text-white rounded-lg hover:opacity-90 transition font-semibold"
                  style={{
                    backgroundColor: '#0D1F3C'
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            ) : (
              <div className="px-4 py-3 border-2 rounded-lg text-center" style={{
                backgroundColor: 'rgba(200, 169, 110, 0.08)',
                borderColor: '#C8A96E'
              }}>
                <p className="text-sm font-semibold" style={{ color: '#0D1F3C' }}>✓ Merci d'être inscrit !</p>
              </div>
            )}
          </div>

          {/* Social Media */}
          <div>
            <h3 className="cormorant-title text-2xl font-semibold mb-6" style={{ color: '#0D1F3C' }}>
              Suivez-nous
            </h3>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61580887480793&ref=FB_PL_BIDIRECTIONAL_ig_profile_ac" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg transition text-white"
                style={{
                  background: 'linear-gradient(to bottom right, rgba(13, 31, 60, 0.1), rgba(13, 31, 60, 0.05))',
                  color: '#0D1F3C'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0D1F3C';
                  e.currentTarget.style.color = '#F9F5EF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'linear-gradient(to bottom right, rgba(13, 31, 60, 0.1), rgba(13, 31, 60, 0.05))';
                  e.currentTarget.style.color = '#0D1F3C';
                }}
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/mohamedimmobilier12?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg transition text-white"
                style={{
                  background: 'linear-gradient(to bottom right, rgba(13, 31, 60, 0.1), rgba(13, 31, 60, 0.05))',
                  color: '#0D1F3C'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0D1F3C';
                  e.currentTarget.style.color = '#F9F5EF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'linear-gradient(to bottom right, rgba(13, 31, 60, 0.1), rgba(13, 31, 60, 0.05))';
                  e.currentTarget.style.color = '#0D1F3C';
                }}
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg transition text-white"
                style={{
                  background: 'linear-gradient(to bottom right, rgba(13, 31, 60, 0.1), rgba(13, 31, 60, 0.05))',
                  color: '#0D1F3C'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0D1F3C';
                  e.currentTarget.style.color = '#F9F5EF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'linear-gradient(to bottom right, rgba(13, 31, 60, 0.1), rgba(13, 31, 60, 0.05))';
                  e.currentTarget.style.color = '#0D1F3C';
                }}
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://l.instagram.com/?u=https%3A%2F%2Fwww.tiktok.com%2F%40immohamed122%3F_t%3DZS-90KVLRYYHDk%26_r%3D1%26fbclid%3DPAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn7qVthX3Z_v65h0SRJfjwSf04epCxQjax56C-MaPKnt_bGVdDPj52j8Z1ACA_aem_futsLGC5SbM2JaaCDiIDjw&e=AT4GAxwUlbpA7aqu7meJzW_rFQuXnWATfUvlHsi-u-d7vZzJiS1wd0GIWw_6VlJnSdaDewKeC70Bk5UKwlmL5fPEwKIDzyuAiqhN8MDTkA" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg transition text-white"
                style={{
                  background: 'linear-gradient(to bottom right, rgba(13, 31, 60, 0.1), rgba(13, 31, 60, 0.05))',
                  color: '#0D1F3C'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0D1F3C';
                  e.currentTarget.style.color = '#F9F5EF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'linear-gradient(to bottom right, rgba(13, 31, 60, 0.1), rgba(13, 31, 60, 0.05))';
                  e.currentTarget.style.color = '#0D1F3C';
                }}
              >
                <Music size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer - Copyright Only */}
        <div className="border-t-2 px-8 py-8 text-center flex-shrink-0 dm-sans" style={{
          borderColor: '#E0E0E0',
          backgroundColor: 'rgba(13, 31, 60, 0.03)'
        }}>
          <div className="h-1 w-16 mx-auto mb-4" style={{
            background: 'linear-gradient(to right, #0D1F3C, #C8A96E)'
          }}></div>
          <p className="text-xs" style={{ color: '#5A5A5A' }}>© 2026 LANDMARK ESTATE</p>
          <p className="text-xs mt-1" style={{ color: '#8A8A8A' }}>Tous droits réservés</p>
        </div>
      </aside>

      {/* Bouton X Flottant - EN CERCLE */}
      {isOpen && (
        <button
          onClick={onClose}
          className="fixed top-8 right-8 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
          style={{
            backgroundColor: '#F9F5EF',
            border: '2px solid #0D1F3C'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E2C98A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F9F5EF';
          }}
          aria-label="Fermer"
        >
          <X size={32} style={{ color: '#0D1F3C' }} strokeWidth={2.5} />
        </button>
      )}
    </>
  );
}