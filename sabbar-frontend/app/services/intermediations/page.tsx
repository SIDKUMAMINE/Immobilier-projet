'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Phone } from 'lucide-react';

export default function IntermediationsPage() {
  const benefits = [
    'Accès à large portefeuille de propriétés curé',
    'Valuation professionnelle et pricing stratégique',
    'Marketing complet et lead generation ciblée',
    'Négociation professionnelle et sécurisée',
    'Gestion administrative et juridique complète',
    'Suivi post-signature et support client'
  ];

  const steps = [
    {
      number: '01',
      title: 'Lead Generation',
      description: 'Captage des leads qualifiés via Instagram, Google Ads, WhatsApp Business et Telegram. Tri et qualification par score (1-5 étoiles).'
    },
    {
      number: '02',
      title: 'Lead Qualification',
      description: 'Analyse du budget, timeline, type de bien, financing. Scoring détaillé pour prioriser les prospects sérieux.'
    },
    {
      number: '03',
      title: 'Property Visit',
      description: 'Organisation des visites (30-45 min). Tour professionnel suivi d\'un contact immédiat pour feedback et next steps.'
    },
    {
      number: '04',
      title: 'Offer & Negotiation',
      description: 'Analyse de l\'offre, counter-offres stratégiques. Accord in principle obtenu (max 5% gap du listing price).'
    },
    {
      number: '05',
      title: 'Transaction Management',
      description: 'Gestion administrative complète : documents notarié, juridique, fiscal. Suivi continu jusqu\'à signature.'
    },
    {
      number: '06',
      title: 'Post-Signature Support',
      description: 'Accompagnement final, remise des clés, support post-vente. Documentation d\'archive et garantie satisfaction.'
    }
  ];

  const features = [
    {
      icon: '🏠',
      title: 'Portfolio Premium',
      description: '30-40 propriétés actives sélectionnées et vérifiées'
    },
    {
      icon: '📱',
      title: 'Multi-Canaux',
      description: 'Instagram, Facebook, Google Ads, WhatsApp, Telegram'
    },
    {
      icon: '⚡',
      title: 'Fast-Track',
      description: 'Vente en 25-30 jours (vs 40-50 marché)'
    },
    {
      icon: '🔒',
      title: 'Sécurité Totale',
      description: 'Accompagnement juridique et protection complète'
    }
  ];

  const stats = [
    { number: '30-40', label: 'Propriétés actives' },
    { number: '25-30j', label: 'Délai moyen de vente' },
    { number: '50+', label: 'Leads qualifiés/mois' },
    { number: '95%', label: 'Taux satisfaction' }
  ];

  const advantages = [
    {
      icon: '💰',
      title: 'Valuation Précise',
      description: 'Expertise de marché pour juste valuation et pricing optimisé.'
    },
    {
      icon: '📊',
      title: 'Lead Management',
      description: 'Système de scoring et attribution pour conversion maximale.'
    },
    {
      icon: '🎯',
      title: 'Ciblage Intelligent',
      description: 'Stratégies marketing adaptées par segment de propriété.'
    },
    {
      icon: '⚖️',
      title: 'Accompagnement Juridique',
      description: 'Support notarié complet et sécurité légale garantie.'
    },
    {
      icon: '🌍',
      title: 'Réseau Étendu',
      description: 'Accès à acheteurs pré-qualifiés et réseau d\'agents partenaires.'
    },
    {
      icon: '💬',
      title: 'Support Personnalisé',
      description: 'Équipe dédiée disponible à chaque étape de votre parcours.'
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
            <div className="text-6xl">🤝</div>
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
                Intermédiations <span style={{ color: '#C8A96E' }}>Immobilière</span>
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
                Plateforme complète de vente, achat et location. Accès à portefeuille premium et accompagnement professionnel.
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
                Vos propriétés se vendent <span style={{ color: '#C8A96E', fontWeight: 600 }}>3x plus vite</span> avec <span style={{ color: '#C8A96E', fontWeight: 600 }}>support complet</span> de bout en bout.
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
                Votre Partenaire<br />
                <span style={{ color: '#C8A96E' }}>De Confiance</span>
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
                  Landmark estate  Intermédiaton offre une plateforme digitale innovante combinée avec une expertise immobilière reconnue. Nous gérons chaque étape de votre transaction (vente, achat, location) avec professionnalisme et transparence.
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
                  Pour les propriétaires: vente rapide au meilleur prix. Pour les acheteurs: accès à portefeuille curé et support complet. Pour tous: zéro surprise, 100% transparence.
                </p>
              </div>

              {/* Benefits */}
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
              Notre Processus en <span style={{ color: '#C8A96E' }}>6 Étapes</span>
            </h2>
            <p 
              style={{
                color: '#8A9BB0',
                fontSize: '16px',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400
              }}
            >
              Un accompagnement structuré pour votre succès
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
              Ce qui nous différencie
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
              Tarification <span style={{ color: '#C8A96E' }}>Transparente</span>
            </h2>
            <p 
              style={{
                color: '#8A9BB0',
                fontSize: '16px',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400
              }}
            >
              Commission standard par segment
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
                  Commission d'intermédiaton
                </p>
                <div style={{ marginBottom: '16px' }}>
                  <p 
                    style={{
                      fontSize: '32px',
                      fontWeight: 300,
                      color: '#C8A96E',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      marginBottom: '4px'
                    }}
                  >
                    Luxury (4M+)
                  </p>
                  <p 
                    style={{
                      fontSize: '24px',
                      fontWeight: 300,
                      color: '#C8A96E',
                      fontFamily: "'Cormorant Garamond', Georgia, serif"
                    }}
                  >
                    2.0%
                  </p>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <p 
                    style={{
                      fontSize: '32px',
                      fontWeight: 300,
                      color: '#C8A96E',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      marginBottom: '4px'
                    }}
                  >
                    Mid-Range (1-3M)
                  </p>
                  <p 
                    style={{
                      fontSize: '24px',
                      fontWeight: 300,
                      color: '#C8A96E',
                      fontFamily: "'Cormorant Garamond', Georgia, serif"
                    }}
                  >
                    2.5%
                  </p>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <p 
                    style={{
                      fontSize: '32px',
                      fontWeight: 300,
                      color: '#C8A96E',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      marginBottom: '4px'
                    }}
                  >
                    Budget (&lt;1M)
                  </p>
                  <p 
                    style={{
                      fontSize: '24px',
                      fontWeight: 300,
                      color: '#C8A96E',
                      fontFamily: "'Cormorant Garamond', Georgia, serif"
                    }}
                  >
                    3.0%
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  'Tous les services inclus',
                  'Zéro frais cachés',
                  'Support complet'
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
            Prêt à <span style={{ color: '#C8A96E' }}>Commencer</span>?
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
            Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons accélérer votre transaction immobilière.
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