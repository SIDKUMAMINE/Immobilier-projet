'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/config';
import { ArrowLeft, MapPin, Heart, Phone, Mail, Share2, ChevronLeft, ChevronRight, Play } from 'lucide-react';
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
// ✅ STATUTS DISPONIBLES
const STATUS_OPTIONS = [
  { value: 'available',        label: 'Disponible',      color: '#16a34a' },
  { value: 'sold',             label: 'Vendu',           color: '#dc2626' },
  { value: 'rented',          label: 'Loué / Occupé',   color: '#2563eb' },
  { value: 'reserved',        label: 'Réservé',         color: '#d97706' },
  { value: 'under_offer',     label: 'Sous offre',      color: '#7c3aed' },
  { value: 'under_contract',  label: 'Sous compromis',  color: '#db2777' },
  { value: 'unavailable',     label: 'Non disponible',  color: '#6b7280' },
];
// LANDMARK color palette
const COLORS = {
  navy: '#0D1F3C',
  navyLight: '#162D4F',
  gold: '#C8A96E',
  goldLight: '#E2C98A',
  terracotta: '#B5573A',
  ivory: '#F9F5EF',
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
  const [shareSuccess, setShareSuccess] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false); /
  const [isLoggedIn, setIsLoggedIn] = useState(false); /
  const touchStartRef = useRef<number>(0);

useEffect(() => {
  const savedFavorites = localStorage.getItem('sabbar_favorites');
  const favs = savedFavorites ? JSON.parse(savedFavorites) : [];
  setFavorites(favs);
  setIsFavorite(favs.includes(parseInt(propertyId)));
  setIsLoggedIn(!!localStorage.getItem('accessToken'));
}, [propertyId]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await propertiesApi.getProperties({ limit: 100, offset: 0 });
        const foundProperty = response?.find((p: any) => String(p.id) === String(propertyId));
        if (foundProperty) {
          setProperty(foundProperty);
        } else {
          setError('Propriété non trouvée');
          setProperty(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
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
    if (videoUrl.includes('youtube.com/embed/')) return videoUrl;
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
    if (videoUrl.includes('supabase.co') && (videoUrl.includes('/storage/') || videoUrl.includes('/object/'))) return true;
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

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = property.title;
    const shareText = `Découvrez cette propriété: ${property.title} - ${property.price.toLocaleString('fr-FR')} MAD`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        console.error('Impossible de copier le lien:', err);
      }
     document.body.removeChild(textArea);
    }
  };

  // ✅ NOUVEAU : Changer le statut directement depuis la page publique
  const handleStatusChange = async (newStatus: string) => {
    if (!property) return;
    setStatusSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return; // Pas connecté = pas de modification
      const res = await fetch(`/api/v1/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Agent-ID': '550e8400-e29b-41d4-a716-446655440000',
        },
        body: JSON.stringify({ ...property, status: newStatus }),
      });
      if (!res.ok) throw new Error('Erreur mise à jour statut');
      const updated = await res.json();
      setProperty(updated);
    } catch (e: any) {
      console.error('Erreur statut:', e.message);
    } finally {
      setStatusSaving(false);
    }
  };

  if (loading) {
    return (
      <main style={{ background: `linear-gradient(to bottom, ${COLORS.navy}, #0f1a2e)`, minHeight: '100vh' }}>
        <div style={{ backgroundColor: COLORS.navyLight, padding: '16px 5%', borderBottom: `1px solid rgba(200,169,110,0.2)` }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Link href="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: COLORS.gold, fontFamily: "'DM Sans', sans-serif" }}>
              <ArrowLeft size={20} />
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </div>
        <div style={{ padding: '48px 5%' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <p style={{ color: COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>⏳ Chargement de la propriété...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main style={{ background: `linear-gradient(to bottom, ${COLORS.navy}, #0f1a2e)`, minHeight: '100vh' }}>
        <div style={{ backgroundColor: COLORS.navyLight, padding: '16px 5%', borderBottom: `1px solid rgba(200,169,110,0.2)` }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Link href="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: COLORS.gold, fontFamily: "'DM Sans', sans-serif" }}>
              <ArrowLeft size={20} />
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </div>
        <div style={{ padding: '48px 5%' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ backgroundColor: 'rgba(181,87,58,0.15)', border: `1px solid rgba(181,87,58,0.4)`, color: '#fca5a5', padding: '16px 24px', borderRadius: 12, fontFamily: "'DM Sans', sans-serif" }}>
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
      if (distance > 0) handleNextImage();
      else handlePrevImage();
    }
  };

  const VideoSection = () => {
    if (!videoUrl) {
      return (
        <div style={{ backgroundColor: 'rgba(13,31,60,0.5)', border: `2px dashed rgba(200,169,110,0.3)`, borderRadius: 12, aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ backgroundColor: 'rgba(200,169,110,0.15)', padding: 16, borderRadius: '50%', marginBottom: 16 }}>
            <Play size={48} color={COLORS.gold} />
          </div>
          <p style={{ color: COLORS.goldLight, fontSize: 18, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Aucune vidéo disponible</p>
          <p style={{ color: 'rgba(226,201,138,0.5)', fontSize: 14, marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>Les vidéos seront disponibles prochainement</p>
        </div>
      );
    }

    if (isDirectVideoFile(videoUrl)) {
      return (
        <div style={{ position: 'relative', backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', width: '100%', aspectRatio: '16/9' }}>
          <video width="100%" height="100%" controls controlsList="nodownload" style={{ display: 'block', width: '100%', height: '100%' }}>
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
        <div style={{ position: 'relative', backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', width: '100%', aspectRatio: '16/9' }}>
          <iframe width="100%" height="100%" src={embedUrl} title="Property Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block' }} />
        </div>
      );
    }

    return (
      <div style={{ backgroundColor: 'rgba(13,31,60,0.5)', border: `2px dashed rgba(200,169,110,0.3)`, borderRadius: 12, aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Play size={48} color={COLORS.gold} />
        <p style={{ color: COLORS.goldLight, fontFamily: "'DM Sans', sans-serif", marginTop: 12 }}>Format vidéo non supporté</p>
      </div>
    );
  };

  return (
    <main style={{ background: `linear-gradient(to bottom, ${COLORS.navy}, #0f1a2e)`, minHeight: '100vh' }}>
      {/* Back Button */}
      <div style={{ backgroundColor: COLORS.navyLight, padding: '16px 5%', borderBottom: `1px solid rgba(200,169,110,0.2)` }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: COLORS.gold, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft size={20} />
            <span>Retour aux propriétés</span>
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <section style={{ padding: '48px 5%' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div
            style={{ position: 'relative', backgroundColor: COLORS.navyLight, borderRadius: 16, overflow: 'hidden', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, cursor: 'grab' }}
            className="group"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img src={images[currentImageIndex]} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

            <button
              onClick={toggleFavorite}
              style={{ position: 'absolute', top: 16, left: 16, padding: 12, borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: isFavorite ? COLORS.gold : 'rgba(0,0,0,0.6)', color: isFavorite ? COLORS.navy : '#fff', zIndex: 10 }}
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            <div style={{ position: 'absolute', bottom: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
              {currentImageIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <>
                <button onClick={handlePrevImage} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: 12, borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}>
                  <ChevronLeft size={24} />
                </button>
                <button onClick={handleNextImage} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: 12, borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}>
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: `2px solid ${currentImageIndex === index ? COLORS.gold : 'rgba(200,169,110,0.2)'}`, cursor: 'pointer', padding: 0 }}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '0 5% 64px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {/* Left Column */}
          <div style={{ gridColumn: 'span 2' }}>
            {/* Title */}
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 42, fontWeight: 300, color: COLORS.ivory, fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: 12 }}>{property.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.gold, fontSize: 16, fontFamily: "'DM Sans', sans-serif" }}>
                <MapPin size={20} />
                <span>{property.city} - {property.quarter || property.district}</span>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div style={{ backgroundColor: 'rgba(22,45,79,0.4)', border: `1px solid rgba(200,169,110,0.2)`, borderRadius: 16, padding: 32, marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 300, color: COLORS.ivory, fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: 16 }}>Description</h2>
                <p style={{ color: COLORS.goldLight, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", fontSize: 15, whiteSpace: 'pre-wrap' }}>{property.description}</p>
              </div>
            )}

            {/* Characteristics */}
            <div style={{ backgroundColor: 'rgba(22,45,79,0.4)', border: `1px solid rgba(200,169,110,0.2)`, borderRadius: 16, padding: 32, marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 300, color: COLORS.ivory, fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: 20 }}>Caractéristiques</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Type de transaction', value: getTransactionTypeLabel(property.transaction_type) },
                  { label: 'Type de bien', value: getPropertyTypeLabel(property.property_type) },
                  { label: 'Ville', value: property.city },
                  { label: 'Quartier', value: property.quarter || property.district || 'N/A' },
                  property.floor && { label: 'Étage', value: property.floor },
                  (property.elevator || property.has_elevator) && { label: 'Ascenseur', value: '✓ Oui', gold: true },
                  property.bedrooms && { label: 'Chambres', value: property.bedrooms },
                  property.bathrooms && { label: 'Salles de bain', value: property.bathrooms },
                  property.area && { label: 'Surface', value: `${property.area} m²` },
                 property.status && { 
                   label: 'Statut', 
                  value: STATUS_OPTIONS.find(s => s.value === property.status)?.label || property.status,
                  color: STATUS_OPTIONS.find(s => s.value === property.status)?.color,
                },
                  { label: 'Date de création', value: new Date(property.createdAt || property.created_at).toLocaleDateString('fr-FR') },
                ].filter(Boolean).map((item: any, i: number, arr: any[]) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid rgba(200,169,110,0.1)` : 'none' }}>
                    <span style={{ color: 'rgba(226,201,138,0.6)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{item.label}</span>
                   <span style={{ 
  color: item.color ? item.color : (item.gold ? COLORS.gold : COLORS.ivory), 
  fontFamily: "'DM Sans', sans-serif", 
  fontSize: 14, 
  fontWeight: 600,
  backgroundColor: item.color ? `${item.color}20` : 'transparent',
  padding: item.color ? '3px 10px' : '0',
  borderRadius: item.color ? 20 : 0,
  border: item.color ? `1px solid ${item.color}50` : 'none',
}}>{item.value}</span>
                  </div>
                ))}

                {property.equipments && property.equipments.length > 0 && (
                  <div style={{ paddingTop: 14 }}>
                    <span style={{ color: 'rgba(226,201,138,0.6)', fontFamily: "'DM Sans', sans-serif", fontSize: 14, display: 'block', marginBottom: 10 }}>Équipements</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {property.equipments.map((eq: string, i: number) => (
                        <span key={i} style={{ backgroundColor: 'rgba(200,169,110,0.15)', color: COLORS.gold, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, border: `1px solid rgba(200,169,110,0.3)` }}>
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
{/* ✅ NOUVEAU : Modifier le statut */}
            {localStorage.getItem('accessToken') && (
              <div style={{ backgroundColor: 'rgba(22,45,79,0.4)', border: `1px solid rgba(200,169,110,0.2)`, borderRadius: 16, padding: 32, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 300, color: COLORS.ivory, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    Statut de l'annonce
                  </h2>
                  {statusSaving && (
                    <span style={{ color: COLORS.goldLight, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                      ⏳ Enregistrement...
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleStatusChange(opt.value)}
                      disabled={statusSaving}
                      style={{
                        padding: '8px 18px',
                        borderRadius: 999,
                        border: `2px solid ${opt.color}`,
                        backgroundColor: property.status === opt.value ? opt.color : 'transparent',
                        color: property.status === opt.value ? '#fff' : opt.color,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: statusSaving ? 'not-allowed' : 'pointer',
                        opacity: statusSaving ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Video */}
            <div style={{ backgroundColor: 'rgba(22,45,79,0.4)', border: `1px solid rgba(200,169,110,0.2)`, borderRadius: 16, padding: 32, marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 300, color: COLORS.ivory, fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: 20 }}>Vidéo de la propriété</h2>
              <VideoSection />
            </div>
          </div>

          {/* Right Column */}
          <div style={{ gridColumn: 'span 1' }}>
            {/* Price Card */}
            <div style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, borderRadius: 16, padding: 24, marginBottom: 20, position: 'sticky', top: 24 }}>
              <p style={{ color: COLORS.navy, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>PRIX</p>
              <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.navy, fontFamily: "'Cormorant Garamond', Georgia, serif", wordBreak: 'break-word' }}>
                {property.price.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <p style={{ color: COLORS.navy, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, marginTop: 2 }}>MAD</p>
            </div>

            {/* Contact Card */}
            <div style={{ backgroundColor: 'rgba(22,45,79,0.5)', border: `1px solid rgba(200,169,110,0.2)`, borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 300, color: COLORS.ivory, fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: 16 }}>Nous contacter</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Téléphone */}
                <a
                  href="tel:+212605585720"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.gold, color: COLORS.navy, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, padding: '10px 16px', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.goldLight; e.currentTarget.style.boxShadow = `0 4px 16px rgba(200,169,110,0.3)`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = COLORS.gold; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Phone size={16} />
                  +212 6 05 58 57 20
                </a>

                {/* Email */}
                <a
                  href="mailto:Landmarkestate3@gmail.com"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: 'transparent', color: COLORS.gold, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, padding: '10px 16px', borderRadius: 10, textDecoration: 'none', border: `1.5px solid ${COLORS.gold}`, transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.gold; e.currentTarget.style.color = COLORS.navy; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = COLORS.gold; }}
                >
                  <Mail size={16} />
                  Landmarkestate3@gmail.com
                </a>

                {/* ✅ BOUTON PARTAGER - Style LANDMARK */}
                <button
                  onClick={handleShare}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    backgroundColor: shareSuccess ? 'rgba(200,169,110,0.2)' : 'rgba(200,169,110,0.08)',
                    color: shareSuccess ? COLORS.gold : 'rgba(226,201,138,0.7)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: `1.5px solid ${shareSuccess ? COLORS.gold : 'rgba(200,169,110,0.25)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (!shareSuccess) {
                      e.currentTarget.style.backgroundColor = 'rgba(200,169,110,0.15)';
                      e.currentTarget.style.color = COLORS.gold;
                      e.currentTarget.style.borderColor = COLORS.gold;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!shareSuccess) {
                      e.currentTarget.style.backgroundColor = 'rgba(200,169,110,0.08)';
                      e.currentTarget.style.color = 'rgba(226,201,138,0.7)';
                      e.currentTarget.style.borderColor = 'rgba(200,169,110,0.25)';
                    }
                  }}
                >
                  <Share2 size={16} />
                  {shareSuccess ? '✓ Lien copié' : 'Partager'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}