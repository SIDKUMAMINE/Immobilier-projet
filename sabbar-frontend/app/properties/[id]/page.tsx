'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/config';
import { ArrowLeft, MapPin, Heart, Phone, Mail, Share2, ChevronLeft, ChevronRight, Play, Copy, Check } from 'lucide-react';
import { propertiesApi } from '@/lib/api';

const transactionTypeMap: { [key: string]: string } = {
  'sale': 'Vente', 'vente': 'Vente', 'rent': 'Location', 'location': 'Location',
  'vacation_rental': 'Location vacances', 'vacation rental': 'Location vacances',
  'vacation': 'Location vacances', 'location vacances': 'Location vacances',
  'location-vacances': 'Location vacances', 'vacances': 'Location vacances',
};

const propertyTypeMap: { [key: string]: string } = {
  'apartment': 'Appartement', 'villa': 'Villa', 'house': 'Maison', 'riad': 'Riad',
  'land': 'Terrain', 'office': 'Bureau', 'commercial': 'Local commercial',
  'apartement': 'Appartement', 'maison': 'Maison', 'terrain': 'Terrain',
  'bureau': 'Bureau', 'local commercial': 'Local commercial', 'local-commercial': 'Local commercial',
};

const getTransactionTypeLabel = (type: string) => transactionTypeMap[type.toLowerCase()] || type;
const getPropertyTypeLabel = (type: string) => propertyTypeMap[type.toLowerCase()] || type;

const STATUS_OPTIONS = [
  { value: 'available',       label: 'Disponible',      color: '#16a34a' },
  { value: 'sold',            label: 'Vendu',           color: '#dc2626' },
  { value: 'rented',         label: 'Loué / Occupé',   color: '#2563eb' },
  { value: 'reserved',       label: 'Réservé',         color: '#d97706' },
  { value: 'under_offer',    label: 'Sous offre',      color: '#7c3aed' },
  { value: 'under_contract', label: 'Sous compromis',  color: '#db2777' },
  { value: 'unavailable',    label: 'Non disponible',  color: '#6b7280' },
];

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
  const [copied, setCopied] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        if (foundProperty) setProperty(foundProperty);
        else { setError('Propriété non trouvée'); setProperty(null); }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
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
    const exts = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.m4v', '.3gp'];
    for (const ext of exts) if (videoUrl.toLowerCase().includes(ext)) return true;
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

  const getShareUrl = () => typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // ✅ Instagram Stories : ouvre l'app Instagram directement
  const shareToInstagram = () => {
    const url = getShareUrl();
    // Sur mobile, tente d'ouvrir l'app Instagram
    const instagramUrl = `instagram://story-camera`;
    const fallbackUrl = `https://www.instagram.com/`;

    // Copie le lien dans le presse-papier d'abord
    copyToClipboard();

    // Tente d'ouvrir Instagram
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = instagramUrl;
    document.body.appendChild(iframe);
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);

    // Affiche un guide
    setShowSharePanel(false);
    alert(`✅ Lien copié !\n\n📱 Pour partager en Story Instagram :\n1. Ouvrez Instagram\n2. Créez une nouvelle Story\n3. Appuyez sur l'autocollant 🔗 Lien\n4. Collez le lien copié\n\nURL : ${url}`);
  };

  const handleShare = async () => {
    setShowSharePanel(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!property) return;
    setStatusSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const res = await fetch(`/api/v1/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Agent-ID': '550e8400-e29b-41d4-a716-446655440000' },
        body: JSON.stringify({ ...property, status: newStatus }),
      });
      if (!res.ok) throw new Error('Erreur mise à jour statut');
      setProperty(await res.json());
    } catch (e: any) {
      console.error('Erreur statut:', e.message);
    } finally {
      setStatusSaving(false);
    }
  };

  const BackBar = () => (
    <div style={{ backgroundColor: COLORS.navyLight, padding: '16px 5%', borderBottom: `1px solid rgba(200,169,110,0.2)` }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Link href="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: COLORS.gold, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={20} />
          <span>Retour aux propriétés</span>
        </Link>
      </div>
    </div>
  );

  if (loading) return (
    <main style={{ background: `linear-gradient(to bottom, ${COLORS.navy}, #0f1a2e)`, minHeight: '100vh' }}>
      <BackBar />
      <div style={{ padding: '48px 5%' }}>
        <p style={{ color: COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>⏳ Chargement...</p>
      </div>
    </main>
  );

  if (error || !property) return (
    <main style={{ background: `linear-gradient(to bottom, ${COLORS.navy}, #0f1a2e)`, minHeight: '100vh' }}>
      <BackBar />
      <div style={{ padding: '48px 5%' }}>
        <div style={{ backgroundColor: 'rgba(181,87,58,0.15)', border: `1px solid rgba(181,87,58,0.4)`, color: '#fca5a5', padding: '16px 24px', borderRadius: 12, fontFamily: "'DM Sans', sans-serif" }}>
          ❌ {error || 'Propriété non trouvée'}
        </div>
      </div>
    </main>
  );

  const images = property.images?.length > 0 ? property.images : [property.image || '/placeholder.jpg'];
  const videoUrl = property?.video_url || property?.videoUrl || property?.video || null;

  const handlePrevImage = () => setCurrentImageIndex(p => p === 0 ? images.length - 1 : p - 1);
  const handleNextImage = () => setCurrentImageIndex(p => p === images.length - 1 ? 0 : p + 1);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartRef.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dist = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(dist) > 50) dist > 0 ? handleNextImage() : handlePrevImage();
  };

  const VideoSection = () => {
    if (!videoUrl) return (
      <div style={{ backgroundColor: 'rgba(13,31,60,0.5)', border: `2px dashed rgba(200,169,110,0.3)`, borderRadius: 12, aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ backgroundColor: 'rgba(200,169,110,0.15)', padding: 16, borderRadius: '50%', marginBottom: 16 }}>
          <Play size={48} color={COLORS.gold} />
        </div>
        <p style={{ color: COLORS.goldLight, fontSize: 18, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Aucune vidéo disponible</p>
        <p style={{ color: 'rgba(226,201,138,0.5)', fontSize: 14, marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>Les vidéos seront disponibles prochainement</p>
      </div>
    );
    if (isDirectVideoFile(videoUrl)) return (
      <div style={{ position: 'relative', backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', width: '100%', aspectRatio: '16/9' }}>
        <video width="100%" height="100%" controls controlsList="nodownload" style={{ width: '100%', height: '100%' }}>
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
    );
    const embedUrl = getEmbedUrl(videoUrl);
    if (embedUrl) return (
      <div style={{ position: 'relative', backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', width: '100%', aspectRatio: '16/9' }}>
        <iframe width="100%" height="100%" src={embedUrl} title="Property Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block' }} />
      </div>
    );
    return <div style={{ borderRadius: 12, aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={48} color={COLORS.gold} /></div>;
  };

  const cardStyle = {
    backgroundColor: 'rgba(22,45,79,0.4)',
    border: `1px solid rgba(200,169,110,0.2)`,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  };

  const h2Style = {
    fontSize: 22, fontWeight: 300, color: COLORS.ivory,
    fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: 20,
  };

  const shareUrl = getShareUrl();
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`🏠 ${property.title}\n📍 ${property.city}\n💰 ${property.price?.toLocaleString('fr-FR')} MAD\n\n${shareUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${property.title} - ${property.city}`)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <main style={{ background: `linear-gradient(to bottom, ${COLORS.navy}, #0f1a2e)`, minHeight: '100vh' }}>

      {/* ── STYLES RESPONSIVE ── */}
      <style>{`
        .pd-main-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
          align-items: flex-start;
          max-width: 1400px;
          margin: 0 auto;
        }
        .pd-left-col {
          flex: 1 1 300px;
          min-width: 0;
        }
        .pd-right-col {
          flex: 0 1 320px;
          width: 100%;
        }
        .pd-price-sticky {
          position: sticky;
          top: 24px;
        }
        .pd-share-panel {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: linear-gradient(180deg, #162D4F 0%, #0D1F3C 100%);
          border-top: 1px solid rgba(200,169,110,0.3);
          border-radius: 20px 20px 0 0;
          padding: 24px 20px 40px;
        }
        .pd-share-overlay {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
        }
        .pd-share-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 20px;
        }
        .pd-share-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 14px 8px;
          border-radius: 12px;
          border: 1px solid rgba(200,169,110,0.2);
          background: rgba(22,45,79,0.5);
          color: #E2C98A;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .pd-share-btn:hover, .pd-share-btn:active {
          background: rgba(200,169,110,0.15);
          border-color: rgba(200,169,110,0.5);
        }
        .pd-copy-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(13,31,60,0.6);
          border: 1px solid rgba(200,169,110,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          margin-top: 16px;
        }
        .pd-copy-url {
          flex: 1;
          color: rgba(226,201,138,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pd-copy-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #C8A96E, #E2C98A);
          color: #0D1F3C;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }

        @media (max-width: 768px) {
          .pd-right-col {
            flex: 1 1 100%;
          }
          .pd-price-sticky {
            position: static;
          }
          .pd-share-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <BackBar />

      {/* ── Share Panel (Bottom Sheet) ── */}
      {showSharePanel && (
        <>
          <div className="pd-share-overlay" onClick={() => setShowSharePanel(false)} />
          <div className="pd-share-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: COLORS.ivory, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 300, margin: 0 }}>
                Partager ce bien
              </h3>
              <button onClick={() => setShowSharePanel(false)} style={{ background: 'none', border: 'none', color: COLORS.gold, cursor: 'pointer', padding: 4 }}>✕</button>
            </div>

            <div className="pd-share-grid">
              {/* WhatsApp */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="pd-share-btn">
                <span style={{ fontSize: 28 }}>💬</span>
                WhatsApp
              </a>

              {/* Facebook */}
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="pd-share-btn">
                <span style={{ fontSize: 28 }}>📘</span>
                Facebook
              </a>

              {/* Twitter/X */}
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="pd-share-btn">
                <span style={{ fontSize: 28 }}>🐦</span>
                Twitter / X
              </a>

              {/* Instagram Story */}
              <button className="pd-share-btn" onClick={shareToInstagram}>
                <span style={{ fontSize: 28 }}>📸</span>
                Instagram
              </button>
            </div>

            {/* Copy URL bar */}
            <div className="pd-copy-bar">
              <span className="pd-copy-url">{shareUrl}</span>
              <button className="pd-copy-btn" onClick={copyToClipboard}>
                {copied ? <><Check size={14} /> Copié !</> : <><Copy size={14} /> Copier</>}
              </button>
            </div>

            {/* Instagram tip */}
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)' }}>
              <p style={{ color: COLORS.gold, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>
                📸 Pour Instagram Story :
              </p>
              <p style={{ color: 'rgba(226,201,138,0.7)', fontFamily: "'DM Sans', sans-serif", fontSize: 11, margin: 0, lineHeight: 1.6 }}>
                1. Copiez le lien ci-dessus<br />
                2. Ouvrez Instagram → Nouvelle Story<br />
                3. Appuyez sur l'autocollant 🔗 Lien<br />
                4. Collez le lien
              </p>
            </div>
          </div>
        </>
      )}

      {/* ── Image Gallery ── */}
      <section style={{ padding: '32px 5%' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div
            style={{
              position: 'relative',
              backgroundColor: COLORS.navyLight,
              borderRadius: 16,
              overflow: 'hidden',
              width: '100%',
              aspectRatio: '16/9',
              maxHeight: 560,
              marginBottom: 12,
              cursor: 'grab',
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <button onClick={toggleFavorite} style={{ position: 'absolute', top: 12, left: 12, padding: 10, borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: isFavorite ? COLORS.gold : 'rgba(0,0,0,0.6)', color: isFavorite ? COLORS.navy : '#fff', zIndex: 10 }}>
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            <div style={{ position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '5px 12px', borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
              {currentImageIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <>
                <button onClick={handlePrevImage} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: 10, borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}>
                  <ChevronLeft size={22} />
                </button>
                <button onClick={handleNextImage} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: 10, borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}>
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
              {images.map((img: string, index: number) => (
                <button key={index} onClick={() => setCurrentImageIndex(index)}
                  style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 8, overflow: 'hidden', border: `2px solid ${currentImageIndex === index ? COLORS.gold : 'rgba(200,169,110,0.2)'}`, cursor: 'pointer', padding: 0 }}>
                  <img src={img} alt={`Thumbnail ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Main Content ── */}
      <section style={{ padding: '0 5% 64px' }}>
        <div className="pd-main-grid">

          {/* Left Column */}
          <div className="pd-left-col">

            {/* Title */}
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: 300, color: COLORS.ivory, fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: 12 }}>
                {property.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.gold, fontSize: 16, fontFamily: "'DM Sans', sans-serif" }}>
                <MapPin size={20} />
                <span>{property.city} - {property.quarter || property.district}</span>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div style={cardStyle}>
                <h2 style={h2Style}>Description</h2>
                <p style={{ color: COLORS.goldLight, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", fontSize: 15, whiteSpace: 'pre-wrap' }}>
                  {property.description}
                </p>
              </div>
            )}

            {/* Characteristics */}
            <div style={cardStyle}>
              <h2 style={h2Style}>Caractéristiques</h2>
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
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid rgba(200,169,110,0.1)` : 'none', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ color: 'rgba(226,201,138,0.6)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{item.label}</span>
                    <span style={{ color: item.color ? item.color : (item.gold ? COLORS.gold : COLORS.ivory), fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, backgroundColor: item.color ? `${item.color}20` : 'transparent', padding: item.color ? '3px 10px' : '0', borderRadius: item.color ? 20 : 0, border: item.color ? `1px solid ${item.color}50` : 'none' }}>
                      {item.value}
                    </span>
                  </div>
                ))}

                {property.equipments?.length > 0 && (
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

            {/* Status Editor (admin only) */}
            {isLoggedIn && (
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ ...h2Style, marginBottom: 0 }}>Statut de l'annonce</h2>
                  {statusSaving && <span style={{ color: COLORS.goldLight, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>⏳ Enregistrement...</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {STATUS_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => handleStatusChange(opt.value)} disabled={statusSaving}
                      style={{ padding: '8px 18px', borderRadius: 999, border: `2px solid ${opt.color}`, backgroundColor: property.status === opt.value ? opt.color : 'transparent', color: property.status === opt.value ? '#fff' : opt.color, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: statusSaving ? 'not-allowed' : 'pointer', opacity: statusSaving ? 0.6 : 1, transition: 'all 0.2s' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            <div style={cardStyle}>
              <h2 style={h2Style}>Vidéo de la propriété</h2>
              <VideoSection />
            </div>
          </div>

          {/* Right Column */}
          <div className="pd-right-col">
            <div className="pd-price-sticky">

              {/* Price Card */}
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
                borderRadius: 16,
                padding: 24,
                marginBottom: 20,
              }}>
                <p style={{ color: COLORS.navy, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>PRIX</p>
                <div style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, color: COLORS.navy, fontFamily: "'Cormorant Garamond', Georgia, serif", wordBreak: 'break-word' }}>
                  {property.price.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <p style={{ color: COLORS.navy, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, marginTop: 2 }}>MAD</p>
              </div>

              {/* Contact Card */}
              <div style={{ backgroundColor: 'rgba(22,45,79,0.5)', border: `1px solid rgba(200,169,110,0.2)`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 300, color: COLORS.ivory, fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: 16 }}>Nous contacter</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="tel:+212605585720"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.gold, color: COLORS.navy, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, padding: '12px 16px', borderRadius: 10, textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.goldLight; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = COLORS.gold; }}
                  >
                    <Phone size={16} /> +212 6 05 58 57 20
                  </a>
                  <a href="mailto:Landmarkestate3@gmail.com"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: 'transparent', color: COLORS.gold, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, padding: '12px 16px', borderRadius: 10, textDecoration: 'none', border: `1.5px solid ${COLORS.gold}` }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.gold; e.currentTarget.style.color = COLORS.navy; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = COLORS.gold; }}
                  >
                    <Mail size={16} /> Landmarkestate3@gmail.com
                  </a>

                  {/* ✅ WhatsApp direct */}
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#25D366', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, padding: '12px 16px', borderRadius: 10, textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#20c45a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#25D366'; }}
                  >
                    💬 Partager sur WhatsApp
                  </a>

                  {/* ✅ Share button → ouvre le panel */}
                  <button onClick={handleShare}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: 'rgba(200,169,110,0.08)', color: 'rgba(226,201,138,0.7)', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, padding: '12px 16px', borderRadius: 10, border: `1.5px solid rgba(200,169,110,0.25)`, cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}>
                    <Share2 size={16} />
                    Plus d'options de partage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}