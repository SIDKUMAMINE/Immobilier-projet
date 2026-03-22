'use client';

import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Mohamed Ahaoui',
      location: 'Casablanca',
      rating: 5,
      text: 'Excellente expérience avec SABBAR. L\'équipe était très professionnelle et m\'a aidé à trouver la maison parfaite. Je recommande vivement !',
      image: '👨‍💼'
    },
    {
      name: 'Fatima Bennani',
      location: 'Rabat',
      rating: 5,
      text: 'Service impeccable du début à la fin. SABBAR a rendu l\'achat de notre propriété facile et sans stress. Merci beaucoup !',
      image: '👩‍💼'
    },
    {
      name: 'Karim Mansouri',
      location: 'Marrakech',
      rating: 5,
      text: 'J\'ai vendu ma propriété en moins d\'un mois avec SABBAR. Leur marketing était excellent et les clients sont venus rapidement.',
      image: '👨‍💼'
    },
    {
      name: 'Nadia El Otmani',
      location: 'Fès',
      rating: 5,
      text: 'Équipe à l\'écoute avec une grande expertise. Ils m\'ont conseillé parfaitement dans mon projet d\'investissement immobilier.',
      image: '👩‍💼'
    },
    {
      name: 'Hassan Akkar',
      location: 'Agadir',
      rating: 5,
      text: 'Service de location de A à Z. SABBAR s\'est occupé de tout et je suis très satisfait du résultat.',
      image: '👨‍💼'
    },
    {
      name: 'Laila Rami',
      location: 'Tangier',
      rating: 5,
      text: 'Très professionnels et honnêtes. Je n\'hésiterai pas à revenir pour mes futurs projets immobiliers.',
      image: '👩‍💼'
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-sabbar-800 to-sabbar-900 border-t border-turquoise-500/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Témoignages de Nos Clients
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Découvrez ce que nos clients satisfaits disent de nous
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-sabbar-700/30 border border-turquoise-500/20 rounded-xl p-8 hover:border-turquoise-500/50 transition-all duration-300 group hover:bg-sabbar-700/50 hover:shadow-lg hover:shadow-turquoise-500/10"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-turquoise-500 text-turquoise-500"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 leading-relaxed mb-6 text-sm italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-sabbar-600">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-turquoise-400 text-xs">
                    📍 {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-sabbar-700/30 border border-turquoise-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Vous Aussi, Rejoignez Nos Clients Satisfaits
          </h3>
          <p className="text-gray-300 mb-6">
            Laissez-nous vous aider à réaliser votre rêve immobilier
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-turquoise-600 to-turquoise-500 hover:from-turquoise-500 hover:to-turquoise-400 text-white font-bold rounded-lg transition-all transform hover:scale-105"
          >
            Contactez-Nous Maintenant
          </a>
        </div>
      </div>
    </section>
  );
}