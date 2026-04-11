"'use client';

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
      // Envoyer l'email via EmailJS
      await emailjs.send(
        'service_yktzmd1', // Service ID
        'template_b8rxmer', // Template ID
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          to_email: 'Landmarkestate3@gmail.com'
        }
      );

      // Succès
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('❌ Erreur:', err);
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
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #C8A96E 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />
        
        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <h1 
            className="text-6xl md:text-7xl font-bold text-white mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300
            }}
          >
            Nous <span style={{ color: '#C8A96E' }}>Contacter</span>
          </h1>
          
          <p 
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{
              color: '#8A9BB0',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400
            }}
          >
            Une question ? Une demande spéciale ? Notre équipe LANDMARK ESTATE est là pour vous accompagner dans votre projet immobilier.
          </p>
        </div>
      </section>

      {/* Contact Info Cards - 4 Columns */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="group rounded-2xl p-8 transition-all duration-300 text-center cursor-pointer"
                style={{
                  background: 'rgba(26, 40, 71, 0.4)',
                  border: '1px solid rgba(200, 169, 110, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(26, 40, 71, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(26, 40, 71, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="text-5xl mb-4">{info.icon}</div>
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{
                    color: '#F9F5EF',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 400
                  }}
                >
                  {info.title}
                </h3>
                <p 
                  className="font-semibold mb-1"
                  style={{
                    color: '#C8A96E',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 500
                  }}
                >
                  {info.value}
                </p>
                <p 
                  style={{
                    color: '#8A9BB0',
                    fontSize: '14px',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400
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
      <section className="py-24 px-4 relative">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, #C8A96E 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left - Form */}
            <div>
              <h2 
                className="text-5xl font-bold mb-10"
                style={{
                  color: '#F9F5EF',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300
                }}
              >
                Envoyez-nous<br />
                <span style={{ color: '#C8A96E' }}>un message</span>
              </h2>

              {submitted && (
                <div 
                  className="mb-6 p-4 rounded-xl border-l-4"
                  style={{
                    background: 'rgba(181, 87, 58, 0.1)',
                    borderColor: '#B5573A'
                  }}
                >
                  <p 
                    style={{
                      color: '#B5573A',
                      fontWeight: 600,
                      fontFamily: "'DM Sans', system-ui, sans-serif"
                    }}
                  >
                    ✅ Message envoyé avec succès ! Nous vous répondrons bientôt.
                  </p>
                </div>
              )}

              {error && (
                <div 
                  className="mb-6 p-4 rounded-xl border-l-4"
                  style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    borderColor: '#dc2626'
                  }}
                >
                  <p 
                    style={{
                      color: '#dc2626',
                      fontWeight: 600,
                      fontFamily: "'DM Sans', system-ui, sans-serif"
                    }}
                  >
                    ❌ {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nom */}
                <div>
                  <label 
                    className="block text-sm mb-3"
                    style={{
                      color: '#E2C98A',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      fontSize: '11px'
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
                    className="w-full px-5 py-3 rounded-lg text-white placeholder-opacity-50 focus:outline-none transition-all"
                    style={{
                      background: 'rgba(26, 40, 71, 0.5)',
                      border: '1px solid rgba(200, 169, 110, 0.2)',
                      color: '#F9F5EF',
                      fontFamily: "'DM Sans', system-ui, sans-serif"
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
                    className="block text-sm mb-3"
                    style={{
                      color: '#E2C98A',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      fontSize: '11px'
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
                    className="w-full px-5 py-3 rounded-lg text-white placeholder-opacity-50 focus:outline-none transition-all"
                    style={{
                      background: 'rgba(26, 40, 71, 0.5)',
                      border: '1px solid rgba(200, 169, 110, 0.2)',
                      color: '#F9F5EF',
                      fontFamily: "'DM Sans', system-ui, sans-serif"
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
                    className="block text-sm mb-3"
                    style={{
                      color: '#E2C98A',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      fontSize: '11px'
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
                    className="w-full px-5 py-3 rounded-lg text-white placeholder-opacity-50 focus:outline-none transition-all"
                    style={{
                      background: 'rgba(26, 40, 71, 0.5)',
                      border: '1px solid rgba(200, 169, 110, 0.2)',
                      color: '#F9F5EF',
                      fontFamily: "'DM Sans', system-ui, sans-serif"
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
                    className="block text-sm mb-3"
                    style={{
                      color: '#E2C98A',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      fontSize: '11px'
                    }}
                  >
                    Sujet <span style={{ color: '#B5573A' }}>*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 rounded-lg text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(26, 40, 71, 0.5)',
                      border: '1px solid rgba(200, 169, 110, 0.2)',
                      color: '#F9F5EF',
                      fontFamily: "'DM Sans', system-ui, sans-serif"
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
                    className="block text-sm mb-3"
                    style={{
                      color: '#E2C98A',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      fontSize: '11px'
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
                    className="w-full px-5 py-3 rounded-lg text-white placeholder-opacity-50 focus:outline-none transition-all resize-none"
                    style={{
                      background: 'rgba(26, 40, 71, 0.5)',
                      border: '1px solid rgba(200, 169, 110, 0.2)',
                      color: '#F9F5EF',
                      fontFamily: "'DM Sans', system-ui, sans-serif"
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
                  className="w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  style={{
                    background: loading ? 'rgba(200, 169, 110, 0.5)' : 'linear-gradient(135deg, #C8A96E 0%, #E2C98A 100%)',
                    color: '#0D1F3C',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer'
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
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: '#0D1F3C' }}></div>
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
            <div className="space-y-8">
              {/* Map Container */}
              <div 
                className="rounded-3xl overflow-hidden h-96 shadow-2xl"
                style={{
                  border: '2px solid rgba(200, 169, 110, 0.2)',
                  background: 'rgba(26, 40, 71, 0.3)'
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.7597313219144!2d-7.589323!3d33.573110!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2d8e8d8d8d8d%3A0x8d8d8d8d8d8d8d8d!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2s!4v1234567890"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Info Box */}
              <div 
                className="rounded-3xl p-8 space-y-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(26, 40, 71, 0.6), rgba(26, 40, 71, 0.4))',
                  border: '1px solid rgba(200, 169, 110, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <h3 
                  className="text-2xl font-bold"
                  style={{
                    color: '#F9F5EF',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 400
                  }}
                >
                  Informations<br />
                  <span style={{ color: '#C8A96E' }}>Supplémentaires</span>
                </h3>

                <div className="space-y-5">
                  <div>
                    <p 
                      style={{
                        color: '#F9F5EF',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 500,
                        marginBottom: '6px'
                      }}
                    >
                      Nous répondons aux demandes
                    </p>
                    <p 
                      style={{
                        color: '#8A9BB0',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400
                      }}
                    >
                      Lundi au vendredi de 09h00 à 18h00
                    </p>
                  </div>

                  <div>
                    <p 
                      style={{
                        color: '#F9F5EF',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
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
                        fontFamily: "'DM Sans', system-ui, sans-serif",
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
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 500,
                        marginBottom: '6px'
                      }}
                    >
                      Visite de nos bureaux
                    </p>
                    <p 
                      style={{
                        color: '#8A9BB0',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400
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
        input::placeholder, textarea::placeholder, select {
          color: rgba(138, 155, 176, 0.6) !important;
        }

        option {
          background: #0D1F3C;
          color: #F9F5EF;
        }
      `}</style>
    </div>
  );
}"