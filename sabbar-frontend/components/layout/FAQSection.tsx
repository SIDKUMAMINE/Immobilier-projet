'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Comment acheter une propriété avec SABBAR ?',
      answer: 'Notre processus est simple et transparent. Consultez notre équipe d\'experts qui vous guideront à travers chaque étape, de la recherche à la signature.'
    },
    {
      question: 'Quels sont vos frais de transaction ?',
      answer: 'Nos frais sont competitifs et transparents. Nous vous fournirons un devis détaillé avant de commencer tout processus.'
    },
    {
      question: 'Proposez-vous des services de financement ?',
      answer: 'Oui, nous travaillons avec les meilleurs partenaires bancaires pour faciliter votre financement immobilier.'
    },
    {
      question: 'Comment puis-je louer une propriété ?',
      answer: 'Contactez notre équipe pour découvrir nos offres de location. Nous avons des propriétés résidentielles et commerciales.'
    },
    {
      question: 'Travaillez-vous dans d\'autres villes ?',
      answer: 'Oui, nous opérons à Casablanca, Rabat, Marrakech et d\'autres villes majeures du Maroc.'
    },
    {
      question: 'Quels sont vos horaires de travail ?',
      answer: 'Nous sommes disponibles du lundi au vendredi de 9h à 18h, et le samedi de 10h à 15h.'
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-fond-50 to-white border-t border-sabbar-700/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-sabbar-900 mb-4">
            Questions Fréquemment Posées
          </h2>
          <p className="text-xl text-sabbar-700">
            Trouvez les réponses à vos questions sur nos services immobiliers
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-sabbar-200 rounded-lg overflow-hidden bg-white hover:border-turquoise-500/50 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-fond-50 transition-colors text-left"
              >
                <span className="text-lg font-semibold text-sabbar-900">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-turquoise-600 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-6 py-4 bg-fond-50 border-t border-sabbar-200">
                  <p className="text-sabbar-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sabbar-700 mb-4">
            Vous ne trouvez pas la réponse ?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-turquoise-600 to-turquoise-500 hover:from-turquoise-500 hover:to-turquoise-400 text-white font-semibold rounded-lg transition-all"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
}