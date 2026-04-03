'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Users, Target, Zap, Shield, TrendingUp } from 'lucide-react';

export default function AProposPage() {
  return (
    <main style={{ background: 'linear-gradient(to bottom, #0D1F3C, #050D1A)' }}>
      {/* Back Button */}
      <div 
        className="py-4 px-[5%] border-b"
        style={{
          background: 'rgba(26, 40, 71, 0.5)',
          borderColor: 'rgba(200, 169, 110, 0.2)'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 transition-all hover:gap-3"
            style={{
              color: '#C8A96E',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500
            }}
          >
            <ArrowLeft size={20} />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="py-24 px-[5%]"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 40, 71, 0.5), rgba(26, 40, 71, 0.3))'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 
              className="mb-6"
              style={{
                fontSize: '52px',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                color: '#F9F5EF'
              }}
            >
              À Propos de <span style={{ color: '#C8A96E' }}>LANDMARK_ESTATE</span>
            </h1>
            <p 
              className="text-lg"
              style={{
                color: '#8A9BB0',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400,
                lineHeight: '1.8'
              }}
            >
              Partenaire immobilier de référence à Casablanca. Nous transformons les projets en succès et les transactions en histoires de confiance.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="text-center">
              <div 
                className="text-5xl mb-6"
              >
                🎯
              </div>
              <h3 
                style={{
                  fontSize: '24px',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  color: '#F9F5EF',
                  marginBottom: '12px'
                }}
              >
                Notre Mission
              </h3>
              <p 
                style={{
                  color: '#8A9BB0',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: '1.7'
                }}
              >
                Redéfinir l'excellence immobilière à Casablanca. Pour promoteurs, propriétaires et acheteurs, nous offrons des solutions transparentes, innovantes et pleines de valeur.
              </p>
            </div>

            <div className="text-center">
              <div 
                className="text-5xl mb-6"
              >
                💡
              </div>
              <h3 
                style={{
                  fontSize: '24px',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  color: '#F9F5EF',
                  marginBottom: '12px'
                }}
              >
                Notre Vision
              </h3>
              <p 
                style={{
                  color: '#8A9BB0',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: '1.7'
                }}
              >
                Marché immobilier plus transparent, plus accessible, plus humain. Zéro compromis sur la qualité, 100% focus sur les objectifs de nos clients.
              </p>
            </div>

            <div className="text-center">
              <div 
                className="text-5xl mb-6"
              >
                ⭐
              </div>
              <h3 
                style={{
                  fontSize: '24px',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  color: '#F9F5EF',
                  marginBottom: '12px'
                }}
              >
                Nos Valeurs
              </h3>
              <p 
                style={{
                  color: '#8A9BB0',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: '1.7'
                }}
              >
                Intégrité, Excellence, Transparence, Innovation. Chaque interaction bâtit la confiance et crée de la valeur durable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section 
        className="py-24 px-[5%]"
        style={{
          background: 'rgba(26, 40, 71, 0.4)'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <h2 
            className="text-center mb-16"
            style={{
              fontSize: '48px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              color: '#F9F5EF'
            }}
          >
            Notre <span style={{ color: '#C8A96E' }}>Histoire</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p 
                style={{
                  color: '#8A9BB0',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '1.8',
                  marginBottom: '20px'
                }}
              >
                 Nous sommes votre partenaire de confiance en commercialisation et intermédiation immobilière. Pour les promoteurs et constructeurs, nous prenons en charge l'intégralité de la commercialisation de vos projets, garantissant des ventes 30-40% plus rapides, la préservation de votre marge et image de marque, ainsi que la liberté et le temps pour maximiser votre nombre de projets annuels
              </p>

              <p 
                style={{
                  color: '#8A9BB0',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '1.8',
                  marginBottom: '20px'
                }}
              >
                Pour les propriétaires et particuliers, nous prenons soin de votre bien, qu'il s'agisse d'un appartement, villa ou local commercial, en le vendant rapidement avec une visibilité maximale sur notre site web et notre base de données d'acheteurs potentiels déjà qualifiés. 
              </p>

              <p 
                style={{
                  color: '#8A9BB0',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '1.8'
                }}
              >
               Notre expertise, notre réseau solide et notre transparence totale garantissent des résultats mesurables et des délais respectés. 📱 Contactez-nous dès aujourd'hui pour discuter de votre projet immobilier.
              </p>
            </div>

            <div 
              className="rounded-2xl p-12"
              style={{
                background: 'rgba(200, 169, 110, 0.05)',
                border: '1px solid rgba(200, 169, 110, 0.2)'
              }}
            >
              <h3 
                style={{
                  fontSize: '24px',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  color: '#C8A96E',
                  marginBottom: '20px'
                }}
              >
                Chiffres Clés
              </h3>

              <div className="space-y-6">
                {[
                  { label: 'Promoteurs en portefeuille', value: '50+' },
                  { label: 'Transactions mensuelles', value: '25-30' },
                  { label: 'Chiffre d\'affaires Year 1', value: 'MAD 11.25M' },
                  { label: 'Accélération des ventes', value: '40%' },
                  { label: 'Valeur préservée', value: '100%' },
                  { label: 'Taux de satisfaction', value: '95%' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.1)]">
                    <span 
                      style={{
                        color: '#8A9BB0',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400
                      }}
                    >
                      {item.label}
                    </span>
                    <span 
                      style={{
                        color: '#C8A96E',
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 300,
                        fontSize: '20px'
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Model Section */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <h2 
            className="text-center mb-16"
            style={{
              fontSize: '48px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              color: '#F9F5EF'
            }}
          >
            Notre Modèle <span style={{ color: '#C8A96E' }}>Bi-Segmenté</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Commercialisation */}
            <div 
              className="rounded-2xl p-8"
              style={{
                background: 'rgba(26, 40, 71, 0.4)',
                border: '1px solid rgba(200, 169, 110, 0.2)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)'
                  }}
                >
                  💼
                </div>
                <h3 
                  style={{
                    fontSize: '24px',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 300,
                    color: '#F9F5EF'
                  }}
                >
                  Commercialisation B2B
                </h3>
              </div>

              <p 
                style={{
                  color: '#8A9BB0',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: '1.7',
                  marginBottom: '16px'
                }}
              >
                <span style={{ color: '#C8A96E', fontWeight: 600 }}>Target:</span> Promoteurs immobiliers
              </p>

              <div className="space-y-3">
                {[
                  'Stratégie marketing 360°',
                  'Équipe commerciale dédiée',
                  'Contenu professionnel (4K, vidéos, visites 360°)',
                  'Campagnes multi-canaux optimisées',
                  'Rapports mensuels détaillés',
                  'Partenariat exclusif long-terme'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={18} style={{ color: '#C8A96E', flexShrink: 0, marginTop: '2px' }} />
                    <span 
                      style={{
                        color: '#8A9BB0',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400,
                        fontSize: '14px'
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div 
                className="mt-8 pt-6 border-t border-[rgba(200,169,110,0.1)]"
              >
                <p 
                  style={{
                    color: '#C8A96E',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: '13px'
                  }}
                >
                  Revenue: MAD 11.25M (2-3 contrats)
                </p>
              </div>
            </div>

            {/* Intermédiaton */}
            <div 
              className="rounded-2xl p-8"
              style={{
                background: 'rgba(26, 40, 71, 0.4)',
                border: '1px solid rgba(200, 169, 110, 0.2)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)'
                  }}
                >
                  🤝
                </div>
                <h3 
                  style={{
                    fontSize: '24px',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 300,
                    color: '#F9F5EF'
                  }}
                >
                  Intermédiaton B2C
                </h3>
              </div>

              <p 
                style={{
                  color: '#8A9BB0',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: '1.7',
                  marginBottom: '16px'
                }}
              >
                <span style={{ color: '#C8A96E', fontWeight: 600 }}>Target:</span> Propriétaires, acheteurs, investisseurs
              </p>

              <div className="space-y-3">
                {[
                  'Plateforme digitale complète',
                  'Lead generation multi-canaux',
                  'Valuation professionnelle',
                  'Négociation et gestion administrative',
                  'Vente 3x plus rapide',
                  'Support post-signature'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={18} style={{ color: '#C8A96E', flexShrink: 0, marginTop: '2px' }} />
                    <span 
                      style={{
                        color: '#8A9BB0',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400,
                        fontSize: '14px'
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div 
                className="mt-8 pt-6 border-t border-[rgba(200,169,110,0.1)]"
              >
                <p 
                  style={{
                    color: '#C8A96E',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: '13px'
                  }}
                >
                  Revenue: MAD 450-600K (25-30 transactions)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

 
      {/* Core Values Section */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <h2 
            className="text-center mb-16"
            style={{
              fontSize: '48px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              color: '#F9F5EF'
            }}
          >
            Nos <span style={{ color: '#C8A96E' }}>Piliers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Intégrité',
                description: 'Transparence totale. Rapports mensuels détaillés. Zéro surprise. Données temps réel accessibles.'
              },
              {
                icon: Target,
                title: 'Excellence',
                description: 'Méthodologie éprouvée en 9 étapes. Résultats mesurés. Chaque détail compte. Zéro compromis.'
              },
              {
                icon: Users,
                title: 'Partenariat',
                description: 'Engagement exclusif long-terme. Alignement d\'objectifs. Investis dans votre succès.'
              },
              {
                icon: Zap,
                title: 'Innovation',
                description: 'Technologie digitale. Stratégies modernes. Contenu 4K. Marketing 360°. Toujours à l\'avant.'
              },
              {
                icon: TrendingUp,
                title: 'Résultats',
                description: '40% accélération. 100% valeur. 95% satisfaction. Chaque métrique documentée et optimisée.'
              },
              {
                icon: CheckCircle2,
                title: 'Expertise',
                description: 'Équipe expérimentée. Formation continue. Coaching quotidien. Professionnalisme reconnu.'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl p-8"
                  style={{
                    background: 'rgba(26, 40, 71, 0.3)',
                    border: '1px solid rgba(200, 169, 110, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(26, 40, 71, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(26, 40, 71, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={32} style={{ color: '#C8A96E', marginBottom: '16px' }} />
                  <h3 
                    style={{
                      fontSize: '20px',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 300,
                      color: '#F9F5EF',
                      marginBottom: '12px'
                    }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    style={{
                      color: '#8A9BB0',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section 
        className="py-24 px-[5%]"
        style={{
          background: 'rgba(26, 40, 71, 0.4)'
        }}
      >
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 
            className="mb-6"
            style={{
              fontSize: '48px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              color: '#F9F5EF'
            }}
          >
            Prêt à <span style={{ color: '#C8A96E' }}>Nous Rejoindre</span>?
          </h2>
          <p 
            className="mb-8"
            style={{
              color: '#8A9BB0',
              fontSize: '16px',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400,
              lineHeight: '1.7'
            }}
          >
            Découvrez comment LANDMARK_ESTATE peut transformer votre projet immobilier en succès de marché.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300"
  style={{
    background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)',
    color: '#0D1F3C',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 500
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
              Prendre Rendez-Vous
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}