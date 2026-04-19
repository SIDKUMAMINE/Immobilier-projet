'use client';

export default function FeaturesSection() {
  return (
    <section className="py-24 px-[5%] bg-gradient-to-b from-[#0a0e1a] to-[#0f1424]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header - LANDMARK STYLES */}
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
            Leader reconnu dans l'immobilier à Casablanca, LANDMARK met à votre service une expertise reconnue et une approche client centrée qui a fait le succès de plus de 5000 transactions immobilières.
          </p>
        </div>

        {/* Main Content - Simple layout */}
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
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    lineHeight: 1.7,
                  }}
                >
                  <span className="text-[#C8A96E] font-semibold">Landmark Estate</span>, votre partenaire immobilier de confiance à Casablanca : des solutions commerciales exclusives pour les promoteurs, une plateforme de vente et location accessible à tous.
                </p>
                
                <p
                  className="text-[#8A9BB0]"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    lineHeight: 1.7,
                  }}
                >
                  Grâce à notre expertise en commercialisation immobilière et notre maîtrise du marché casablancais, nous vous offrons des solutions sur mesure, innovantes et pleines de valeur pour concrétiser vos ambitions immobilières.
                </p>

                <p
                  className="text-[#8A9BB0]"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    lineHeight: 1.7,
                  }}
                >
                  Que vous soyez <strong className="text-white">promoteur</strong> cherchant une commercialisation exclusive, <strong className="text-white">propriétaire</strong> souhaitant vendre rapidement, ou <strong className="text-white">acheteur</strong> en quête du bien idéal, LANDMARK_ESTATE est l'interlocuteur unique pour tous vos projets immobiliers.
                </p>
              </div>
            </div>

            {/* Right Column - Stats + Avantages */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.2)] rounded-xl p-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div
                      className="text-3xl font-bold text-[#C8A96E] mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 300,
                      }}
                    >
            
                    </div>
                    <div
                      className="text-sm text-[#8A9BB0]"
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      Chaque bien traité avec soin et rigueur
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-3xl font-bold text-[#C8A96E] mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 300,
                      }}
                    >

                    </div>
                    <div
                      className="text-sm text-[#8A9BB0]"
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      Équipe ancrée dans le marché casablancais
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-3xl font-bold text-[#C8A96E] mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 300,
                      }}
                    >
                      98%
                    </div>
                    <div
                      className="text-sm text-[#8A9BB0]"
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      Satisfaction client
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Points */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-[#C8A96E] mt-1.5 flex-shrink-0 text-xl">●</div>
                  <p
                    className="text-[#8A9BB0]"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Agents immobiliers certifiés et assermentes
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-[#C8A96E] mt-1.5 flex-shrink-0 text-xl">●</div>
                  <p
                    className="text-[#8A9BB0]"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Portefeuille diversifié de propriétés premium
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-[#C8A96E] mt-1.5 flex-shrink-0 text-xl">●</div>
                  <p
                    className="text-[#8A9BB0]"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Service de commercialisation complète
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-[#C8A96E] mt-1.5 flex-shrink-0 text-xl">●</div>
                  <p
                    className="text-[#8A9BB0]"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Accompagnement juridique et administratif
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-[#C8A96E] mt-1.5 flex-shrink-0 text-xl">●</div>
                  <p
                    className="text-[#8A9BB0]"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Confidentialité et discrétion garanties
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}