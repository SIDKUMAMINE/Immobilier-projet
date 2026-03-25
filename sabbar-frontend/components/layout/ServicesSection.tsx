'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: '🤝',
      title: 'Intermédiations Immobilière',
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
      icon: '💼',
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
    <section className="bg-gradient-to-b from-[#0D1F3C] to-[#0A1629] py-24 px-[5%]" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;600&display=swap');
        
        .cormorant-display {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
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

      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="cormorant-display text-6xl md:text-7xl text-white mb-6">
            Nos <span style={{ color: '#C8A96E' }}>Services</span>
          </h2>

          <p className="dm-sans text-lg text-[#A8A8A8] max-w-3xl mx-auto leading-relaxed">
            Solutions immobilières complètes et adaptées à vos besoins, combinant expertise traditionnelle et technologies modernes
          </p>
        </div>

        {/* Services Grid - 2 COLONNES CÔTE À CÔTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="rounded-lg p-12 transition-all duration-300 group"
              style={{
                backgroundColor: 'rgba(13, 31, 60, 0.5)',
                border: '1px solid rgba(200, 169, 110, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(200, 169, 110, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Icon */}
              <div className="text-5xl mb-6 transition-transform group-hover:scale-110">{service.icon}</div>

              {/* Title */}
              <h3 className="cormorant-display text-4xl text-white mb-4 transition-colors" style={{ color: '#F9F5EF' }}>
                {service.title}
              </h3>

              {/* Description BRÈVE */}
              <p className="dm-sans text-base text-[#A8A8A8] mb-8 leading-relaxed">{service.description}</p>

              {/* Features - 6 items */}
              <div className="space-y-3 mb-8">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="flex-shrink-0 mt-1" style={{ color: '#C8A96E' }} />
                    <span className="dm-sans text-sm text-[#A8A8A8]">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button - LIEN DIRECT VERS SOUS-PAGE */}
              <Link
                href={service.link}
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-300 dm-sans"
                style={{
                  border: '1px solid #C8A96E',
                  color: '#C8A96E',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#C8A96E';
                  e.currentTarget.style.color = '#0D1F3C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#C8A96E';
                }}
              >
                En savoir plus
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
