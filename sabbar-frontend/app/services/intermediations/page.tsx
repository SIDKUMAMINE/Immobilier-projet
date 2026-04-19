'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Phone, FileSearch, Users, MessageSquare, ShieldCheck, MapPin, Star } from 'lucide-react';

export default function IntermediationsPage() {

  const steps = [
    {
      number: '01',
      title: 'Identification du projet',
      description: "Premier contact pour comprendre votre projet : type de bien, quartier, budget, delai. Nous definissons ensemble les criteres essentiels."
    },
    {
      number: '02',
      title: 'Analyse et conseil',
      description: "Etude du marche local, estimation du prix juste, conseil sur les quartiers et les tendances de prix a Casablanca et regions."
    },
    {
      number: '03',
      title: 'Visite du bien',
      description: "Organisation des visites avec verification du titre foncier au prealable. Compte-rendu immediat apres chaque visite."
    },
    {
      number: '04',
      title: 'Offre et negociation',
      description: "Accompagnement dans la formulation de l'offre et la negociation. Nous defendons vos interets pour obtenir les meilleures conditions."
    },
    {
      number: '05',
      title: 'Dossier et acte notarie',
      description: "Preparation et suivi de tous les documents : compromis, acte de vente, dossier fiscal. Coordination avec le notaire jusqu'a la signature."
    },
    {
      number: '06',
      title: 'Remise des cles et suivi',
      description: "Accompagnement le jour de la signature, remise des cles et support post-vente pour toute question administrative."
    }
  ];

  const features = [
    { title: 'Biens verifies', detail: '14 proprietes selectionnees avec titre foncier controle' },
    { title: 'Multi-canaux', detail: 'Mubawab, Avito, Sarouty, Facebook, Instagram' },
    { title: 'Verification TF', detail: 'Titre foncier verifie avant chaque visite' },
    { title: 'Securite juridique', detail: "Accompagnement complet jusqu'au notaire" },
  ];

  const advantages = [
    { Icon: FileSearch, title: 'Estimation precise', description: 'Connaissance terrain du marche casablancais pour un prix juste, ni sous-evalue ni hors marche.' },
    { Icon: MessageSquare, title: 'Disponibilite reelle', description: 'Un seul interlocuteur joignable sur WhatsApp, avec une reponse garantie sous 2h, 7j/7.' },
    { Icon: Users, title: 'Diffusion large', description: 'Publication sur Mubawab, Avito, Sarouty, Facebook et Instagram pour une visibilite maximale.' },
    { Icon: ShieldCheck, title: 'Securite juridique', description: 'Verification du titre foncier, accompagnement notarial et suivi de toute la documentation legale.' },
    { Icon: MapPin, title: 'Connaissance locale', description: 'Expertise des quartiers de Casablanca et de Berrechid : prix reels, tendances, atouts de chaque secteur.' },
    { Icon: Star, title: 'Transparence totale', description: 'Commissions affichees clairement, zero frais cache, tout est explique avant chaque etape.' },
  ];

  return (
    <main style={{ background: 'linear-gradient(to bottom, #0D1F3C, #050D1A)' }}>

      {/* Back Button */}
      <div className="py-4 px-[5%] border-b" style={{ background: 'rgba(26, 40, 71, 0.5)', borderColor: 'rgba(200, 169, 110, 0.2)' }}>
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-all hover:gap-3"
            style={{ color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500 }}
          >
            <ArrowLeft size={20} />
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="py-24 px-[5%]" style={{ background: 'linear-gradient(135deg, rgba(26,40,71,0.5), rgba(26,40,71,0.3))' }}>
        <div className="max-w-[1400px] mx-auto">
          <h1
            className="mb-6"
            style={{ fontSize: '48px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}
          >
            Un accompagnement <span style={{ color: '#C8A96E' }}>de confiance</span>
          </h1>
          <p className="max-w-2xl mb-4" style={{ fontSize: '18px', color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.7' }}>
            Vous vendez, achetez ou louez un bien a Casablanca ? Landmark Estate vous accompagne a chaque etape avec un seul interlocuteur, une communication claire et aucune mauvaise surprise.
          </p>
          <p className="max-w-2xl" style={{ fontSize: '16px', color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400 }}>
            <span style={{ color: '#C8A96E', fontWeight: 500 }}>Notre engagement :</span> vous informer a chaque etape, verifier les documents avant toute visite, et rester disponible jusqu&apos;a la remise des cles.
          </p>
        </div>
      </section>

      {/* ENGAGEMENTS QUALITATIFS */}
      <section className="py-16 px-[5%]" style={{ background: 'rgba(26,40,71,0.4)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: 'Disponibilite', detail: 'Un interlocuteur unique, joignable 7j/7 sur WhatsApp' },
              { label: 'Transparence', detail: 'Documents verifies, commissions claires, zero surprise' },
              { label: 'Accompagnement', detail: "De la premiere visite a la remise des cles chez le notaire" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <p className="mb-2" style={{ fontSize: '22px', fontWeight: 300, color: '#C8A96E', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {item.label}
                </p>
                <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, fontSize: '13px' }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESCRIPTION + FEATURES */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 style={{ fontSize: '40px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF', marginBottom: '24px' }}>
                Votre Partenaire<br /><span style={{ color: '#C8A96E' }}>De Confiance</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.8' }}>
                  Landmark Estate gere chaque etape de votre transaction immobiliere avec professionnalisme et transparence. Que vous soyez vendeur, acheteur ou locataire, nous sommes votre interlocuteur unique du debut a la fin.
                </p>
                <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.8' }}>
                  Pour les <strong style={{ color: '#F9F5EF' }}>proprietaires</strong> : vente au juste prix avec une visibilite maximale. Pour les <strong style={{ color: '#F9F5EF' }}>acheteurs</strong> : acces a des biens verifies avec titre foncier propre. Pour tous : zero surprise et 100% de transparence.
                </p>
                <p style={{ color: '#8A9BB0', fontSize: '15px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.8', paddingTop: '16px', borderTop: '1px solid rgba(200,169,110,0.12)' }}>
                  <span style={{ color: '#C8A96E', fontWeight: 500 }}>Mohamed Sabbar</span>, fondateur de Landmark Estate, prend personnellement en charge chaque dossier d&apos;intermediation — vous n&apos;avez pas un agent parmi d&apos;autres, vous avez un interlocuteur qui connait votre bien et defend vos interets.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 transition-all duration-300"
                  style={{ background: 'rgba(26,40,71,0.4)', border: '1px solid rgba(200,169,110,0.2)', cursor: 'default' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,40,71,0.6)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(26,40,71,0.4)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.2)'; }}
                >
                  <h3 style={{ color: '#F9F5EF', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', fontWeight: 300, marginBottom: '8px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '13px', lineHeight: 1.6 }}>
                    {feature.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESSUS EN 6 ETAPES */}
      <section className="py-24 px-[5%]" style={{ background: 'rgba(26,40,71,0.4)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontSize: '48px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}>
              Notre Processus en <span style={{ color: '#C8A96E' }}>6 Etapes</span>
            </h2>
            <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400 }}>
              Un accompagnement structure du debut a la signature
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-8 transition-all duration-300"
                style={{ background: 'rgba(26,40,71,0.4)', border: '1px solid rgba(200,169,110,0.2)', cursor: 'default' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,40,71,0.6)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(26,40,71,0.4)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)', color: '#0D1F3C', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: '24px' }}
                >
                  {step.number}
                </div>
                <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 400, color: '#F9F5EF', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {step.title}
                </h3>
                <p style={{ color: '#8A9BB0', fontSize: '14px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.6' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES CLES */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontSize: '48px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}>
              Nos <span style={{ color: '#C8A96E' }}>Avantages Cles</span>
            </h2>
            <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400 }}>
              Ce qui nous differencie au quotidien
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((item, idx) => {
              const Icon = item.Icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-8 transition-all duration-300"
                  style={{ background: 'rgba(26,40,71,0.3)', border: '1px solid rgba(200,169,110,0.2)', cursor: 'default' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,40,71,0.5)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(26,40,71,0.3)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Icon size={32} style={{ color: '#C8A96E', marginBottom: '16px' }} />
                  <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 400, color: '#F9F5EF', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#8A9BB0', fontSize: '14px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.6' }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    

      {/* CTA FINAL */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="mb-6" style={{ fontSize: '48px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}>
            Parlons de votre <span style={{ color: '#C8A96E' }}>projet</span>
          </h2>
          <p className="mb-10" style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.7' }}>
            Une consultation gratuite suffit pour vous orienter honnetement sur votre projet de vente, d&apos;achat ou de location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)', color: '#0D1F3C', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500 }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(200,169,110,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Demander une consultation <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/212605585720"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all duration-300"
              style={{ border: '1px solid rgba(200,169,110,0.4)', color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500, background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200,169,110,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Phone size={18} />
              Nous ecrire sur WhatsApp
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}