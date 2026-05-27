'use client';

import { useState, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';
import { supabase } from '@/lib/supabase';

const EMAILJS_CONFIG = { publicKey: 'hTTnBv9DSUcGkL6Bl', serviceId: 'service_j97op7o', templateId: 'template_b8rxmer' };
const WHATSAPP_NUMBER = '212605585720';

export default function ContactIntermediationPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'Intermédiation immobilière', budget: '', type: '', message: '' });
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => { emailjs.init(EMAILJS_CONFIG.publicKey); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendWhatsAppNotification = (data: typeof formData) => {
    const msg = `🤝 *Nouvelle demande - Intermédiation Immobilière*\n━━━━━━━━━━━━━━━━━━━━━\n\n👤 *Nom:* ${data.name}\n📧 *Email:* ${data.email}\n📞 *Téléphone:* ${data.phone || 'Non fourni'}\n💰 *Budget:* ${data.budget || 'Non précisé'}\n🏠 *Type de bien:* ${data.type || 'Non précisé'}\n\n💬 *Message:*\n${data.message}\n\n_Envoyé depuis la page Intermédiation - LANDMARK ESTATE_`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      // ✅ Supabase
      if (supabase) {
        await supabase.from('leads').insert({
          full_name: formData.name,
          email:     formData.email,
          phone:     formData.phone || null,
          subject:   formData.subject,
          message:   `Budget: ${formData.budget}\nType: ${formData.type}\n\n${formData.message}`,
          property_type:    formData.type || null,
          status:    'new',
          source:    'intermediation',
          score:     0,
        });
      }
      // ✅ EmailJS
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        from_name: formData.name, from_email: formData.email, phone: formData.phone || 'Non fourni',
        subject: `[Intermédiation] ${formData.subject}`,
        message: `Budget: ${formData.budget || 'Non précisé'}\nType de bien: ${formData.type || 'Non précisé'}\n\n${formData.message}`,
        reply_to: formData.email,
      });
      setSubmitted(true);
      const sentData = { ...formData };
      setFormData({ name: '', email: '', phone: '', subject: 'Intermédiation immobilière', budget: '', type: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
      setTimeout(() => sendWhatsAppNotification(sentData), 500);
    } catch (err: any) {
      setError('Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter par WhatsApp.');
    } finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 20px', borderRadius: '8px', background: 'rgba(26, 40, 71, 0.5)', border: '1px solid rgba(200, 169, 110, 0.2)', color: '#F9F5EF', fontFamily: 'DM Sans, system-ui, sans-serif', outline: 'none', transition: 'all 0.3s', boxSizing: 'border-box', fontSize: '14px' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', marginBottom: '12px', color: '#E2C98A', fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' };
  const focusHandlers = {
    onFocus: (e: React.FocusEvent<any>) => { e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.6)'; e.currentTarget.style.background = 'rgba(26, 40, 71, 0.8)'; },
    onBlur:  (e: React.FocusEvent<any>) => { e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)'; e.currentTarget.style.background = 'rgba(26, 40, 71, 0.5)'; },
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D1F3C, #050D1A)', minHeight: '100vh' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(138, 155, 176, 0.6) !important; }
        option { background: #0D1F3C; color: #F9F5EF; }
        .ci-hero-title { font-size: 52px; font-weight: 300; color: #F9F5EF; margin-bottom: 16px; font-family: 'Cormorant Garamond', Georgia, serif; }
        .ci-hero-section { position: relative; padding: 80px 5%; overflow: hidden; }
        .ci-stats { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; margin-top: 32px; }
        .ci-form-section { padding: 64px 5%; }
        .ci-main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; max-width: 72rem; margin: 0 auto; }
        .ci-form-card { background: rgba(26, 40, 71, 0.4); border-radius: 24px; padding: 48px; border: 1px solid rgba(200, 169, 110, 0.2); }
        .ci-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ci-right-col { display: flex; flex-direction: column; gap: 24px; }
        @media (max-width: 768px) {
          .ci-hero-title { font-size: 30px; } .ci-hero-section { padding: 48px 5%; }
          .ci-form-section { padding: 32px 5%; } .ci-main-grid { grid-template-columns: 1fr; gap: 32px; }
          .ci-form-card { padding: 24px; } .ci-form-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ padding: '16px 5%', borderBottom: '1px solid rgba(200, 169, 110, 0.2)', background: 'rgba(26, 40, 71, 0.5)' }}>
        <Link href="/services/intermediations" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#C8A96E', fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 500, textDecoration: 'none' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap = '12px'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap = '8px'; }}>
          <ArrowLeft size={18} /> Retour à Intermédiation
        </Link>
      </div>

      <section className="ci-hero-section">
        <div style={{ position: 'absolute', top: 0, right: 0, width: '384px', height: '384px', borderRadius: '50%', opacity: 0.08, background: 'radial-gradient(circle, #C8A96E 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ maxWidth: '72rem', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
          <h1 className="ci-hero-title">Intermédiation <span style={{ color: '#C8A96E' }}>Immobilière</span></h1>
          <p style={{ fontSize: '18px', color: '#8A9BB0', maxWidth: '600px', margin: '0 auto 16px', fontFamily: 'DM Sans, system-ui, sans-serif', lineHeight: '1.7' }}>Parlez-nous de votre projet. Notre équipe vous accompagne dans l'achat, la vente ou la location de votre bien.</p>
          <div className="ci-stats">
            {[{ v: '25-30j', l: 'Délai moyen' }, { v: '50+', l: 'Leads/mois' }, { v: '95%', l: 'Satisfaction' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 300, color: '#C8A96E', fontFamily: 'Cormorant Garamond, Georgia, serif', margin: 0 }}>{s.v}</p>
                <p style={{ fontSize: '12px', color: '#8A9BB0', fontFamily: 'DM Sans, system-ui, sans-serif', margin: 0 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ci-form-section">
        <div className="ci-main-grid">
          <div className="ci-form-card">
            <h2 style={{ fontSize: '32px', fontWeight: 300, color: '#F9F5EF', marginBottom: '8px', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Votre Demande</h2>
            <p style={{ color: '#8A9BB0', fontSize: '14px', fontFamily: 'DM Sans, system-ui, sans-serif', marginBottom: '32px' }}>Remplissez ce formulaire et nous vous recontactons sous 24h.</p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <span style={{ padding: '5px 12px', borderRadius: '20px', background: 'rgba(200, 169, 110, 0.1)', border: '1px solid rgba(200, 169, 110, 0.3)', color: '#E2C98A', fontSize: '12px', fontFamily: 'DM Sans, system-ui, sans-serif' }}>✉️ Email automatique</span>
              <span style={{ padding: '5px 12px', borderRadius: '20px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)', color: '#25D366', fontSize: '12px', fontFamily: 'DM Sans, system-ui, sans-serif' }}>💬 Notification WhatsApp</span>
              {supabase && <span style={{ padding: '5px 12px', borderRadius: '20px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', color: '#4ade80', fontSize: '12px', fontFamily: 'DM Sans, system-ui, sans-serif' }}>🗄️ Sauvegardé dashboard</span>}
            </div>

            {submitted && <div style={{ marginBottom: '24px', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #22c55e', background: 'rgba(34, 197, 94, 0.1)' }}><p style={{ color: '#22c55e', fontWeight: 600, fontFamily: 'DM Sans, system-ui, sans-serif', margin: '0 0 4px 0' }}>✅ Demande envoyée et sauvegardée !</p><p style={{ color: '#22c55e', opacity: 0.8, fontSize: '13px', fontFamily: 'DM Sans, system-ui, sans-serif', margin: 0 }}>📋 Lead ajouté à votre dashboard · 💬 WhatsApp s'est ouvert</p></div>}
            {error && <div style={{ marginBottom: '24px', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #dc2626', background: 'rgba(220, 38, 38, 0.1)' }}><p style={{ color: '#dc2626', fontWeight: 600, fontFamily: 'DM Sans, system-ui, sans-serif', margin: 0 }}>❌ {error}</p></div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div><label style={labelStyle}>Nom complet <span style={{ color: '#B5573A' }}>*</span></label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Votre nom complet" required style={inputStyle} {...focusHandlers} /></div>
              <div className="ci-form-row-2">
                <div><label style={labelStyle}>Email <span style={{ color: '#B5573A' }}>*</span></label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="votre@email.com" required style={inputStyle} {...focusHandlers} /></div>
                <div><label style={labelStyle}>Téléphone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+212 6 00 00 00 00" style={inputStyle} {...focusHandlers} /></div>
              </div>
              <div className="ci-form-row-2">
                <div><label style={labelStyle}>Je souhaite <span style={{ color: '#B5573A' }}>*</span></label><select name="subject" value={formData.subject} onChange={handleChange} required style={{ ...inputStyle, cursor: 'pointer' }} {...focusHandlers}><option value="Intermédiation immobilière">Sélectionner</option><option value="Acheter un bien">Acheter un bien</option><option value="Vendre mon bien">Vendre mon bien</option><option value="Louer un bien">Louer un bien</option><option value="Mettre en location">Mettre en location</option><option value="Estimation de mon bien">Estimation de mon bien</option></select></div>
                <div><label style={labelStyle}>Budget (DH)</label><select name="budget" value={formData.budget} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }} {...focusHandlers}><option value="">Sélectionner</option><option value="Moins de 1M DH">Moins de 1M DH</option><option value="1M - 2M DH">1M - 2M DH</option><option value="2M - 4M DH">2M - 4M DH</option><option value="4M DH et plus">4M DH et plus</option><option value="À discuter">À discuter</option></select></div>
              </div>
              <div><label style={labelStyle}>Type de bien</label><select name="type" value={formData.type} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }} {...focusHandlers}><option value="">Sélectionner</option><option value="Appartement">Appartement</option><option value="Villa / Maison">Villa / Maison</option><option value="Bureau / Local commercial">Bureau / Local commercial</option><option value="Terrain">Terrain</option><option value="Immeuble">Immeuble</option><option value="Autre">Autre</option></select></div>
              <div><label style={labelStyle}>Message <span style={{ color: '#B5573A' }}>*</span></label><textarea name="message" value={formData.message} onChange={handleChange} placeholder="Décrivez votre projet en détail : localisation souhaitée, critères importants, timeline..." required rows={5} style={{ ...inputStyle, resize: 'none' }} {...focusHandlers} /></div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: loading ? 'rgba(200, 169, 110, 0.4)' : 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)', color: '#0D1F3C', fontFamily: 'DM Sans, system-ui, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', border: 'none', boxSizing: 'border-box' }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 20px 40px rgba(200, 169, 110, 0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                {loading ? <><div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '20px', width: '20px', border: '2px solid #0D1F3C', borderTopColor: 'transparent' }} /><span>Envoi...</span></> : <><Send size={18} /><span>Envoyer ma demande</span></>}
              </button>
              <p style={{ textAlign: 'center', color: '#8A9BB0', fontSize: '12px', fontFamily: 'DM Sans, system-ui, sans-serif', margin: 0 }}>💬 WhatsApp s'ouvrira automatiquement après envoi</p>
            </form>
          </div>

          <div className="ci-right-col">
            <div style={{ borderRadius: '20px', padding: '32px', background: 'rgba(26, 40, 71, 0.4)', border: '1px solid rgba(200, 169, 110, 0.2)' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 300, color: '#F9F5EF', fontFamily: 'Cormorant Garamond, Georgia, serif', margin: '0 0 20px 0' }}>Ce que vous obtenez</h3>
              {[{ icon: '🏠', text: 'Accès à 30-40 propriétés premium vérifiées' }, { icon: '⚡', text: 'Vente en 25-30 jours (vs 40-50 marché)' }, { icon: '🔒', text: 'Accompagnement juridique et notarié complet' }, { icon: '📱', text: 'Suivi WhatsApp dédié tout au long du process' }, { icon: '💰', text: 'Commission 2.0% à 3.0% selon segment' }, { icon: '✅', text: 'Zéro frais cachés, 100% transparent' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ color: '#8A9BB0', fontSize: '14px', fontFamily: 'DM Sans, system-ui, sans-serif' }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: '20px', padding: '32px', background: 'rgba(26, 40, 71, 0.4)', border: '1px solid rgba(200, 169, 110, 0.2)' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 300, color: '#F9F5EF', fontFamily: 'Cormorant Garamond, Georgia, serif', margin: '0 0 20px 0' }}>Contact <span style={{ color: '#C8A96E' }}>Direct</span></h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <a href="tel:+212605585720" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#E2C98A', textDecoration: 'none', fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: '15px' }}>📞 +212 6 05 58 57 20</a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#25D366', textDecoration: 'none', fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: '15px' }}>💬 WhatsApp (réponse rapide)</a>
                <a href="mailto:Landmarkestate3@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#E2C98A', textDecoration: 'none', fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: '15px' }}>✉️ Landmarkestate3@gmail.com</a>
              </div>
            </div>
            <div style={{ borderRadius: '20px', padding: '24px 32px', background: 'rgba(200, 169, 110, 0.05)', border: '1px solid rgba(200, 169, 110, 0.15)', textAlign: 'center' }}>
              <p style={{ color: '#C8A96E', fontSize: '13px', fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 500, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Disponibilité</p>
              <p style={{ color: '#F9F5EF', fontSize: '16px', fontFamily: 'DM Sans, system-ui, sans-serif', margin: 0 }}>Lun - Ven : 09h00 - 18h00</p>
              <p style={{ color: '#8A9BB0', fontSize: '13px', fontFamily: 'DM Sans, system-ui, sans-serif', margin: '4px 0 0 0' }}>Réponse sous 24h garantie</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}