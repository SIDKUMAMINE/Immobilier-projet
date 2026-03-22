'use client';

import { X, MapPin, Phone, Mail, Send, Facebook, Instagram, Youtube, Music } from 'lucide-react';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PublicSidebar({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-white z-50 transform transition-transform duration-300 overflow-hidden flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-12">
          
          {/* Logo */}
          <div className="text-center mt-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">SABBAR</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-teal-700 to-yellow-500 mx-auto"></div>
          </div>

          {/* Brand Description */}
          <div className="text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              Votre partenaire immobilier de confiance pour un accompagnement clair et sécurisé au Maroc. Intermédiaton et commercialisation de qualité.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Nous Contacter</h3>
            <div className="space-y-5">
              
              {/* Address */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-teal-100 to-teal-50">
                    <MapPin size={20} className="text-teal-700" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Adresse</p>
                  <p className="text-sm text-gray-600 mt-1">Casablanca, Maroc</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-50">
                    <Phone size={20} className="text-yellow-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Téléphone</p>
                  <a href="tel:+212561511251" className="text-sm text-teal-700 hover:text-teal-800 mt-1">
                    +212 5 61 51 12 51
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50">
                    <Mail size={20} className="text-purple-700" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email</p>
                  <a href="mailto:contact@sabbar.ma" className="text-sm text-teal-700 hover:text-teal-800 mt-1">
                    contact@sabbar.ma
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Inscrivez-vous</h3>
            <p className="text-sm text-gray-600 mb-4">
              Soyez informés de nos projets exclusifs et offres spéciales
            </p>
            
            {!subscribed ? (
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email" 
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-700 transition"
                />
                <button 
                  onClick={() => {
                    if (email) {
                      setSubscribed(true);
                      setTimeout(() => setSubscribed(false), 3000);
                    }
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-teal-700 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-500 transition"
                >
                  <Send size={18} />
                </button>
              </div>
            ) : (
              <div className="px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                <p className="text-sm font-semibold text-green-700">✓ Merci d'être inscrit !</p>
              </div>
            )}
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Suivez-nous</h3>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-700 hover:to-blue-600 hover:text-white transition text-blue-700"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg hover:from-pink-700 hover:to-pink-600 hover:text-white transition text-pink-700"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg hover:from-red-700 hover:to-red-600 hover:text-white transition text-red-700"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:from-gray-700 hover:to-gray-600 hover:text-white transition text-gray-700"
              >
                <Music size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer - Copyright Only */}
        <div className="border-t-2 border-gray-200 bg-gray-50 px-8 py-8 text-center flex-shrink-0">
          <div className="h-1 w-16 bg-gradient-to-r from-teal-700 to-yellow-500 mx-auto mb-4"></div>
          <p className="text-xs text-gray-600">© 2026 SABBAR Immobilier</p>
          <p className="text-xs text-gray-500 mt-1">Tous droits réservés</p>
        </div>
      </aside>

      {/* Bouton X Flottant - EN CERCLE BLANC */}
      {isOpen && (
        <button
          onClick={onClose}
          className="fixed top-8 right-8 z-50 w-14 h-14 rounded-full bg-white border-2 border-gray-900 shadow-lg hover:shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
          aria-label="Fermer"
        >
          <X size={32} className="text-gray-900" strokeWidth={2.5} />
        </button>
      )}
    </>
  );
}