'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: '🤝',
      title: 'Intermédiation Immobilière',
      description: 'Accompagnement professionnel pour l\'achat, la vente ou la location de votre bien immobilier.',
      features: [
        'Accès à un large portefeuille de propriétés',
        'Négociation professionnelle et sécurisée',
        'Conseil personnalisé adapté à vos besoins',
        'Gestion complète du dossier administratif',
        'Expertise juridique et fiscale',
        'Suivi post-signature'
      ],
      link: '/services/intermediations'
    },
    {
      icon: '📊',
      title: 'Commercialisation',
      description: 'Stratégie complète pour valoriser et vendre rapidement votre propriété.',
      features: [
        'Photographie et vidéographie professionnelle',
        'Description détaillée et attrayante',
        'Publication sur multiples canaux digitaux',
        'Gestion des visites et des négociations',
        'Rapport mensuel d\'activité',
        'Stratégie de pricing optimisée'
      ],
      link: '/services/commercialisation'
    }
  ];

  return (
    <section 
      id="nos-services"
      className="min-h-screen bg-gradient-to-br from-[#050D1A] via-[#0D1F3C] to-[#1a2847] py-16 md:py-20 px-4 md:px-[5%] relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full pointer-events-none opacity-[0.05]" 
        style={{
          background: 'radial-gradient(circle, rgba(200, 169, 110, 0.1) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite'
        }} />

      {/* Header */}
      <div className="text-center mb-12 md:mb-20 relative z-10">
        <h2 
          className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300
          }}
        >
          Nos{' '}
          <span className="bg-gradient-to-r from-[#C8A96E] to-[#E2C98A] bg-clip-text text-transparent">
            Services
          </span>
        </h2>
        <p 
          className="text-base md:text-lg text-[#8A9BB0] max-w-[600px] mx-auto px-4"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400
          }}
        >
          Solutions immobilières complètes et adaptées à vos besoins, combinant expertise traditionnelle et technologies modernes
        </p>
      </div>

      {/* Services Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-[1200px] mx-auto relative z-10">
        {services.map((service, idx) => (
          <div 
            key={idx}
            className="p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:border-[#C8A96E] group cursor-pointer"
            style={{
              background: 'rgba(13, 31, 60, 0.4)',
              border: '1px solid rgba(200, 169, 110, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(13, 31, 60, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)';
              e.currentTarget.style.transform = 'translateY(-10px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(13, 31, 60, 0.4)';
              e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="text-3xl md:text-4xl mb-4 md:mb-6">{service.icon}</div>
            <h3 
              className="text-xl md:text-2xl font-bold text-white mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300
              }}
            >
              {service.title}
            </h3>
            <p 
              className="text-sm md:text-base text-[#8A9BB0] mb-6 md:mb-8"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400
              }}
            >
              {service.description}
            </p>

            <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {service.features.map((feature, featureIdx) => (
                <li key={featureIdx} className="flex items-start gap-3">
                  <span className="text-[#C8A96E] mt-1 flex-shrink-0">✓</span>
                  <span 
                    className="text-xs md:text-sm text-[#8A9BB0]"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 400
                    }}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Bouton "En savoir plus" - FONCTIONNEL */}
            <Link href={service.link}>
              <button 
                className="w-full text-[#C8A96E] border border-[#C8A96E] px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-300 hover:bg-[#C8A96E] hover:text-[#0D1F3C]"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 500
                }}
              >
                En savoir plus →
              </button>
            </Link>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
    </section>
  );
}