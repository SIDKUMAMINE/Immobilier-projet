'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Heart, Phone, Mail, Share2, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { propertiesApi } from '@/lib/api';

const transactionTypeMap: { [key: string]: string } = {
  // Vente
  'sale': 'Vente',
  'vente': 'Vente',
  
  // Location
  'rent': 'Location',
  'location': 'Location',
  
  // Location Vacances
  'vacation_rental': 'Location vacances',
  'vacation rental': 'Location vacances',
  'vacation': 'Location vacances',
  'location vacances': 'Location vacances',
  'location-vacances': 'Location vacances',
  'vacances': 'Location vacances',
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
        console.log('📊 Total properties:', Array.isArray(response) ? response.length : 0);
        
        const foundProperty = response?.find((p: any) => String(p.id) === String(propertyId));
        
        if (foundProperty) {
          console.log('🏠 Property found:', foundProperty);
          console.log('🎬 Video URL (video_url):', foundProperty.video_url);
          console.log('🎬 Video URL (videoUrl):', foundProperty.videoUrl);
          console.log('🎬 All keys in property:', Object.keys(foundProperty));
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

  // Helper function to convert video URL to embed format
  const getEmbedUrl = (videoUrl: string): string | null => {
    if (!videoUrl) return null;
    
    // YouTube watch URL format
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    // YouTube youtu.be short format
    if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    // Already embed format
    if (videoUrl.includes('youtube.com/embed/')) {
      return videoUrl;
    }
    
    // Vimeo format
    if (videoUrl.includes('vimeo.com/')) {
      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    
    return null;
  };

  // Helper function to determine if URL is a direct video file (including Supabase)
  const isDirectVideoFile = (videoUrl: string): boolean => {
    if (!videoUrl) {
      console.log('❌ isDirectVideoFile: videoUrl est vide');
      return false;
    }
    
    console.log('🎬 Checking video URL:', videoUrl);
    
    // Check for direct video file extensions (this should catch .mp4)
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.m4v', '.3gp'];
    for (const ext of videoExtensions) {
      if (videoUrl.toLowerCase().includes(ext)) {
        console.log(`✅ Detected video extension: ${ext}`);
        return true;
      }
    }
    
    // Supabase Storage URLs - these are direct video files
    if (videoUrl.includes('supabase.co') && (videoUrl.includes('/storage/') || videoUrl.includes('/object/'))) {
      console.log('✅ Detected Supabase Storage URL');
      return true;
    }
    
    console.log('❌ Not detected as direct video file');
    return false;
  };

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

  // ✅ Définir les images et vidéo EN HAUT avant le return JSX
  const images = property.images && property.images.length > 0 ? property.images : [property.image || '/placeholder.jpg'];

  // ✅ IMPORTANT: Chercher la vidéo dans TOUS les champs possibles
  const videoUrl = property?.video_url 
    || property?.videoUrl 
    || property?.video 
    || property?.video_URL
    || property?.Video
    || property?.VIDEO
    || property?.video_path
    || property?.videoPath
    || null;

  console.log('🎯 FINAL videoUrl extracted:', videoUrl);

  // ✅ Extraire et afficher tous les champs liés à la vidéo
  if (!videoUrl) {
    console.warn('⚠️ VIDEO URL NOT FOUND. Checking all property keys...');
    const allKeys = Object.keys(property);
    const videoRelatedKeys = allKeys.filter(key => 
      key.toLowerCase().includes('video') || 
      key.toLowerCase().includes('url') ||
      key.toLowerCase().includes('path') ||
      key.toLowerCase().includes('media')
    );
    console.log('🔍 Video-related keys found:', videoRelatedKeys);
    videoRelatedKeys.forEach(key => {
      console.log(`  ${key}:`, property[key]);
    });
  }

  // Image navigation handlers
  const handlePrevImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
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

  // ✅ Composant VideoSection - logique de rendu vidéo
  const VideoSection = () => {
    console.log('🎬 VideoSection render - videoUrl:', videoUrl);

    if (!videoUrl) {
      console.log('ℹ️ Aucune vidéo trouvée');
      return (
        <div className="bg-[rgba(26,40,71,0.5)] border-2 border-dashed border-[rgba(212,175,55,0.3)] rounded-lg aspect-video flex flex-col items-center justify-center text-center p-8">
          <div className="bg-[rgba(212,175,55,0.2)] p-4 rounded-full mb-4">
            <Play size={48} className="text-[#d4af37]" />
          </div>
          <p className="text-[#b0b0b0] text-lg font-semibold">Aucune vidéo disponible</p>
          <p className="text-[#666] text-sm mt-2">Les vidéos seront disponibles prochainement</p>
        </div>
      );
    }

    // ✅ Vérifier les formats directs EN PREMIER
    if (isDirectVideoFile(videoUrl)) {
      console.log('✅ Rendering direct video (MP4, WebM, etc.)');
      return (
        <div className="relative bg-black rounded-lg overflow-hidden w-full aspect-video">
          <video
            width="100%"
            height="100%"
            controls
            controlsList="nodownload"
            className="w-full h-full"
            style={{ display: 'block' }}
            onError={(e) => {
              console.error('❌ Video playback error:', e);
            }}
            onLoadedMetadata={() => {
              console.log('✅ Video metadata loaded');
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            Votre navigateur ne supporte pas le lecteur vidéo HTML5.
          </video>
        </div>
      );
    }

    // ✅ Vérifier YouTube/Vimeo après
    const embedUrl = getEmbedUrl(videoUrl);
    if (embedUrl) {
      console.log('✅ Rendering embedded video (YouTube/Vimeo)');
      return (
        <div className="relative bg-black rounded-lg overflow-hidden w-full aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="Property Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: 'block' }}
          />
        </div>
      );
    }

    // ✅ Format non supporté
    console.log('❌ Unsupported video format:', videoUrl);
    return (
      <div className="bg-[rgba(26,40,71,0.5)] border-2 border-dashed border-[rgba(212,175,55,0.3)] rounded-lg aspect-video flex flex-col items-center justify-center text-center p-8">
        <div className="bg-[rgba(212,175,55,0.2)] p-4 rounded-full mb-4">
          <Play size={48} className="text-[#d4af37]" />
        </div>
        <p className="text-[#b0b0b0] text-lg font-semibold">Format vidéo non supporté</p>
        <p className="text-[#666] text-sm mt-2 break-all max-w-xs">
          URL: {videoUrl.substring(0, 80)}...
        </p>
        <p className="text-[#666] text-xs mt-1">
          Formats supportés: MP4, WebM, YouTube, Vimeo, Supabase
        </p>
      </div>
    );
  };

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

            {/* Description */}
            {property.description && (
              <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">📝 Description</h2>
                <p className="text-[#b0b0b0] leading-relaxed">{property.description}</p>
              </div>
            )}

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

            {/* Video Section */}
            <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">🎬 Vidéo de la propriété</h2>
              <VideoSection />
            </div>
          </div>

          {/* Right Column - Price and Contact */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-xl p-6 mb-6 sticky top-8">
              <p className="text-[#0f1a2e] font-bold text-xs mb-1">PRIX</p>
              <div className="text-2xl font-bold text-[#0f1a2e] mb-1 break-words">
                {property.price.toLocaleString('fr-FR', { 
                  minimumFractionDigits: 0, 
                  maximumFractionDigits: 0 
                })}
              </div>
              <p className="text-[#0f1a2e] font-semibold text-sm">MAD</p>
            </div>

            {/* Contact Card */}
            <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">📞 Nous contacter</h3>

              <div className="space-y-3">
                <a
                  href="tel:+212561511251"
                  className="w-full flex items-center justify-center gap-3 bg-[#d4af37] hover:bg-[#f4d03f] text-[#0f1a2e] font-bold py-2 px-3 rounded-lg transition text-sm"
                >
                  <Phone size={18} />
                  +212 5 61 51 12 51
                </a>

                <a
                  href="mailto:contact@landmark-estate.com"
                  className="w-full flex items-center justify-center gap-3 border-2 border-[#d4af37] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0f1a2e] font-bold py-2 px-3 rounded-lg transition text-sm"
                >
                  <Mail size={18} />
                  contact@landmark.ma
                </a>

                <button className="w-full flex items-center justify-center gap-3 border-2 border-[#b0b0b0] hover:border-[#d4af37] text-[#b0b0b0] hover:text-[#d4af37] font-bold py-2 px-3 rounded-lg transition text-sm">
                  <Share2 size={18} />
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