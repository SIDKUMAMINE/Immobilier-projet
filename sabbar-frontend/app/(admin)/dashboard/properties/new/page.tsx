'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Video, AlertCircle, ChevronDown, MapPin, Building2, Camera } from 'lucide-react';
import { propertiesApi, ApiCallError } from '@/lib/api';

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

const MOROCCAN_CITIES = [
  'Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda',
  'Kénitra','Tétouan','Salé','Mohammedia','Béni Mellal','Nador','Settat',
  'Berrechid','Tit Melloul','Inezgane','Ait-Melloul','Essaouira','Safi',
  'Taroudant','Ouarzazate','Errachidia','Laâyoune','Dakhla','Smara',
  'Al Hoceïma','Guelmim','Tiznit','Ifrane','Azrou','Midelt','Tinghir',
  'Chefchaouen','Asilah','Larache','Sidi Ifni','Tan-Tan','Tarfaya',
  'Erfoud','Merzouga','Risani','Goulmima','Taounate','Taza','Sefrou',
  'Khémis Sahel','Boujdour','Berkane','Driouch','Nador','Jerada',
  'Saïdia','Taourirt','Guercif','Rommani','M\'diq','Fnideq','Ouazzane',
  'Oued Laou','Khénifra','Kasbah Tadla','Imlil',
];

const PROPERTY_TYPES = [
  { value: 'studio',     label: 'Studio'          },
  { value: 'apartment',  label: 'Appartement'     },
  { value: 'villa',      label: 'Villa'           },
  { value: 'maison',     label: 'Maison'          },
  { value: 'riad',       label: 'Riad'            },
  { value: 'terrain',    label: 'Terrain'         },
  { value: 'bureau',     label: 'Bureau'          },
  { value: 'commercial', label: 'Local commercial'},
];

const TRANSACTION_TYPES = [
  { value: 'sale',            label: 'Vente'             },
  { value: 'rent',            label: 'Location'          },
  { value: 'vacation_rental', label: 'Location vacances' },
];

interface FormData {
  title: string; description: string; transaction_type: string; property_type: string;
  price: string; area: string; city: string; district: string; address: string;
  bedrooms: string; bathrooms: string; floor: string;
  has_parking: boolean; has_garden: boolean; has_pool: boolean;
  has_elevator: boolean; is_furnished: boolean; is_new: boolean;
}

// ─── Composants ───────────────────────────────────────────────────────────────

function Section({ num, title, icon, children }: { num: number; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${T.borderSoft}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(13,31,60,0.04)' }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', alignItems: 'center', gap: '12px', background: '#faf8f5' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', fontWeight: 400, color: T.navy }}>{num}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && <span style={{ color: T.gold }}>{icon}</span>}
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', fontWeight: 400, color: T.navy, margin: 0 }}>{title}</h3>
        </div>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.muted, marginBottom: '8px', fontFamily: "'DM Sans', sans-serif" }}>
          {label}{required && <span style={{ color: T.terra, marginLeft: '3px' }}>*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', background: T.ivory,
  border: `1px solid ${T.borderSoft}`, borderRadius: '10px',
  fontSize: '13px', color: T.navy, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '36px',
};

function LMInput({ type = 'text', placeholder, value, onChange, min }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} min={min}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...inputStyle, borderColor: focused ? T.gold : T.borderSoft, boxShadow: focused ? `0 0 0 3px rgba(200,169,110,0.08)` : 'none' }}
    />
  );
}

function LMTextarea({ placeholder, value, onChange, rows = 3 }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...inputStyle, resize: 'none', borderColor: focused ? T.gold : T.borderSoft, boxShadow: focused ? `0 0 0 3px rgba(200,169,110,0.08)` : 'none' }}
    />
  );
}

function LMSelect({ value, onChange, children }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...selectStyle, borderColor: focused ? T.gold : T.borderSoft, boxShadow: focused ? `0 0 0 3px rgba(200,169,110,0.08)` : 'none' }}>
        {children}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.gold, pointerEvents: 'none' }} />
    </div>
  );
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${checked ? T.border : T.borderSoft}`, background: checked ? 'rgba(200,169,110,0.07)' : '#faf8f5', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: `2px solid ${checked ? T.gold : 'rgba(13,31,60,0.2)'}`, background: checked ? T.gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
        {checked && <span style={{ color: T.navy, fontSize: '11px', fontWeight: 700 }}>✓</span>}
      </div>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: 'none' }} />
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: checked ? T.navy : T.muted, fontWeight: checked ? 500 : 400 }}>{label}</span>
    </label>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function NewPropertyPage() {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    title: '', description: '', transaction_type: 'sale', property_type: 'apartment',
    price: '', area: '', city: '', district: '', address: '',
    bedrooms: '', bathrooms: '', floor: '',
    has_parking: false, has_garden: false, has_pool: false,
    has_elevator: false, is_furnished: false, is_new: false,
  });

  const [photos, setPhotos]           = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [video, setVideo]             = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 10 - photos.length);
    setPhotos(prev => [...prev, ...arr]);
    arr.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setPhotoPreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const handleVideo = (files: FileList | null) => {
    if (!files?.[0]) return;
    setVideo(files[0]);
    setVideoPreview(URL.createObjectURL(files[0]));
  };

  const removePhoto = (i: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== i));
    setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    setError(''); setUploadProgress('');
    if (!form.title?.trim())              { setError('Veuillez remplir le titre'); return; }
    if (!form.price || parseFloat(form.price) <= 0) { setError('Veuillez entrer un prix valide'); return; }
    if (!form.city)                       { setError('Veuillez sélectionner une ville'); return; }
    setLoading(true);
    try {
      setUploadProgress('Création de l\'annonce...');
      const property = await propertiesApi.createProperty({
        title: form.title, description: form.description,
        transaction_type: form.transaction_type, property_type: form.property_type,
        price: parseFloat(form.price),
        area: form.area ? parseFloat(form.area) : null,
        city: form.city, district: form.district || null, address: form.address || null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        floor: form.floor ? parseInt(form.floor) : null,
        has_parking: form.has_parking, has_garden: form.has_garden,
        has_pool: form.has_pool, has_elevator: form.has_elevator,
        is_furnished: form.is_furnished, is_new: form.is_new, status: 'available',
      });
      if (photos.length > 0) {
        setUploadProgress(`Upload des photos (${photos.length})...`);
        try { await propertiesApi.uploadImages(property.id, photos); } catch {}
      }
      if (video) {
        setUploadProgress('Upload de la vidéo...');
        try { await propertiesApi.uploadVideo(property.id, video); } catch {}
      }
      router.push('/dashboard/properties');
    } catch (e: any) {
      setError(e instanceof ApiCallError ? e.message : e.message || 'Erreur lors de la création');
    } finally { setLoading(false); setUploadProgress(''); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        ::placeholder { color: rgba(13,31,60,0.3) !important; }
        select option { background: #F9F5EF; color: #0D1F3C; }
      `}</style>

      <div style={{ minHeight: '100%', background: T.ivory, padding: '32px 40px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(200,169,110,0.1)', border: `1px solid ${T.border}`, marginBottom: '12px' }}>
              <Building2 size={11} style={{ color: T.gold }} />
              <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.gold }}>Nouvelle annonce</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', fontWeight: 300, color: T.navy, margin: '0 0 6px', lineHeight: 1.1 }}>
              Publier une <span style={{ color: T.gold, fontStyle: 'italic' }}>annonce</span>
            </h1>
            <p style={{ fontSize: '13px', color: T.muted, margin: 0 }}>Remplissez les informations pour mettre votre bien en ligne</p>
          </div>

          {/* Erreur */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(181,87,58,0.08)', border: `1px solid rgba(181,87,58,0.25)`, borderRadius: '12px', color: T.terra, fontSize: '13px', marginBottom: '20px', fontFamily: "'DM Sans', sans-serif" }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          {/* Progress */}
          {uploadProgress && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(200,169,110,0.08)', border: `1px solid ${T.border}`, borderRadius: '12px', color: T.gold, fontSize: '13px', marginBottom: '20px', fontFamily: "'DM Sans', sans-serif" }}>
              <div style={{ width: '16px', height: '16px', border: `2px solid rgba(200,169,110,0.3)`, borderTopColor: T.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
              {uploadProgress}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── 1. Informations générales ── */}
            <Section num={1} title="Informations générales">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Titre de l'annonce" required>
                  <LMInput placeholder="Ex: Appartement moderne 3 chambres — Maarif" value={form.title} onChange={(e: any) => set('title', e.target.value)} />
                </Field>
                <Field label="Description">
                  <LMTextarea placeholder="Décrivez le bien en détail : vue, luminosité, état, atouts..." value={form.description} onChange={(e: any) => set('description', e.target.value)} rows={4} />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Type de transaction" required>
                    <LMSelect value={form.transaction_type} onChange={(e: any) => set('transaction_type', e.target.value)}>
                      {TRANSACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </LMSelect>
                  </Field>
                  <Field label="Type de bien" required>
                    <LMSelect value={form.property_type} onChange={(e: any) => set('property_type', e.target.value)}>
                      {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </LMSelect>
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Prix (MAD)" required>
                    <LMInput type="number" placeholder="Ex: 450 000" value={form.price} onChange={(e: any) => set('price', e.target.value)} />
                  </Field>
                  <Field label="Surface (m²)">
                    <LMInput type="number" placeholder="Ex: 90" value={form.area} onChange={(e: any) => set('area', e.target.value)} />
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Chambres">
                    <LMInput type="number" placeholder="Ex: 3" value={form.bedrooms} onChange={(e: any) => set('bedrooms', e.target.value)} />
                  </Field>
                  <Field label="Salles de bain">
                    <LMInput type="number" placeholder="Ex: 2" value={form.bathrooms} onChange={(e: any) => set('bathrooms', e.target.value)} />
                  </Field>
                </div>
              </div>
            </Section>

            {/* ── 2. Localisation ── */}
            <Section num={2} title="Localisation" icon={<MapPin size={16} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Ville" required>
                    <LMSelect value={form.city} onChange={(e: any) => set('city', e.target.value)}>
                      <option value="">Sélectionner une ville</option>
                      {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </LMSelect>
                  </Field>
                  <Field label="Quartier">
                    <LMInput placeholder="Ex: Maarif, Guéliz, Hivernage..." value={form.district} onChange={(e: any) => set('district', e.target.value)} />
                  </Field>
                </div>
                <Field label="Adresse complète">
                  <LMInput placeholder="Ex: 12 Avenue Hassan II, Casablanca" value={form.address} onChange={(e: any) => set('address', e.target.value)} />
                </Field>
              </div>
            </Section>

            {/* ── 3. Caractéristiques ── */}
            <Section num={3} title="Caractéristiques & équipements">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Étage */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Étage">
                    <LMInput type="number" placeholder="Ex: 2 (0 = RDC)" value={form.floor} onChange={(e: any) => set('floor', e.target.value)} min="0" />
                  </Field>
                </div>

                {/* Équipements en checkboxes stylisées */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.muted, marginBottom: '10px', fontFamily: "'DM Sans', sans-serif" }}>Équipements</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <CheckItem label="🚗 Parking"    checked={form.has_parking}  onChange={v => set('has_parking', v)} />
                    <CheckItem label="🌿 Jardin"     checked={form.has_garden}   onChange={v => set('has_garden', v)} />
                    <CheckItem label="🏊 Piscine"    checked={form.has_pool}     onChange={v => set('has_pool', v)} />
                    <CheckItem label="🛗 Ascenseur"  checked={form.has_elevator} onChange={v => set('has_elevator', v)} />
                    <CheckItem label="🛋️ Meublé"    checked={form.is_furnished} onChange={v => set('is_furnished', v)} />
                    <CheckItem label="🆕 Neuf"       checked={form.is_new}       onChange={v => set('is_new', v)} />
                  </div>
                </div>
              </div>
            </Section>

            {/* ── 4. Photos ── */}
            <Section num={4} title="Photos" icon={<Camera size={16} />}>
              {/* Zone drop */}
              <div
                onClick={() => photoInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handlePhotos(e.dataTransfer.files); }}
                style={{ border: `2px dashed rgba(200,169,110,0.35)`, borderRadius: '12px', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: 'rgba(200,169,110,0.03)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.background = 'rgba(200,169,110,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.35)'; e.currentTarget.style.background = 'rgba(200,169,110,0.03)'; }}
              >
                <Upload size={28} style={{ color: T.gold, margin: '0 auto 12px', opacity: 0.7 }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: T.navy, marginBottom: '4px' }}>Cliquez ou glissez vos photos ici</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.muted }}>JPG, PNG, WEBP · Max 5 MB · {10 - photos.length} photo{10 - photos.length > 1 ? 's' : ''} restante{10 - photos.length > 1 ? 's' : ''}</p>
                <input ref={photoInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handlePhotos(e.target.files)} />
              </div>

              {/* Previews */}
              {photoPreviews.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                  {photoPreviews.map((src, i) => (
                    <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: i === 0 ? `2px solid ${T.gold}` : `1px solid ${T.borderSoft}` }}>
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {i === 0 && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: `linear-gradient(transparent, rgba(200,169,110,0.9))`, padding: '4px', textAlign: 'center' }}>
                          <span style={{ fontSize: '8px', fontWeight: 700, color: T.navy, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.05em' }}>PRINCIPALE</span>
                        </div>
                      )}
                      <button onClick={() => removePhoto(i)}
                        style={{ position: 'absolute', top: '4px', right: '4px', width: '18px', height: '18px', background: T.terra, color: '#fff', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => photoInputRef.current?.click()}
                    style={{ width: '80px', height: '80px', borderRadius: '10px', border: `2px dashed rgba(200,169,110,0.35)`, background: 'transparent', cursor: 'pointer', color: T.gold, fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    +
                  </button>
                </div>
              )}
              {photoPreviews.length > 0 && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: T.muted, marginTop: '10px' }}>
                  ✦ La première photo est utilisée comme image principale
                </p>
              )}
            </Section>

            {/* ── 5. Vidéo ── */}
            <Section num={5} title="Vidéo (optionnel)">
              {!videoPreview ? (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  style={{ border: `2px dashed rgba(200,169,110,0.25)`, borderRadius: '12px', padding: '32px 24px', textAlign: 'center', cursor: 'pointer', background: 'rgba(200,169,110,0.02)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.background = 'rgba(200,169,110,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.25)'; e.currentTarget.style.background = 'rgba(200,169,110,0.02)'; }}
                >
                  <Video size={24} style={{ color: T.gold, margin: '0 auto 10px', opacity: 0.6 }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: T.navy, marginBottom: '4px' }}>Ajouter une vidéo</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.muted }}>MP4, MOV · Max 50 MB</p>
                  <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideo(e.target.files)} />
                </div>
              ) : (
                <div>
                  <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                    <video src={videoPreview} controls style={{ width: '100%', maxHeight: '240px', objectFit: 'contain' }} />
                    <button onClick={() => { setVideo(null); setVideoPreview(null); }}
                      style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', background: T.terra, color: '#fff', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={13} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>{video?.name}</span>
                    <button onClick={() => videoInputRef.current?.click()} style={{ fontSize: '12px', color: T.gold, fontFamily: "'DM Sans', sans-serif", background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                      Remplacer
                    </button>
                    <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideo(e.target.files)} />
                  </div>
                </div>
              )}
            </Section>

            {/* ── Actions ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px' }}>
              <button
                onClick={() => router.push('/dashboard/properties')}
                style={{ padding: '12px 24px', borderRadius: '10px', border: `1px solid ${T.borderSoft}`, background: '#fff', color: T.muted, fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.navy; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderSoft; e.currentTarget.style.color = T.muted; }}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '13px 32px', background: loading ? 'rgba(200,169,110,0.5)' : `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, fontSize: '13px', fontWeight: 600, borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.25s', letterSpacing: '0.03em', boxShadow: loading ? 'none' : '0 4px 16px rgba(200,169,110,0.3)' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                {loading ? (
                  <>
                    <div style={{ width: '14px', height: '14px', border: `2px solid rgba(13,31,60,0.3)`, borderTopColor: T.navy, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Publication en cours...
                  </>
                ) : '✦ Publier l\'annonce'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}