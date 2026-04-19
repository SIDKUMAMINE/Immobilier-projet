'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Users, Target, Zap, Shield, TrendingUp, MapPin, Phone } from 'lucide-react';

export default function AProposPage() {
  return (
    <main style={{ background: 'linear-gradient(to bottom, #0D1F3C, #050D1A)' }}>

      {/* Back Button */}
      <div
        className="py-4 px-[5%] border-b"
        style={{ background: 'rgba(26, 40, 71, 0.5)', borderColor: 'rgba(200, 169, 110, 0.2)' }}
      >
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
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="mb-6"
            style={{ fontSize: '52px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}
          >
            A Propos de <span style={{ color: '#C8A96E' }}>Landmark Estate</span>
          </h1>
          <p
            className="text-lg"
            style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.8' }}
          >
            Votre partenaire immobilier de confiance a Casablanca — de la premiere visite a la signature chez le notaire.
          </p>
        </div>
      </section>

      {/* QUI SOMMES-NOUS */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            <div>
              <h2
                className="mb-8"
                style={{ fontSize: '42px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}
              >
                Notre <span style={{ color: '#C8A96E' }}>Histoire</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, fontSize: '16px', lineHeight: '1.8' }}>
                  Landmark Estate est nee d&apos;un constat simple : le marche immobilier casablancais manque de transparence et de suivi. Trop d&apos;acquereurs naviguent sans accompagnement, trop de vendeurs attendent sans nouvelles.
                </p>
                <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, fontSize: '16px', lineHeight: '1.8' }}>
                  Fondee a Casablanca par <span style={{ color: '#C8A96E', fontWeight: 600 }}>Mohamed Sabbar</span>, notre agence s&apos;est donnee une mission precise : etre l&apos;interlocuteur unique et fiable pour les promoteurs qui souhaitent commercialiser leurs projets, et pour les particuliers qui veulent acheter, vendre ou louer en toute serenite.
                </p>
                <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, fontSize: '16px', lineHeight: '1.8' }}>
                  Nous operons aujourd&apos;hui sur <strong style={{ color: '#F9F5EF' }}>Casablanca et Berrechid</strong>, avec un portefeuille de biens verifies et une disponibilite reelle — pas une hotline, mais un interlocuteur qui connait votre dossier.
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl p-10"
              style={{ background: 'rgba(200, 169, 110, 0.05)', border: '1px solid rgba(200, 169, 110, 0.2)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid rgba(200,169,110,0.15)' }}>
                <div
                  style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '20px', fontWeight: 500, color: '#0D1F3C',
                    fontFamily: "'Cormorant Garamond', Georgia, serif"
                  }}
                >
                  MS
                </div>
                <div>
                  <p style={{ color: '#F9F5EF', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 300, margin: 0 }}>
                    Mohamed Sabbar
                  </p>
                  <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '13px', margin: '4px 0 0' }}>
                    Fondateur — Landmark Estate
                  </p>
                </div>
              </div>

              <h3 style={{ color: '#C8A96E', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 300, marginBottom: '16px' }}>
                Nos engagements concrets
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  '14 biens disponibles, verifies et publies',
                  'Reponse WhatsApp garantie sous 2h',
                  'Verification du titre foncier avant chaque visite',
                  "Accompagnement jusqu'a l'acte notarie",
                  'Diffusion sur Mubawab, Avito et Sarouty',
                  'Rapport de suivi mensuel pour les promoteurs',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} style={{ color: '#C8A96E', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', lineHeight: 1.6 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(200,169,110,0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} style={{ color: '#C8A96E' }} />
                  <a href="tel:+212605585720" style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '13px', textDecoration: 'none' }}>
                    +212 6 05 58 57 20
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} style={{ color: '#C8A96E' }} />
                  <span style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '13px' }}>
                    Casablanca, Maroc
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALEURS */}
      <section className="py-24 px-[5%]" style={{ background: 'rgba(26, 40, 71, 0.4)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                label: 'Notre mission',
                text: "Simplifier chaque etape d'une transaction immobiliere a Casablanca. Un seul interlocuteur, du premier contact a l'acte notarie."
              },
              {
                label: 'Notre vision',
                text: 'Devenir la reference locale pour les promoteurs qui cherchent un partenaire commercial serieux, et pour les familles qui cherchent leur chez-soi au Maroc.'
              },
              {
                label: 'Nos valeurs',
                text: "Integrite sur les documents, transparence sur les prix, reactivite sur les reponses. Chaque promesse que nous faisons est une promesse que nous tenons."
              }
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C8A96E' }} />
                </div>
                <h3 style={{ fontSize: '24px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#C8A96E', marginBottom: '12px' }}>
                  {item.label}
                </h3>
                <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, fontSize: '15px', lineHeight: '1.7' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODELE BI-SEGMENTE */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <h2
            className="text-center mb-16"
            style={{ fontSize: '48px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}
          >
            Notre Modele <span style={{ color: '#C8A96E' }}>Bi-Segmente</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8" style={{ background: 'rgba(26, 40, 71, 0.4)', border: '1px solid rgba(200, 169, 110, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} style={{ color: '#C8A96E' }} />
                </div>
                <h3 style={{ fontSize: '24px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}>
                  Commercialisation B2B
                </h3>
              </div>
              <p style={{ color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500, fontSize: '13px', marginBottom: '20px' }}>
                Pour les promoteurs immobiliers
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Prise en charge complete de la commercialisation',
                  'Strategie marketing 360 — digital et terrain',
                  'Contenu professionnel : photos, videos, visites 360',
                  'Campagnes multi-canaux : Mubawab, Avito, reseaux sociaux',
                  'Rapport mensuel detaille sur les performances',
                  "Partenariat exclusif avec alignement d'objectifs",
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} style={{ color: '#C8A96E', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-8" style={{ background: 'rgba(26, 40, 71, 0.4)', border: '1px solid rgba(200, 169, 110, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={20} style={{ color: '#C8A96E' }} />
                </div>
                <h3 style={{ fontSize: '24px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}>
                  Intermediation B2C
                </h3>
              </div>
              <p style={{ color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500, fontSize: '13px', marginBottom: '20px' }}>
                Pour les proprietaires, acheteurs et investisseurs
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Estimation professionnelle de votre bien',
                  'Diffusion sur les plateformes leaders au Maroc',
                  'Gestion des visites et negociations',
                  'Verification des documents et titre foncier',
                  'Accompagnement administratif et juridique',
                  "Suivi jusqu'a la signature chez le notaire",
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} style={{ color: '#C8A96E', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILIERS */}
      <section className="py-24 px-[5%]" style={{ background: 'rgba(26, 40, 71, 0.4)' }}>
        <div className="max-w-[1400px] mx-auto">
          <h2
            className="text-center mb-16"
            style={{ fontSize: '48px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}
          >
            Nos <span style={{ color: '#C8A96E' }}>Piliers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Integrite', description: 'Transparence totale sur les documents, les prix et les delais. Zero surprise entre la promesse et la realite.' },
              { icon: Target, title: 'Excellence', description: "Un processus structure de la mise en marche a la signature. Chaque bien est presente avec le soin qu'il merite." },
              { icon: Users, title: 'Partenariat', description: 'Un seul interlocuteur du debut a la fin. Votre succes est notre succes — nous nous y engageons.' },
              { icon: Zap, title: 'Innovation', description: 'Presence digitale complete : site web, reseaux sociaux, plateformes immobilieres. Votre bien vu partout.' },
              { icon: TrendingUp, title: 'Resultats', description: 'Des actions mesurables et un suivi regulier. Vous savez a tout moment ou en est votre projet.' },
              { icon: CheckCircle2, title: 'Expertise', description: 'Connaissance terrain du marche casablancais et berrechidois. Nous conseillons en toute honnetete.' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-8"
                  style={{ background: 'rgba(26, 40, 71, 0.3)', border: '1px solid rgba(200, 169, 110, 0.2)', transition: 'all 0.3s ease', cursor: 'default' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26, 40, 71, 0.5)'; e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.4)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(26, 40, 71, 0.3)'; e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Icon size={32} style={{ color: '#C8A96E', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF', marginBottom: '12px' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, fontSize: '14px', lineHeight: '1.6' }}>
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
          <h2
            className="mb-6"
            style={{ fontSize: '48px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}
          >
            Parlons de votre <span style={{ color: '#C8A96E' }}>projet</span>
          </h2>
          <p
            className="mb-10"
            style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.7' }}
          >
            Que vous soyez promoteur, proprietaire ou acheteur — une consultation gratuite suffit pour vous orienter honnêtement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)', color: '#0D1F3C', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500 }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(200, 169, 110, 0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Prendre rendez-vous
            </Link>

            <a
              href="https://wa.me/212605585720"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all duration-300"
              style={{ background: 'transparent', border: '1px solid rgba(200, 169, 110, 0.4)', color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200,169,110,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Nous ecrire sur WhatsApp
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}