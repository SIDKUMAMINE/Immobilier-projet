'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Heart, Phone, Mail, Share2, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { propertiesApi } from '@/lib/api';

// Translation mappings
const transactionTypeMap: { [key: string]: string } = {
  'sale': 'Vente',
  'rental': 'Location',
  'vacation rental': 'Location vacances',
  'location vacances': 'Location vacances',
  'vente': 'Vente',
  'location': 'Location',
  'vacation': 'Location vacances',
  'vacances': 'Location vacances',
  'location-vacances': 'Location vacances',
};

const propertyTypeMap: { [key: string]: string } = {
  'apartment': 'Appartement',
  'villa': 'Villa',
  'house': 'Maison',
  'riad': 'Riad',
  'land': 'Terrain',
  'office': 'Bureau',
  'commercial': 'Local commercial',
  'apartement': 'Appartement',
  'maison': 'Maison',
  'terrain': 'Terrain',
  'bureau': 'Bureau',
  'local commercial': 'Local commercial',
  'local-commercial': 'Local commercial',
};

const getTransactionTypeLabel = (type: string): string => {
  return transactionTypeMap[type.toLowerCase()] || type;
};

const getPropertyTypeLabel = (type: string): string => {
  return propertyTypeMap[type.toLowerCase()] || type;
};

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<(number | string)[]>([]);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const touchStartRef = useRef<number>(0);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('sabbar_favorites');
    const favs = savedFavorites ? JSON.parse(savedFavorites) : [];
    setFavorites(favs);
    setIsFavorite(favs.includes(parseInt(propertyId)));
  }, [propertyId]);

  // Fetch property from API
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

  // Image navigation handlers
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndValue = e.changedTouches[0].clientX;
    const distance = touchStartRef.current - touchEndValue;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
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

      {/* Image Gallery with Swipe */}
      <section className="py-12 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div 
            className="relative bg-[#0f1a2e] rounded-2xl overflow-hidden h-96 sm:h-[500px] md:h-[600px] flex items-center justify-center group mb-8 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main Image */}
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className={`absolute top-4 left-4 p-3 rounded-full transition-all z-10 ${
                isFavorite
                  ? 'bg-[#d4af37] text-[#0f1a2e]'
                  : 'bg-[rgba(0,0,0,0.6)] hover:bg-[#d4af37] text-white'
              }`}
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-[rgba(0,0,0,0.7)] text-white px-4 py-2 rounded-lg text-sm font-bold">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Left Arrow */}
            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.6)] hover:bg-[#d4af37] text-white hover:text-[#0f1a2e] p-3 rounded-full transition-all z-10 hidden group-hover:block"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Right Arrow */}
            {images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.6)] hover:bg-[#d4af37] text-white hover:text-[#0f1a2e] p-3 rounded-full transition-all z-10 hidden group-hover:block"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Swipe Hint */}
            <div className="absolute bottom-4 left-4 bg-[rgba(0,0,0,0.7)] text-white px-3 py-1 rounded-lg text-xs font-semibold">
              👉 Glissez pour naviguer
            </div>
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-4">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? 'border-[#d4af37]'
                      : 'border-[rgba(212,175,55,0.2)] hover:border-[#d4af37]'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-[5%]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Title and Location */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{property.title}</h1>
              <div className="flex items-center gap-2 text-[#d4af37] text-lg mb-4">
                <MapPin size={24} />
                <span>{property.city} - {property.quarter || property.district}</span>
              </div>
            </div>

            {/* Characteristics Section */}
            <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">📋 Caractéristiques</h2>
              <div className="space-y-4">
                {/* Transaction Type */}
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                  <span className="text-[#b0b0b0]">Type de transaction</span>
                  <span className="text-white font-bold">{getTransactionTypeLabel(property.transaction_type)}</span>
                </div>

                {/* Property Type */}
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                  <span className="text-[#b0b0b0]">Type de bien</span>
                  <span className="text-white font-bold">{getPropertyTypeLabel(property.property_type)}</span>
                </div>

                {/* City */}
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                  <span className="text-[#b0b0b0]">Ville</span>
                  <span className="text-white font-bold">{property.city}</span>
                </div>

                {/* District/Quarter */}
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                  <span className="text-[#b0b0b0]">Quartier</span>
                  <span className="text-white font-bold">{property.quarter || property.district || 'N/A'}</span>
                </div>

                {/* Floor */}
                {property.floor && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                    <span className="text-[#b0b0b0]">Étage</span>
                    <span className="text-white font-bold">{property.floor}</span>
                  </div>
                )}

                {/* Elevator */}
                {property.elevator || property.has_elevator ? (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                    <span className="text-[#b0b0b0]">Ascenseur</span>
                    <span className="text-[#d4af37] font-bold">✓ Oui</span>
                  </div>
                ) : null}

                {/* Bedrooms */}
                {property.bedrooms && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                    <span className="text-[#b0b0b0]">Chambres</span>
                    <span className="text-white font-bold">{property.bedrooms}</span>
                  </div>
                )}

                {/* Bathrooms */}
                {property.bathrooms && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                    <span className="text-[#b0b0b0]">Salles de bain</span>
                    <span className="text-white font-bold">{property.bathrooms}</span>
                  </div>
                )}

                {/* Area */}
                {property.area && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                    <span className="text-[#b0b0b0]">Surface</span>
                    <span className="text-white font-bold">{property.area} m²</span>
                  </div>
                )}

                {/* Equipment */}
                {property.equipments && property.equipments.length > 0 && (
                  <div className="pb-4">
                    <span className="text-[#b0b0b0] block mb-3">Équipements</span>
                    <div className="flex flex-wrap gap-2">
                      {property.equipments.map((equipment: string, index: number) => (
                        <span key={index} className="bg-[rgba(212,175,55,0.2)] text-[#d4af37] px-3 py-1 rounded-full text-sm font-bold border border-[rgba(212,175,55,0.3)]">
                          {equipment}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                {property.status && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(212,175,55,0.1)]">
                    <span className="text-[#b0b0b0]">Statut</span>
                    <span className="text-white font-bold">{property.status}</span>
                  </div>
                )}

                {/* Creation Date */}
                <div className="flex justify-between items-center">
                  <span className="text-[#b0b0b0]">Date de création</span>
                  <span className="text-white font-bold">{new Date(property.createdAt || property.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">📝 Description</h2>
                <p className="text-[#b0b0b0] leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Video Section */}
            <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">🎬 Vidéo de la propriété</h2>
              
              {property.video_url || property.videoUrl ? (
                <div className="relative bg-black rounded-lg overflow-hidden h-96 sm:h-[500px] flex items-center justify-center group cursor-pointer">
                  <iframe
                    src={property.video_url || property.videoUrl}
                    title="Property Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="bg-[rgba(26,40,71,0.5)] border-2 border-dashed border-[rgba(212,175,55,0.3)] rounded-lg h-96 flex flex-col items-center justify-center text-center p-8">
                  <Play size={48} className="text-[#d4af37] mb-4 opacity-50" />
                  <p className="text-[#b0b0b0] text-lg">Aucune vidéo disponible pour cette propriété</p>
                  <p className="text-[#666] text-sm mt-2">Les vidéos seront disponibles prochainement</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Price and Contact */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-2xl p-8 mb-8 sticky top-8">
              <p className="text-[#0f1a2e] font-bold text-sm mb-2">PRIX</p>
              <div className="text-3xl font-bold text-[#0f1a2e] mb-2 break-words">
                {property.price.toLocaleString('fr-FR', { 
                  minimumFractionDigits: 0, 
                  maximumFractionDigits: 0 
                })}
              </div>
              <p className="text-[#0f1a2e] font-semibold text-lg mb-8">MAD</p>
            </div>

            {/* Contact Card */}
            <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">📞 Nous contacter</h3>

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