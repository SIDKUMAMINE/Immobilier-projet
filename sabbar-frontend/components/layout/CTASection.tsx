'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-b from-[#0A1629] to-[#0D1F3C] py-24 px-[5%]">
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
        <div 
          className="rounded-2xl p-16 text-center transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundColor: 'rgba(13, 31, 60, 0.4)',
            border: '1px solid rgba(200, 169, 110, 0.2)',
            backgroundImage: 'linear-gradient(to bottom right, rgba(200, 169, 110, 0.08), rgba(181, 87, 58, 0.04))'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.4)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(200, 169, 110, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h2 className="cormorant-display text-5xl md:text-6xl text-white mb-6">
            Vous Aussi, Rejoignez Nos Clients Satisfaits
          </h2>

          <p className="dm-sans text-[#A8A8A8] mb-10 text-base md:text-lg leading-relaxed">
            Laissez-nous vous aider à réaliser votre rêve immobilier avec expertise et professionnalisme
          </p>

          <Link href="/contact">
            <button 
              className="dm-sans px-10 py-4 rounded-lg font-semibold text-base transition-all duration-300 cursor-pointer flex items-center gap-2 mx-auto"
              style={{
                backgroundColor: '#C8A96E',
                color: '#0D1F3C',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E2C98A';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(200, 169, 110, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C8A96E';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Contactez-Nous Maintenant
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}