'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

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

  // Initialiser EmailJS
  useEffect(() => {
    emailjs.init('hTTnBv9DSUcGkL6Bl');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await emailjs.send(
        'service_yktzmd1',
        'template_b8rxmer',
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          to_email: 'Landmarkestate3@gmail.com'
        }
      );

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: '📞',
      title: 'Téléphone',
      value: '+212 6 05 58 57 20',
      subtext: 'Lun-Ven: 09:00 - 18:00'
    },
    {
      icon: '✉️',
      title: 'Email',
      value: 'Landmarkestate3@gmail.com',
      subtext: 'Réponse sous 24h'
    },
    {
      icon: '📍',
      title: 'Adresse',
      value: 'Casablanca, Maroc',
      subtext: 'Sur rendez-vous'
    },
    {
      icon: '🕐',
      title: 'Horaires',
      value: '09:00 - 18:00',
      subtext: 'Lundi - Vendredi'
    }
  ];

  return (
    <div style={{ background: 'linear-gradient(to bottom, #0D1F3C, #050D1A)' }}>
      
      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '128px 16px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '384px',
          height: '384px',
          borderRadius: '50%',
          opacity: 0.1,
          background: 'radial-gradient(circle, #C8A96E 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
        
        <div style={{ position: 'relative', maxWidth: '72rem', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h1 
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '24px',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontWeight: 300
            }}
          >
            Nous <span style={{ color: '#C8A96E' }}>Contacter</span>
          </h1>
          
          <p 
            style={{
              fontSize: '20px',
              maxWidth: '48rem',
              margin: '0 auto',
              color: '#8A9BB0',
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontWeight: 400
            }}
          >
            Une question ? Une demande spéciale ? Notre équipe LANDMARK ESTATE est là pour vous accompagner dans votre projet immobilier.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{ padding: '64px 16px' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: '16px',
                  padding: '32px',
                  transition: 'all 0.3s duration',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(26, 40, 71, 0.4)',
                  border: '1px solid rgba(200, 169, 110, 0.2)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = 'rgba(26, 40, 71, 0.6)';
                  el.style.borderColor = 'rgba(200, 169, 110, 0.5)';
                  el.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = 'rgba(26, 40, 71, 0.4)';
                  el.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>{info.icon}</div>
                <h3 
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: '#F9F5EF',
                    fontFamily: 'Cormorant Garamond, Georgia, serif'
                  }}
                >
                  {info.title}
                </h3>
                <p 
                  style={{
                    fontWeight: 500,
                    marginBottom: '4px',
                    color: '#C8A96E',
                    fontFamily: 'DM Sans, system-ui, sans-serif'
                  }}
                >
                  {info.value}
                </p>
                <p 
                  style={{
                    color: '#8A9BB0',
                    fontSize: '14px',
                    fontFamily: 'DM Sans, system-ui, sans-serif'
                  }}
                >
                  {info.subtext}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Form + Map */}
      <section style={{ padding: '96px 16px', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '384px',
          height: '384px',
          borderRadius: '50%',
          opacity: 0.05,
          background: 'radial-gradient(circle, #C8A96E 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />

        <div style={{ maxWidth: '72rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            
            {/* Left - Form */}
            <div>
              <h2 
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  marginBottom: '40px',
                  color: '#F9F5EF',
                  fontFamily: 'Cormorant Garamond, Georgia, serif'
                }}
              >
                Envoyez-nous<br />
                <span style={{ color: '#C8A96E' }}>un message</span>
              </h2>

              {submitted && (
                <div 
                  style={{
                    marginBottom: '24px',
                    padding: '16px',
                    borderRadius: '12px',
                    borderLeft: '4px solid #B5573A',
                    background: 'rgba(181, 87, 58, 0.1)'
                  }}
                >
                  <p 
                    style={{
                      color: '#B5573A',
                      fontWeight: 600,
                      fontFamily: 'DM Sans, system-ui, sans-serif'
                    }}
                  >
                    ✅ Message envoyé avec succès ! Nous vous répondrons bientôt.
                  </p>
                </div>
              )}

              {error && (
                <div 
                  style={{
                    marginBottom: '24px',
                    padding: '16px',
                    borderRadius: '12px',
                    borderLeft: '4px solid #dc2626',
                    background: 'rgba(220, 38, 38, 0.1)'
                  }}
                >
                  <p 
                    style={{
                      color: '#dc2626',
                      fontWeight: 600,
                      fontFamily: 'DM Sans, system-ui, sans-serif'
                    }}
                  >
                    ❌ {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Nom */}
                <div>
                  <label 
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      marginBottom: '12px',
                      color: '#E2C98A',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontWeight: 500,
                      textTransform: 'uppercase'
                    }}
                  >
                    Nom complet <span style={{ color: '#B5573A' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      background: 'rgba(26, 40, 71, 0.5)',
                      border: '1px solid rgba(200, 169, 110, 0.2)',
                      color: '#F9F5EF',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)';
                      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.7)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.5)';
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label 
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      marginBottom: '12px',
                      color: '#E2C98A',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontWeight: 500,
                      textTransform: 'uppercase'
                    }}
                  >
                    Email <span style={{ color: '#B5573A' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      background: 'rgba(26, 40, 71, 0.5)',
                      border: '1px solid rgba(200, 169, 110, 0.2)',
                      color: '#F9F5EF',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)';
                      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.7)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.5)';
                    }}
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label 
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      marginBottom: '12px',
                      color: '#E2C98A',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontWeight: 500,
                      textTransform: 'uppercase'
                    }}
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+212 6 05 58 57 20"
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      background: 'rgba(26, 40, 71, 0.5)',
                      border: '1px solid rgba(200, 169, 110, 0.2)',
                      color: '#F9F5EF',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)';
                      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.7)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.5)';
                    }}
                  />
                </div>

                {/* Sujet */}
                <div>
                  <label 
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      marginBottom: '12px',
                      color: '#E2C98A',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontWeight: 500,
                      textTransform: 'uppercase'
                    }}
                  >
                    Sujet <span style={{ color: '#B5573A' }}>*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      background: 'rgba(26, 40, 71, 0.5)',
                      border: '1px solid rgba(200, 169, 110, 0.2)',
                      color: '#F9F5EF',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)';
                      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.7)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.5)';
                    }}
                  >
                    <option value="">Sélectionner un sujet</option>
                    <option value="achat">Achat de propriété</option>
                    <option value="vente">Vente de propriété</option>
                    <option value="location">Location de propriété</option>
                    <option value="commercialisation">Service de commercialisation</option>
                    <option value="autre">Autre demande</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label 
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      marginBottom: '12px',
                      color: '#E2C98A',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      fontWeight: 500,
                      textTransform: 'uppercase'
                    }}
                  >
                    Message <span style={{ color: '#B5573A' }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande..."
                    required
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      background: 'rgba(26, 40, 71, 0.5)',
                      border: '1px solid rgba(200, 169, 110, 0.2)',
                      color: '#F9F5EF',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s',
                      resize: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)';
                      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.7)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                      e.currentTarget.style.background = 'rgba(26, 40, 71, 0.5)';
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: loading ? 'rgba(200, 169, 110, 0.5)' : 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)',
                    color: '#0D1F3C',
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(200, 169, 110, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        animation: 'spin 1s linear infinite',
                        borderRadius: '50%',
                        height: '20px',
                        width: '20px',
                        borderTop: '2px solid #0D1F3C',
                        borderRight: '2px solid transparent'
                      }} />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right - Map + Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Map Container */}
              <div 
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  height: '384px',
                  border: '2px solid rgba(200, 169, 110, 0.2)',
                  background: 'rgba(26, 40, 71, 0.3)',
                  boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)'
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.7597313219144!2d-7.589323!3d33.573110!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2d8e8d8d8d8d%3A0x8d8d8d8d8d8d8d8d!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2s!4v1234567890"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ width: '100%', height: '100%' }}
                ></iframe>
              </div>

              {/* Info Box */}
              <div 
                style={{
                  borderRadius: '24px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  background: 'linear-gradient(135deg, rgba(26, 40, 71, 0.6), rgba(26, 40, 71, 0.4))',
                  border: '1px solid rgba(200, 169, 110, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <h3 
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#F9F5EF',
                    fontFamily: 'Cormorant Garamond, Georgia, serif'
                  }}
                >
                  Informations<br />
                  <span style={{ color: '#C8A96E' }}>Supplémentaires</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <p 
                      style={{
                        color: '#F9F5EF',
                        fontFamily: 'DM Sans, system-ui, sans-serif',
                        fontWeight: 500,
                        marginBottom: '6px'
                      }}
                    >
                      Nous répondons aux demandes
                    </p>
                    <p 
                      style={{
                        color: '#8A9BB0',
                        fontFamily: 'DM Sans, system-ui, sans-serif'
                      }}
                    >
                      Lundi au vendredi de 09h00 à 18h00
                    </p>
                  </div>

                  <div>
                    <p 
                      style={{
                        color: '#F9F5EF',
                        fontFamily: 'DM Sans, system-ui, sans-serif',
                        fontWeight: 500,
                        marginBottom: '6px'
                      }}
                    >
                      Urgence en dehors des heures
                    </p>
                    <a
                      href="https://wa.me/212605585720"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#C8A96E',
                        fontFamily: 'DM Sans, system-ui, sans-serif',
                        fontWeight: 500,
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#E2C98A';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#C8A96E';
                      }}
                    >
                      💬 +212 6 05 58 57 20 (WhatsApp)
                    </a>
                  </div>

                  <div>
                    <p 
                      style={{
                        color: '#F9F5EF',
                        fontFamily: 'DM Sans, system-ui, sans-serif',
                        fontWeight: 500,
                        marginBottom: '6px'
                      }}
                    >
                      Visite de nos bureaux
                    </p>
                    <p 
                      style={{
                        color: '#8A9BB0',
                        fontFamily: 'DM Sans, system-ui, sans-serif'
                      }}
                    >
                      Sur rendez-vous uniquement (contactez-nous à l'avance)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}