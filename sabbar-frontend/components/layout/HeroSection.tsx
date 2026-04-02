'use client';

import Image from 'next/image';
import heroBuilding from '@/public/images/cities/cdcdc.jpeg';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 px-4 md:px-[5%] min-h-screen flex items-center">
      {/* Background Image with Next.js Image for optimization */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={heroBuilding}
          alt="Building Background"
          fill
          priority
          quality={85}
          className="object-cover object-center"
        />
        
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(13,31,60,0.75)] via-[rgba(13,31,60,0.6)] to-[rgba(13,31,60,0.3)]" />
        
        {/* Additional overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,31,60,0.2)] to-[rgba(13,31,60,0.4)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* MOBILE: Column layout | DESKTOP: Row layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-12">
          
          {/* Left content */}
          <div className="w-full md:max-w-[55%] animate-slideInLeft">
            <h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight tracking-tighter"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300
              }}
            >
              Transformez Votre{' '}
              <span className="bg-gradient-to-r from-[#C8A96E] to-[#E2C98A] bg-clip-text text-transparent">
                Projet Immobilier
              </span>
            </h1>

            <p 
              className="text-base md:text-lg text-[#8A9BB0] leading-relaxed mb-4 md:mb-6"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400
              }}
            >
              Partenaire immobilier stratégique à Casablanca. Commercialisation exclusive pour promoteurs et intermédiations complètes pour propriétaires et acheteurs.
            </p>

            <p 
              className="text-sm md:text-base text-[#8A9BB0] leading-relaxed mb-6 md:mb-10"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400
              }}
            >
              <span style={{ color: '#C8A96E', fontWeight: 600 }}>40% plus vite.</span> <span style={{ color: '#C8A96E', fontWeight: 600 }}>100% de la valeur.</span> Zéro compromis sur l'excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-8 md:mb-10">
              {/* Bouton Services */}
              <button 
                className="text-[#0D1F3C] px-6 md:px-10 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer w-full sm:w-auto"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)'
                }}
                onClick={() => {
                  const servicesSection = document.getElementById('nos-services');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(200, 169, 110, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Découvrir Nos Services →
              </button>
            </div>

            {/* Stats - Responsive */}
            <div className="flex flex-col sm:flex-row sm:gap-8 md:gap-16 pt-6 md:pt-8 border-t border-[rgba(200,169,110,0.1)]">
              {[
                { number: '50+', label: 'Promoteurs' },
                { number: '25-30', label: 'Transactions/Mois' },
                { number: 'MAD 11.25M', label: 'Revenue Year 1' }
              ].map((stat, idx) => (
                <div key={idx} className="text-left mb-4 sm:mb-0">
                  <div 
                    className="text-2xl md:text-3xl font-bold text-[#C8A96E] mb-1"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 300
                    }}
                  >
                    {stat.number}
                  </div>
                  <div 
                    className="text-xs md:text-xs text-[#8A9BB0] uppercase tracking-widest"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 500
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out;
        }

        /* Responsive background attachment */
        @media (max-width: 768px) {
          section {
            background-attachment: scroll;
          }
        }
      `}</style>
    </section>
  );
}