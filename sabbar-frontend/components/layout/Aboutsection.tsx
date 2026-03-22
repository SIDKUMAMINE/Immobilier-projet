'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="bg-gradient-to-b from-sabbar-900 to-sabbar-800 py-24 px-4 border-t border-turquoise-500/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-white">Qui sommes-nous</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              SABBAR est votre partenaire immobilier de confiance pour un accompagnement clair et sécurisé au Maroc.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Grâce à notre savoir-faire en intermédiaton et commercialisation, nous vous offrons des solutions sur mesure, innovantes et pleines de valeur pour concrétiser vos ambitions immobilières.
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-turquoise-600 to-turquoise-500 hover:from-turquoise-500 hover:to-turquoise-400 text-white font-bold rounded-lg transition-all duration-300 group"
            >
              Nous contacter
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { src: '/images/cities/casablanca.jpg', alt: 'Property 1' },
              { src: '/images/cities/rabat.jpg', alt: 'Property 2' },
              { src: '/images/cities/marrakech.jpg', alt: 'Property 3' },
              { src: '/images/cities/casablanca.jpg', alt: 'Property 4' }
            ].map((img, idx) => (
              <div key={idx} className="relative h-48 rounded-xl overflow-hidden border border-turquoise-500/20 bg-sabbar-800">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.warn(`❌ About section image failed to load: ${img.src}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}