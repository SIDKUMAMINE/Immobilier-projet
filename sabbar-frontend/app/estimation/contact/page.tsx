'use client';

import { useState, useEffect } from 'react';
import { Send, ArrowLeft, MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  publicKey: 'hTTnBv9DSUcGkL6Bl',
  serviceId: 'service_yktzmd1',
  templateId: 'template_b8rxmer',
};

const WHATSAPP_NUMBER = '212605585720';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  phone: string;
  ville: string;
  quartier: string;
  typeBien: string;
  regime: string;
  surface: string;
  budget: string;
  message: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
`;

export default function EstimationContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '',
    ville: '', quartier: '', typeBien: '',
    regime: '', surface: '', budget: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendWhatsApp = (data: FormData) => {
    const msg =
`🏠 *Demande d'expertise — Estimation LANDMARK ESTATE*
━━━━━━━━━━━━━━━━━━━━━

👤 *Contact*
Nom : ${data.name}
Email : ${data.email}
Tél : ${data.phone || 'Non renseigné'}

📍 *Bien immobilier*
Ville : ${data.ville}
Quartier : ${data.quartier}
Type : ${data.typeBien || 'Non précisé'}
Régime : ${data.regime || 'Non précisé'}
Surface : ${data.surface ? data.surface + ' m²' : 'Non précisée'}
Budget : ${data.budget || 'Non précisé'}

💬 *Message :*
${data.message || '—'}

_Source : Page Estimation — LANDMARK ESTATE_`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Non fourni',
        subject: `[Estimation] ${formData.typeBien || 'Bien'} — ${formData.ville}, ${formData.quartier}`,
        message: `Ville : ${formData.ville}\nQuartier : ${formData.quartier}\nType : ${formData.typeBien}\nRégime : ${formData.regime}\nSurface : ${formData.surface} m²\nBudget : ${formData.budget}\n\nMessage : ${formData.message}`,
        reply_to: formData.email,
      });

      setSubmitted(true);
      const copy = { ...formData };
      setFormData({ name: '', email: '', phone: '', ville: '', quartier: '', typeBien: '', regime: '', surface: '', budget: '', message: '' });
      setTimeout(() => sendWhatsApp(copy), 600);
      setTimeout(() => setSubmitted(false), 10000);
    } catch (err: any) {
      setError('Erreur lors de l\'envoi. Contactez-nous directement par WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  // ── Input helpers ─────────────────────────────────────────────────────────

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '10px',
    background: 'rgba(13, 31, 60, 0.6)',
    border: '1px solid rgba(200, 169, 110, 0.18)',
    color: '#F9F5EF',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '15px',
    fontWeight: 400,
    outline: 'none',
    transition: 'all 0.25s ease',
    boxSizing: 'border-box',
  };

  const inputFocused: React.CSSProperties = {
    ...inputBase,
    border: '1px solid rgba(200, 169, 110, 0.6)',
    background: 'rgba(13, 31, 60, 0.85)',
    boxShadow: '0 0 0 3px rgba(200, 169, 110, 0.08)',
  };

  const getInputStyle = (name: string) => focused === name ? inputFocused : inputBase;

  const focusProps = (name: string) => ({
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
  });

  const LabelEl = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <label style={{
      display: 'block',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      color: 'rgba(200, 169, 110, 0.7)',
      marginBottom: '8px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {children}
      {required && <span style={{ color: '#B5573A', marginLeft: '3px' }}>*</span>}
    </label>
  );

  const Field = ({ children, half }: { children: React.ReactNode; half?: boolean }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      {children}
    </div>
  );

  // ── Chip selector ─────────────────────────────────────────────────────────

  const ChipSelect = ({
    name, options, value, onChange,
  }: { name: string; options: string[]; value: string; onChange: (v: string) => void }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          style={{
            padding: '9px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap' as const,
            background: value === opt ? 'rgba(200, 169, 110, 0.15)' : 'rgba(13, 31, 60, 0.5)',
            border: `1px solid ${value === opt ? '#C8A96E' : 'rgba(200, 169, 110, 0.18)'}`,
            color: value === opt ? '#C8A96E' : 'rgba(249, 245, 239, 0.6)',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  if (!mounted) return null;

  return (
    <>
      <style>{`
        ${fonts}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: rgba(122, 143, 163, 0.5) !important; }
        option { background: #0D1F3C; color: #F9F5EF; }
        select { appearance: none; -webkit-appearance: none; cursor: pointer; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .anim-fade { animation: fadeUp 0.6s ease both; }
        .anim-1 { animation-delay: 0.1s; }
        .anim-2 { animation-delay: 0.2s; }
        .anim-3 { animation-delay: 0.3s; }
        .anim-4 { animation-delay: 0.4s; }
        @media (max-width: 900px) {
          .two-col { grid-template-columns: 1fr !important; }
          .side-panel { display: none !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          .form-grid > * { grid-column: span 1 !important; }
        }
        @media (max-width: 600px) {
          .hero-title { font-size: 36px !important; }
          .card-pad { padding: 28px 20px !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0D1F3C 0%, #091629 40%, #050D1A 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Ambient glows */}
        <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '-150px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,110,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Top bar */}
        <div style={{
          borderBottom: '1px solid rgba(200, 169, 110, 0.12)',
          background: 'rgba(13, 31, 60, 0.7)',
          backdropFilter: 'blur(12px)',
          padding: '16px 5%',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link
              href="/estimation"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                color: '#C8A96E', textDecoration: 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '14px', fontWeight: 500,
                transition: 'gap 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.gap = '12px')}
              onMouseLeave={e => (e.currentTarget.style.gap = '8px')}
            >
              <ArrowLeft size={16} />
              Retour à l'estimation
            </Link>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '18px', fontWeight: 300,
              color: '#E2C98A', letterSpacing: '0.08em',
            }}>
              LANDMARK ESTATE
            </div>
          </div>
        </div>

        {/* Hero */}
        <section style={{ padding: '72px 5% 56px', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>

            <div className="anim-fade anim-1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '100px',
              border: '1px solid rgba(200, 169, 110, 0.25)',
              background: 'rgba(200, 169, 110, 0.05)',
              marginBottom: '28px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C8A96E', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{
                fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em',
                textTransform: 'uppercase', color: '#C8A96E',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}>
                Expertise offerte · Réponse sous 24h
              </span>
            </div>

            <h1 className="anim-fade anim-2 hero-title" style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '52px', fontWeight: 300,
              color: '#F9F5EF', lineHeight: 1.1,
              marginBottom: '20px',
            }}>
              Contactez un expert<br />
              <span style={{ color: '#C8A96E', fontStyle: 'italic' }}>pour votre estimation</span>
            </h1>

            <p className="anim-fade anim-3" style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: '16px', fontWeight: 400,
              color: '#7A8FA3', lineHeight: 1.8,
              maxWidth: '520px', margin: '0 auto',
            }}>
              Vous avez reçu votre estimation en ligne — parlez maintenant à Mohamed Sabbar
              pour une évaluation personnalisée et confidentielle de votre bien.
            </p>

          </div>
        </section>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.2), transparent)' }} />

        {/* Main content */}
        <section style={{ padding: '64px 5% 80px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px', alignItems: 'start' }}>

              {/* ── FORM ── */}
              <div className="anim-fade anim-2">

                {/* Success */}
                {submitted && (
                  <div style={{
                    marginBottom: '28px',
                    padding: '20px 24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    background: 'rgba(34, 197, 94, 0.06)',
                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                  }}>
                    <CheckCircle size={22} style={{ color: '#22c55e', flexShrink: 0, marginTop: '1px' }} />
                    <div>
                      <p style={{ color: '#22c55e', fontWeight: 600, fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: '4px' }}>
                        Message envoyé avec succès !
                      </p>
                      <p style={{ color: 'rgba(34,197,94,0.7)', fontSize: '13px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                        Mohamed Sabbar vous recontactera sous 24h. WhatsApp s'est ouvert — envoyez le message pour une réponse immédiate.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div style={{
                    marginBottom: '24px', padding: '16px 20px',
                    borderRadius: '10px', border: '1px solid rgba(181, 87, 58, 0.3)',
                    background: 'rgba(181, 87, 58, 0.06)',
                    fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', color: '#B5573A',
                  }}>
                    ❌ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* Section: Vos coordonnées */}
                  <div style={{ marginBottom: '36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #C8A96E, #E2C98A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#0D1F3C', fontFamily: "'Cormorant Garamond', Georgia, serif", flexShrink: 0 }}>1</div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontWeight: 400, color: '#F9F5EF' }}>Vos coordonnées</h2>
                    </div>

                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <Field half>
                        <LabelEl required>Nom complet</LabelEl>
                        <input
                          type="text" name="name" value={formData.name}
                          onChange={handleChange} required
                          placeholder="Votre nom et prénom"
                          style={getInputStyle('name')} {...focusProps('name')}
                        />
                      </Field>
                      <Field half>
                        <LabelEl>Téléphone</LabelEl>
                        <input
                          type="tel" name="phone" value={formData.phone}
                          onChange={handleChange}
                          placeholder="+212 6 00 00 00 00"
                          style={getInputStyle('phone')} {...focusProps('phone')}
                        />
                      </Field>
                      <Field>
                        <LabelEl required>Adresse email</LabelEl>
                        <input
                          type="email" name="email" value={formData.email}
                          onChange={handleChange} required
                          placeholder="votre@email.com"
                          style={getInputStyle('email')} {...focusProps('email')}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Separator */}
                  <div style={{ height: '1px', background: 'rgba(200,169,110,0.1)', marginBottom: '36px' }} />

                  {/* Section: Votre bien */}
                  <div style={{ marginBottom: '36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #C8A96E, #E2C98A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#0D1F3C', fontFamily: "'Cormorant Garamond', Georgia, serif", flexShrink: 0 }}>2</div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontWeight: 400, color: '#F9F5EF' }}>Votre bien</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                      <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Field half>
                          <LabelEl required>Ville</LabelEl>
                          <input
                            type="text" name="ville" value={formData.ville}
                            onChange={handleChange} required
                            placeholder="Ex : Casablanca"
                            style={getInputStyle('ville')} {...focusProps('ville')}
                          />
                        </Field>
                        <Field half>
                          <LabelEl required>Quartier</LabelEl>
                          <input
                            type="text" name="quartier" value={formData.quartier}
                            onChange={handleChange} required
                            placeholder="Ex : Maarif, Anfa..."
                            style={getInputStyle('quartier')} {...focusProps('quartier')}
                          />
                        </Field>
                      </div>

                      <div>
                        <LabelEl>Type de bien</LabelEl>
                        <ChipSelect
                          name="typeBien"
                          options={['Appartement', 'Villa', 'Riad', 'Bureau', 'Local commercial', 'Terrain']}
                          value={formData.typeBien}
                          onChange={v => setFormData(p => ({ ...p, typeBien: v }))}
                        />
                      </div>

                      <div>
                        <LabelEl>Régime</LabelEl>
                        <ChipSelect
                          name="regime"
                          options={['Vente', 'Location']}
                          value={formData.regime}
                          onChange={v => setFormData(p => ({ ...p, regime: v }))}
                        />
                      </div>

                      <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Field half>
                          <LabelEl>Superficie</LabelEl>
                          <input
                            type="text" name="surface" value={formData.surface}
                            onChange={handleChange}
                            placeholder="Ex : 120 m²"
                            style={getInputStyle('surface')} {...focusProps('surface')}
                          />
                        </Field>
                        <Field half>
                          <LabelEl>Budget / Prix souhaité</LabelEl>
                          <input
                            type="text" name="budget" value={formData.budget}
                            onChange={handleChange}
                            placeholder="Ex : 1,2 M MAD"
                            style={getInputStyle('budget')} {...focusProps('budget')}
                          />
                        </Field>
                      </div>

                    </div>
                  </div>

                  {/* Separator */}
                  <div style={{ height: '1px', background: 'rgba(200,169,110,0.1)', marginBottom: '36px' }} />

                  {/* Section: Message */}
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #C8A96E, #E2C98A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#0D1F3C', fontFamily: "'Cormorant Garamond', Georgia, serif", flexShrink: 0 }}>3</div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontWeight: 400, color: '#F9F5EF' }}>Informations complémentaires</h2>
                    </div>

                    <textarea
                      name="message" value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Décrivez votre projet, vos questions, ou tout élément utile pour notre expert..."
                      style={{ ...getInputStyle('message'), resize: 'none' }}
                      {...focusProps('message')}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: '17px',
                      borderRadius: '10px', border: 'none',
                      background: loading ? 'rgba(200, 169, 110, 0.4)' : 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)',
                      color: '#0D1F3C',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontSize: '15px', fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      transition: 'all 0.3s',
                      letterSpacing: '0.03em',
                    }}
                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(200,169,110,0.25)'; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {loading
                      ? <><div style={{ width: '18px', height: '18px', border: '2px solid #0D1F3C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><span>Envoi en cours...</span></>
                      : <><Send size={17} /><span>Envoyer ma demande</span></>
                    }
                  </button>

                  <p style={{
                    textAlign: 'center', marginTop: '14px',
                    fontSize: '12px', color: 'rgba(122, 143, 163, 0.7)',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>
                    💬 WhatsApp s'ouvrira automatiquement après l'envoi
                  </p>
                </form>
              </div>

              {/* ── SIDE PANEL ── */}
              <div className="side-panel anim-fade anim-3" style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Expert card */}
                <div style={{
                  background: 'rgba(13, 31, 60, 0.7)',
                  border: '1px solid rgba(200, 169, 110, 0.2)',
                  borderRadius: '16px', padding: '28px',
                  backdropFilter: 'blur(8px)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(200,169,110,0.3), rgba(226,201,138,0.1))',
                      border: '2px solid rgba(200,169,110,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '22px', fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: '#C8A96E', fontWeight: 300,
                    }}>
                      MS
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 400, color: '#F9F5EF', marginBottom: '2px' }}>
                        Mohamed Sabbar
                      </p>
                      <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '12px', color: '#C8A96E', fontWeight: 500, letterSpacing: '0.05em' }}>
                        Expert immobilier — Casablanca
                      </p>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', color: '#7A8FA3', lineHeight: 1.75, marginBottom: '20px' }}>
                    Spécialiste du marché casablancais depuis plus de 10 ans. Je vous apporte une analyse précise et confidentielle de la valeur de votre bien.
                  </p>
                  <div style={{ height: '1px', background: 'rgba(200,169,110,0.1)', marginBottom: '20px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <a href="tel:+212605585720" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2C98A', textDecoration: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#C8A96E'}
                      onMouseLeave={e => e.currentTarget.style.color = '#E2C98A'}>
                      <Phone size={15} style={{ color: '#C8A96E' }} /> +212 6 05 58 57 20
                    </a>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#25D366', textDecoration: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                      onMouseLeave={e => e.currentTarget.style.color = '#25D366'}>
                      <span style={{ fontSize: '15px' }}>💬</span> WhatsApp — réponse rapide
                    </a>
                    <a href="mailto:Landmarkestate3@gmail.com"
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2C98A', textDecoration: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#C8A96E'}
                      onMouseLeave={e => e.currentTarget.style.color = '#E2C98A'}>
                      <Mail size={15} style={{ color: '#C8A96E' }} /> Landmarkestate3@gmail.com
                    </a>
                  </div>
                </div>

                {/* Guarantees */}
                <div style={{
                  background: 'rgba(13, 31, 60, 0.5)',
                  border: '1px solid rgba(200, 169, 110, 0.15)',
                  borderRadius: '16px', padding: '24px',
                }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', fontWeight: 400, color: '#F9F5EF', marginBottom: '16px' }}>
                    Nos engagements
                  </p>
                  {[
                    { icon: '⚡', label: 'Réponse sous 24h', detail: 'Délai garanti, jours ouvrables' },
                    { icon: '🎯', label: 'Expertise gratuite', detail: 'Sans engagement ni frais' },
                    { icon: '🔒', label: 'Confidentialité totale', detail: 'Vos données restent privées' },
                    { icon: '📊', label: 'Analyse de marché', detail: 'Basée sur les données actuelles' },
                  ].map((g, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < 3 ? '14px' : '0' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>{g.icon}</span>
                      <div>
                        <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '13px', fontWeight: 500, color: '#E2C98A', marginBottom: '2px' }}>{g.label}</p>
                        <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '12px', color: '#5A6E82' }}>{g.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hours */}
                <div style={{
                  background: 'rgba(13, 31, 60, 0.5)',
                  border: '1px solid rgba(200, 169, 110, 0.12)',
                  borderRadius: '16px', padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                }}>
                  <Clock size={20} style={{ color: '#C8A96E', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '13px', fontWeight: 500, color: '#E2C98A', marginBottom: '2px' }}>
                      Disponible Lun–Sam
                    </p>
                    <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '12px', color: '#5A6E82' }}>
                      9h00 – 19h00 · Casablanca (GMT+1)
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div style={{
                  background: 'rgba(13, 31, 60, 0.5)',
                  border: '1px solid rgba(200, 169, 110, 0.12)',
                  borderRadius: '16px', padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                }}>
                  <MapPin size={20} style={{ color: '#C8A96E', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '13px', fontWeight: 500, color: '#E2C98A', marginBottom: '2px' }}>
                      Casablanca, Maroc
                    </p>
                    <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '12px', color: '#5A6E82' }}>
                      Couverture nationale · Spécialiste Casa
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(200,169,110,0.1)',
          padding: '24px 5%',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: '12px', color: 'rgba(90, 110, 130, 0.8)',
          }}>
            © {new Date().getFullYear()} LANDMARK ESTATE — Tous droits réservés · Vos données sont traitées en toute confidentialité
          </p>
        </div>

      </div>
    </>
  );
}