'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Heart, Phone, Mail, Share2, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { propertiesApi } from '@/lib/api';
import { API_BASE_URL } from '@/lib/config';

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
  const [error, setError] = useState('');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Charger la propriété
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertiesApi.getProperty(propertyId);
        console.log('📋 Property loaded:', response);
        console.log('🎬 Video URL:', response.video_url);
        setProperty(response);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  // 🎥 Fonction pour uploader la vidéo (depuis le dashboard)
  const handleVideoUpload = async (file: File) => {
    if (!property) return;

    setUploadingVideo(true);
    setUploadError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vous devez être connecté pour uploader une vidéo');
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Uploading video to:', `${API_BASE_URL}/api/v1/properties/${propertyId}/video`);

      // 1️⃣ Uploader la vidéo
      const res = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyId}/video`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('❌ Upload error:', data);
        throw new Error(data.detail || 'Erreur lors de l\'upload');
      }

      const uploadedData = await res.json();
      console.log('✅ Video uploaded:', uploadedData);

      // 2️⃣ Recharger la propriété pour obtenir la nouvelle URL vidéo
      const getRes = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (getRes.ok) {
        const updatedProperty = await getRes.json();
        console.log('🔄 Property reloaded:', updatedProperty);
        setProperty(updatedProperty);
      }
    } catch (e: any) {
      console.error('❌ Video upload error:', e);
      setUploadError(e.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1a2e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#b0b0b0]">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1a2e] p-6">
        <Link href="/" className="flex items-center gap-2 text-[#d4af37] hover:text-[#e6c55c] mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0f1a2e] p-6">
        <Link href="/" className="flex items-center gap-2 text-[#d4af37] hover:text-[#e6c55c] mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <p className="text-[#b0b0b0]">Propriété non trouvée</p>
      </div>
    );
  }

  const images = property.images && Array.isArray(property.images) ? property.images : [];
  const currentImage = images[currentImageIndex] || '/placeholder.jpg';

  return (
    <div className="min-h-screen bg-[#0f1a2e]">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 bg-[#0f1a2e]/95 backdrop-blur border-b border-[rgba(212,175,55,0.1)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#d4af37] hover:text-[#e6c55c] transition">
            <ArrowLeft size={20} />
            <span className="text-sm font-semibold">Retour</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full transition ${
                isFavorite
                  ? 'bg-[rgba(212,175,55,0.2)] text-[#d4af37]'
                  : 'hover:bg-[rgba(212,175,55,0.1)] text-[#b0b0b0] hover:text-[#d4af37]'
              }`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-full hover:bg-[rgba(212,175,55,0.1)] text-[#b0b0b0] hover:text-[#d4af37] transition">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery with Swipe */}
          {images.length > 0 && (
            <div className="group relative bg-black rounded-2xl overflow-hidden aspect-video">
              <img
                src={currentImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(i => (i === 0 ? images.length - 1 : i - 1))
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(i => (i === images.length - 1 ? 0 : i + 1))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    idx === currentImageIndex
                      ? 'border-[#d4af37]'
                      : 'border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.5)]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Location */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{property.title}</h1>
            <div className="flex items-center gap-2 text-[#d4af37] mb-4">
              <MapPin size={20} />
              <span className="text-lg">
                {property.quarter || property.district || ''} {property.city}
              </span>
            </div>
            {property.description && (
              <p className="text-[#b0b0b0] text-base leading-relaxed">{property.description}</p>
            )}
          </div>

          {/* Caractéristiques */}
          <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Caractéristiques</h2>
            <div className="grid grid-cols-2 gap-6">
              {property.transaction_type && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Type de transaction</p>
                  <p className="text-white font-semibold">{getTransactionTypeLabel(property.transaction_type)}</p>
                </div>
              )}
              {property.property_type && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Type de bien</p>
                  <p className="text-white font-semibold">{getPropertyTypeLabel(property.property_type)}</p>
                </div>
              )}
              {property.city && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Ville</p>
                  <p className="text-white font-semibold">{property.city}</p>
                </div>
              )}
              {property.quarter && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Quartier</p>
                  <p className="text-white font-semibold">{property.quarter}</p>
                </div>
              )}
              {property.floor !== undefined && property.floor !== null && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Étage</p>
                  <p className="text-white font-semibold">{property.floor}</p>
                </div>
              )}
              {property.has_elevator !== undefined && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Ascenseur</p>
                  <p className="text-white font-semibold">{property.has_elevator ? '✓ Oui' : '✗ Non'}</p>
                </div>
              )}
              {property.bedrooms && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Chambres</p>
                  <p className="text-white font-semibold">{property.bedrooms}</p>
                </div>
              )}
              {property.bathrooms && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Salles de bain</p>
                  <p className="text-white font-semibold">{property.bathrooms}</p>
                </div>
              )}
              {property.area && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Surface</p>
                  <p className="text-white font-semibold">{property.area} m²</p>
                </div>
              )}
              {property.equipments && Array.isArray(property.equipments) && property.equipments.length > 0 && (
                <div className="col-span-2">
                  <p className="text-[#b0b0b0] text-sm mb-3">Équipements</p>
                  <div className="flex flex-wrap gap-2">
                    {property.equipments.map((eq: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-[rgba(212,175,55,0.15)] text-[#d4af37] rounded-full text-sm">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {property.status && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Statut</p>
                  <p className="text-white font-semibold">{property.status}</p>
                </div>
              )}
              {property.createdAt || property.created_at && (
                <div>
                  <p className="text-[#b0b0b0] text-sm mb-1">Date de création</p>
                  <p className="text-white font-semibold">
                    {new Date(property.createdAt || property.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Video Section */}
          <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Play size={24} className="text-[#d4af37]" />
              Vidéo de la propriété
            </h2>

            {uploadError && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {uploadError}
              </div>
            )}

            {property.video_url ? (
              <div className="space-y-4">
                <div className="relative bg-black rounded-xl overflow-hidden w-full aspect-video">
                  <video
                    src={property.video_url}
                    controls
                    className="w-full h-full"
                    controlsList="nodownload"
                  />
                </div>
                <p className="text-sm text-[#b0b0b0]">
                  ✅ Vidéo: {property.video_url.substring(0, 60)}...
                </p>
              </div>
            ) : (
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-[rgba(212,175,55,0.3)] rounded-xl p-12 text-center cursor-pointer hover:border-[rgba(212,175,55,0.6)] transition"
              >
                <div className="bg-[rgba(212,175,55,0.1)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play size={32} className="text-[#d4af37]" />
                </div>
                <p className="text-[#b0b0b0] text-lg font-semibold">Aucune vidéo disponible</p>
                <p className="text-[#666] text-sm mt-2">Les vidéos seront disponibles prochainement</p>
              </div>
            )}

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleVideoUpload(e.target.files[0]);
                }
              }}
              disabled={uploadingVideo}
            />
          </div>
        </div>

        {/* Right Column - Price & Contact */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-6">
            <p className="text-[#b0b0b0] text-sm mb-2">Prix</p>
            <p className="text-4xl font-bold text-[#d4af37] mb-2">
              {property.price?.toLocaleString('fr-MA')}
            </p>
            <p className="text-[#b0b0b0] text-sm">MAD</p>
          </div>

          {/* Contact Card */}
          <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.2)] rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold mb-4">Contacter l'annonceur</h3>
            <button className="w-full flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#e6c55c] text-[#0f1a2e] py-2 px-4 rounded-lg font-semibold transition">
              <Phone size={18} />
              Appeler
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-[rgba(212,175,55,0.15)] hover:bg-[rgba(212,175,55,0.25)] text-[#d4af37] py-2 px-4 rounded-lg font-semibold transition">
              <Mail size={18} />
              Email
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-[rgba(212,175,55,0.15)] hover:bg-[rgba(212,175,55,0.25)] text-[#d4af37] py-2 px-4 rounded-lg font-semibold transition">
              <Share2 size={18} />
              Partager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}