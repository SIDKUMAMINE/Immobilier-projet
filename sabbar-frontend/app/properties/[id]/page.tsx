'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Heart, Phone, Mail, Share2, ChevronLeft, ChevronRight, Play, X, Copy } from 'lucide-react';
import { propertiesApi } from '@/lib/api';

const transactionTypeMap: { [key: string]: string } = {
  'sale': 'Vente',
  'vente': 'Vente',
  'rent': 'Location',
  'location': 'Location',
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

// 🎨 PALETTE SABBAR
const SABBAR_COLORS = {
  navyDominant: '#0D1F3C',
  goldAccent: '#C8A96E',
  goldLight: '#E2C98A',
  terracotta: '#B5573A',
  ivory: '#F9F5EF',
};

// 📱 Options de partage
const SHARE_OPTIONS = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366' },
  { id: 'email', name: 'Email', icon: '📧', color: '#EA4335' },
  { id: 'facebook', name: 'Facebook', icon: '👍', color: '#1877F2' },
  { id: 'twitter', name: 'Twitter', icon: '𝕏', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', color: '#0088cc' },
  { id: 'copy', name: 'Copier le lien', icon: '📋', color: SABBAR_COLORS.goldAccent },
];

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<(number | string)[]>([]);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
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
          console.log('🏠 Property found:', foundProperty);
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

  const getEmbedUrl = (videoUrl: string): string | null => {
    if (!videoUrl) return null;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (videoUrl.includes('youtube.com/embed/')) {
      return videoUrl;
    }
    if (videoUrl.includes('vimeo.com/')) {
      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return null;
  };

  const isDirectVideoFile = (videoUrl: string): boolean => {
    if (!videoUrl) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.m4v', '.3gp'];
    for (const ext of videoExtensions) {
      if (videoUrl.toLowerCase().includes(ext)) return true;
    }
    if (videoUrl.includes('supabase.co') && (videoUrl.includes('/storage/') || videoUrl.includes('/object/'))) {
      return true;
    }
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

  // ✅ Fonction de partage améliorée
  const handleShare = async (platform: string) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = property.title;
    const shareText = `Découvrez cette propriété: ${property.title} - ${property.price.toLocaleString('fr-FR')} MAD`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n' + shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
        break;
      case 'copy':
        copyToClipboard(shareUrl);
        break;
      default:
        break;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) {
        console.error('❌ Impossible de copier le lien:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-[#f9f5ef] to-[#f5f1eb] min-h-screen">
        <div className="bg-[#F9F5EF] py-4 px-[5%] border-b border-[rgba(200,169,110,0.2)]">
          <div className="max-w-[1400px] mx-auto">
            <Link href="/properties" className="inline-flex items-center gap-2 text-[#C8A96E] hover:text-[#0D1F3C] transition-colors" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
              <ArrowLeft size={20} />
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </div>
        <div className="py-12 px-[5%]">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-[#0D1F3C] text-lg" style={{ fontFamily: 'DM Sans' }}>⏳ Chargement de la propriété...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="bg-gradient-to-b from-[#f9f5ef] to-[#f5f1eb] min-h-screen">
        <div className="bg-[#F9F5EF] py-4 px-[5%] border-b border-[rgba(200,169,110,0.2)]">
          <div className="max-w-[1400px] mx-auto">
            <Link href="/properties" className="inline-flex items-center gap-2 text-[#C8A96E] hover:text-[#0D1F3C] transition-colors" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
              <ArrowLeft size={20} />
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </div>
        <div className="py-12 px-[5%]">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-[rgba(181,87,58,0.1)] border border-[rgba(181,87,58,0.3)] text-[#B5573A] px-6 py-4 rounded-lg" style={{ fontFamily: 'DM Sans' }}>
              ❌ {error || 'Propriété non trouvée'}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [property.image || '/placeholder.jpg'];
  const videoUrl = property?.video_url || property?.videoUrl || property?.video || property?.video_URL || property?.Video || property?.VIDEO || property?.video_path || property?.videoPath || null;

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

  const VideoSection = () => {
    if (!videoUrl) {
      return (
        <div className="bg-[rgba(13,31,60,0.1)] border-2 border-dashed border-[rgba(200,169,110,0.3)] rounded-lg aspect-video flex flex-col items-center justify-center text-center p-8">
          <div className="bg-[rgba(200,169,110,0.2)] p-4 rounded-full mb-4">
            <Play size={48} className="text-[#C8A96E]" />
          </div>
          <p className="text-[#0D1F3C] text-lg font-semibold" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 300 }}>Aucune vidéo disponible</p>
          <p className="text-[#999] text-sm mt-2" style={{ fontFamily: 'DM Sans' }}>Les vidéos seront disponibles prochainement</p>
        </div>
      );
    }

    if (isDirectVideoFile(videoUrl)) {
      return (
        <div className="relative bg-black rounded-lg overflow-hidden w-full aspect-video">
          <video width="100%" height="100%" controls controlsList="nodownload" className="w-full h-full" style={{ display: 'block' }}>
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            Votre navigateur ne supporte pas le lecteur vidéo HTML5.
          </video>
        </div>
      );
    }

    const embedUrl = getEmbedUrl(videoUrl);
    if (embedUrl) {
      return (
        <div className="relative bg-black rounded-lg overflow-hidden w-full aspect-video">
          <iframe width="100%" height="100%" src={embedUrl} title="Property Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block' }} />
        </div>
      );
    }

    return (
      <div className="bg-[rgba(13,31,60,0.1)] border-2 border-dashed border-[rgba(200,169,110,0.3)] rounded-lg aspect-video flex flex-col items-center justify-center text-center p-8">
        <div className="bg-[rgba(200,169,110,0.2)] p-4 rounded-full mb-4">
          <Play size={48} className="text-[#C8A96E]" />
        </div>
        <p className="text-[#0D1F3C] text-lg font-semibold" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 300 }}>Format vidéo non supporté</p>
      </div>
    );
  };

  // 🎨 MODAL DE PARTAGE SABBAR
  const ShareModal = () => {
    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setShowShareModal(false)}
          style={{ backdropFilter: 'blur(2px)' }}
        />

        {/* Modal */}
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{ backgroundColor: SABBAR_COLORS.ivory }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ backgroundColor: SABBAR_COLORS.navyDominant }}
          >
            <h2 className="text-xl font-light" style={{ color: SABBAR_COLORS.goldLight, fontFamily: 'Cormorant Garamond', fontWeight: 300 }}>
              Partager cette propriété
            </h2>
            <button
              onClick={() => setShowShareModal(false)}
              className="p-1 hover:opacity-80 transition"
              style={{ color: SABBAR_COLORS.goldLight }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Link Copy Section */}
          <div className="px-6 py-4 border-b" style={{ borderColor: SABBAR_COLORS.goldAccent + '30' }}>
            <p className="text-xs font-bold uppercase mb-3" style={{ color: SABBAR_COLORS.navyDominant, fontFamily: 'DM Sans', letterSpacing: '0.5px' }}>
              Lien de partage
            </p>
            <div className="flex gap-2">
              <div
                className="flex-1 px-3 py-2 rounded-lg text-xs truncate"
                style={{
                  backgroundColor: SABBAR_COLORS.goldAccent + '15',
                  color: SABBAR_COLORS.navyDominant,
                  fontFamily: 'DM Sans',
                }}
              >
                {typeof window !== 'undefined' ? window.location.href.substring(0, 40) + '...' : 'URL'}
              </div>
              <button
                onClick={() => handleShare('copy')}
                className="px-3 py-2 rounded-lg font-bold transition hover:opacity-80"
                style={{
                  backgroundColor: copiedLink ? '#10B981' : SABBAR_COLORS.goldAccent,
                  color: copiedLink ? 'white' : SABBAR_COLORS.navyDominant,
                  fontFamily: 'DM Sans',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {copiedLink ? '✓ Copié' : 'Copier'}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="px-6 py-4">
            <p className="text-xs font-bold uppercase mb-4" style={{ color: SABBAR_COLORS.navyDominant, fontFamily: 'DM Sans', letterSpacing: '0.5px' }}>
              Partager via
            </p>
            <div className="grid grid-cols-4 gap-3">
              {SHARE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    handleShare(option.id);
                    if (option.id !== 'copy') {
                      setTimeout(() => setShowShareModal(false), 300);
                    }
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition hover:scale-110"
                  style={{
                    backgroundColor: option.id === 'copy' ? (copiedLink ? '#10B981' : SABBAR_COLORS.goldAccent + '20') : 'rgba(13, 31, 60, 0.05)',
                    border: `1px solid ${option.color}30`,
                  }}
                  title={option.name}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span
                    className="text-xs font-bold text-center leading-tight"
                    style={{
                      color: option.id === 'copy' ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.navyDominant,
                      fontFamily: 'DM Sans',
                      fontWeight: 500,
                    }}
                  >
                    {option.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-6 py-3 text-center text-xs"
            style={{
              backgroundColor: SABBAR_COLORS.goldAccent + '10',
              color: SABBAR_COLORS.navyDominant,
              fontFamily: 'DM Sans',
              fontWeight: 400,
            }}
          >
            Partagez cette propriété avec vos amis et famille
          </div>
        </div>
      </>
    );
  };

  return (
    <main className="bg-gradient-to-b from-[#f9f5ef] to-[#f5f1eb] min-h-screen">
      {/* Back Button */}
      <div className="bg-[#F9F5EF] py-4 px-[5%] border-b border-[rgba(200,169,110,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <Link href="/properties" className="inline-flex items-center gap-2 text-[#C8A96E] hover:text-[#0D1F3C] transition-colors" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
            <ArrowLeft size={20} />
            <span>Retour aux propriétés</span>
          </Link>
        </div>
      </div>

      {/* Image Gallery with Swipe */}
      <section className="py-12 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div 
            className="relative bg-[#E2C98A] rounded-2xl overflow-hidden h-96 sm:h-[500px] md:h-[600px] flex items-center justify-center group mb-8 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img src={images[currentImageIndex]} alt={property.title} className="w-full h-full object-cover transition-opacity duration-300" />

            <button
              onClick={toggleFavorite}
              className={`absolute top-4 left-4 p-3 rounded-full transition-all z-10 ${isFavorite ? 'bg-[#C8A96E] text-[#F9F5EF]' : 'bg-[rgba(0,0,0,0.6)] hover:bg-[#C8A96E] text-white'}`}
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            <div className="absolute bottom-4 right-4 bg-[rgba(0,0,0,0.7)] text-white px-4 py-2 rounded-lg text-sm font-bold">
              {currentImageIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.6)] hover:bg-[#C8A96E] text-white hover:text-[#F9F5EF] p-3 rounded-full transition-all z-10 hidden group-hover:block"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.6)] hover:bg-[#C8A96E] text-white hover:text-[#F9F5EF] p-3 rounded-full transition-all z-10 hidden group-hover:block"
              >
                <ChevronRight size={24} />
              </button>
            )}

            <div className="absolute bottom-4 left-4 bg-[rgba(0,0,0,0.7)] text-white px-3 py-1 rounded-lg text-xs font-semibold">
              👉 Glissez pour naviguer
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-4">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-[#C8A96E]' : 'border-[rgba(200,169,110,0.2)] hover:border-[#C8A96E]'}`}
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
              <h1 className="text-4xl md:text-5xl font-light text-[#0D1F3C] mb-4" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 300 }}>{property.title}</h1>
              <div className="flex items-center gap-2 text-[#C8A96E] text-lg mb-4" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                <MapPin size={24} />
                <span>{property.city} - {property.quarter || property.district}</span>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-light text-[#0D1F3C] mb-6" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 300 }}>📝 Description</h2>
                <p className="text-[#0D1F3C] leading-relaxed" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>{property.description}</p>
              </div>
            )}

            {/* Characteristics Section */}
            <div className="bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-light text-[#0D1F3C] mb-6" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 300 }}>📋 Caractéristiques</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.2)]">
                  <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Type de transaction</span>
                  <span className="text-[#0D1F3C] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>{getTransactionTypeLabel(property.transaction_type)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.2)]">
                  <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Type de bien</span>
                  <span className="text-[#0D1F3C] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>{getPropertyTypeLabel(property.property_type)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.2)]">
                  <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Ville</span>
                  <span className="text-[#0D1F3C] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>{property.city}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.2)]">
                  <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Quartier</span>
                  <span className="text-[#0D1F3C] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>{property.quarter || property.district || 'N/A'}</span>
                </div>
                {property.floor && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.2)]">
                    <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Étage</span>
                    <span className="text-[#0D1F3C] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>{property.floor}</span>
                  </div>
                )}
                {property.elevator || property.has_elevator ? (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.2)]">
                    <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Ascenseur</span>
                    <span className="text-[#C8A96E] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>✓ Oui</span>
                  </div>
                ) : null}
                {property.bedrooms && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.2)]">
                    <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Chambres</span>
                    <span className="text-[#0D1F3C] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.2)]">
                    <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Salles de bain</span>
                    <span className="text-[#0D1F3C] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>{property.bathrooms}</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.2)]">
                    <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Surface</span>
                    <span className="text-[#0D1F3C] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>{property.area} m²</span>
                  </div>
                )}
                {property.equipments && property.equipments.length > 0 && (
                  <div className="pb-4">
                    <span className="text-[#0D1F3C] block mb-3" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Équipements</span>
                    <div className="flex flex-wrap gap-2">
                      {property.equipments.map((equipment: string, index: number) => (
                        <span key={index} className="bg-[rgba(200,169,110,0.2)] text-[#C8A96E] px-3 py-1 rounded-full text-sm font-bold border border-[rgba(200,169,110,0.4)]" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>
                          {equipment}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {property.status && (
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(200,169,110,0.2)]">
                    <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Statut</span>
                    <span className="text-[#0D1F3C] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>{property.status}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[#0D1F3C]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Date de création</span>
                  <span className="text-[#0D1F3C] font-bold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>{new Date(property.createdAt || property.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-light text-[#0D1F3C] mb-6" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 300 }}>🎬 Vidéo de la propriété</h2>
              <VideoSection />
            </div>
          </div>

          {/* Right Column - Price and Contact */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#C8A96E] to-[#E2C98A] rounded-xl p-6 mb-6 sticky top-8">
              <p className="text-[#0D1F3C] font-bold text-xs mb-1" style={{ fontFamily: 'DM Sans', letterSpacing: '0.5px' }}>PRIX</p>
              <div className="text-2xl font-bold text-[#0D1F3C] mb-1 break-words" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 300 }}>
                {property.price.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <p className="text-[#0D1F3C] font-semibold text-sm" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>MAD</p>
            </div>

            <div className="bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] rounded-2xl p-6">
              <h3 className="text-xl font-light text-[#0D1F3C] mb-4" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 300 }}>📞 Nous contacter</h3>
              <div className="space-y-3">
                <a
                  href="tel:+212605585720"
                  className="w-full flex items-center justify-center gap-3 bg-[#C8A96E] hover:bg-[#E2C98A] text-[#0D1F3C] font-bold py-2 px-3 rounded-lg transition text-sm"
                  style={{ fontFamily: 'DM Sans', fontWeight: 600 }}
                >
                  <Phone size={18} />
                  +212 6 05 58 57 20
                </a>
                <a
                  href="mailto:Landmarkestate3@gmail.com"
                  className="w-full flex items-center justify-center gap-3 border-2 border-[#C8A96E] hover:bg-[#C8A96E] text-[#C8A96E] hover:text-[#0D1F3C] font-bold py-2 px-3 rounded-lg transition text-sm"
                  style={{ fontFamily: 'DM Sans', fontWeight: 600 }}
                >
                  <Mail size={18} />
                  Landmarkestate3@gmail.com
                </a>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full flex items-center justify-center gap-3 border-2 border-[#0D1F3C] hover:border-[#C8A96E] text-[#0D1F3C] hover:text-[#C8A96E] font-bold py-2 px-3 rounded-lg transition text-sm"
                  style={{ fontFamily: 'DM Sans', fontWeight: 600 }}
                >
                  <Share2 size={18} />
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      {showShareModal && <ShareModal />}
    </main>
  );
}