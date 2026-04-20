'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Phone, BarChart2, Camera, Globe, Users, TrendingUp, Shield, Target } from 'lucide-react';

export default function CommercializationPage() {

  const steps = [
    { number: '01', title: 'Diagnostic du projet', description: "Analyse du projet, de son emplacement, de la concurrence locale et des acheteurs cibles. Identification des points forts a valoriser." },
    { number: '02', title: 'Strategie et positionnement', description: "Definition du prix juste, du profil acheteur cible et du message commercial adapte au marche casablancais." },
    { number: '03', title: 'Production de contenu', description: "Photos et videos professionnelles du projet. Fiches techniques detaillees et visuels adaptes aux plateformes marocaines." },
    { number: '04', title: 'Lancement commercial', description: "Publication sur toutes les plateformes : Mubawab, Avito, Sarouty, Facebook, Instagram. Activation du reseau d'acheteurs qualifies." },
    { number: '05', title: 'Gestion des leads et visites', description: "Reception et qualification des contacts, organisation des visites, suivi des prospects serieux jusqu'a l'offre d'achat." },
    { number: '06', title: 'Suivi et rapport mensuel', description: "Rapport mensuel complet sur les vues, contacts, visites et ventes. Ajustements de strategie selon les resultats." }
  ];

  const features = [
    { Icon: Camera, title: 'Contenu professionnel', detail: 'Photos, videos et fiches techniques pour valoriser chaque bien du projet' },
    { Icon: Globe, title: 'Diffusion maximale', detail: 'Mubawab, Avito, Sarouty, Facebook, Instagram -- toutes les plateformes actives au Maroc' },
    { Icon: BarChart2, title: 'Rapport mensuel', detail: 'Vues, contacts, visites et ventes -- chiffres reels chaque mois' },
    { Icon: Users, title: 'Reseau acheteurs', detail: "Acces a une base de contacts qualifies cherchant activement a acheter a Casablanca" },
  ];

  const advantages = [
    { Icon: Users, title: 'Partenariat exclusif', description: "Un seul partenaire commercial pour votre projet. Mohamed Sabbar suit personnellement chaque dossier." },
    { Icon: TrendingUp, title: 'Resultats mesurables', description: 'Chaque action est trackee et reportee. Vous savez exactement ou en est votre projet chaque mois.' },
    { Icon: Target, title: 'Ciblage marche local', description: 'Connaissance fine des acheteurs casablancais : leur budget, leurs quartiers preferes, leurs criteres.' },
    { Icon: Shield, title: 'Securite juridique', description: "Accompagnement jusqu'a l'acte notarie. Verification des documents et coordination avec le notaire." },
    { Icon: Camera, title: 'Mise en valeur du projet', description: 'Photos et videos professionnelles qui valorisent votre projet face a la concurrence.' },
    { Icon: BarChart2, title: 'Transparence totale', description: "Rapport mensuel detaille, acces aux statistiques de diffusion. Zero surprise sur les performances." },
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

      {/* ── HERO B2B — 2 colonnes ── */}
      <section className="px-[5%]" style={{ paddingTop: '88px', paddingBottom: '88px', background: 'linear-gradient(135deg, rgba(26,40,71,0.55), rgba(5,13,26,0.25))' }}>
        <div
          className="max-w-[1400px] mx-auto"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}
        >

          {/* ── Colonne gauche ── */}
          <div>
            <div
              className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full"
              style={{ border: '1px solid rgba(200,169,110,0.28)', background: 'rgba(200,169,110,0.05)' }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C8A96E', display: 'inline-block' }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500 }}>
                Réservé aux promoteurs · Casablanca
              </span>
            </div>

            <h1 style={{ fontSize: '52px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF', lineHeight: 1.12, margin: '0 0 20px' }}>
              Votre projet vendu.<br />
              <span style={{ color: '#C8A96E', fontStyle: 'italic' }}>Sans compromis.</span>
            </h1>

            <div style={{ width: 40, height: 1, background: 'rgba(200,169,110,0.35)', margin: '0 0 28px' }} />

            <p style={{ fontSize: '17px', color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.8', margin: '0 0 14px', maxWidth: '500px' }}>
              Landmark Estate prend en charge la commercialisation complète de votre projet immobilier à Casablanca — de la stratégie de prix jusqu&apos;à la signature chez le notaire.
            </p>

            <p style={{ fontSize: '15px', color: '#6B7E96', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.7', maxWidth: '480px', margin: '0 0 52px' }}>
              <span style={{ color: '#C8A96E', fontWeight: 500 }}>Mohamed Sabbar</span>, marketeur et commercial spécialisé en immobilier, suit personnellement chaque projet en partenariat exclusif.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { title: 'Un seul interlocuteur', desc: 'Mohamed Sabbar suit chaque dossier personnellement, du diagnostic à la remise des clés.' },
                { title: 'Exclusivité totale', desc: 'Aucune concurrence interne. Votre projet est notre unique priorité commerciale.' },
                { title: 'Résultats transparents', desc: 'Rapport mensuel réel — vues, leads, visites, ventes. Rien de caché.' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                  <div style={{ width: '1px', background: 'rgba(200,169,110,0.4)', minHeight: '46px', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", margin: '0 0 5px' }}>{item.title}</p>
                    <p style={{ fontSize: '13px', color: '#5D7087', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Colonne droite ── */}
          <div style={{ borderLeft: '1px solid rgba(200,169,110,0.1)', paddingLeft: '64px', paddingTop: '4px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3D5268', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500, margin: '0 0 36px' }}>
              Ce que nous prenons en charge
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {[
                { num: '01', title: 'Stratégie & positionnement', desc: 'Prix juste, profil acheteur cible, message commercial adapté au marché casablancais.' },
                { num: '02', title: 'Contenu & visibilité', desc: 'Photos et vidéos professionnelles, diffusion sur Mubawab, Avito, Sarouty, Facebook, Instagram.' },
                { num: '03', title: 'Gestion commerciale', desc: "Qualification des leads, organisation des visites, suivi des prospects jusqu'à l'offre d'achat." },
                { num: '04', title: "Suivi jusqu'au notaire", desc: 'Coordination des dossiers, vérification des documents et accompagnement à la signature.' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#C8A96E', fontWeight: 300, letterSpacing: '0.04em', paddingTop: '2px', minWidth: '22px', flexShrink: 0 }}>{item.num}</span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#C4B89A', fontFamily: "'DM Sans', system-ui, sans-serif", margin: '0 0 6px' }}>{item.title}</p>
                    <p style={{ fontSize: '13px', color: '#4A6075', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '44px', paddingTop: '28px', borderTop: '1px solid rgba(200,169,110,0.1)' }}>
              <p style={{ fontSize: '10px', color: '#3D5268', fontFamily: "'DM Sans', system-ui, sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Commission de commercialisation</p>
              <p style={{ fontSize: '28px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#C8A96E', margin: '0 0 6px', lineHeight: 1 }}>2.5% du prix de vente</p>
              <p style={{ fontSize: '12px', color: '#3D5268', fontFamily: "'DM Sans', system-ui, sans-serif", margin: 0 }}>Tous les services inclus · Zéro frais cachés</p>
            </div>
          </div>

        </div>
      </section>

      {/* ENGAGEMENTS QUALITATIFS */}
      <section className="py-16 px-[5%]" style={{ background: 'rgba(26,40,71,0.4)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: 'Exclusivite', detail: 'Un seul partenaire commercial pour votre projet, sans concurrence interne' },
              { label: 'Transparence', detail: 'Rapport mensuel reel sur les vues, contacts, visites et ventes' },
              { label: 'Engagement', detail: "Accompagnement complet de la mise en marche a la signature notariale" },
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
                Partenaire commercial<br /><span style={{ color: '#C8A96E' }}>de votre projet</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.8' }}>
                  Landmark Estate accompagne les promoteurs dans la commercialisation exclusive de leurs projets immobiliers a Casablanca. Nous combinons connaissance terrain du marche local, strategie marketing adaptee au client marocain et suivi rigoureux des performances.
                </p>
                <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.8' }}>
                  En tant que promoteur, vous gardez le contr&ocirc;le de votre projet et de votre marge. Nous nous chargeons de tout le reste : visibilite, contacts, visites, negociation et coordination notariale.
                </p>
                <p style={{ color: '#8A9BB0', fontSize: '15px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.8', paddingTop: '16px', borderTop: '1px solid rgba(200,169,110,0.12)' }}>
                  <span style={{ color: '#C8A96E', fontWeight: 500 }}>Mohamed Sabbar</span> &mdash; marketeur et commercial specialise en immobilier &mdash; prend personnellement en charge chaque partenariat. Vous avez un interlocuteur unique qui connait votre projet et defend vos interets.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.Icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl p-6 transition-all duration-300"
                    style={{ background: 'rgba(26,40,71,0.4)', border: '1px solid rgba(200,169,110,0.2)', cursor: 'default' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,40,71,0.6)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(26,40,71,0.4)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.2)'; }}
                  >
                    <Icon size={28} style={{ color: '#C8A96E', marginBottom: '12px' }} />
                    <h3 style={{ color: '#F9F5EF', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', fontWeight: 300, marginBottom: '8px' }}>
                      {feature.title}
                    </h3>
                    <p style={{ color: '#8A9BB0', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '13px', lineHeight: 1.6 }}>
                      {feature.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESSUS EN 6 ETAPES */}
      <section className="py-24 px-[5%]" style={{ background: 'rgba(26,40,71,0.4)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontSize: '48px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}>
              Notre methodologie en <span style={{ color: '#C8A96E' }}>6 etapes</span>
            </h2>
            <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400 }}>
              Un processus structure du diagnostic a la derniere vente
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
              Nos <span style={{ color: '#C8A96E' }}>avantages cles</span>
            </h2>
            <p style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400 }}>
              Ce qui nous differencie sur le marche casablancais
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
      <section className="py-24 px-[5%]" style={{ background: 'rgba(26,40,71,0.4)' }}>
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="mb-6" style={{ fontSize: '48px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#F9F5EF' }}>
            Parlons de <span style={{ color: '#C8A96E' }}>votre projet</span>
          </h2>
          <p className="mb-10" style={{ color: '#8A9BB0', fontSize: '16px', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400, lineHeight: '1.7' }}>
            Une consultation gratuite avec Mohamed Sabbar pour evaluer votre projet et vous proposer une strategie de commercialisation adaptee au marche casablancais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)', color: '#0D1F3C', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500, textDecoration: 'none' }}
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
              style={{ border: '1px solid rgba(200,169,110,0.4)', color: '#C8A96E', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500, background: 'transparent', textDecoration: 'none' }}
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