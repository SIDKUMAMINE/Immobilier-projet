'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Phone } from 'lucide-react';

export default function CommercializationPage() {
  const benefits = [
    'Analyse de marché fine et diagnostic stratégique',
    'Stratégie marketing 360° complète',
    'Contenu professionnel (photos 4K, vidéos, visites 360°)',
    'Équipe commerciale dédiée et formation',
    'Campagnes publicitaires multi-canaux optimisées',
    'Rapports mensuels et optimisation continue'
  ];

  const steps = [
    {
      number: '01',
      title: 'Diagnostic Stratégique',
      description: 'Analyse détaillée de votre projet, du marché et de la concurrence. Identification des forces à valoriser et des opportunités commerciales.'
    },
    {
      number: '02',
      title: 'Stratégie Marketing',
      description: 'Élaboration d\'une stratégie complète : positionnement, messaging, pricing strategy et timeline de commercialisation.'
    },
    {
      number: '03',
      title: 'Contenu Professionnel',
      description: 'Photos 4K haute résolution, vidéos cinématiques, visites virtuelles 360° et fiches techniques détaillées.'
    },
    {
      number: '04',
      title: 'Équipe Commerciale',
      description: 'Recrutement stratégique, formation intensive, coaching quotidien et système de bonus structuré.'
    },
    {
      number: '05',
      title: 'Campagnes Multi-Canaux',
      description: 'Meta ADS, TikTok ADS, Google ADS, LinkedIn ADS. Budget optimisé et ROI mesuré avec ajustements mensuels.'
    },
    {
      number: '06',
      title: 'Suivi & Optimisation',
      description: 'Rapports mensuels détaillés, dashboards temps réel, analyses de performance et optimisations continues.'
    }
  ];

  const features = [
    {
      icon: '📸',
      title: 'Contenu Premium',
      description: 'Photos 4K, vidéos cinématiques et visites virtuelles 360° immersives'
    },
    {
      icon: '🌐',
      title: 'Présence Multi-Canaux',
      description: 'Distribution maximale sur tous les réseaux et portails immobiliers majeurs'
    },
    {
      icon: '📊',
      title: 'Analytics Avancés',
      description: 'Rapports détaillés avec KPIs, statistiques de performance et insights d\'optimisation'
    },
    {
      icon: '👥',
      title: 'Équipe Dédiée',
      description: 'Manager commercial responsable, équipe de vente professionnelle et support complet'
    }
  ];

  const stats = [
    { number: '50+', label: 'Promoteurs en portefeuille' },
    { number: '40%', label: 'Accélération des ventes' },
    { number: '100%', label: 'Valeur préservée' },
    { number: 'MAD 11.25M', label: 'Chiffre Year 1' }
  ];

  const advantages = [
    {
      icon: '🤝',
      title: 'Partenariat Exclusif',
      description: 'Engagement long-terme sans concurrence interne. 100% focus sur vos objectifs.'
    },
    {
      icon: '📈',
      title: 'Résultats Mesurables',
      description: 'Taux de vente optimisés, prix préservés, délais réduits. Chaque métrique compte.'
    },
    {
      icon: '💼',
      title: 'Expertise Reconnue',
      description: 'Équipe de commerciaux professionnels avec années d\'expérience en immobilier.'
    },
    {
      icon: '🔍',
      title: 'Transparence Totale',
      description: 'Rapports mensuels détaillés, accès données temps réel, zéro surprise.'
    },
    {
      icon: '🎯',
      title: 'Stratégie Complète',
      description: 'Diagnostic → Positioning → Content → Marketing → Leads → Optimization.'
    },
    {
      icon: '🌍',
      title: 'Réseau Étendu',
      description: 'Agents partenaires qualifiés et accès à portefeuille d\'acheteurs pré-qualifiés.'
    }
  ];

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
          <div className="flex items-start gap-8">
            <div className="text-6xl">💼</div>
            <div>
              <h1 
                className="mb-6"
                style={{
                  fontSize: '48px',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  color: '#F9F5EF'
                }}
              >
                <span style={{ color: '#C8A96E' }}>Commercialisation Exclusive</span>
              </h1>
              <p 
                className="max-w-2xl mb-4"
                style={{
                  fontSize: '18px',
                  color: '#8A9BB0',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  lineHeight: '1.7'
                }}
              >
                Partenariat stratégique complet pour transformer votre projet en succès de marché.
              </p>
              <p 
                className="max-w-2xl"
                style={{
                  fontSize: '17px',
                  color: '#8A9BB0',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 400
                }}
              >
                Nos clients vendent <span style={{ color: '#C8A96E', fontWeight: 600 }}>40% plus vite</span> et conservent <span style={{ color: '#C8A96E', fontWeight: 600 }}>100% de la valeur</span> de leurs projets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-16 px-[5%]"
        style={{
          background: 'rgba(26, 40, 71, 0.4)'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p 
                  className="mb-2"
                  style={{
                    fontSize: '36px',
                    fontWeight: 300,
                    color: '#C8A96E',
                    fontFamily: "'Cormorant Garamond', Georgia, serif"
                  }}
                >
                  {stat.number}
                </p>
                <p 
                  style={{
                    color: '#8A9BB0',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: '13px'
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 
                style={{
                  fontSize: '40px',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  color: '#F9F5EF',
                  marginBottom: '24px'
                }}
              >
                Partenariat Stratégique<br />
                <span style={{ color: '#C8A96E' }}>Pour Votre Succès</span>
              </h2>
              
              <div className="space-y-4 mb-8">
                <p 
                  style={{
                    color: '#8A9BB0',
                    fontSize: '16px',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    lineHeight: '1.8'
                  }}
                >
                  LANDMARK estate  Commercialisation accompagne les promoteurs immobiliers dans la commercialisation exclusive de leurs nouveaux projets. Nous combinons analyse de marché fine, stratégie marketing 360°, gestion commerciale rigoureuse et accompagnement continu.
                </p>
                <p 
                  style={{
                    color: '#8A9BB0',
                    fontSize: '16px',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    lineHeight: '1.8'
                  }}
                >
                  Notre méthodologie éprouvée en 9 étapes garantit la transformation de votre projet en landmark estate de marché.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="space-y-4">
                <h3 
                  style={{
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#F9F5EF',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    marginBottom: '16px'
                  }}
                >
                  Services Inclus
                </h3>
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={24} style={{ color: '#C8A96E', flexShrink: 0, marginTop: '4px' }} />
                    <span 
                      style={{
                        color: '#8A9BB0',
                        fontSize: '15px',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400
                      }}
                    >
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 transition-all duration-300"
                  style={{
                    background: 'rgba(26, 40, 71, 0.4)',
                    border: '1px solid rgba(200, 169, 110, 0.2)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(26, 40, 71, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(26, 40, 71, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                  }}
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 
                    className="font-bold mb-2"
                    style={{
                      color: '#F9F5EF',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 500,
                      fontSize: '15px'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{
                      color: '#8A9BB0',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 400,
                      fontSize: '13px'
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        className="py-24 px-[5%]"
        style={{
          background: 'rgba(26, 40, 71, 0.4)'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="mb-4"
              style={{
                fontSize: '48px',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                color: '#F9F5EF'
              }}
            >
              Notre Méthodologie en <span style={{ color: '#C8A96E' }}>6 Étapes</span>
            </h2>
            <p 
              style={{
                color: '#8A9BB0',
                fontSize: '16px',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400
              }}
            >
              Un accompagnement structuré de l'analyse jusqu'à l'optimisation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-8 transition-all duration-300"
                style={{
                  background: 'rgba(26, 40, 71, 0.4)',
                  border: '1px solid rgba(200, 169, 110, 0.2)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(26, 40, 71, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(26, 40, 71, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)',
                    color: '#0D1F3C',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 300,
                    fontSize: '24px'
                  }}
                >
                  {step.number}
                </div>

                <h3 
                  className="mb-3"
                  style={{
                    fontSize: '20px',
                    fontWeight: 400,
                    color: '#F9F5EF',
                    fontFamily: "'Cormorant Garamond', Georgia, serif"
                  }}
                >
                  {step.title}
                </h3>
                <p 
                  style={{
                    color: '#8A9BB0',
                    fontSize: '14px',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    lineHeight: '1.6'
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="mb-4"
              style={{
                fontSize: '48px',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                color: '#F9F5EF'
              }}
            >
              Nos <span style={{ color: '#C8A96E' }}>Avantages Clés</span>
            </h2>
            <p 
              style={{
                color: '#8A9BB0',
                fontSize: '16px',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400
              }}
            >
              Ce qui nous différencie de la concurrence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-8 transition-all duration-300"
                style={{
                  background: 'rgba(26, 40, 71, 0.3)',
                  border: '1px solid rgba(200, 169, 110, 0.2)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(26, 40, 71, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(26, 40, 71, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 
                  className="mb-3"
                  style={{
                    fontSize: '20px',
                    fontWeight: 400,
                    color: '#F9F5EF',
                    fontFamily: "'Cormorant Garamond', Georgia, serif"
                  }}
                >
                  {item.title}
                </h3>
                <p 
                  style={{
                    color: '#8A9BB0',
                    fontSize: '14px',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400,
                    lineHeight: '1.6'
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section 
        className="py-24 px-[5%]"
        style={{
          background: 'rgba(26, 40, 71, 0.4)'
        }}
      >
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="mb-4"
              style={{
                fontSize: '40px',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                color: '#F9F5EF'
              }}
            >
              Tarification <span style={{ color: '#C8A96E' }}>Flexible</span>
            </h2>
            <p 
              style={{
                color: '#8A9BB0',
                fontSize: '16px',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400
              }}
            >
              Commission alignée avec votre succès
            </p>
          </div>

          <div 
            className="rounded-3xl p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 40, 71, 0.5), rgba(26, 40, 71, 0.3))',
              border: '1px solid rgba(200, 169, 110, 0.2)'
            }}
          >
            <div className="space-y-6 mb-8">
              <div className="space-y-3">
                <p 
                  style={{
                    color: '#8A9BB0',
                    fontSize: '16px',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400
                  }}
                >
                  Commission de commercialisation exclusive
                </p>
                <p 
                  style={{
                    fontSize: '48px',
                    fontWeight: 300,
                    color: '#C8A96E',
                    fontFamily: "'Cormorant Garamond', Georgia, serif"
                  }}
                >
                  2.5% du prix de vente
                </p>
                <p 
                  style={{
                    fontSize: '13px',
                    color: '#8A9BB0',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400
                  }}
                >
                  avec réductions volume et bonus performance
                </p>
              </div>
              <div className="space-y-3">
                {[
                  'Engagement exclusif long-terme',
                  'Tous les services inclus',
                  'Zéro concurrence interne'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-center gap-2">
                    <CheckCircle2 size={20} style={{ color: '#C8A96E' }} />
                    <span 
                      style={{
                        color: '#8A9BB0',
                        fontSize: '14px',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-[5%]">
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
            Prêt à Transformer <span style={{ color: '#C8A96E' }}>Votre Projet</span>?
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
            Contactez-nous pour une consultation gratuite et découvrez comment notre stratégie peut transformer votre projet en succès de marché.
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
              Demander une Consultation <ArrowRight size={18} />
            </Link>
            <a
              href="tel:+212605585720"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300"
              style={{
                border: '2px solid #C8A96E',
                color: '#C8A96E',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 500,
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#C8A96E';
                e.currentTarget.style.color = '#0D1F3C';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#C8A96E';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Phone size={18} />
              +212 6 05 58 57 20
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}