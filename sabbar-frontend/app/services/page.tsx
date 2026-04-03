'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
      <section className="py-24 px-4 bg-gradient-to-r from-amber-900/20 via-black to-black border-t border-amber-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-400">
            Contactez-nous dès aujourd'hui pour une consultation gratuite et découvrez comment nous pouvons vous aider.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/contact">
              <button className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105">
                Nous contacter
              </button>
            </Link>
            <a href="tel:+212605585720">
              <button className="px-8 py-4 border-2 border-amber-600 text-amber-500 hover:text-amber-400 font-bold rounded-lg transition-all duration-300">
               +212 6 05 58 57 20
              </button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}