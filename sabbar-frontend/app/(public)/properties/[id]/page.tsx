'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Home, Maximize2, Bath, Heart, Phone, Mail, Share2 } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  district: string;
  address?: string;
  area: number;
  bedrooms: number;
  bathrooms?: number;
  property_type: string;
  transaction_type: string;
  images?: string[];
  video?: string;
  floor?: number;
  has_parking?: boolean;
  has_garden?: boolean;
  has_pool?: boolean;
  has_elevator?: boolean;
  is_furnished?: boolean;
  is_available?: boolean;
  created_at: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Charger les détails de la propriété
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8000/api/v1/properties/${propertyId}`);

        if (!response.ok) {
          throw new Error('Propriété non trouvée');
        }

        const data = await response.json();
        setProperty(data);

        // Vérifier si le bien est en favoris
        const savedFavorites = localStorage.getItem('sabbar_favorites');
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites);
          setIsFavorite(favorites.includes(parseInt(propertyId)));
        }
      } catch (err) {
        console.error('❌ Erreur:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem('sabbar_favorites');
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    const propId = parseInt(propertyId);

    if (isFavorite) {
      const newFavorites = favorites.filter((id: number) => id !== propId);
      localStorage.setItem('sabbar_favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(propId);
      localStorage.setItem('sabbar_favorites', JSON.stringify(favorites));
    }

    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-[#0a0e1a] to-[#0f1424] min-h-screen">
        <div className="py-24 px-[5%]">
          <div className="max-w-[1400px] mx-auto text-center">
            <div className="animate-spin text-5xl mb-4">🏠</div>
            <p className="text-[#b0b0b0] text-lg">Chargement des détails...</p>
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

  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80'
  ];
  const currentImage = images[currentImageIndex];

  const transactionLabel = {
    'sale': 'Vente',
    'rent': 'Location',
    'vacation_rental': 'Location vacances'
  }[property.transaction_type] || property.transaction_type;

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
              src={currentImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {/* Boutons navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.6)] hover:bg-[#d4af37] text-white p-3 rounded-full transition opacity-0 group-hover:opacity-100"
                >
                  ◀
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.6)] hover:bg-[#d4af37] text-white p-3 rounded-full transition opacity-0 group-hover:opacity-100"
                >
                  ▶
                </button>
              </>
            )}

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

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-12">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-20 rounded-lg overflow-hidden border-2 transition ${
                    idx === currentImageIndex
                      ? 'border-[#d4af37]'
                      : 'border-[rgba(212,175,55,0.2)] hover:border-[#d4af37]'
                  }`}
                >
                  <img src={img} alt={`${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
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
                <span>{property.city} - {property.district}</span>
              </div>
              {property.address && (
                <p className="text-[#b0b0b0]">{property.address}</p>
              )}
            </div>

            {/* Caractéristiques principales */}
            <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Caractéristiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex justify-center text-[#d4af37] mb-3">
                    <Home size={32} />
                  </div>
                  <p className="text-3xl font-bold text-white">{property.bedrooms}</p>
                  <p className="text-[#b0b0b0]">Chambres</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center text-[#d4af37] mb-3">
                    <Maximize2 size={32} />
                  </div>
                  <p className="text-3xl font-bold text-white">{property.area}</p>
                  <p className="text-[#b0b0b0]">m²</p>
                </div>

                {property.bathrooms !== null && property.bathrooms !== undefined && (
                  <div className="text-center">
                    <div className="flex justify-center text-[#d4af37] mb-3">
                      <Bath size={32} />
                    </div>
                    <p className="text-3xl font-bold text-white">{property.bathrooms}</p>
                    <p className="text-[#b0b0b0]">Salles</p>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-4xl mb-3">{property.is_available ? '✅' : '❌'}</div>
                  <p className="text-[#b0b0b0]">{property.is_available ? 'Disponible' : 'Non disponible'}</p>
                </div>
              </div>

              {/* Commodités */}
              {(property.has_parking || property.has_garden || property.has_pool || property.has_elevator || property.is_furnished) && (
                <div className="mt-8 pt-8 border-t border-[rgba(212,175,55,0.1)]">
                  <h3 className="text-lg font-bold text-white mb-4">Commodités</h3>
                  <div className="flex flex-wrap gap-3">
                    {property.has_parking && <span className="bg-[#d4af37] text-[#0f1a2e] px-4 py-2 rounded-full font-bold text-sm">🅿️ Parking</span>}
                    {property.has_garden && <span className="bg-[#d4af37] text-[#0f1a2e] px-4 py-2 rounded-full font-bold text-sm">🌳 Jardin</span>}
                    {property.has_pool && <span className="bg-[#d4af37] text-[#0f1a2e] px-4 py-2 rounded-full font-bold text-sm">🏊 Piscine</span>}
                    {property.has_elevator && <span className="bg-[#d4af37] text-[#0f1a2e] px-4 py-2 rounded-full font-bold text-sm">🛗 Ascenseur</span>}
                    {property.is_furnished && <span className="bg-[#d4af37] text-[#0f1a2e] px-4 py-2 rounded-full font-bold text-sm">🛋️ Meublé</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
                <p className="text-[#b0b0b0] leading-relaxed whitespace-pre-wrap">{property.description}</p>
              </div>
            )}
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
                  href="mailto:contact@sabbar.ma"
                  className="w-full flex items-center justify-center gap-3 border-2 border-[#d4af37] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0f1a2e] font-bold py-3 rounded-lg transition"
                >
                  <Mail size={20} />
                  contact@sabbar.ma
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