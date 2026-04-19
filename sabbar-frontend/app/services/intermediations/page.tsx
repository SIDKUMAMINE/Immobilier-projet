'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Phone, FileSearch, Users, MessageSquare, ShieldCheck, MapPin, Star } from 'lucide-react';

export default function IntermediationsPage() {

  const benefits = [
    'Acces a un portefeuille de biens verifies et selectionnes',
    'Estimation professionnelle et conseil de prix',
    'Diffusion multi-plateformes : Mubawab, Avito, Sarouty, reseaux sociaux',
    'Negociation professionnelle et securisee',
    'Verification du titre foncier avant chaque visite',
    'Accompagnement administratif et juridique complet',
    'Suivi jusqu\'a la signature chez le notaire',
  ];

  const steps = [
    {
      number: '01',
      title: 'Identification du projet',
      description: 'Premier contact pour comprendre votre projet : type de bien, quartier, budget, delai. Nous definissons ensemble les criteres essentiels.'
    },
    {
      number: '02',
      title: 'Analyse et conseil',
      description: 'Etude du marche local, estimation du prix juste, conseil sur les quartiers et les tendances de prix a Casablanca et regions.'
    },
    {
      number: '03',
      title: 'Visite du bien',
      description: 'Organisation des visites avec verification du titre foncier au prealable. Compte-rendu immediat apres chaque visite.'
    },
    {
      number: '04',
      title: 'Offre et negociation',
      description: 'Accompagnement dans la formulation de l\'offre et la negociation. Nous defendons vos interets pour obtenir les meilleures conditions.'
    },
    {
      number: '05',
      title: 'Dossier et acte notarie',
      description: 'Preparation et suivi de tous les documents : compromis, acte de vente, dossier fiscal. Coordination avec le notaire jusqu\'a la signature.'
    },
    {
      number: '06',
      title: 'Remise des cles et suivi',
      description: 'Accompagnement le jour de la signature, remise des cles et support post-vente pour toute question administrative.'
    }
  ];

  const advantages = [
    {
      Icon: FileSearch,
      title: 'Estimation precise',
      description: 'Connaissance terrain du marche casablancais pour un prix juste, ni sous-evalue ni hors marche.'
    },
    {
      Icon: MessageSquare,
      title: 'Disponibilite reelle',
      description: 'Un seul interlocuteur joignable sur WhatsApp, avec une reponse garantie sous 2h, 7j/7.'
    },
    {
      Icon: Users,
      title: 'Diffusion large',
      description: 'Publication sur Mubawab, Avito, Sarouty, Facebook et Instagram pour une visibilite maximale.'
    },
    {
      Icon: ShieldCheck,
      title: 'Securite juridique',
      description: 'Verification du titre foncier, accompagnement notarial et suivi de toute la documentation legale.'
    },
    {
      Icon: MapPin,
      title: 'Connaissance locale',
      description: 'Expertise des quartiers de Casablanca et de Berrechid : prix reels, tendances, atouts de chaque secteur.'
    },
    {
      Icon: Star,
      title: 'Transparence totale',
      description: 'Commissions affichees clairement, zero frais cache, tout est explique avant chaque etape.'
    }
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
            Intermediation <span style={{ color: '#C8A96E' }}>Immobiliere</span>
          </h1>
          <p className="max-w-2xl mb-4" style={{ fontSize: '18px', color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.7' }}>
            Vente, achat, location — nous gerons chaque etape de votre transaction avec transparence et rigueur, de la premiere visite a la signature chez le notaire.
          </p>
          <p className="max-w-2xl" style={{ fontSize: '15px', color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400 }}>
            <span style={{ color: '#C8A96E', fontWeight: 500 }}>Casablanca et regions</span> — commissions transparentes, titre foncier verifie, accompagnement complet.
          </p>
        </div>
      </section>

      {/* ENGAGEMENTS — remplace les fausses stats */}
      <section className="py-16 px-[5%]" style={{ background: 'rgba(26, 40, 71, 0.4)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { value: '14', label: 'Biens verifies et disponibles' },
              { value: '< 2h', label: 'Reponse garantie sur WhatsApp' },
              { value: '2 - 3%', label: 'Commission tout inclus, zero frais cache' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <p className="mb-2" style={{ fontSize: '36px', fontWeight: 300, color: '#C8A96E', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {item.value}
                </p>
                <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, fontSize: '13px' }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESCRIPTION + SERVICES */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 style={{ fontSize: '40px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF', marginBottom: '24px' }}>
                Votre Partenaire<br /><span style={{ color: '#C8A96E' }}>De Confiance</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.8' }}>
                  Landmark Estate gere chaque etape de votre transaction immobiliere avec professionnalisme et transparence. Que vous soyez vendeur, acheteur ou locataire, nous sommes votre interlocuteur unique du debut a la fin.
                </p>
                <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.8' }}>
                  Pour les <strong style={{ color: '#F9F5EF' }}>proprietaires</strong> : vente au juste prix avec une visibilite maximale. Pour les <strong style={{ color: '#F9F5EF' }}>acheteurs</strong> : acces a des biens verifies avec titre foncier propre. Pour tous : zero surprise et 100% de transparence.
                </p>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 400, color: '#F9F5EF', fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: '16px' }}>
                Ce qui est inclus
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} style={{ color: '#C8A96E', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ color: '#8A9BB0', fontSize: '14px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: 1.6 }}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte credit immobilier — besoin specifique marche marocain */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="rounded-2xl p-6" style={{ background: 'rgba(26,40,71,0.4)', border: '1px solid rgba(200,169,110,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF', marginBottom: '12px' }}>
                  Financement par credit immobilier
                </h3>
                <p style={{ color: '#8A9BB0', fontSize: '14px', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.7 }}>
                  Vous achetez par credit ? Nous vous accompagnons dans vos demarches aupres des banques marocaines (CIH, Attijari, BMCE, Bank of Africa) et vous aidons a constituer votre dossier de financement.
                </p>
              </div>
              <div className="rounded-2xl p-6" style={{ background: 'rgba(26,40,71,0.4)', border: '1px solid rgba(200,169,110,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF', marginBottom: '12px' }}>
                  Titre foncier et securite documentaire
                </h3>
                <p style={{ color: '#8A9BB0', fontSize: '14px', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.7 }}>
                  Avant toute visite, nous verifions le statut du titre foncier (TF ou melkia) et l\'absence de litige. Vous visitez uniquement des biens dont les documents sont en regle.
                </p>
              </div>
              <div className="rounded-2xl p-6" style={{ background: 'rgba(26,40,71,0.4)', border: '1px solid rgba(200,169,110,0.2)' }}>
                <h3 style={{ fontSize: '18px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF', marginBottom: '12px' }}>
                  Frais de notaire
                </h3>
                <p style={{ color: '#8A9BB0', fontSize: '14px', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.7 }}>
                  Les frais de notaire au Maroc representent environ 2.5 a 4% du prix de vente et sont a la charge de l\'acheteur. Nous vous aidons a les calculer en amont pour eviter toute surprise.
                </p>
              </div>
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

      {/* AVANTAGES CLES — sans emojis */}
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

      {/* TARIFICATION */}
      <section className="py-24 px-[5%]" style={{ background: 'rgba(26,40,71,0.4)' }}>
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4" style={{ fontSize: '40px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}>
              Tarification <span style={{ color: '#C8A96E' }}>Transparente</span>
            </h2>
            <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400 }}>
              Commissions tout inclus — aucun supplement apres signature
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(200,169,110,0.25)' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #C8A96E 0%, #E2C98A 50%, rgba(200,169,110,0.2) 100%)' }} />
            <div style={{ background: 'rgba(13,31,60,0.6)', padding: '40px' }}>

              {/* Grille des taux */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { segment: 'Luxe (4M MAD et plus)', taux: '2.0%' },
                  { segment: 'Milieu de gamme (1M — 3M MAD)', taux: '2.5%' },
                  { segment: 'Accessible (moins de 1M MAD)', taux: '3.0%' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderBottom: idx < 2 ? '1px solid rgba(200,169,110,0.1)' : 'none'
                    }}
                  >
                    <span style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '15px' }}>
                      {item.segment}
                    </span>
                    <span style={{ color: '#C8A96E', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: 300 }}>
                      {item.taux}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ce qui est inclus */}
              <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(200,169,110,0.12)' }}>
                <p style={{ color: 'rgba(200,169,110,0.7)', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
                  Tout est inclus dans ces commissions
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    'Estimation et conseil de prix',
                    'Diffusion multi-plateformes',
                    'Organisation et suivi des visites',
                    'Negociation et gestion des offres',
                    'Verification du titre foncier',
                    'Accompagnement chez le notaire',
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={14} style={{ color: '#C8A96E', flexShrink: 0 }} />
                      <span style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '13px' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note frais de notaire */}
              <div style={{ marginTop: '20px', padding: '14px 16px', background: 'rgba(200,169,110,0.06)', borderRadius: '8px', border: '1px solid rgba(200,169,110,0.15)' }}>
                <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                  <span style={{ color: '#C8A96E', fontWeight: 500 }}>Frais de notaire :</span> environ 2.5 a 4% du prix de vente, reglementaires et a la charge de l&apos;acheteur. Nous vous aidons a les calculer en amont pour eviter toute surprise.
                </p>
              </div>

            </div>
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