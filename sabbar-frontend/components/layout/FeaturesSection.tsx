'use client';

export default function FeaturesSection() {
  return (
    <section className="py-24 px-[5%] bg-gradient-to-b from-[#0a0e1a] to-[#0f1424]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              lineHeight: 1.05,
            }}
          >
            Pourquoi Choisir <span className="text-[#C8A96E]">LANDMARK</span>
          </h2>
          <p
            className="text-lg text-[#8A9BB0] max-w-3xl mx-auto"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            Votre partenaire immobilier de confiance à Casablanca — chaque bien traité avec soin, chaque client accompagné jusqu'à la signature.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(200,169,110,0.2)] rounded-2xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left Column - Text */}
            <div>
              <h3
                className="text-3xl font-bold text-white mb-8"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                }}
              >
                Qui Sommes-nous ?
              </h3>
              
              <div className="space-y-6 leading-relaxed">
                <p
                  className="text-[#8A9BB0]"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: 1.7 }}
                >
                  <span className="text-[#C8A96E] font-semibold">Landmark Estate</span>, votre partenaire immobilier de confiance à Casablanca : des solutions commerciales exclusives pour les promoteurs, une plateforme de vente et location accessible à tous.
                </p>
                
                <p
                  className="text-[#8A9BB0]"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: 1.7 }}
                >
                  Grâce à notre expertise en commercialisation immobilière et notre maîtrise du marché casablancais, nous vous offrons des solutions sur mesure, innovantes et pleines de valeur pour concrétiser vos ambitions immobilières.
                </p>

                <p
                  className="text-[#8A9BB0]"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: 1.7 }}
                >
                  Que vous soyez <strong className="text-white">promoteur</strong> cherchant une commercialisation exclusive, <strong className="text-white">propriétaire</strong> souhaitant vendre rapidement, ou <strong className="text-white">acheteur</strong> en quête du bien idéal, Landmark Estate est l'interlocuteur unique pour tous vos projets immobiliers.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">

              {/* Engagements — style ligne avec séparateur */}
              <div className="border border-[rgba(200,169,110,0.2)] rounded-xl overflow-hidden">
                {[
                  { label: 'Chaque bien traité avec soin et rigueur' },
                  { label: 'Équipe ancrée dans le marché casablancais' },
                  { label: '98% de satisfaction client' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 px-6 py-4 border-b border-[rgba(200,169,110,0.1)] last:border-b-0"
                    style={{ background: idx % 2 === 0 ? 'rgba(200,169,110,0.04)' : 'transparent' }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)' }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#C8A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p
                      className="text-[#8A9BB0]"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400 }}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Key Points */}
              <div className="space-y-3">
                {[
                  'Agents immobiliers certifiés et assermentés',
                  'Portefeuille diversifié de propriétés premium',
                  'Service de commercialisation complète',
                  'Accompagnement juridique et administratif',
                  'Confidentialité et discrétion garanties',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="text-[#C8A96E] mt-1.5 flex-shrink-0 text-xl">●</div>
                    <p
                      className="text-[#8A9BB0]"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400 }}
                    >
                      {point}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}