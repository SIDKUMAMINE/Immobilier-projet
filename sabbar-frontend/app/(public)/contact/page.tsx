'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulation d'envoi - à adapter avec votre backend
      console.log('📧 Formulaire soumis:', formData);
      
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('❌ Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone size={32} className="text-amber-500" />,
      title: 'Téléphone',
      value: '+212 6 12 34 56 78',
      subtext: 'Lun-Ven: 09:00 - 18:00'
    },
    {
      icon: <Mail size={32} className="text-amber-500" />,
      title: 'Email',
      value: 'contact@immobilierm.ma',
      subtext: 'Réponse sous 24h'
    },
    {
      icon: <MapPin size={32} className="text-amber-500" />,
      title: 'Adresse',
      value: '123 Rue Hassan II, Casablanca',
      subtext: 'Maroc, 20000'
    },
    {
      icon: <Clock size={32} className="text-amber-500" />,
      title: 'Horaires',
      value: '09:00 - 18:00',
      subtext: 'Lundi - Vendredi'
    }
  ];

  const faqItems = [
    {
      question: 'Quel est votre délai de réponse ?',
      answer: 'Nous répondons à toutes les demandes dans les 24 heures ouvrables. Pour les questions urgentes, appelez directement notre ligne d\'assistance.'
    },
    {
      question: 'Proposez-vous des consultations gratuites ?',
      answer: 'Oui ! Nous offrons une première consultation gratuite pour comprendre vos besoins et vous proposer la meilleure solution.'
    },
    {
      question: 'Travaillez-vous dans toutes les villes du Maroc ?',
      answer: 'Nous sommes basés à Casablanca et nous servons les principales villes (Rabat, Marrakech, Tanger, Fès, Agadir) et régions du Maroc.'
    },
    {
      question: 'Comment puis-je vendre ma propriété ?',
      answer: 'Contactez-nous directement ou prenez rendez-vous pour une évaluation gratuite de votre propriété. Nous gérons ensuite tout le processus de commercialisation.'
    },
    {
      question: 'Y a-t-il des frais cachés ?',
      answer: 'Non, nous pratiquons une tarification totalement transparente. Tous les frais sont expliqués et convenus à l\'avance.'
    },
    {
      question: 'Proposez-vous un financement immobilier ?',
      answer: 'Nous pouvons vous mettre en relation avec des partenaires bancaires de confiance pour faciliter votre financement.'
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 border-b border-amber-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-amber-900/10"></div>
        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Nous Contacter
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Une question ? Une demande spéciale ? Notre équipe est là pour vous aider. Contactez-nous par téléphone, email ou via le formulaire ci-dessous.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="bg-gray-800/30 border border-amber-600/20 rounded-xl p-6 hover:border-amber-600/50 hover:bg-gray-800/50 transition-all duration-300 text-center"
              >
                <div className="flex justify-center mb-4">{info.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                <p className="text-amber-500 font-semibold mb-1">{info.value}</p>
                <p className="text-gray-400 text-sm">{info.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Envoyez-nous un message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-600 rounded-lg">
                  <p className="text-green-400 font-semibold flex items-center gap-2">
                    <span>✅</span> Message envoyé avec succès ! Nous vous répondrons bientôt.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-amber-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-amber-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+212 6 12 34 56 78"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-amber-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Sujet */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Sujet <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-600 focus:outline-none transition-colors"
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
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande..."
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-amber-600 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Info */}
            <div className="space-y-8">
              {/* Carte */}
              <div className="rounded-xl overflow-hidden border border-amber-600/20 h-96 bg-gray-800">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.7597313219144!2d-7.589323!3d33.573110!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2d8e8d8d8d8d%3A0x8d8d8d8d8d8d8d8d!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2s!4v1234567890"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Infos supplémentaires */}
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900 border border-amber-600/20 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Informations supplémentaires</h3>

                <div className="space-y-4 text-gray-300">
                  <p>
                    <span className="font-semibold text-white">Nous répondons aux demandes:</span>
                    <br />
                    Du lundi au vendredi de 09h00 à 18h00
                  </p>
                  <p>
                    <span className="font-semibold text-white">Urgence en dehors des heures:</span>
                    <br />
                    Appelez notre ligne d'urgence: +212 6 12 34 56 78
                  </p>
                  <p>
                    <span className="font-semibold text-white">Visite de nos bureaux:</span>
                    <br />
                    Sur rendez-vous uniquement (contactez-nous à l'avance)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gray-900 border-t border-amber-600">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Questions Fréquemment Posées
            </h2>
            <p className="text-xl text-gray-400">
              Trouvez les réponses à vos questions les plus courantes
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-black border border-amber-600/20 rounded-xl overflow-hidden hover:border-amber-600/50 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white text-left">{item.question}</h3>
                  <span className={`text-amber-500 transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {expandedFaq === idx && (
                  <div className="px-6 py-4 border-t border-amber-600/20 bg-gray-900/30">
                    <p className="text-gray-300">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-900/20 via-black to-black border-t border-amber-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Besoin d'une consultation ?
          </h2>
          <p className="text-xl text-gray-400">
            Prenez rendez-vous avec nos experts immobiliers pour discuter de vos projets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <button className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105">
                Chat avec un agent
              </button>
            </Link>
            <button
              onClick={() => document.querySelector('input[name="name"]')?.focus()}
              className="px-8 py-4 border-2 border-amber-600 text-amber-500 hover:text-amber-400 font-bold rounded-lg transition-all duration-300"
            >
              Remplir le formulaire
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}