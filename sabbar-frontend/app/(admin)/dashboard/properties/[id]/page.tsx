'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil, Trash2, AlertCircle, X, Upload, Video, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

interface Property {
  id: string;
  title: string;
  description: string;
  transaction_type: string;
  property_type: string;
  price: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  city: string;
  district?: string;
  address?: string;
  status: string;
  // ✨ Nouveaux champs
  has_parking?: boolean;
  has_garden?: boolean;
  has_pool?: boolean;
  has_elevator?: boolean;
  is_furnished?: boolean;
  property_condition?: string; // 'new' ou 'used'
  images?: string[];
  video?: string;
}

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan'];

const PROPERTY_TYPES = [
  { value: 'studio', label: 'Studio' },
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

const PROPERTY_CONDITIONS = [
  { value: 'new', label: '🆕 Neuf' },
  { value: 'used', label: '📅 Deuxième main' },
];

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [property, setProperty] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState<Property | null>(null);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const set = (k: keyof Property, v: any) => {
    setEditForm(editForm ? { ...editForm, [k]: v } : null);
  };

  // Charger l'annonce
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/api/v1/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Annonce non trouvée');
        const data = await res.json();
        setProperty(data);
        setEditForm(data);
        if (data.images) setPhotoPreviews(data.images);
        if (data.video) setVideoPreview(data.video);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 10 - photoPreviews.length);
    arr.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setPhotoPreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const handleVideo = (files: FileList | null) => {
    if (!files?.[0]) return;
    setVideoPreview(URL.createObjectURL(files[0]));
  };

  const removePhoto = (i: number) => {
    setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!editForm) return;

    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');

      const res = await fetch(`${API_BASE_URL}/api/v1/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Agent-ID': '550e8400-e29b-41d4-a716-446655440000',
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Erreur lors de la mise à jour');
      }

      const updatedData = await res.json();
      setProperty(updatedData);
      setEditForm(updatedData);
      setIsEditing(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Supprimer l'annonce
  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    setDeleting(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');

      const res = await fetch(`${API_BASE_URL}/api/v1/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Agent-ID': '550e8400-e29b-41d4-a716-446655440000',
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Erreur lors de la suppression');
      }

      router.push('/dashboard/properties');
    } catch (e: any) {
      setError(e.message);
      setDeleting(false);
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block">
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-500 mt-3">Chargement...</p>
      </div>
    );
  }

  // État d'erreur
  if (error && !property) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
          <AlertCircle size={16} />
          {error}
        </div>
        <Link href="/dashboard/properties" className="text-blue-600 hover:underline">
          ← Retour aux annonces
        </Link>
      </div>
    );
  }

  // Annonce non trouvée
  if (!property) {
    return (
      <div className="p-6">
        <p className="text-slate-500 mb-4">Annonce non trouvée</p>
        <Link href="/dashboard/properties" className="text-blue-600 hover:underline">
          ← Retour aux annonces
        </Link>
      </div>
    );
  }

  // Mode VUE
  if (!isEditing) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/properties" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft size={18} />
            Retour
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Pencil size={16} />
              Modifier
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-60"
            >
              <Trash2 size={16} />
              {deleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{property.title}</h1>
          <p className="text-slate-500 mt-2">{property.description}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Prix</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {property.price.toLocaleString('fr-MA')} MAD
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Surface</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {property.area || '—'} m²
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Chambres</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {property.bedrooms || '—'}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Salles de bain</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {property.bathrooms || '—'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mode ÉDITION - COMPLET
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Modifier l'annonce</h1>
        <button
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
        >
          <X size={16} />
          Annuler
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Section 1: Informations générales */}
      <Section num={1} title="Informations générales">
        <div className="space-y-4">
          <Field label="Titre de l'annonce *">
            <input
              type="text"
              placeholder="Ex: Appartement moderne 3 chambres - Maarif"
              value={editForm?.title || ''}
              onChange={e => set('title', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </Field>

          <Field label="Description">
            <textarea
              placeholder="Décrivez le bien en détail..."
              value={editForm?.description || ''}
              onChange={e => set('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Type de transaction *">
              <div className="relative">
                <select
                  value={editForm?.transaction_type || ''}
                  onChange={e => set('transaction_type', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none cursor-pointer"
                >
                  {TRANSACTION_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field>
            <Field label="Type de bien *">
              <div className="relative">
                <select
                  value={editForm?.property_type || ''}
                  onChange={e => set('property_type', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none cursor-pointer"
                >
                  {PROPERTY_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Prix (MAD) *">
              <input
                type="number"
                placeholder="Ex: 450000"
                value={editForm?.price || ''}
                onChange={e => set('price', parseFloat(e.target.value))}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </Field>
            <Field label="Surface (m²)">
              <input
                type="number"
                placeholder="Ex: 90"
                value={editForm?.area || ''}
                onChange={e => set('area', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre de chambres">
              <input
                type="number"
                placeholder="Ex: 3"
                value={editForm?.bedrooms || ''}
                onChange={e => set('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </Field>
            <Field label="Nombre de salles de bain">
              <input
                type="number"
                placeholder="Ex: 2"
                value={editForm?.bathrooms || ''}
                onChange={e => set('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* Section 2: Localisation */}
      <Section num={2} title="Localisation">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ville *">
              <div className="relative">
                <select
                  value={editForm?.city || ''}
                  onChange={e => set('city', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none cursor-pointer"
                >
                  <option value="">Sélectionner une ville</option>
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field>
            <Field label="Quartier">
              <input
                type="text"
                placeholder="Ex: Maarif, Gueliz..."
                value={editForm?.district || ''}
                onChange={e => set('district', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </Field>
          </div>
          <Field label="Adresse complète">
            <input
              type="text"
              placeholder="Ex: Avenue Hassan II..."
              value={editForm?.address || ''}
              onChange={e => set('address', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </Field>
        </div>
      </Section>

      {/* Section 3: Critères supplémentaires */}
      <Section num={3} title="Critères supplémentaires">
        <div className="space-y-6">
          {/* État du bien */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">État du bien</h4>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_CONDITIONS.map(condition => (
                <label key={condition.value} className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <input
                    type="radio"
                    name="property_condition"
                    value={condition.value}
                    checked={editForm?.property_condition === condition.value}
                    onChange={() => set('property_condition', condition.value)}
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                  />
                  <span className="text-sm text-slate-700">{condition.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Caractéristiques */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Caractéristiques</h4>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Étage">
                <input
                  type="number"
                  placeholder="Ex: 2"
                  value={editForm?.floor || ''}
                  onChange={e => set('floor', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </Field>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer py-2.5">
                  <input
                    type="checkbox"
                    checked={editForm?.has_elevator || false}
                    onChange={e => set('has_elevator', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                  />
                  <span className="text-sm text-slate-700">Ascenseur</span>
                </label>
              </div>
            </div>
          </div>

          {/* Équipements */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Équipements</h4>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={editForm?.has_parking || false}
                  onChange={e => set('has_parking', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-700">Parking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={editForm?.has_garden || false}
                  onChange={e => set('has_garden', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-700">Jardin</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={editForm?.has_pool || false}
                  onChange={e => set('has_pool', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-700">Piscine</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={editForm?.is_furnished || false}
                  onChange={e => set('is_furnished', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-700">Meublé</span>
              </label>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4: Photos */}
      <Section num={4} title="Photos">
        <div
          className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-blue-300 transition cursor-pointer bg-slate-50"
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
      </Section>

      {/* Section 5: Vidéo */}
      <Section num={5} title="Vidéo (optionnel)">
        {!videoPreview ? (
          <div
            className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-blue-300 transition cursor-pointer bg-slate-50"
            onClick={() => videoInputRef.current?.click()}
          >
            <Video size={24} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Cliquez pour ajouter une vidéo</p>
            <p className="text-xs text-slate-400 mt-1">MP4, MOV · Max 50 MB</p>
            <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={e => handleVideo(e.target.files)} />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video src={videoPreview} controls className="w-full max-h-64 object-contain" />
              <button
                onClick={() => setVideoPreview(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Vidéo uploadée</span>
              <button onClick={() => videoInputRef.current?.click()} className="text-blue-500 hover:text-blue-700 font-medium">Remplacer</button>
              <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={e => handleVideo(e.target.files)} />
            </div>
          </div>
        )}
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={() => setIsEditing(false)}
          className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60"
        >
          {saving ? 'Enregistrement...' : '💾 Sauvegarder'}
        </button>
      </div>
    </div>
  );
}

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-slate-50">
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
      {label && <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>}
      {children}
    </div>
  );
}