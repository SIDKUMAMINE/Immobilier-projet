'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-sabbar-800/70 via-sabbar-900 to-sabbar-800/70 border-y border-turquoise-500/20 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h3 className="text-3xl md:text-4xl font-bold text-white">
          Prêt à trouver votre bien immobilier ?
        </h3>
        <p className="text-xl text-gray-300">
          Contactez-nous dès aujourd'hui pour une consultation gratuite
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/chat"
            className="px-8 py-4 bg-gradient-to-r from-turquoise-600 to-turquoise-500 hover:from-turquoise-500 hover:to-turquoise-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Démarrer maintenant
          </Link>
          <Link
            href="#contact"
            className="px-8 py-4 border-2 border-turquoise-500 text-turquoise-600 hover:text-turquoise-500 font-bold rounded-lg transition-all duration-300"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}