'use client';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Mohamed Ahaoui',
      location: 'Casablanca',
      text: 'Excellente expérience avec SABBAR. L\'équipe était très professionnelle et m\'a aidé à trouver la maison parfaite.',
      rating: 5
    },
    {
      name: 'Fatima Bennani',
      location: 'Rabat',
      text: 'Service impeccable du début à la fin. SABBAR a rendu l\'achat de notre propriété facile et sans stress.',
      rating: 5
    },
    {
      name: 'Karim Mansouri',
      location: 'Marrakech',
      text: 'J\'ai vendu ma propriété en moins d\'un mois avec SABBAR. Leur marketing était excellent.',
      rating: 5
    },
    {
      name: 'Nadia El Otmani',
      location: 'Fès',
      text: 'Équipe à l\'écoute avec une grande expertise. Ils m\'ont conseillé parfaitement dans mon projet.',
      rating: 5
    },
    {
      name: 'Hassan Akkar',
      location: 'Agadir',
      text: 'Service de location de A à Z. SABBAR s\'est occupé de tout et je suis très satisfait.',
      rating: 5
    },
    {
      name: 'Laila Rami',
      location: 'Tangier',
      text: 'Très professionnels et honnêtes. Je n\'hésite pas à revenir pour mes futurs projets.',
      rating: 5
    }
  ];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
  };

  return (
    <section className="bg-[#0f1a2e] py-24 px-[5%]">
      <h2 className="text-5xl font-bold text-white text-center mb-16">Témoignages de Nos Clients</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="bg-[rgba(10,14,26,0.5)] border border-[rgba(212,175,55,0.15)] rounded-2xl p-6 transition-all duration-300 hover:border-[rgba(212,175,55,0.4)] hover:bg-[rgba(10,14,26,0.8)]"
          >
            <div className="text-[#d4af37] text-sm mb-3">
              {'★'.repeat(testimonial.rating)}
            </div>
            <p className="text-[#b0b0b0] italic leading-relaxed text-sm mb-5">
              "{testimonial.text}"
            </p>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-[#d4af37] to-[#e6c753] rounded-full flex items-center justify-center text-[#0f1a2e] font-bold text-sm">
                {getInitials(testimonial.name)}
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">{testimonial.name}</h4>
                <p className="text-[#b0b0b0] text-xs">📍 {testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}