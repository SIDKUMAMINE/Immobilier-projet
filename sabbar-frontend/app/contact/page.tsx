'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  publicKey: 'hTTnBv9DSUcGkL6Bl',
  serviceId: 'service_yktzmd1',
  templateId: 'template_b8rxmer',
};

const WHATSAPP_NUMBER = '212605585720'; // Sans le +

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendWhatsAppNotification = (data: typeof formData) => {
    // Compose le message WhatsApp avec les infos du formulaire
    const whatsappMessage = 
`🏠 *Nouveau message - LANDMARK ESTATE*

👤 *Nom:* ${data.name}
📧 *Email:* ${data.email}
📞 *Téléphone:* ${data.phone || 'Non fourni'}
📋 *Sujet:* ${data.subject}

💬 *Message:*
${data.message}

_Envoyé depuis le formulaire de contact_`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Ouvre WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Envoyer l'email via EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone || 'Non fourni',
          subject: formData.subject,
          message: formData.message,
          reply_to: formData.email,
        }
      );

      // 2️⃣ Email envoyé → afficher succès
      setSubmitted(true);
      const sentData = { ...formData };
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);

      // 3️⃣ Ouvrir WhatsApp avec le message pré-rempli (après 500ms)
      setTimeout(() => {
        sendWhatsAppNotification(sentData);
      }, 500);

    } catch (err: any) {
      console.error('❌ Erreur EmailJS:', err);
      let errorMessage = 'Erreur lors de l\'envoi. ';
      if (err?.status === 401) errorMessage += 'Clé publique invalide.';
      else if (err?.status === 403) errorMessage += 'Domaine non autorisé sur EmailJS.';
      else if (err?.status === 422) errorMessage += 'Variables du template incorrectes.';
      else errorMessage += 'Veuillez réessayer ou nous contacter par WhatsApp.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 20px',
    borderRadius: '8px',
    background: 'rgba(26, 40, 71, 0.5)',
    border: '1px solid rgba(200, 169, 110, 0.2)',
    color: '#F9F5EF',
    fontFamily: 'DM Sans, system-ui, sans-serif',
    outline: 'none',
    transition: 'all 0.3s',
    boxSizing: 'border-box' as const,
    fontSize: '14px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    marginBottom: '12px',
    color: '#E2C98A',
    fontFamily: 'DM Sans, system-ui, sans-serif',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  };

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<any>) => {
      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.6)';
      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.8)';
    },
    onBlur: (e: React.FocusEvent<any>) => {
      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.5)';
    },
  };

  const contactInfo = [
    { icon: '📞', title: 'Téléphone', value: '+212 6 05 58 57 20', subtext: 'Lun-Ven: 09:00 - 18:00' },
    { icon: '✉️', title: 'Email', value: 'Landmarkestate3@gmail.com', subtext: 'Réponse sous 24h' },
    { icon: '📍', title: 'Adresse', value: 'Casablanca, Maroc', subtext: 'Sur rendez-vous' },
    { icon: '🕐', title: 'Horaires', value: '09:00 - 18:00', subtext: 'Lundi - Vendredi' }
  ];

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D1F3C, #050D1A)' }}>

      {/* Hero */}
      <section style={{ position: 'relative', padding: '128px 16px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '384px', height: '384px', borderRadius: '50%', opacity: 0.1, background: 'radial-gradient(circle, #C8A96E 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'relative', maxWidth: '72rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 'bold', color: 'white', marginBottom: '24px', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Nous <span style={{ color: '#C8A96E' }}>Contacter</span>
          </h1>
          <p style={{ fontSize: '20px', maxWidth: '48rem', margin: '0 auto', color: '#8A9BB0', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
            Une question ? Une demande spéciale ? Notre équipe LANDMARK ESTATE est là pour vous accompagner dans votre projet immobilier.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{ padding: '64px 16px' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {contactInfo.map((info, idx) => (
              <div key={idx}
                style={{ borderRadius: '16px', padding: '32px', transition: 'all 0.3s', textAlign: 'center', cursor: 'pointer', background: 'rgba(26, 40, 71, 0.4)', border: '1px solid rgba(200, 169, 110, 0.2)' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.background = 'rgba(26, 40, 71, 0.6)'; el.style.borderColor = 'rgba(200, 169, 110, 0.5)'; el.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.background = 'rgba(26, 40, 71, 0.4)'; el.style.borderColor = 'rgba(200, 169, 110, 0.2)'; el.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>{info.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#F9F5EF', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>{info.title}</h3>
                <p style={{ fontWeight: 500, marginBottom: '4px', color: '#C8A96E', fontFamily: 'DM Sans, system-ui, sans-serif' }}>{info.value}</p>
                <p style={{ color: '#8A9BB0', fontSize: '14px', fontFamily: 'DM Sans, system-ui, sans-serif' }}>{info.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section style={{ padding: '96px 16px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '384px', height: '384px', borderRadius: '50%', opacity: 0.05, background: 'radial-gradient(circle, #C8A96E 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div style={{ maxWidth: '72rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

            {/* Form */}
            <div>
              <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: '#F9F5EF', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                Envoyez-nous<br /><span style={{ color: '#C8A96E' }}>un message</span>
              </h2>

              {/* Badge info Email + WhatsApp */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(200, 169, 110, 0.1)', border: '1px solid rgba(200, 169, 110, 0.3)', color: '#E2C98A', fontSize: '12px', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
                  ✉️ Email automatique
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)', color: '#25D366', fontSize: '12px', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
                  💬 Notification WhatsApp
                </span>
              </div>

              {/* Success */}
              {submitted && (
                <div style={{ marginBottom: '24px', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #22c55e', background: 'rgba(34, 197, 94, 0.1)' }}>
                  <p style={{ color: '#22c55e', fontWeight: 600, fontFamily: 'DM Sans, system-ui, sans-serif', margin: '0 0 4px 0' }}>
                    ✅ Message envoyé par email !
                  </p>
                  <p style={{ color: '#22c55e', opacity: 0.8, fontSize: '13px', fontFamily: 'DM Sans, system-ui, sans-serif', margin: 0 }}>
                    💬 WhatsApp s'est ouvert avec votre message. Envoyez-le pour une réponse rapide !
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{ marginBottom: '24px', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #dc2626', background: 'rgba(220, 38, 38, 0.1)' }}>
                  <p style={{ color: '#dc2626', fontWeight: 600, fontFamily: 'DM Sans, system-ui, sans-serif', margin: 0 }}>❌ {error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Nom */}
                <div>
                  <label style={labelStyle}>Nom complet <span style={{ color: '#B5573A' }}>*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Votre nom complet" required style={inputStyle} {...focusHandlers} />
                </div>

                {/* Email + Téléphone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Email <span style={{ color: '#B5573A' }}>*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="votre@email.com" required style={inputStyle} {...focusHandlers} />
                  </div>
                  <div>
                    <label style={labelStyle}>Téléphone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+212 6 00 00 00 00" style={inputStyle} {...focusHandlers} />
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <label style={labelStyle}>Sujet <span style={{ color: '#B5573A' }}>*</span></label>
                  <select name="subject" value={formData.subject} onChange={handleChange} required style={{ ...inputStyle, cursor: 'pointer' }} {...focusHandlers}>
                    <option value="">Sélectionner un sujet</option>
                    <option value="Achat de propriété">Achat de propriété</option>
                    <option value="Vente de propriété">Vente de propriété</option>
                    <option value="Location de propriété">Location de propriété</option>
                    <option value="Service de commercialisation">Service de commercialisation</option>
                    <option value="Consultation ROI">Consultation ROI</option>
                    <option value="Autre demande">Autre demande</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>Message <span style={{ color: '#B5573A' }}>*</span></label>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Décrivez votre demande..." required rows={6} style={{ ...inputStyle, resize: 'none' }} {...focusHandlers} />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px',
                    transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    background: loading ? 'rgba(200, 169, 110, 0.4)' : 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)',
                    color: '#0D1F3C', fontFamily: 'DM Sans, system-ui, sans-serif',
                    cursor: loading ? 'not-allowed' : 'pointer', border: 'none', boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.boxShadow = '0 20px 40px rgba(200, 169, 110, 0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {loading ? (
                    <>
                      <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '20px', width: '20px', border: '2px solid #0D1F3C', borderTopColor: 'transparent', flexShrink: 0 }} />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>

                {/* Note WhatsApp */}
                <p style={{ textAlign: 'center', color: '#8A9BB0', fontSize: '12px', fontFamily: 'DM Sans, system-ui, sans-serif', margin: 0 }}>
                  💬 Après envoi, WhatsApp s'ouvrira automatiquement pour une réponse encore plus rapide
                </p>
              </form>
            </div>

            {/* Map + Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ borderRadius: '24px', overflow: 'hidden', height: '384px', border: '2px solid rgba(200, 169, 110, 0.2)', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)' }}>
                <iframe
                  width="100%" height="100%" frameBorder={0}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.7597313219144!2d-7.589323!3d33.573110!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2d8e8d8d8d8d%3A0x8d8d8d8d8d8d8d8d!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2s!4v1234567890"
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              <div style={{ borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'linear-gradient(135deg, rgba(26, 40, 71, 0.6), rgba(26, 40, 71, 0.4))', border: '1px solid rgba(200, 169, 110, 0.2)', backdropFilter: 'blur(10px)' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F9F5EF', fontFamily: 'Cormorant Garamond, Georgia, serif', margin: 0 }}>
                  Informations<br /><span style={{ color: '#C8A96E' }}>Supplémentaires</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <p style={{ color: '#F9F5EF', fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 500, margin: '0 0 6px 0' }}>Nous répondons aux demandes</p>
                    <p style={{ color: '#8A9BB0', fontFamily: 'DM Sans, system-ui, sans-serif', margin: 0 }}>Lundi au vendredi de 09h00 à 18h00</p>
                  </div>
                  <div>
                    <p style={{ color: '#F9F5EF', fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 500, margin: '0 0 6px 0' }}>Urgence en dehors des heures</p>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#25D366', fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 500, textDecoration: 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#4ade80'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#25D366'; }}
                    >
                      💬 +212 6 05 58 57 20 (WhatsApp)
                    </a>
                  </div>
                  <div>
                    <p style={{ color: '#F9F5EF', fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 500, margin: '0 0 6px 0' }}>Visite de nos bureaux</p>
                    <p style={{ color: '#8A9BB0', fontFamily: 'DM Sans, system-ui, sans-serif', margin: 0 }}>Sur rendez-vous uniquement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(138, 155, 176, 0.6) !important; }
        option { background: #0D1F3C; color: #F9F5EF; }
        @media (max-width: 1024px) {
          [style*="gridTemplateColumns: '1fr 1fr'"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}