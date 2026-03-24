'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Quels services propose LANDMARK?',
      answer: 'LANDMARK propose une gamme complète de services immobiliers incluant la vente, la location, la gestion de propriétés, et le conseil en investissement immobilier au Maroc.'
    },
    {
      question: 'Comment fonctionne le processus de vente avec LANDMARK?',
      answer: 'Notre processus est simple: inscription de votre propriété, marketing professionnel, visites, négociation, et finalisation de la vente avec tous les documents légaux.'
    },
    {
      question: 'Quels sont vos frais de commission?',
      answer: 'Nos frais de commission sont compétitifs et négociables selon le type de propriété et le marché. Contactez-nous pour une consultation gratuite et des informations détaillées.'
    },
    {
      question: 'Pouvez-vous m\'aider à obtenir un financement?',
      answer: 'Oui, nous avons des partenaires bancaires et pouvons vous guider dans le processus de demande de financement immobilier.'
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
            Trouvez les réponses à vos questions
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
      </div>
    </section>
  );
}