'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Combien de temps pour vendre ma propriété?',
      answer: '20-40 jours en moyenne. Nos clients vendent 3x plus vite que le marché.'
    },
    {
      question: 'Quel est votre taux de réussite?',
      answer: '95% de satisfaction client. 85% des propriétés vendues en 90 jours. Résultats garantis.'
    },
    {
      question: 'Combien coûte vos services?',
      answer: '2.0-3.0% de commission selon le segment. Transparent, sans frais cachés.'
    },
    {
      question: 'Comment ça marche pour les promoteurs?',
      answer: 'Partenariat exclusif. Stratégie 360°. Équipe dédiée. Ventes 40% plus rapides.'
    }
  ];

  return (
    <section className="bg-gradient-to-b from-[#0D1F3C] to-[#0A1629] py-24 px-[5%]" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;600&display=swap');
        
        .cormorant-display {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
        }
        
        .dm-sans {
          font-family: 'DM Sans', system-ui, sans-serif;
        }
      `}</style>

      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="cormorant-display text-6xl md:text-7xl text-white mb-6">
            Questions <span style={{ color: '#C8A96E' }}>Fréquentes</span>
          </h2>
          <p className="dm-sans text-lg text-[#A8A8A8]">
            Trouvez les réponses rapidement
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: expandedFaq === idx ? 'rgba(13, 31, 60, 0.7)' : 'rgba(13, 31, 60, 0.4)',
                border: expandedFaq === idx ? '1px solid rgba(200, 169, 110, 0.3)' : '1px solid rgba(200, 169, 110, 0.15)',
              }}
              onMouseEnter={(e) => {
                if (expandedFaq !== idx) {
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(13, 31, 60, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (expandedFaq !== idx) {
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.15)';
                  e.currentTarget.style.backgroundColor = 'rgba(13, 31, 60, 0.4)';
                }
              }}
            >
              <div
                className="p-6 flex justify-between items-center"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <span className="dm-sans text-white font-semibold text-base">{faq.question}</span>
                <ChevronDown
                  size={24}
                  className="transition-transform duration-300 flex-shrink-0"
                  style={{
                    color: '#C8A96E',
                    transform: expandedFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </div>

              {expandedFaq === idx && (
                <div className="px-6 pb-6 dm-sans text-[#A8A8A8] leading-relaxed text-sm" style={{ borderTop: '1px solid rgba(200, 169, 110, 0.1)' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="/contact"
            className="inline-block dm-sans font-semibold text-base px-8 py-4 rounded-lg transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)',
              color: '#0D1F3C'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(200, 169, 110, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Prendre Rendez-Vous →
          </a>
        </div>
      </div>
    </section>
  );
}