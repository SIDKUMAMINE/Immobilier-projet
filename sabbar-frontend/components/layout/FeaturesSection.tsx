'use client';

import { CheckCircle } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: '🏠',
      title: 'Large Sélection',
      description: 'Accédez à plus de 500 propriétés sélectionnées dans les meilleures locations.'
    },
    {
      icon: '🔍',
      title: 'Recherche Avancée',
      description: 'Filtrez par prix, localisation, type de propriété et bien d\'autres critères.'
    },
    {
      icon: '💬',
      title: 'Support 24/7',
      description: 'Notre équipe est disponible pour répondre à toutes vos questions immobilières.'
    },
    {
      icon: '📱',
      title: 'App Mobile',
      description: 'Consultez les propriétés en déplacement avec notre application mobile intuitive.'
    },
    {
      icon: '🛡️',
      title: 'Transactions Sécurisées',
      description: 'Tous les processus sont transparents et conformes à la loi marocaine.'
    },
    {
      icon: '⭐',
      title: 'Avis Vérifiés',
      description: '98% de satisfaction client avec des milliers d\'avis positifs.'
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-sabbar-900 to-sabbar-800 border-t border-turquoise-500/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pourquoi Choisir SABBAR
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Les meilleures raisons de nous faire confiance pour votre projet immobilier
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-sabbar-800/50 border border-turquoise-500/20 rounded-xl p-8 hover:border-turquoise-500/50 transition-all duration-300 group hover:bg-sabbar-800/70"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Features List */}
        <div className="mt-16 bg-sabbar-800/30 border border-turquoise-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Ce qui nous rend Unique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Expert locaux avec 10+ ans d\'expérience',
              'Processus de vente/location accéléré',
              'Accompagnement personnalisé du début à la fin',
              'Financement immobilier facilité',
              'Documentation complète et transparente',
              'Suivi post-vente professionnel'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle size={20} className="text-turquoise-500 flex-shrink-0" />
                <span className="text-gray-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}