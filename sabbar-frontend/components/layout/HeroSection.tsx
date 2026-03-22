'use client';

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sabbar-800 via-sabbar-800 to-sabbar-900">
      {/* Decorative Elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-turquoise-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-turquoise-500/10 rounded-full blur-3xl"></div>

      {/* Slider Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-sabbar-900 via-transparent to-sabbar-900 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-sabbar-900 via-sabbar-800 to-sabbar-900">
          <Image
            src="/images/cities/casablanca.jpg"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              console.warn('❌ Hero background image failed to load');
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-white">Trouvez votre bien</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-turquoise-500 via-turquoise-400 to-turquoise-600">
              Immobilier Idéal
            </span>
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed">
            Votre partenaire immobilier de confiance pour un accompagnement clair et sécurisé au Maroc. Intermédiaton et commercialisation de qualité.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Link
              href="/chat"
              className="px-8 py-4 bg-gradient-to-r from-turquoise-600 to-turquoise-500 hover:from-turquoise-500 hover:to-turquoise-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
            >
              Commencer
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#annonces"
              className="px-8 py-4 border-2 border-turquoise-500 text-turquoise-600 hover:text-turquoise-500 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:bg-turquoise-500/10"
            >
              <MapPin size={20} />
              Explorer
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-turquoise-500">500+</p>
              <p className="text-gray-300 text-sm">Propriétés</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-turquoise-500">98%</p>
              <p className="text-gray-300 text-sm">Satisfaction</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-turquoise-500">24/7</p>
              <p className="text-gray-300 text-sm">Support</p>
            </div>
          </div>
        </div>

        {/* Right - Featured Properties */}
        <div className="hidden md:block relative">
          <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-turquoise-500/30 bg-sabbar-800">
            <Image
              src="/images/cities/casablanca.jpg"
              alt="Property Featured"
              fill
              className="object-cover"
              onError={(e) => {
                console.warn('❌ Featured property image failed to load');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sabbar-900/80 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Casablanca</h3>
                <p className="text-turquoise-500">Villa de luxe 🏡</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}