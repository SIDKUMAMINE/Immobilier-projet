'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Heart, Phone, Mail, Share2, ChevronLeft, ChevronRight, Play, X, Copy, ChevronDown } from 'lucide-react';
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

// 🎯 COMPOSANT FILTRE SABBAR - RÉSTYLISÉ
interface FilterSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionner une option'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <label
        className="block text-xs font-bold uppercase mb-2"
        style={{
          color: SABBAR_COLORS.goldAccent,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '10px',
          letterSpacing: '1px',
          fontWeight: 700,
        }}
      >
        {label}
      </label>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-200"
          style={{
            backgroundColor: isOpen ? SABBAR_COLORS.navyDominant : 'rgba(249, 245, 239, 0.05)',
            color: value && value !== placeholder ? SABBAR_COLORS.ivory : SABBAR_COLORS.goldLight,
            border: `2px solid ${SABBAR_COLORS.goldAccent}`,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <span className="truncate">
            {value && value !== placeholder ? value : placeholder}
          </span>
          <ChevronDown
            size={18}
            className="flex-shrink-0 ml-2 transition-transform duration-200"
            style={{
              color: SABBAR_COLORS.goldAccent,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-xl z-50 overflow-hidden border-2"
            style={{
              backgroundColor: SABBAR_COLORS.navyDominant,
              borderColor: SABBAR_COLORS.goldAccent,
              boxShadow: `0 10px 30px rgba(200, 169, 110, 0.2)`,
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => {
                onChange(placeholder);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left transition-colors"
              style={{
                backgroundColor: value === placeholder ? SABBAR_COLORS.goldAccent + '15' : 'transparent',
                color: value === placeholder ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldLight,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              {placeholder}
            </button>

            <div
              style={{
                height: '1px',
                backgroundColor: SABBAR_COLORS.goldAccent + '20',
              }}
            />

            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left transition-colors text-sm"
                style={{
                  backgroundColor: value === option ? SABBAR_COLORS.goldAccent + '15' : 'transparent',
                  color: value === option ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldLight,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: value === option ? 600 : 500,
                  borderBottom: `1px solid ${SABBAR_COLORS.goldAccent}10`,
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
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

  // 🎯 ÉTAT DES FILTRES
  const [filters, setFilters] = useState({
    city: 'Sélectionner une ville',
    transactionType: 'Tous les types',
    propertyType: 'Tous les types',
  });

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
      <main
        className="min-h-screen"
        style={{
          backgroundColor: SABBAR_COLORS.navyDominant,
        }}
      >
        <div
          className="py-4 px-[5%] border-b"
          style={{
            backgroundColor: SABBAR_COLORS.navyDominant,
            borderColor: SABBAR_COLORS.goldAccent + '30',
          }}
        >
          <div className="max-w-[1400px] mx-auto">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 font-bold transition-colors"
              style={{
                color: SABBAR_COLORS.goldAccent,
              }}
            >
              <ArrowLeft size={20} />
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </div>
        <div className="py-12 px-[5%]">
          <div className="max-w-[1400px] mx-auto">
            <p
              className="text-lg"
              style={{
                color: SABBAR_COLORS.goldLight,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ⏳ Chargement de la propriété...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main
        className="min-h-screen"
        style={{
          backgroundColor: SABBAR_COLORS.navyDominant,
        }}
      >
        <div
          className="py-4 px-[5%] border-b"
          style={{
            backgroundColor: SABBAR_COLORS.navyDominant,
            borderColor: SABBAR_COLORS.goldAccent + '30',
          }}
        >
          <div className="max-w-[1400px] mx-auto">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 font-bold transition-colors"
              style={{
                color: SABBAR_COLORS.goldAccent,
              }}
            >
              <ArrowLeft size={20} />
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </div>
        <div className="py-12 px-[5%]">
          <div className="max-w-[1400px] mx-auto">
            <div
              className="px-6 py-4 rounded-lg border"
              style={{
                backgroundColor: SABBAR_COLORS.terracotta + '20',
                borderColor: SABBAR_COLORS.terracotta + '50',
                color: SABBAR_COLORS.terracotta,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ❌ {error || 'Propriété non trouvée'}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [property.image || '/placeholder.jpg'];
  const videoUrl = property?.video_url || property?.videoUrl || property?.video || property?.video_URL || property?.Video || property?.VIDEO || property?.video_path || property?.videoPath || null;

  const cities = [
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Fès',
    'Tanger',
    'Agadir',
    'Meknès',
    'Oujda',
    'Kénitra',
    'Tétouan',
  ];

  const transactionTypes = [
    'Vente',
    'Location',
    'Location vacances',
  ];

  const propertyTypes = [
    'Studio',
    'Appartement',
    'Villa',
    'Maison',
    'Riad',
    'Terrain',
    'Bureau',
    'Local commercial',
  ];

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
        <div
          className="border-2 border-dashed rounded-lg aspect-video flex flex-col items-center justify-center text-center p-8"
          style={{
            backgroundColor: SABBAR_COLORS.navyDominant + '50',
            borderColor: SABBAR_COLORS.goldAccent + '50',
          }}
        >
          <div
            className="p-4 rounded-full mb-4"
            style={{
              backgroundColor: SABBAR_COLORS.goldAccent + '20',
            }}
          >
            <Play size={48} style={{ color: SABBAR_COLORS.goldAccent }} />
          </div>
          <p
            className="text-lg font-semibold"
            style={{
              color: SABBAR_COLORS.goldLight,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Aucune vidéo disponible
          </p>
          <p
            className="text-sm mt-2"
            style={{
              color: SABBAR_COLORS.goldAccent + '80',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Les vidéos seront disponibles prochainement
          </p>
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
      <div
        className="border-2 border-dashed rounded-lg aspect-video flex flex-col items-center justify-center text-center p-8"
        style={{
          backgroundColor: SABBAR_COLORS.navyDominant + '50',
          borderColor: SABBAR_COLORS.goldAccent + '50',
        }}
      >
        <div
          className="p-4 rounded-full mb-4"
          style={{
            backgroundColor: SABBAR_COLORS.goldAccent + '20',
          }}
        >
          <Play size={48} style={{ color: SABBAR_COLORS.goldAccent }} />
        </div>
        <p
          className="text-lg font-semibold"
          style={{
            color: SABBAR_COLORS.goldLight,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Format vidéo non supporté
        </p>
      </div>
    );
  };

  // 🎨 MODAL DE PARTAGE SABBAR
  const ShareModal = () => {
    return (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setShowShareModal(false)}
          style={{ backdropFilter: 'blur(2px)' }}
        />

        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{ backgroundColor: SABBAR_COLORS.ivory }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ backgroundColor: SABBAR_COLORS.navyDominant }}
          >
            <h2 className="text-xl font-light" style={{ color: SABBAR_COLORS.goldLight, fontFamily: 'Cormorant Garamond' }}>
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
                }}
              >
                {copiedLink ? '✓ Copié' : 'Copier'}
              </button>
            </div>
          </div>

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
                    }}
                  >
                    {option.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="px-6 py-3 text-center text-xs"
            style={{
              backgroundColor: SABBAR_COLORS.goldAccent + '10',
              color: SABBAR_COLORS.navyDominant,
              fontFamily: 'DM Sans',
            }}
          >
            Partagez cette propriété avec vos amis et famille
          </div>
        </div>
      </>
    );
  };

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: SABBAR_COLORS.navyDominant,
      }}
    >
      {/* Back Button */}
      <div
        className="py-4 px-[5%] border-b"
        style={{
          backgroundColor: SABBAR_COLORS.navyDominant,
          borderColor: SABBAR_COLORS.goldAccent + '30',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 font-bold transition-colors"
            style={{
              color: SABBAR_COLORS.goldAccent,
            }}
          >
            <ArrowLeft size={20} />
            <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Retour aux propriétés</span>
          </Link>
        </div>
      </div>

      {/* 🎯 SECTION FILTRES SABBAR */}
      <section
        className="py-8 px-[5%] border-b"
        style={{
          backgroundColor: SABBAR_COLORS.navyDominant,
          borderColor: SABBAR_COLORS.goldAccent + '30',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <h2
            className="text-lg font-bold mb-6"
            style={{
              color: SABBAR_COLORS.goldAccent,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            🔍 Affiner votre recherche
          </h2>

          {/* Grille de filtres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <FilterSelect
              label="Ville"
              options={cities}
              value={filters.city}
              onChange={(value) => setFilters({ ...filters, city: value })}
              placeholder="Sélectionner une ville"
            />

            <FilterSelect
              label="Type de transaction"
              options={transactionTypes}
              value={filters.transactionType}
              onChange={(value) => setFilters({ ...filters, transactionType: value })}
              placeholder="Tous les types"
            />

            <FilterSelect
              label="Type de bien"
              options={propertyTypes}
              value={filters.propertyType}
              onChange={(value) => setFilters({ ...filters, propertyType: value })}
              placeholder="Tous les types"
            />
          </div>

          {/* Critères supplémentaires */}
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: SABBAR_COLORS.navyDominant + '80',
              borderColor: SABBAR_COLORS.goldAccent + '30',
            }}
          >
            <h3
              className="text-base font-bold mb-6 flex items-center gap-2"
              style={{
                color: SABBAR_COLORS.goldAccent,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{
                backgroundColor: SABBAR_COLORS.goldAccent,
                color: SABBAR_COLORS.navyDominant,
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>3</span>
              Critères supplémentaires
            </h3>

            {/* État du bien */}
            <div className="mb-8">
              <h4
                className="text-sm font-bold mb-4"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                État du bien
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="condition" defaultChecked className="w-5 h-5" />
                  <span style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
                    🆕 Neuf
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="condition" className="w-5 h-5" />
                  <span style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
                    🏠 Deuxième main
                  </span>
                </label>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="mb-8">
              <h4
                className="text-sm font-bold mb-4"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Caractéristiques
              </h4>
              
              {/* Étage */}
              <div className="mb-6">
                <label
                  className="block text-xs font-bold uppercase mb-2"
                  style={{
                    color: SABBAR_COLORS.goldAccent,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '1px',
                  }}
                >
                  Étage
                </label>
                <input
                  type="number"
                  placeholder="Ex: 2"
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'rgba(249, 245, 239, 0.05)',
                    borderColor: SABBAR_COLORS.goldAccent,
                    color: SABBAR_COLORS.goldLight,
                    border: `2px solid ${SABBAR_COLORS.goldAccent}`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>

              {/* Ascenseur */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
                  Ascenseur
                </span>
              </label>
            </div>

            {/* Équipements */}
            <div className="mb-8">
              <h4
                className="text-sm font-bold mb-4"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Équipements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                  <span style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
                    Parking
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                  <span style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
                    Jardin
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                  <span style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
                    Piscine
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                  <span style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
                    Meublé
                  </span>
                </label>
              </div>
            </div>

            {/* Prix */}
            <div className="mb-8">
              <h4
                className="text-sm font-bold mb-4"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Prix (MAD)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'rgba(249, 245, 239, 0.05)',
                    borderColor: SABBAR_COLORS.goldAccent,
                    color: SABBAR_COLORS.goldLight,
                    border: `2px solid ${SABBAR_COLORS.goldAccent}`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'rgba(249, 245, 239, 0.05)',
                    borderColor: SABBAR_COLORS.goldAccent,
                    color: SABBAR_COLORS.goldLight,
                    border: `2px solid ${SABBAR_COLORS.goldAccent}`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Surface */}
            <div className="mb-8">
              <h4
                className="text-sm font-bold mb-4"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Surface (m²)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'rgba(249, 245, 239, 0.05)',
                    borderColor: SABBAR_COLORS.goldAccent,
                    color: SABBAR_COLORS.goldLight,
                    border: `2px solid ${SABBAR_COLORS.goldAccent}`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'rgba(249, 245, 239, 0.05)',
                    borderColor: SABBAR_COLORS.goldAccent,
                    color: SABBAR_COLORS.goldLight,
                    border: `2px solid ${SABBAR_COLORS.goldAccent}`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Chambres et Salles de bain */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4
                  className="text-sm font-bold mb-4"
                  style={{
                    color: SABBAR_COLORS.goldAccent,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Nombre de chambres
                </h4>
                <input
                  type="number"
                  placeholder="Ex: 1"
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'rgba(249, 245, 239, 0.05)',
                    borderColor: SABBAR_COLORS.goldAccent,
                    color: SABBAR_COLORS.goldLight,
                    border: `2px solid ${SABBAR_COLORS.goldAccent}`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
              <div>
                <h4
                  className="text-sm font-bold mb-4"
                  style={{
                    color: SABBAR_COLORS.goldAccent,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Salles de bain
                </h4>
                <input
                  type="number"
                  placeholder="Ex: 1"
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'rgba(249, 245, 239, 0.05)',
                    borderColor: SABBAR_COLORS.goldAccent,
                    color: SABBAR_COLORS.goldLight,
                    border: `2px solid ${SABBAR_COLORS.goldAccent}`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Image Gallery with Swipe */}
      <section className="py-12 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div 
            className="relative rounded-2xl overflow-hidden h-96 sm:h-[500px] md:h-[600px] flex items-center justify-center group mb-8 cursor-grab active:cursor-grabbing"
            style={{
              backgroundColor: SABBAR_COLORS.navyDominant + '50',
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img src={images[currentImageIndex]} alt={property.title} className="w-full h-full object-cover transition-opacity duration-300" />

            <button
              onClick={toggleFavorite}
              className="absolute top-4 left-4 p-3 rounded-full transition-all z-10"
              style={{
                backgroundColor: isFavorite ? SABBAR_COLORS.goldAccent : 'rgba(0,0,0,0.6)',
                color: isFavorite ? SABBAR_COLORS.navyDominant : 'white',
              }}
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            <div
              className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-bold"
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
              }}
            >
              {currentImageIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all z-10 hidden group-hover:block"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                }}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all z-10 hidden group-hover:block"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                }}
              >
                <ChevronRight size={24} />
              </button>
            )}

            <div
              className="absolute bottom-4 left-4 px-3 py-1 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
              }}
            >
              👉 Glissez pour naviguer
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-4">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: currentImageIndex === index ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldAccent + '30',
                  }}
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
              <h1
                className="text-4xl md:text-5xl font-light mb-4"
                style={{
                  color: SABBAR_COLORS.ivory,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                }}
              >
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-lg mb-4">
                <MapPin size={24} style={{ color: SABBAR_COLORS.goldAccent }} />
                <span
                  style={{
                    color: SABBAR_COLORS.goldAccent,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {property.city} - {property.quarter || property.district}
                </span>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div
                className="rounded-2xl p-8 mb-8 border"
                style={{
                  backgroundColor: SABBAR_COLORS.navyDominant + '50',
                  borderColor: SABBAR_COLORS.goldAccent + '30',
                }}
              >
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{
                    color: SABBAR_COLORS.goldAccent,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  📝 Description
                </h2>
                <p
                  className="leading-relaxed"
                  style={{
                    color: SABBAR_COLORS.goldLight,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {property.description}
                </p>
              </div>
            )}

            {/* Characteristics Section */}
            <div
              className="rounded-2xl p-8 mb-8 border"
              style={{
                backgroundColor: SABBAR_COLORS.navyDominant + '50',
                borderColor: SABBAR_COLORS.goldAccent + '30',
              }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                📋 Caractéristiques
              </h2>
              <div className="space-y-4">
                <div
                  className="flex justify-between items-center pb-4 border-b"
                  style={{
                    borderColor: SABBAR_COLORS.goldAccent + '20',
                  }}
                >
                  <span
                    style={{
                      color: SABBAR_COLORS.goldLight,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Type de transaction
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color: SABBAR_COLORS.ivory,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {getTransactionTypeLabel(property.transaction_type)}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center pb-4 border-b"
                  style={{
                    borderColor: SABBAR_COLORS.goldAccent + '20',
                  }}
                >
                  <span
                    style={{
                      color: SABBAR_COLORS.goldLight,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Type de bien
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color: SABBAR_COLORS.ivory,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {getPropertyTypeLabel(property.property_type)}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center pb-4 border-b"
                  style={{
                    borderColor: SABBAR_COLORS.goldAccent + '20',
                  }}
                >
                  <span
                    style={{
                      color: SABBAR_COLORS.goldLight,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Ville
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color: SABBAR_COLORS.ivory,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {property.city}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center pb-4 border-b"
                  style={{
                    borderColor: SABBAR_COLORS.goldAccent + '20',
                  }}
                >
                  <span
                    style={{
                      color: SABBAR_COLORS.goldLight,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Quartier
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color: SABBAR_COLORS.ivory,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {property.quarter || property.district || 'N/A'}
                  </span>
                </div>
                {property.floor && (
                  <div
                    className="flex justify-between items-center pb-4 border-b"
                    style={{
                      borderColor: SABBAR_COLORS.goldAccent + '20',
                    }}
                  >
                    <span
                      style={{
                        color: SABBAR_COLORS.goldLight,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Étage
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: SABBAR_COLORS.ivory,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {property.floor}
                    </span>
                  </div>
                )}
                {property.elevator || property.has_elevator ? (
                  <div
                    className="flex justify-between items-center pb-4 border-b"
                    style={{
                      borderColor: SABBAR_COLORS.goldAccent + '20',
                    }}
                  >
                    <span
                      style={{
                        color: SABBAR_COLORS.goldLight,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Ascenseur
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: SABBAR_COLORS.goldAccent,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      ✓ Oui
                    </span>
                  </div>
                ) : null}
                {property.bedrooms && (
                  <div
                    className="flex justify-between items-center pb-4 border-b"
                    style={{
                      borderColor: SABBAR_COLORS.goldAccent + '20',
                    }}
                  >
                    <span
                      style={{
                        color: SABBAR_COLORS.goldLight,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Chambres
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: SABBAR_COLORS.ivory,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {property.bedrooms}
                    </span>
                  </div>
                )}
                {property.bathrooms && (
                  <div
                    className="flex justify-between items-center pb-4 border-b"
                    style={{
                      borderColor: SABBAR_COLORS.goldAccent + '20',
                    }}
                  >
                    <span
                      style={{
                        color: SABBAR_COLORS.goldLight,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Salles de bain
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: SABBAR_COLORS.ivory,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {property.bathrooms}
                    </span>
                  </div>
                )}
                {property.area && (
                  <div
                    className="flex justify-between items-center pb-4 border-b"
                    style={{
                      borderColor: SABBAR_COLORS.goldAccent + '20',
                    }}
                  >
                    <span
                      style={{
                        color: SABBAR_COLORS.goldLight,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Surface
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: SABBAR_COLORS.ivory,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {property.area} m²
                    </span>
                  </div>
                )}
                {property.equipments && property.equipments.length > 0 && (
                  <div className="pb-4">
                    <span
                      className="block mb-3"
                      style={{
                        color: SABBAR_COLORS.goldLight,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Équipements
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {property.equipments.map((equipment: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm font-bold border"
                          style={{
                            backgroundColor: SABBAR_COLORS.goldAccent + '20',
                            color: SABBAR_COLORS.goldAccent,
                            borderColor: SABBAR_COLORS.goldAccent + '50',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {equipment}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {property.status && (
                  <div
                    className="flex justify-between items-center pb-4 border-b"
                    style={{
                      borderColor: SABBAR_COLORS.goldAccent + '20',
                    }}
                  >
                    <span
                      style={{
                        color: SABBAR_COLORS.goldLight,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Statut
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: SABBAR_COLORS.ivory,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {property.status}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      color: SABBAR_COLORS.goldLight,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Date de création
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color: SABBAR_COLORS.ivory,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {new Date(property.createdAt || property.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div
              className="rounded-2xl p-8 mb-8 border"
              style={{
                backgroundColor: SABBAR_COLORS.navyDominant + '50',
                borderColor: SABBAR_COLORS.goldAccent + '30',
              }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                🎬 Vidéo de la propriété
              </h2>
              <VideoSection />
            </div>
          </div>

          {/* Right Column - Price and Contact */}
          <div className="lg:col-span-1">
            <div
              className="rounded-xl p-6 mb-6 sticky top-8"
              style={{
                background: `linear-gradient(to bottom right, ${SABBAR_COLORS.goldAccent}, #F4D03F)`,
              }}
            >
              <p
                className="font-bold text-xs mb-1"
                style={{
                  color: SABBAR_COLORS.navyDominant,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                PRIX
              </p>
              <div
                className="text-2xl font-bold mb-1 break-words"
                style={{
                  color: SABBAR_COLORS.navyDominant,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {property.price.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <p
                className="font-semibold text-sm"
                style={{
                  color: SABBAR_COLORS.navyDominant,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                MAD
              </p>
            </div>

            <div
              className="rounded-2xl p-6 border"
              style={{
                backgroundColor: SABBAR_COLORS.navyDominant + '50',
                borderColor: SABBAR_COLORS.goldAccent + '30',
              }}
            >
              <h3
                className="text-xl font-bold mb-4"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                📞 Nous contacter
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+212605585720"
                  className="w-full flex items-center justify-center gap-3 font-bold py-2 px-3 rounded-lg transition text-sm"
                  style={{
                    backgroundColor: SABBAR_COLORS.goldAccent,
                    color: SABBAR_COLORS.navyDominant,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Phone size={18} />
                  +212 6 05 58 57 20
                </a>
                <a
                  href="mailto:Landmarkestate3@gmail.com"
                  className="w-full flex items-center justify-center gap-3 border-2 font-bold py-2 px-3 rounded-lg transition text-sm"
                  style={{
                    borderColor: SABBAR_COLORS.goldAccent,
                    color: SABBAR_COLORS.goldAccent,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Mail size={18} />
                  Landmarkestate3@gmail.com
                </a>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full flex items-center justify-center gap-3 border-2 font-bold py-2 px-3 rounded-lg transition text-sm"
                  style={{
                    borderColor: SABBAR_COLORS.goldLight,
                    color: SABBAR_COLORS.goldLight,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
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