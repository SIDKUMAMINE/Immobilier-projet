import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estimation de Bien | LANDMARK ESTATE',
  description:
    'Obtenez une estimation gratuite et professionnelle de votre bien immobilier à Casablanca et au Maroc. Expertise LANDMARK ESTATE.',
};

export default function EstimationPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D1F3C 0%, #162D4F 50%, #0D1F3C 100%)',
      }}
    >
      {/* ─────────────────────────────────────────
          HERO — Titre de la page
      ───────────────────────────────────────── */}
      <section
        style={{
          padding: '80px 24px 60px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(200, 169, 110, 0.15)',
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C8A96E',
            marginBottom: '16px',
          }}
        >
          Service Gratuit
        </p>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 600,
            color: '#F9F5EF',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}
        >
          Estimation de Votre Bien
        </h1>

        <p
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: '17px',
            color: 'rgba(226, 201, 138, 0.75)',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Recevez une évaluation précise et gratuite de votre bien immobilier
          par nos experts. Résultat sous 24h.
        </p>
      </section>

      {/* ─────────────────────────────────────────
          ZONE PRINCIPALE — À compléter
      ───────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '80px 24px',
        }}
      >
        {/* 
          ╔══════════════════════════════════════════╗
          ║   ESPACE RÉSERVÉ — FORMULAIRE D'ESTIMATION ║
          ║                                            ║
          ║  À intégrer ici :                         ║
          ║  • Type de bien (appartement, villa...)   ║
          ║  • Superficie (m²)                        ║
          ║  • Localisation / quartier                ║
          ║  • Étage, état général, équipements       ║
          ║  • Coordonnées du demandeur               ║
          ╚══════════════════════════════════════════╝
        */}

        {/* Placeholder visuel — à supprimer quand le formulaire est prêt */}
        <div
          style={{
            border: '2px dashed rgba(200, 169, 110, 0.3)',
            borderRadius: '16px',
            padding: '80px 40px',
            textAlign: 'center',
            background: 'rgba(200, 169, 110, 0.03)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(200, 169, 110, 0.1)',
              border: '1px solid rgba(200, 169, 110, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '28px',
            }}
          >
            🏠
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '28px',
              fontWeight: 500,
              color: '#F9F5EF',
              marginBottom: '12px',
            }}
          >
            Formulaire d'estimation
          </h2>

          <p
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: '15px',
              color: 'rgba(226, 201, 138, 0.6)',
              maxWidth: '400px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Le formulaire d'estimation sera intégré ici.
            <br />
            Cette zone est prête à recevoir votre contenu.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          BLOC DE CONFIANCE — Chiffres / garanties
          (optionnel — à activer ou supprimer)
      ───────────────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid rgba(200, 169, 110, 0.15)',
          padding: '60px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            textAlign: 'center',
          }}
        >
          {[
            { icon: '⚡', label: 'Réponse sous 24h', sub: 'Délai garanti' },
            { icon: '🎯', label: '100% Gratuit', sub: 'Sans engagement' },
            { icon: '🔒', label: 'Confidentiel', sub: 'Données sécurisées' },
            { icon: '📊', label: 'Expertise locale', sub: 'Marché casablancais' },
          ].map(({ icon, label, sub }) => (
            <div key={label}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#F9F5EF',
                  marginBottom: '4px',
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '13px',
                  color: 'rgba(200, 169, 110, 0.7)',
                }}
              >
                {sub}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}