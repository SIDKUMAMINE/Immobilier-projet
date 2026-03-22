'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ServicesSection() {
  return (
    <section className="bg-gradient-to-b from-sabbar-800 to-sabbar-900 py-24 px-4 border-t border-turquoise-500/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="text-white">Nos Services</span>
        </h2>
        <p className="text-center text-gray-300 text-xl mb-16 max-w-2xl mx-auto">
          De la conception à la remise des clés, nous vous accompagnez à chaque étape de votre projet immobilier
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              icon: '🤝',
              title: 'Intermédiaton Immobilière',
              description: 'Trouvez la propriété idéale avec notre expertise. Nous vous guidons dans votre recherche et négociation pour les meilleures conditions.'
            },
            {
              icon: '💼',
              title: 'Commercialisation',
              description: 'Mettez en valeur votre propriété. Marketing professionnel et visibilité maximale pour vendre ou louer rapidement et au meilleur prix.'
            }
          ].map((service, idx) => (
            <div
              key={idx}
              className="bg-sabbar-700/30 border border-turquoise-500/20 rounded-2xl p-8 hover:border-turquoise-500/50 transition-all duration-300 group hover:bg-sabbar-700/50"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-gray-300 leading-relaxed mb-6">{service.description}</p>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 text-turquoise-600 hover:text-turquoise-500 font-semibold group/link"
              >
                En savoir plus
                <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}