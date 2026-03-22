'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Users, TrendingUp, Shield, Zap, Award } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      icon: '🤝',
      title: 'Intermédiaton Immobilière',
      description: 'Trouvez la propriété idéale avec notre expertise',
      fullDescription: 'Notre service d\'intermédiaton immobilière vous offre un accompagnement complet dans votre recherche de bien immobilier. Grâce à notre réseau étendu et notre connaissance approfondie du marché marocain, nous vous guidons vers les meilleures opportunités.',
      benefits: [
        'Accès à un large portefeuille de propriétés',
        'Négociation professionnelle et sécurisée',
        'Conseil personnalisé adapté à vos besoins',
        'Gestion complète du dossier administratif',
        'Expertise juridique et fiscale',
        'Suivi post-signature'
      ],
      features: [
        { icon: '🏠', text: 'Plus de 500 propriétés disponibles' },
        { icon: '💼', text: 'Agents expérimentés et certifiés' },
        { icon: '⚡', text: 'Traitement rapide des dossiers' },
        { icon: '🔒', text: 'Garantie de sécurité juridique' }
      ],
      color: 'blue'
    },
    {
      id: 2,
      icon: '💼',
      title: 'Commercialisation & Marketing',
      description: 'Mettez en valeur votre propriété',
      fullDescription: 'Notre service de commercialisation assure la meilleure exposition de votre propriété sur le marché. Nous utilisons des stratégies marketing innovantes et modernes pour attirer les meilleurs acheteurs ou locataires.',
      benefits: [
        'Photographie et vidéographie professionnelle',
        'Description détaillée et attrayante',
        'Publication sur multiples canaux digitaux',
        'Gestion des visites et des négociations',
        'Rapport mensuel d\'activité',
        'Stratégie de pricing optimisée'
      ],
      features: [
        { icon: '📸', text: 'Photos et vidéos haute résolution' },
        { icon: '📱', text: 'Présence sur tous les réseaux' },
        { icon: '📊', text: 'Analytics et rapports détaillés' },
        { icon: '🎯', text: 'Ciblage intelligent des acheteurs' }
      ],
      color: 'amber'
    }
  ];

  const stats = [
    { number: '500+', label: 'Propriétés gérées', icon: '🏠' },
    { number: '98%', label: 'Satisfaction clients', icon: '⭐' },
    { number: '50+', label: 'Agents professionnels', icon: '👥' },
    { number: '24/7', label: 'Support client', icon: '📞' }
  ];

  const process = [
    {
      step: 1,
      title: 'Consultation Initiale',
      description: 'Nous écoutons vos besoins et vos objectifs pour proposer la meilleure solution adaptée.'
    },
    {
      step: 2,
      title: 'Analyse & Stratégie',
      description: 'Notre équipe analyse le marché et définit une stratégie personnalisée pour vous.'
    },
    {
      step: 3,
      title: 'Exécution',
      description: 'Mise en œuvre complète de notre plan avec suivi régulier et transparence totale.'
    },
    {
      step: 4,
      title: 'Finalisation',
      description: 'Accompagnement jusqu\'à la signature et support post-transaction pour votre tranquillité.'
    }
  ];

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative py-24 px-4 border-b border-amber-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-amber-900/10"></div>
        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Nos Services
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            De la recherche de votre bien immobilier à sa commercialisation, ImmobilierM vous accompagne à chaque étape avec professionnalisme et expertise.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-3xl font-bold text-amber-500 mb-2">{stat.number}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Détaillés */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto space-y-24">
          {services.map((service, idx) => (
            <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Contenu */}
              <div className={idx % 2 === 1 ? 'lg:col-span-1 lg:order-2' : ''}>
                <div className="text-5xl mb-6">{service.icon}</div>
                <h2 className="text-4xl font-bold text-white mb-4">{service.title}</h2>
                <p className="text-xl text-gray-400 mb-6">{service.fullDescription}</p>

                {/* Benefits */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Nos avantages:</h3>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-amber-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link href="#contact">
                  <button className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 group">
                    En savoir plus
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              {/* Features Cards */}
              <div className={`grid grid-cols-2 gap-4 ${idx % 2 === 1 ? 'lg:col-span-1 lg:order-1' : ''}`}>
                {service.features.map((feature, fidx) => (
                  <div
                    key={fidx}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900 border border-amber-600/20 hover:border-amber-600/50 rounded-xl p-6 transition-all duration-300 group hover:shadow-lg hover:shadow-amber-600/10"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
                    <p className="text-gray-300 text-sm">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Processus Section */}
      <section className="py-24 px-4 bg-gray-900 border-y border-amber-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Notre Processus
            </h2>
            <p className="text-xl text-gray-400">
              Un accompagnement structuré en 4 étapes pour votre succès
            </p>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Card */}
                <div className="bg-black border border-amber-600/20 rounded-xl p-8 h-full hover:border-amber-600/50 transition-all duration-300">
                  {/* Étape */}
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {item.step}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>

                {/* Connector */}
                {idx < process.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-6 w-12 h-0.5 bg-gradient-to-r from-amber-600 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-xl text-gray-400">
              Nos valeurs fondamentales qui nous distinguent sur le marché
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={40} className="text-amber-500" />,
                title: 'Fiabilité & Sécurité',
                description: 'Toutes nos transactions sont sécurisées et respectent les normes légales marocaines.'
              },
              {
                icon: <TrendingUp size={40} className="text-amber-500" />,
                title: 'Expertise du Marché',
                description: 'Une connaissance approfondie du marché immobilier marocain et de ses tendances.'
              },
              {
                icon: <Award size={40} className="text-amber-500" />,
                title: 'Excellence Service',
                description: 'Un service personnalisé et une attention particulière à chaque client.'
              },
              {
                icon: <Users size={40} className="text-amber-500" />,
                title: 'Équipe Expérimentée',
                description: 'Des professionnels certifiés avec des années d\'expérience dans l\'immobilier.'
              },
              {
                icon: <Zap size={40} className="text-amber-500" />,
                title: 'Technologie Moderne',
                description: 'Utilisation des dernières technologies pour optimiser votre expérience.'
              },
              {
                icon: '💬',
                title: 'Support 24/7',
                description: 'Une équipe disponible en permanence pour répondre à vos questions.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-800/30 border border-amber-600/20 rounded-2xl p-8 hover:border-amber-600/50 transition-all duration-300 group hover:bg-gray-800/50"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform">
                  {typeof item.icon === 'string' ? (
                    <div className="text-4xl">{item.icon}</div>
                  ) : (
                    item.icon
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Final */}
      <section className="py-24 px-4 bg-gradient-to-r from-amber-900/20 via-black to-black border-t border-amber-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-400">
            Contactez-nous dès aujourd'hui pour une consultation gratuite et découvrez comment nous pouvons vous aider à atteindre vos objectifs immobiliers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/chat">
              <button className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105">
                Démarrer une consultation
              </button>
            </Link>
            <Link href="#contact">
              <button className="px-8 py-4 border-2 border-amber-600 text-amber-500 hover:text-amber-400 font-bold rounded-lg transition-all duration-300">
                Nous contacter
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-black border-t border-amber-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tarification Transparente
            </h2>
            <p className="text-xl text-gray-400">
              Pas de frais cachés, des tarifs justes et compétitifs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1 Pricing */}
            <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-600/30 rounded-xl p-8 hover:border-blue-600/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">Intermédiaton</h3>
              <p className="text-gray-400 mb-6">Commission standard adaptée au prix de la propriété</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-500" />
                  <span>2-3% du prix de vente</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-500" />
                  <span>Consultation gratuite</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-500" />
                  <span>Accompagnement complet</span>
                </li>
              </ul>
              <Link href="#contact">
                <button className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
                  Demander une consultation
                </button>
              </Link>
            </div>

            {/* Service 2 Pricing */}
            <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-600/30 rounded-xl p-8 hover:border-amber-600/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">Commercialisation</h3>
              <p className="text-gray-400 mb-6">Forfait marketing adapté à vos besoins</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-amber-500" />
                  <span>Formules flexibles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-amber-500" />
                  <span>Photos & vidéos incluses</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-amber-500" />
                  <span>Gestion complète</span>
                </li>
              </ul>
              <Link href="#contact">
                <button className="w-full mt-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors">
                  Demander un devis
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}