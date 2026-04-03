'use client';

import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      icon: '🤝',
      title: 'Intermédiations Immobilière',
      subtitle: 'Accompagnement complet pour vos transactions',
      description: 'Accès à un large portefeuille de propriétés, négociation professionnelle, conseil personnalisé et gestion complète de votre dossier administratif.',
      link: '/services/intermediations'
    },
    {
      id: 2,
      icon: '💼',
      title: 'Commercialisation & Marketing',
      subtitle: 'Stratégie marketing pour valoriser votre bien',
      description: 'Photographie professionnelle, vidéos HD, publication multi-canaux et stratégie pour vendre rapidement votre propriété.',
      link: '/services/commercialisation'
    }
  ];

  return (
    <main className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 border-b border-amber-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-amber-900/10"></div>
        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Nos Services
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Deux solutions complètes et complémentaires pour tous vos besoins immobiliers
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900 border border-amber-600/20 hover:border-amber-600/50 rounded-2xl p-8 transition-all duration-300 group hover:shadow-lg hover:shadow-amber-600/10"
              >
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{service.icon}</div>

                {/* Title & Subtitle */}
                <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">
                  {service.title}
                </h2>
                <p className="text-amber-500 text-sm font-semibold mb-4">{service.subtitle}</p>

                {/* Description */}
                <p className="text-gray-300 mb-8 leading-relaxed">
                  {service.description}
                </p>

                {/* CTA Button */}
                <Link
                  href={service.link}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all duration-300 group/btn"
                >
                  Découvrir
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* CTA Final */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 
            className="mb-6"
            style={{
              fontSize: '48px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              color: '#F9F5EF'
            }}
          >
            Prêt à Transformer <span style={{ color: '#C8A96E' }}>Votre Projet</span>?
          </h2>
          <p 
            className="mb-8"
            style={{
              color: '#8A9BB0',
              fontSize: '16px',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400,
              lineHeight: '1.7'
            }}
          >
            Contactez-nous pour une consultation gratuite et découvrez comment notre stratégie peut transformer votre projet en succès de marché.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)',
                color: '#0D1F3C',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(200, 169, 110, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Demander une Consultation <ArrowRight size={18} />
            </Link>
            <a
              href="tel:+212605585720"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 whitespace-nowrap"
              style={{
                border: '2px solid #C8A96E',
                color: '#C8A96E',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 500,
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#C8A96E';
                e.currentTarget.style.color = '#0D1F3C';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#C8A96E';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Phone size={18} />
              <span>+212 6 05 58 57 20</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}