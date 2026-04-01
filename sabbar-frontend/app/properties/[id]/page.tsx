'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Heart, Phone, Mail, Share2 } from 'lucide-react';
import { propertiesApi } from '@/lib/api';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<(number | string)[]>([]);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('sabbar_favorites');
    const favs = savedFavorites ? JSON.parse(savedFavorites) : [];
    setFavorites(favs);
    setIsFavorite(favs.includes(parseInt(propertyId)));
  }, [propertyId]);

  // Récupérer la propriété depuis l'API
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📡 Fetching property from API...', propertyId);
        
        const response = await propertiesApi.getProperties({
          limit: 100,
          offset: 0
        });
        
        console.log('✅ Properties loaded:', response);
        
        const foundProperty = response?.find((p: any) => String(p.id) === String(propertyId));
        
        if (foundProperty) {
          setProperty(foundProperty);
        } else {
          setError('Propriété non trouvée');
          setProperty(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
        console.error('❌ Erreur:', message);
        setError(message);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const toggleFavorite = () => {
    const newFavorites = favorites.includes(parseInt(propertyId))
      ? favorites.filter(id => id !== parseInt(propertyId))
      : [...favorites, parseInt(propertyId)];
    
    setFavorites(newFavorites);
    setIsFavorite(!isFavorite);
    localStorage.setItem('sabbar_favorites', JSON.stringify(newFavorites));
  };

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-[#0a0e1a] to-[#0f1424] min-h-screen">
        <div className="bg-[#0f1a2e] py-4 px-[5%] border-b border-[rgba(212,175,55,0.2)]">
          <div className="max-w-[1400px] mx-auto">
            <Link href="/properties" className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f4d03f] transition-colors">
              <ArrowLeft size={20} />
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </div>
        <div className="py-12 px-[5%]">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-[#b0b0b0] text-lg">⏳ Chargement de la propriété...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="bg-gradient-to-b from-[#0a0e1a] to-[#0f1424] min-h-screen">
        <div className="bg-[#0f1a2e] py-4 px-[5%] border-b border-[rgba(212,175,55,0.2)]">
          <div className="max-w-[1400px] mx-auto">
            <Link href="/properties" className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f4d03f] transition-colors">
              <ArrowLeft size={20} />
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </div>
        <div className="py-12 px-[5%]">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] text-[#fca5a5] px-6 py-4 rounded-lg">
              ❌ {error || 'Propriété non trouvée'}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [property.image || '/placeholder.jpg'];

  return (
    <main className="bg-gradient-to-b from-[#0a0e1a] to-[#0f1424] min-h-screen">
      {/* Back Button */}
      <div className="bg-[#0f1a2e] py-4 px-[5%] border-b border-[rgba(212,175,55,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <Link href="/properties" className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f4d03f] transition-colors">
            <ArrowLeft size={20} />
            <span>Retour aux propriétés</span>
          </Link>
        </div>
      </div>

      {/* Galerie d'images */}
      <section className="py-12 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative bg-[#0f1a2e] rounded-2xl overflow-hidden h-96 md:h-[600px] flex items-center justify-center group mb-8">
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {/* Favoris */}
            <button
              onClick={toggleFavorite}
              className={`absolute top-4 left-4 p-3 rounded-full transition-all ${
                isFavorite
                  ? 'bg-[#d4af37] text-[#0f1a2e]'
                  : 'bg-[rgba(0,0,0,0.6)] hover:bg-[#d4af37] text-white'
              }`}
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            {/* Indicateur */}
            <div className="absolute bottom-4 right-4 bg-[rgba(0,0,0,0.7)] text-white px-4 py-2 rounded-lg text-sm font-bold">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-12 px-[5%]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche */}
          <div className="lg:col-span-2">
            {/* Titre et localisation */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{property.title}</h1>
              <div className="flex items-center gap-2 text-[#d4af37] text-lg mb-4">
                <MapPin size={24} />
                <span>{property.city} - {property.quarter || property.district}</span>
              </div>
            </div>

            {/* Caractéristiques principales */}
            <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Caractéristiques</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                  <span className="text-[#b0b0b0]">Type</span>
                  <span className="text-white font-bold">{property.transaction_type || property.name || property.title}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                  <span className="text-[#b0b0b0]">Ville</span>
                  <span className="text-white font-bold">{property.city}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                  <span className="text-[#b0b0b0]">Quartier</span>
                  <span className="text-white font-bold">{property.quarter || property.district}</span>
                </div>
                {property.bedrooms && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                    <span className="text-[#b0b0b0]">Chambres</span>
                    <span className="text-white font-bold">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                    <span className="text-[#b0b0b0]">Salles de bain</span>
                    <span className="text-white font-bold">{property.bathrooms}</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                    <span className="text-[#b0b0b0]">Surface</span>
                    <span className="text-white font-bold">{property.area} m²</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[#b0b0b0]">Date de création</span>
                  <span className="text-white font-bold">{new Date(property.createdAt || property.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Prix et contact */}
          <div className="lg:col-span-1">
            {/* Carte de prix */}
            <div className="bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-2xl p-8 mb-8 sticky top-8">
              <p className="text-[#0f1a2e] font-bold text-sm mb-2">PRIX</p>
              <div className="text-3xl font-bold text-[#0f1a2e] mb-2 break-words">
                {property.price.toLocaleString('fr-FR', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
              <p className="text-[#0f1a2e] font-semibold text-lg mb-8">MAD</p>
            </div>

            {/* Agent de contact */}
            <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Nous contacter</h3>

              <div className="space-y-4">
                <a
                  href="tel:+212561511251"
                  className="w-full flex items-center justify-center gap-3 bg-[#d4af37] hover:bg-[#f4d03f] text-[#0f1a2e] font-bold py-3 rounded-lg transition"
                >
                  <Phone size={20} />
                  +212 5 61 51 12 51
                </a>

                <a
                  href="mailto:contact@landmark-estate.com"
                  className="w-full flex items-center justify-center gap-3 border-2 border-[#d4af37] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0f1a2e] font-bold py-3 rounded-lg transition"
                >
                  <Mail size={20} />
                  contact@landmark.ma
                </a>

                <button className="w-full flex items-center justify-center gap-3 border-2 border-[#b0b0b0] hover:border-[#d4af37] text-[#b0b0b0] hover:text-[#d4af37] font-bold py-3 rounded-lg transition">
                  <Share2 size={20} />
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}