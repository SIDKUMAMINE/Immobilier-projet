'use client';

import { useEffect, useState } from 'react';

export default function StatsSection() {
  const [counts, setCounts] = useState({
    properties: 0,
    customers: 0,
    cities: 0,
    years: 0
  });

  useEffect(() => {
    // Animation des compteurs
    const interval = setInterval(() => {
      setCounts(prev => ({
        properties: Math.min(prev.properties + 50, 500),
        customers: Math.min(prev.customers + 100, 5000),
        cities: Math.min(prev.cities + 1, 15),
        years: Math.min(prev.years + 1, 10)
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'Propriétés',
      value: '500+',
      icon: '🏠'
    },
    {
      label: 'Clients Satisfaits',
      value: '5,000+',
      icon: '😊'
    },
    {
      label: 'Villes Couvertes',
      value: '15+',
      icon: '🌍'
    },
    {
      label: 'Années d\'Expérience',
      value: '10+',
      icon: '⭐'
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-r from-sabbar-900 via-sabbar-800 to-sabbar-900 border-y border-turquoise-500/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nos Statistiques
          </h2>
          <p className="text-xl text-gray-300">
            Des chiffres qui parlent de notre succès
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-sabbar-800/50 border border-turquoise-500/30 rounded-xl p-8 text-center hover:border-turquoise-500/60 transition-all duration-300 group hover:bg-sabbar-800/70 hover:shadow-xl hover:shadow-turquoise-500/10"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="mb-4">
                <p className="text-4xl md:text-5xl font-bold text-turquoise-500 mb-2">
                  {stat.value}
                </p>
                <h3 className="text-lg font-semibold text-gray-200">
                  {stat.label}
                </h3>
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-turquoise-600 to-turquoise-500 rounded-full mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez des milliers de clients satisfaits qui ont trouvé leur bien immobilier idéal
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-turquoise-600 to-turquoise-500 hover:from-turquoise-500 hover:to-turquoise-400 text-white font-bold rounded-lg transition-all transform hover:scale-105"
          >
            Commencer Votre Recherche
          </a>
        </div>
      </div>
    </section>
  );
}