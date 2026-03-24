'use client';

export default function HeroAndServicesPage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0D1F3C] via-[#1a2847] to-[#050D1A] flex items-center justify-between px-[5%] py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-radial-gradient opacity-[0.08] rounded-full pointer-events-none animate-float" 
        style={{
          background: 'radial-gradient(circle, rgba(200, 169, 110, 0.08) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite'
        }} />

      {/* Left content */}
      <div className="max-w-[55%] relative z-10 animate-slideInLeft">
        <h1 
          className="text-6xl font-bold text-white mb-6 leading-tight tracking-tighter"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300
          }}
        >
          Transformez Votre{' '}
          <span className="bg-gradient-to-r from-[#C8A96E] to-[#E2C98A] bg-clip-text text-transparent">
            Projet Immobilier
          </span>
        </h1>

        <p 
          className="text-lg text-[#8A9BB0] leading-relaxed mb-6"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400
          }}
        >
          Partenaire immobilier stratégique à Casablanca. Commercialisation exclusive pour promoteurs et intermédiations complètes pour propriétaires et acheteurs.
        </p>

        <p 
          className="text-base text-[#8A9BB0] leading-relaxed mb-10"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400
          }}
        >
          <span style={{ color: '#C8A96E', fontWeight: 600 }}>40% plus vite.</span> <span style={{ color: '#C8A96E', fontWeight: 600 }}>100% de la valeur.</span> Zéro compromis sur l'excellence.
        </p>

        <div className="flex gap-6 mb-10 flex-wrap">
          {/* Bouton Services - Scroll vers la section services */}
          <button 
            className="text-[#0D1F3C] px-10 py-4 rounded-lg font-bold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500,
              background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)'
            }}
            onClick={() => {
              const servicesSection = document.getElementById('nos-services');
              if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(200, 169, 110, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Découvrir Nos Services →
          </button>

          <button 
            className="text-[#C8A96E] border-2 border-[#C8A96E] px-10 py-4 rounded-lg font-bold text-base transition-all duration-300 hover:bg-[#C8A96E]/10 hover:-translate-y-1 cursor-pointer"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500,
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#E2C98A';
              e.currentTarget.style.color = '#E2C98A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#C8A96E';
              e.currentTarget.style.color = '#C8A96E';
            }}
          >
            📋 Voir Portfolio
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-16 pt-8 border-t border-[rgba(200,169,110,0.1)] flex-wrap">
          {[
            { number: '50+', label: 'Promoteurs' },
            { number: '25-30', label: 'Transactions/Mois' },
            { number: 'MAD 11.25M', label: 'Revenue Year 1' }
          ].map((stat, idx) => (
            <div key={idx} className="text-left">
              <div 
                className="text-3xl font-bold text-[#C8A96E] mb-1"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300
                }}
              >
                {stat.number}
              </div>
              <div 
                className="text-xs text-[#8A9BB0] uppercase tracking-widest"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 500
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Gateway Strategy Highlight */}
        <div 
          className="mt-12 p-6 rounded-2xl"
          style={{
            background: 'rgba(200, 169, 110, 0.05)',
            border: '1px solid rgba(200, 169, 110, 0.2)'
          }}
        >
          <p 
            className="text-sm text-[#C8A96E] font-bold mb-2 uppercase tracking-wider"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500
            }}
          >
            🎯 Notre Avantage Stratégique
          </p>
          <p 
            className="text-[#8A9BB0] text-sm leading-relaxed"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400
            }}
          >
            <span style={{ color: '#F9F5EF', fontWeight: 500 }}>Gateway Strategy:</span> Si commercialisation est rejetée, nous offrons intermédiaton. Aucune opportunité perdue. <span style={{ color: '#C8A96E', fontWeight: 600 }}>Taux de conversion 100%.</span>
          </p>
        </div>
      </div>

      {/* Right - 3D Floating Property Illustration */}
      <div className="max-w-[40%] relative z-10 animate-slideInRight h-[600px] flex items-center justify-center">
        <svg
          viewBox="0 0 500 600"
          className="w-full h-full"
          style={{
            filter: 'drop-shadow(0 20px 60px rgba(200, 169, 110, 0.2))',
            animation: 'floatIllustration 8s ease-in-out infinite'
          }}
        >
          {/* Background Circles - Glow Effect */}
          <circle cx="250" cy="300" r="280" fill="none" stroke="#C8A96E" strokeWidth="1" opacity="0.15" />
          <circle cx="250" cy="300" r="240" fill="none" stroke="#C8A96E" strokeWidth="0.5" opacity="0.1" />
          <circle cx="250" cy="300" r="200" fill="none" stroke="#E2C98A" strokeWidth="0.5" opacity="0.08" />

          {/* 3D Property Building - Isometric View */}
          <g className="property-3d" style={{ transformOrigin: '250px 300px' }}>
            {/* Building Base Shadow */}
            <ellipse cx="250" cy="480" rx="160" ry="30" fill="#0D1F3C" opacity="0.3" />

            {/* Main Building Structure */}
            <g className="building-main">
              {/* Left Face (Depth) */}
              <path d="M 150 350 L 140 300 L 140 200 L 150 250 Z" fill="#A0845C" opacity="0.7" />
              
              {/* Front Face */}
              <rect x="150" y="250" width="200" height="230" fill="#C8A96E" stroke="#E2C98A" strokeWidth="2" />
              
              {/* Right Face (Depth) */}
              <path d="M 350 250 L 370 280 L 370 480 L 350 480 Z" fill="#A0845C" opacity="0.8" />

              {/* Roof Main */}
              <path d="M 150 250 L 250 120 L 350 250 Z" fill="#E2C98A" stroke="#F9F5EF" strokeWidth="1.5" />
              
              {/* Roof Depth */}
              <path d="M 250 120 L 370 200 L 350 250 Z" fill="#B8956A" opacity="0.9" />
              <path d="M 250 120 L 130 200 L 150 250 Z" fill="#8B6F47" opacity="0.8" />

              {/* Door - Ground Level */}
              <rect x="220" y="410" width="60" height="70" fill="#0D1F3C" stroke="#C8A96E" strokeWidth="1.5" rx="2" />
              <circle cx="275" cy="445" r="3" fill="#C8A96E" opacity="0.8" />

              {/* Windows - Level 1 */}
              <rect x="170" y="300" width="35" height="35" fill="#87CEEB" stroke="#0D1F3C" strokeWidth="1" rx="2" opacity="0.8" />
              <line x1="187.5" y1="300" x2="187.5" y2="335" stroke="#0D1F3C" strokeWidth="0.8" />
              <line x1="170" y1="317.5" x2="205" y2="317.5" stroke="#0D1F3C" strokeWidth="0.8" />

              <rect x="295" y="300" width="35" height="35" fill="#87CEEB" stroke="#0D1F3C" strokeWidth="1" rx="2" opacity="0.8" />
              <line x1="312.5" y1="300" x2="312.5" y2="335" stroke="#0D1F3C" strokeWidth="0.8" />
              <line x1="295" y1="317.5" x2="330" y2="317.5" stroke="#0D1F3C" strokeWidth="0.8" />

              {/* Windows - Level 2 */}
              <rect x="170" y="360" width="35" height="35" fill="#87CEEB" stroke="#0D1F3C" strokeWidth="1" rx="2" opacity="0.7" />
              <line x1="187.5" y1="360" x2="187.5" y2="395" stroke="#0D1F3C" strokeWidth="0.8" />
              <line x1="170" y1="377.5" x2="205" y2="377.5" stroke="#0D1F3C" strokeWidth="0.8" />

              <rect x="295" y="360" width="35" height="35" fill="#87CEEB" stroke="#0D1F3C" strokeWidth="1" rx="2" opacity="0.7" />
              <line x1="312.5" y1="360" x2="312.5" y2="395" stroke="#0D1F3C" strokeWidth="0.8" />
              <line x1="295" y1="377.5" x2="330" y2="377.5" stroke="#0D1F3C" strokeWidth="0.8" />

              {/* Accent Line - Building Edge */}
              <line x1="250" y1="250" x2="250" y2="480" stroke="#E2C98A" strokeWidth="1" opacity="0.5" strokeDasharray="3,3" />
            </g>

            {/* Floating Elements Around Property */}
            <g className="floating-elements" style={{ animation: 'floatElements 6s ease-in-out infinite' }}>
              {/* Key Symbol - Right */}
              <g transform="translate(400, 280)">
                <circle cx="0" cy="0" r="8" fill="#C8A96E" opacity="0.8" />
                <rect x="8" y="-3" width="20" height="6" fill="#C8A96E" rx="2" opacity="0.8" />
                <rect x="24" y="-4" width="6" height="8" fill="#C8A96E" opacity="0.8" />
              </g>

              {/* Chart/Growth Symbol - Left Top */}
              <g transform="translate(80, 220)">
                <path d="M 0 20 L 0 0 M 8 15 L 8 5 M 16 10 L 16 0" stroke="#C8A96E" strokeWidth="2" fill="none" opacity="0.7" />
                <polyline points="0,20 8,15 16,10" stroke="#C8A96E" strokeWidth="1.5" fill="none" opacity="0.6" />
              </g>

              {/* Checkmark - Right Bottom */}
              <g transform="translate(380, 400)">
                <circle cx="0" cy="0" r="12" fill="none" stroke="#E2C98A" strokeWidth="1.5" opacity="0.6" />
                <path d="M -5 0 L 0 5 L 8 -3" stroke="#C8A96E" strokeWidth="2" fill="none" opacity="0.8" />
              </g>
            </g>

            {/* Decorative Dots */}
            <g className="dots-floating" opacity="0.4">
              <circle cx="80" cy="180" r="3" fill="#C8A96E" style={{ animation: 'floatDot 7s ease-in-out infinite' }} />
              <circle cx="420" cy="250" r="2" fill="#E2C98A" style={{ animation: 'floatDot 6s ease-in-out infinite 1s' }} />
              <circle cx="150" cy="120" r="2.5" fill="#C8A96E" style={{ animation: 'floatDot 8s ease-in-out infinite 2s' }} />
              <circle cx="380" cy="500" r="2" fill="#E2C98A" style={{ animation: 'floatDot 7.5s ease-in-out infinite 0.5s' }} />
            </g>

            {/* Path Line - Base */}
            <path d="M 80 520 Q 250 500 420 520" stroke="#C8A96E" strokeWidth="1.5" fill="none" opacity="0.25" strokeDasharray="5,5" />
          </g>
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes floatIllustration {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateZ(0deg); }
          50% { transform: translateY(-40px) rotateX(5deg) rotateZ(3deg); }
        }

        @keyframes floatElements {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          25% { transform: translateY(-15px) translateX(5px) scale(1.05); }
          50% { transform: translateY(-30px) translateX(-5px) scale(1); }
          75% { transform: translateY(-15px) translateX(5px) scale(1.05); }
        }

        @keyframes floatDot {
          0%, 100% { transform: translateY(0px) translateX(0px) opacity(0.4); }
          50% { transform: translateY(-50px) translateX(20px) opacity(0.8); }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 1s ease-out;
        }

        @supports (perspective: 1000px) {
          .property-3d {
            perspective: 1000px;
          }
        }
      `}</style>
    </section>
  );
}

function ServicesSection() {
  return (
    <section 
      id="nos-services"
      className="min-h-screen bg-gradient-to-br from-[#050D1A] via-[#0D1F3C] to-[#1a2847] py-20 px-[5%] relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.05]" 
        style={{
          background: 'radial-gradient(circle, rgba(200, 169, 110, 0.1) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite'
        }} />

      {/* Header */}
      <div className="text-center mb-20 relative z-10">
        <h2 
          className="text-5xl font-bold text-white mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300
          }}
        >
          Nos{' '}
          <span className="bg-gradient-to-r from-[#C8A96E] to-[#E2C98A] bg-clip-text text-transparent">
            Services
          </span>
        </h2>
        <p 
          className="text-lg text-[#8A9BB0] max-w-[600px] mx-auto"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400
          }}
        >
          Solutions immobilières complètes et adaptées à vos besoins, combinant expertise traditionnelle et technologies modernes
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1200px] mx-auto relative z-10">
        {/* Service Card 1 - Intermédiation */}
        <div 
          className="p-8 rounded-2xl border transition-all duration-300 hover:border-[#C8A96E] group cursor-pointer"
          style={{
            background: 'rgba(13, 31, 60, 0.4)',
            border: '1px solid rgba(200, 169, 110, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(13, 31, 60, 0.6)';
            e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)';
            e.currentTarget.style.transform = 'translateY(-10px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(13, 31, 60, 0.4)';
            e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div className="text-4xl mb-6">🤝</div>
          <h3 
            className="text-2xl font-bold text-white mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300
            }}
          >
            Intermédiations Immobilière
          </h3>
          <p 
            className="text-[#8A9BB0] mb-8"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400
            }}
          >
            Accompagnement professionnel pour l'achat, la vente ou la location de votre bien immobilier.
          </p>

          <ul className="space-y-4 mb-8">
            {[
              'Accès à un large portefeuille de propriétés',
              'Négociation professionnelle et sécurisée',
              'Conseil personnalisé adapté à vos besoins',
              'Gestion complète du dossier administratif',
              'Expertise juridique et fiscale',
              'Suivi post-signature'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-[#C8A96E] mt-1">✓</span>
                <span 
                  className="text-[#8A9BB0]"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <button 
            className="text-[#C8A96E] border border-[#C8A96E] px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(200, 169, 110, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            En savoir plus →
          </button>
        </div>

        {/* Service Card 2 - Commercialisation */}
        <div 
          className="p-8 rounded-2xl border transition-all duration-300 hover:border-[#C8A96E] group cursor-pointer"
          style={{
            background: 'rgba(13, 31, 60, 0.4)',
            border: '1px solid rgba(200, 169, 110, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(13, 31, 60, 0.6)';
            e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)';
            e.currentTarget.style.transform = 'translateY(-10px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(13, 31, 60, 0.4)';
            e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div className="text-4xl mb-6">📊</div>
          <h3 
            className="text-2xl font-bold text-white mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300
            }}
          >
            Commercialisation
          </h3>
          <p 
            className="text-[#8A9BB0] mb-8"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400
            }}
          >
            Stratégie complète pour valoriser et vendre rapidement votre propriété.
          </p>

          <ul className="space-y-4 mb-8">
            {[
              'Photographie et vidéographie professionnelle',
              'Description détaillée et attrayante',
              'Publication sur multiples canaux digitaux',
              'Gestion des visites et des négociations',
              'Rapport mensuel d\'activité',
              'Stratégie de pricing optimisée'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-[#C8A96E] mt-1">✓</span>
                <span 
                  className="text-[#8A9BB0]"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <button 
            className="text-[#C8A96E] border border-[#C8A96E] px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(200, 169, 110, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            En savoir plus →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
    </section>
  );
}