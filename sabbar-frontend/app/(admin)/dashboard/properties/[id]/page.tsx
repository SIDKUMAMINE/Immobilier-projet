'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil, Trash2, AlertCircle, X, Upload, Video, ChevronDown, MapPin, Building2, Camera, Save } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  navy:      '#0D1F3C',
  gold:      '#C8A96E',
  goldLight: '#E2C98A',
  terra:     '#B5573A',
  ivory:     '#F9F5EF',
  muted:     'rgba(13,31,60,0.45)',
  border:    'rgba(200,169,110,0.18)',
  borderSoft:'rgba(13,31,60,0.08)',
};

interface Property {
  id: string; title: string; description: string;
  transaction_type: string; property_type: string;
  price: number; area?: number; bedrooms?: number; bathrooms?: number; floor?: number;
  city: string; district?: string; address?: string; status: string;
  has_parking?: boolean; has_garden?: boolean; has_pool?: boolean;
  has_elevator?: boolean; is_furnished?: boolean; is_new?: boolean;
  images?: string[]; video?: string;
}

const MOROCCAN_CITIES = [
  'Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda',
  'Kénitra','Tétouan','Salé','Mohammedia','Béni Mellal','Nador','Settat',
  'Berrechid','Tit Melloul','Inezgane','Ait-Melloul','Essaouira','Safi',
  'Taroudant','Ouarzazate','Errachidia','Laâyoune','Dakhla','Smara',
  'Al Hoceïma','Guelmim','Tiznit','Ifrane','Azrou','Midelt','Tinghir',
  'Chefchaouen','Asilah','Larache','Sidi Ifni','Tan-Tan','Tarfaya',
  'Erfoud','Merzouga','Risani','Goulmima','Taounate','Taza','Sefrou',
  'Berkane','Driouch','Jerada','Saïdia','Taourirt','Guercif','Rommani',
  "M'diq",'Fnideq','Ouazzane','Oued Laou','Khénifra','Kasbah Tadla','Imlil',
];

const PROPERTY_TYPES = [
  { value: 'studio', label: 'Studio' }, { value: 'apartment', label: 'Appartement' },
  { value: 'villa', label: 'Villa' }, { value: 'maison', label: 'Maison' },
  { value: 'riad', label: 'Riad' }, { value: 'terrain', label: 'Terrain' },
  { value: 'bureau', label: 'Bureau' }, { value: 'commercial', label: 'Local commercial' },
];

const TRANSACTION_TYPES = [
  { value: 'sale', label: 'Vente' }, { value: 'rent', label: 'Location' },
  { value: 'vacation_rental', label: 'Location vacances' },
];

const STATUS_OPTIONS = [
  { value: 'available',      label: 'Disponible',     color: '#16a34a' },
  { value: 'sold',           label: 'Vendu',          color: '#dc2626' },
  { value: 'rented',         label: 'Loué / Occupé',  color: '#2563eb' },
  { value: 'reserved',       label: 'Réservé',        color: '#d97706' },
  { value: 'under_offer',    label: 'Sous offre',     color: '#7c3aed' },
  { value: 'under_contract', label: 'Sous compromis', color: '#db2777' },
  { value: 'unavailable',    label: 'Non disponible', color: '#6b7280' },
];

// ─── Sous-composants ──────────────────────────────────────────────────────────

function Section({ num, title, icon, children }: { num: number; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${T.borderSoft}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(13,31,60,0.04)' }}>
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', alignItems: 'center', gap: '12px', background: '#faf8f5' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', fontWeight: 400, color: T.navy }}>{num}</span>
        </div>
        {icon && <span style={{ color: T.gold }}>{icon}</span>}
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '17px', fontWeight: 400, color: T.navy, margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: '22px 24px' }}>{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.muted, marginBottom: '7px', fontFamily: "'DM Sans', sans-serif" }}>
        {label}{required && <span style={{ color: T.terra, marginLeft: '3px' }}>*</span>}
      </label>}
      {children}
    </div>
  );
}

function LMInput({ type = 'text', placeholder, value, onChange, min }: any) {
  const [f, setF] = useState(false);
  return <input type={type} placeholder={placeholder} value={value ?? ''} onChange={onChange} min={min}
    onFocus={() => setF(true)} onBlur={() => setF(false)}
    style={{ width: '100%', padding: '11px 14px', background: T.ivory, border: `1px solid ${f ? T.gold : T.borderSoft}`, borderRadius: '10px', fontSize: '13px', color: T.navy, outline: 'none', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', boxSizing: 'border-box' as const, boxShadow: f ? `0 0 0 3px rgba(200,169,110,0.08)` : 'none' }} />;
}

function LMTextarea({ placeholder, value, onChange, rows = 3 }: any) {
  const [f, setF] = useState(false);
  return <textarea placeholder={placeholder} value={value ?? ''} onChange={onChange} rows={rows}
    onFocus={() => setF(true)} onBlur={() => setF(false)}
    style={{ width: '100%', padding: '11px 14px', background: T.ivory, border: `1px solid ${f ? T.gold : T.borderSoft}`, borderRadius: '10px', fontSize: '13px', color: T.navy, outline: 'none', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', resize: 'none', boxSizing: 'border-box' as const, boxShadow: f ? `0 0 0 3px rgba(200,169,110,0.08)` : 'none' }} />;
}

function LMSelect({ value, onChange, children }: any) {
  const [f, setF] = useState(false);
  return <div style={{ position: 'relative' }}>
    <select value={value ?? ''} onChange={onChange} onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ width: '100%', padding: '11px 36px 11px 14px', background: T.ivory, border: `1px solid ${f ? T.gold : T.borderSoft}`, borderRadius: '10px', fontSize: '13px', color: T.navy, outline: 'none', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', appearance: 'none', cursor: 'pointer', boxShadow: f ? `0 0 0 3px rgba(200,169,110,0.08)` : 'none' }}>
      {children}
    </select>
    <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.gold, pointerEvents: 'none' }} />
  </div>;
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${checked ? T.border : T.borderSoft}`, background: checked ? 'rgba(200,169,110,0.07)' : '#faf8f5', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
    <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: `2px solid ${checked ? T.gold : 'rgba(13,31,60,0.2)'}`, background: checked ? T.gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
      {checked && <span style={{ color: T.navy, fontSize: '11px', fontWeight: 700 }}>✓</span>}
    </div>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: 'none' }} />
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: checked ? T.navy : T.muted, fontWeight: checked ? 500 : 400 }}>{label}</span>
  </label>;
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function PropertyDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id as string;

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [property, setProperty]       = useState<Property | null>(null);
  const [editForm, setEditForm]       = useState<Property | null>(null);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview]  = useState<string | null>(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [error, setError]             = useState('');
  const [isEditing, setIsEditing]     = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  const set = (k: keyof Property, v: any) => setEditForm(f => f ? { ...f, [k]: v } : null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/api/v1/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Annonce non trouvée');
        const data = await res.json();
        setProperty(data); setEditForm(data);
        if (data.images) setPhotoPreviews(data.images);
        if (data.video) setVideoPreview(data.video);
      } catch (e: any) { setError(e.message); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 10 - photoPreviews.length).forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setPhotoPreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!property || statusSaving) return;
    setStatusSaving(true); setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/v1/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Agent-ID': '550e8400-e29b-41d4-a716-446655440000' },
        body: JSON.stringify({ ...property, status: newStatus }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Erreur'); }
      const updated = await res.json();
      setProperty(updated); setEditForm(updated);
    } catch (e: any) { setError(e.message); }
    finally { setStatusSaving(false); }
  };

  const handleSave = async () => {
    if (!editForm) return;
    setSaving(true); setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/v1/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Agent-ID': '550e8400-e29b-41d4-a716-446655440000' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Erreur mise à jour'); }
      const updated = await res.json();
      setProperty(updated); setEditForm(updated); setIsEditing(false);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer définitivement cette annonce ?')) return;
    setDeleting(true); setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/v1/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'X-Agent-ID': '550e8400-e29b-41d4-a716-446655440000' },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Erreur suppression'); }
      router.push('/dashboard/properties');
    } catch (e: any) { setError(e.message); setDeleting(false); }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', background: T.ivory }}>
      <div style={{ width: '36px', height: '36px', border: `3px solid rgba(200,169,110,0.2)`, borderTopColor: T.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '16px' }} />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: T.muted }}>Chargement de l'annonce...</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Erreur fatale ─────────────────────────────────────────────────────────────
  if (error && !property) return (
    <div style={{ padding: '40px', background: T.ivory, minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(181,87,58,0.08)', border: `1px solid rgba(181,87,58,0.25)`, borderRadius: '12px', color: T.terra, fontSize: '13px', marginBottom: '20px', fontFamily: "'DM Sans', sans-serif" }}>
        <AlertCircle size={15} /> {error}
      </div>
      <Link href="/dashboard/properties" style={{ color: T.gold, fontFamily: "'DM Sans', sans-serif", fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={14} /> Retour aux annonces
      </Link>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!property) return null;

  const currentStatus = STATUS_OPTIONS.find(s => s.value === property.status);

  // ════════════════════════════════════════════════════════════════════════════
  // ── MODE VUE ────────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  if (!isEditing) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .lm-stat:hover{box-shadow:0 8px 24px rgba(13,31,60,0.08)!important;}
        .lm-status-btn{transition:all 0.2s ease;}
        .lm-status-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.15)!important;}
        .lm-edit:hover{background:rgba(200,169,110,0.15)!important;color:#C8A96E!important;}
        .lm-del:hover{background:rgba(181,87,58,0.12)!important;color:#B5573A!important;}
      `}</style>
      <div style={{ minHeight: '100%', background: T.ivory, padding: '32px 40px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/dashboard/properties" style={{ display: 'flex', alignItems: 'center', gap: '7px', color: T.muted, fontFamily: "'DM Sans', sans-serif", fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = T.gold} onMouseLeave={e => e.currentTarget.style.color = T.muted}>
              <ArrowLeft size={15} /> Retour aux annonces
            </Link>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsEditing(true)} className="lm-edit"
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 20px', background: 'rgba(200,169,110,0.1)', border: `1px solid ${T.border}`, borderRadius: '10px', color: T.navy, fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
                <Pencil size={14} /> Modifier
              </button>
              <button onClick={handleDelete} disabled={deleting} className="lm-del"
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 20px', background: 'rgba(181,87,58,0.08)', border: `1px solid rgba(181,87,58,0.2)`, borderRadius: '10px', color: T.terra, fontSize: '13px', fontWeight: 500, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', opacity: deleting ? 0.6 : 1 }}>
                <Trash2 size={14} /> {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(181,87,58,0.08)', border: `1px solid rgba(181,87,58,0.25)`, borderRadius: '12px', color: T.terra, fontSize: '13px', marginBottom: '20px', fontFamily: "'DM Sans', sans-serif" }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Titre + badge statut */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
              {currentStatus && (
                <span style={{ padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: `${currentStatus.color}12`, color: currentStatus.color, border: `1px solid ${currentStatus.color}30` }}>
                  {currentStatus.label}
                </span>
              )}
              <span style={{ fontSize: '11px', color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>ID: {id.slice(0, 8)}</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', fontWeight: 300, color: T.navy, margin: '0 0 10px', lineHeight: 1.1 }}>{property.title}</h1>
            {property.description && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: T.muted, lineHeight: 1.7, margin: 0 }}>{property.description}</p>}
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Prix', value: `${property.price.toLocaleString('fr-MA')} MAD`, accent: T.gold, big: true },
              { label: 'Surface', value: property.area ? `${property.area} m²` : '—', accent: T.navy, big: false },
              { label: 'Chambres', value: property.bedrooms?.toString() || '—', accent: T.navy, big: false },
              { label: 'Sdb', value: property.bathrooms?.toString() || '—', accent: T.navy, big: false },
            ].map(s => (
              <div key={s.label} className="lm-stat" style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: `1px solid ${T.borderSoft}`, boxShadow: '0 2px 8px rgba(13,31,60,0.04)', transition: 'box-shadow 0.2s' }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.muted, marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: s.big ? '22px' : '28px', fontWeight: 300, color: s.accent, lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Localisation */}
          <div style={{ background: '#fff', borderRadius: '14px', padding: '18px 22px', border: `1px solid ${T.borderSoft}`, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(13,31,60,0.04)' }}>
            <MapPin size={16} style={{ color: T.gold, flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: T.navy, fontWeight: 500 }}>
              {[property.address, property.district, property.city].filter(Boolean).join(', ')}
            </span>
          </div>

          {/* Équipements */}
          {(property.has_parking || property.has_garden || property.has_pool || property.has_elevator || property.is_furnished || property.is_new) && (
            <div style={{ background: '#fff', borderRadius: '14px', padding: '18px 22px', border: `1px solid ${T.borderSoft}`, marginBottom: '20px', boxShadow: '0 2px 8px rgba(13,31,60,0.04)' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.muted, marginBottom: '12px' }}>Équipements</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { ok: property.has_parking,  label: '🚗 Parking' },
                  { ok: property.has_garden,   label: '🌿 Jardin' },
                  { ok: property.has_pool,     label: '🏊 Piscine' },
                  { ok: property.has_elevator, label: '🛗 Ascenseur' },
                  { ok: property.is_furnished, label: '🛋️ Meublé' },
                  { ok: property.is_new,       label: '🆕 Neuf' },
                ].filter(e => e.ok).map(e => (
                  <span key={e.label} style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", background: 'rgba(200,169,110,0.1)', color: T.navy, border: `1px solid ${T.border}` }}>{e.label}</span>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {photoPreviews.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.muted, marginBottom: '12px' }}>Photos ({photoPreviews.length})</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                {photoPreviews.map((src, i) => (
                  <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3', border: i === 0 ? `2px solid ${T.gold}` : `1px solid ${T.borderSoft}`, position: 'relative' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {i === 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: `linear-gradient(transparent, rgba(200,169,110,0.9))`, fontSize: '8px', fontWeight: 700, color: T.navy, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textAlign: 'center' }}>PRINCIPALE</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Statut rapide ── */}
          <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${T.borderSoft}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(13,31,60,0.04)' }}>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${T.borderSoft}`, background: '#faf8f5', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '13px' }}>⚡</span>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '17px', fontWeight: 400, color: T.navy }}>Changer le statut</span>
              {statusSaving && <div style={{ width: '14px', height: '14px', border: `2px solid rgba(200,169,110,0.3)`, borderTopColor: T.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginLeft: 'auto' }} />}
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {STATUS_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => handleStatusChange(opt.value)} className="lm-status-btn"
                  style={{ padding: '9px 18px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: statusSaving ? 'not-allowed' : 'pointer', border: `2px solid ${opt.color}`, background: property.status === opt.value ? opt.color : 'transparent', color: property.status === opt.value ? '#fff' : opt.color, transition: 'all 0.2s', opacity: statusSaving ? 0.6 : 1 }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // ── MODE ÉDITION ─────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        ::placeholder{color:rgba(13,31,60,0.3)!important;}
        select option{background:#F9F5EF;color:#0D1F3C;}
        .lm-status-edit{transition:all 0.2s ease;}
        .lm-status-edit:hover{transform:translateY(-1px);}
      `}</style>

      <div style={{ minHeight: '100%', background: T.ivory, padding: '32px 40px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Header édition */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(200,169,110,0.1)', border: `1px solid ${T.border}`, marginBottom: '10px' }}>
                <Pencil size={10} style={{ color: T.gold }} />
                <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.gold }}>Mode édition</span>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 300, color: T.navy, margin: 0, lineHeight: 1.1 }}>
                Modifier <span style={{ color: T.gold, fontStyle: 'italic' }}>l'annonce</span>
              </h1>
            </div>
            <button onClick={() => setIsEditing(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: '#fff', border: `1px solid ${T.borderSoft}`, borderRadius: '10px', color: T.muted, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.navy; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderSoft; e.currentTarget.style.color = T.muted; }}>
              <X size={14} /> Annuler
            </button>
          </div>

          {/* Erreur */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(181,87,58,0.08)', border: `1px solid rgba(181,87,58,0.25)`, borderRadius: '12px', color: T.terra, fontSize: '13px', marginBottom: '20px', fontFamily: "'DM Sans', sans-serif" }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* 1. Infos générales */}
            <Section num={1} title="Informations générales">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Titre" required><LMInput placeholder="Titre de l'annonce" value={editForm?.title} onChange={(e: any) => set('title', e.target.value)} /></Field>
                <Field label="Description"><LMTextarea placeholder="Description détaillée..." value={editForm?.description} onChange={(e: any) => set('description', e.target.value)} rows={4} /></Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Transaction" required>
                    <LMSelect value={editForm?.transaction_type} onChange={(e: any) => set('transaction_type', e.target.value)}>
                      {TRANSACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </LMSelect>
                  </Field>
                  <Field label="Type de bien" required>
                    <LMSelect value={editForm?.property_type} onChange={(e: any) => set('property_type', e.target.value)}>
                      {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </LMSelect>
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Prix (MAD)" required><LMInput type="number" placeholder="450000" value={editForm?.price} onChange={(e: any) => set('price', parseFloat(e.target.value))} /></Field>
                  <Field label="Surface (m²)"><LMInput type="number" placeholder="90" value={editForm?.area} onChange={(e: any) => set('area', e.target.value ? parseFloat(e.target.value) : undefined)} /></Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Chambres"><LMInput type="number" placeholder="3" value={editForm?.bedrooms} onChange={(e: any) => set('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)} /></Field>
                  <Field label="Salles de bain"><LMInput type="number" placeholder="2" value={editForm?.bathrooms} onChange={(e: any) => set('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)} /></Field>
                </div>
              </div>
            </Section>

            {/* 2. Localisation */}
            <Section num={2} title="Localisation" icon={<MapPin size={15} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Ville" required>
                    <LMSelect value={editForm?.city} onChange={(e: any) => set('city', e.target.value)}>
                      <option value="">Sélectionner une ville</option>
                      {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </LMSelect>
                  </Field>
                  <Field label="Quartier"><LMInput placeholder="Ex: Maarif, Guéliz..." value={editForm?.district} onChange={(e: any) => set('district', e.target.value)} /></Field>
                </div>
                <Field label="Adresse complète"><LMInput placeholder="12 Avenue Hassan II..." value={editForm?.address} onChange={(e: any) => set('address', e.target.value)} /></Field>
              </div>
            </Section>

            {/* 3. Statut */}
            <Section num={3} title="Statut de l'annonce">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {STATUS_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => set('status', opt.value)} className="lm-status-edit"
                    style={{ padding: '9px 18px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', border: `2px solid ${opt.color}`, background: editForm?.status === opt.value ? opt.color : 'transparent', color: editForm?.status === opt.value ? '#fff' : opt.color }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </Section>

            {/* 4. Équipements */}
            <Section num={4} title="Caractéristiques & équipements">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Étage"><LMInput type="number" placeholder="0 = RDC" value={editForm?.floor} onChange={(e: any) => set('floor', e.target.value ? parseInt(e.target.value) : undefined)} min="0" /></Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <CheckItem label="🚗 Parking"    checked={!!editForm?.has_parking}  onChange={v => set('has_parking', v)} />
                  <CheckItem label="🌿 Jardin"     checked={!!editForm?.has_garden}   onChange={v => set('has_garden', v)} />
                  <CheckItem label="🏊 Piscine"    checked={!!editForm?.has_pool}     onChange={v => set('has_pool', v)} />
                  <CheckItem label="🛗 Ascenseur"  checked={!!editForm?.has_elevator} onChange={v => set('has_elevator', v)} />
                  <CheckItem label="🛋️ Meublé"    checked={!!editForm?.is_furnished} onChange={v => set('is_furnished', v)} />
                  <CheckItem label="🆕 Neuf"       checked={!!editForm?.is_new}       onChange={v => set('is_new', v)} />
                </div>
              </div>
            </Section>

            {/* 5. Photos */}
            <Section num={5} title="Photos" icon={<Camera size={15} />}>
              <div onClick={() => photoInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handlePhotos(e.dataTransfer.files); }}
                style={{ border: `2px dashed rgba(200,169,110,0.35)`, borderRadius: '12px', padding: '32px 24px', textAlign: 'center', cursor: 'pointer', background: 'rgba(200,169,110,0.03)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.background = 'rgba(200,169,110,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.35)'; e.currentTarget.style.background = 'rgba(200,169,110,0.03)'; }}>
                <Upload size={24} style={{ color: T.gold, margin: '0 auto 10px', opacity: 0.7 }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: T.navy, marginBottom: '4px' }}>Cliquez ou glissez vos photos ici</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.muted }}>JPG, PNG, WEBP · Max 5 MB</p>
                <input ref={photoInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handlePhotos(e.target.files)} />
              </div>
              {photoPreviews.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
                  {photoPreviews.map((src, i) => (
                    <div key={i} style={{ position: 'relative', width: '76px', height: '76px', borderRadius: '10px', overflow: 'hidden', border: i === 0 ? `2px solid ${T.gold}` : `1px solid ${T.borderSoft}` }}>
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i))}
                        style={{ position: 'absolute', top: '3px', right: '3px', width: '18px', height: '18px', background: T.terra, color: '#fff', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* 6. Vidéo */}
            <Section num={6} title="Vidéo (optionnel)">
              {!videoPreview ? (
                <div onClick={() => videoInputRef.current?.click()}
                  style={{ border: `2px dashed rgba(200,169,110,0.25)`, borderRadius: '12px', padding: '28px 24px', textAlign: 'center', cursor: 'pointer', background: 'rgba(200,169,110,0.02)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.background = 'rgba(200,169,110,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.25)'; e.currentTarget.style.background = 'rgba(200,169,110,0.02)'; }}>
                  <Video size={22} style={{ color: T.gold, margin: '0 auto 10px', opacity: 0.6 }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: T.navy, marginBottom: '4px' }}>Ajouter une vidéo</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.muted }}>MP4, MOV · Max 50 MB</p>
                  <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) setVideoPreview(URL.createObjectURL(e.target.files[0])); }} />
                </div>
              ) : (
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                  <video src={videoPreview} controls style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }} />
                  <button onClick={() => setVideoPreview(null)}
                    style={{ position: 'absolute', top: '8px', right: '8px', width: '26px', height: '26px', background: T.terra, color: '#fff', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={12} />
                  </button>
                </div>
              )}
            </Section>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px' }}>
              <button onClick={() => setIsEditing(false)}
                style={{ padding: '12px 24px', borderRadius: '10px', border: `1px solid ${T.borderSoft}`, background: '#fff', color: T.muted, fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.navy; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderSoft; e.currentTarget.style.color = T.muted; }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '13px 32px', background: saving ? 'rgba(200,169,110,0.5)' : `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, fontSize: '13px', fontWeight: 600, borderRadius: '10px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.25s', letterSpacing: '0.03em', boxShadow: saving ? 'none' : '0 4px 16px rgba(200,169,110,0.3)' }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                {saving ? (
                  <><div style={{ width: '14px', height: '14px', border: `2px solid rgba(13,31,60,0.3)`, borderTopColor: T.navy, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Enregistrement...</>
                ) : <><Save size={14} /> Sauvegarder les modifications</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}