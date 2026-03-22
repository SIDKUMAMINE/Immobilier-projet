'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Video, AlertCircle, ChevronDown } from 'lucide-react';
import { propertiesApi, ApiCallError } from '@/lib/api';

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan'];

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Appartement' },
  { value: 'villa', label: 'Villa' },
  { value: 'house', label: 'Maison' },
  { value: 'riad', label: 'Riad' },
  { value: 'land', label: 'Terrain' },
  { value: 'office', label: 'Bureau' },
  { value: 'commercial', label: 'Local commercial' },
];

const TRANSACTION_TYPES = [
  { value: 'sale', label: 'Vente' },
  { value: 'rent', label: 'Location' },
  { value: 'vacation_rent', label: 'Location vacances' },
];

interface FormData {
  title: string;
  description: string;
  transaction_type: string;
  property_type: string;
  price: string;
  area: string;
  city: string;
  district: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
}

export default function NewPropertyPage() {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    transaction_type: 'sale',
    property_type: 'apartment',
    price: '',
    area: '',
    city: '',
    district: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

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
    setError('');
    setUploadProgress('');

    // Validation
    if (!form.title?.trim()) {
      setError('Veuillez remplir le titre');
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError('Veuillez entrer un prix valide');
      return;
    }
    if (!form.city) {
      setError('Veuillez sélectionner une ville');
      return;
    }

    setLoading(true);

    try {
      // ÉTAPE 1: Créer l'annonce
      setUploadProgress('Création de l\'annonce...');
      const property = await propertiesApi.createProperty({
        title: form.title,
        description: form.description,
        transaction_type: form.transaction_type,
        property_type: form.property_type,
        price: parseFloat(form.price),
        area: form.area ? parseFloat(form.area) : null,
        city: form.city,
        district: form.district || null,
        address: form.address || null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        status: 'available',
      });

      console.log('✅ Annonce créée:', property.id);
      console.log('Status retourné:', property.status);

      // ÉTAPE 2: Uploader les photos
      if (photos.length > 0) {
        setUploadProgress(`Upload des photos (${photos.length})...`);
        try {
          await propertiesApi.uploadImages(property.id, photos);
          console.log('✅ Photos uploadées');
        } catch (err: any) {
          console.warn('⚠️ Erreur upload photos:', err.message);
          // Continuer même si les photos échouent
        }
      }

      // ÉTAPE 3: Uploader la vidéo
      if (video) {
        setUploadProgress('Upload de la vidéo...');
        try {
          await propertiesApi.uploadVideo(property.id, video);
          console.log('✅ Vidéo uploadée');
        } catch (err: any) {
          console.warn('⚠️ Erreur upload vidéo:', err.message);
          // Continuer même si la vidéo échoue
        }
      }

      // Succès!
      setUploadProgress('');
      router.push('/dashboard/properties');
    } catch (e: any) {
      const errorMsg = e instanceof ApiCallError 
        ? e.message 
        : e.message || 'Erreur lors de la création de l\'annonce';
      setError(errorMsg);
      console.error('❌ Erreur:', e);
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  const inputCls = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition";
  const selectCls = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition appearance-none cursor-pointer";

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto space-y-5">

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {uploadProgress && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            {uploadProgress}
          </div>
        )}

        {/* 1. Informations générales */}
        <Section num={1} title="Informations générales">
          <div className="space-y-4">
            <Field label="Titre de l'annonce *">
              <input
                type="text"
                placeholder="Ex: Appartement moderne 3 chambres - Maarif"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="Description">
              <textarea
                placeholder="Décrivez le bien en détail..."
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Type de transaction *">
                <div className="relative">
                  <select value={form.transaction_type} onChange={e => set('transaction_type', e.target.value)} className={selectCls}>
                    {TRANSACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </Field>
              <Field label="Type de bien *">
                <div className="relative">
                  <select value={form.property_type} onChange={e => set('property_type', e.target.value)} className={selectCls}>
                    {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Prix (MAD) *">
                <input type="number" placeholder="Ex: 450000" value={form.price} onChange={e => set('price', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Surface (m²)">
                <input type="number" placeholder="Ex: 90" value={form.area} onChange={e => set('area', e.target.value)} className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre de chambres">
                <input type="number" placeholder="Ex: 3" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Nombre de salles de bain">
                <input type="number" placeholder="Ex: 2" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} className={inputCls} />
              </Field>
            </div>
          </div>
        </Section>

        {/* 2. Localisation */}
        <Section num={2} title="Localisation">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ville *">
                <div className="relative">
                  <select value={form.city} onChange={e => set('city', e.target.value)} className={selectCls}>
                    <option value="">Sélectionner une ville</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </Field>
              <Field label="Quartier">
                <input type="text" placeholder="Ex: Maarif, Gueliz..." value={form.district} onChange={e => set('district', e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Adresse complète">
              <input type="text" placeholder="Ex: Avenue Hassan II..." value={form.address} onChange={e => set('address', e.target.value)} className={inputCls} />
            </Field>
          </div>
        </Section>

        {/* 3. Photos */}
        <Section num={3} title="Photos">
          <div
            className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-300 transition cursor-pointer bg-slate-50"
            onClick={() => photoInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handlePhotos(e.dataTransfer.files); }}
          >
            <Upload size={24} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Cliquez pour ajouter des photos ou glissez-déposez</p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP · Max 5 MB · 10 photos max</p>
            <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handlePhotos(e.target.files)} />
          </div>

          {photoPreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {photoPreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-semibold">#1</span>
                  )}
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => photoInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center text-blue-400 hover:border-blue-400 transition text-xs font-medium"
              >
                + Ajouter
              </button>
            </div>
          )}
          {photoPreviews.length > 0 && (
            <p className="text-xs text-slate-400 mt-2">
              ℹ️ La première photo sera utilisée comme image principale
            </p>
          )}
        </Section>

        {/* 4. Vidéo */}
        <Section num={4} title="Vidéo (optionnel)">
          {!videoPreview ? (
            <div
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-300 transition cursor-pointer bg-slate-50"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video size={24} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Cliquez pour ajouter une vidéo</p>
              <p className="text-xs text-slate-400 mt-1">MP4, MOV · Max 50 MB</p>
              <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={e => handleVideo(e.target.files)} />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video src={videoPreview} controls className="w-full max-h-64 object-contain" />
                <button
                  onClick={() => { setVideo(null); setVideoPreview(null); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{video?.name}</span>
                <button onClick={() => videoInputRef.current?.click()} className="text-blue-500 hover:text-blue-700 font-medium">Remplacer</button>
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={e => handleVideo(e.target.files)} />
              </div>
            </div>
          )}
        </Section>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 pb-4">
          <button
            onClick={() => router.push('/dashboard/properties')}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60 shadow-md shadow-blue-500/20"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publication en cours...
              </>
            ) : 'Publier l\'annonce'}
          </button>
        </div>

      </div>
    </div>
  );
}

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{num}</span>
        <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}