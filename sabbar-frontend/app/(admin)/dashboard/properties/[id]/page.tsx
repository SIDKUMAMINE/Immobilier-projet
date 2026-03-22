'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Home, Pencil, Trash2, Save, X, AlertCircle } from 'lucide-react';
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
  city: string;
  district?: string;
  address?: string;
  status: string;
}

const CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger',
  'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan',
];

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

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
          <Link
            href="/dashboard/properties"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
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

        {/* Location */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Localisation
          </h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Ville:</span> {property.city}</p>
            <p><span className="font-semibold">Quartier:</span> {property.district || '—'}</p>
            <p><span className="font-semibold">Adresse:</span> {property.address || '—'}</p>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Home size={20} />
            Détails
          </h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Type de bien:</span> {property.property_type}</p>
            <p><span className="font-semibold">Type de transaction:</span> {property.transaction_type}</p>
            <p><span className="font-semibold">Statut:</span> {property.status}</p>
          </div>
        </div>
      </div>
    );
  }

  // Mode ÉDITION
  return (
    <div className="p-6 space-y-6">
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

      {/* Formulaire */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Titre</label>
          <input
            type="text"
            value={editForm?.title || ''}
            onChange={e => setEditForm(editForm ? { ...editForm, title: e.target.value } : null)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            value={editForm?.description || ''}
            onChange={e => setEditForm(editForm ? { ...editForm, description: e.target.value } : null)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Prix (MAD)</label>
            <input
              type="number"
              value={editForm?.price || ''}
              onChange={e => setEditForm(editForm ? { ...editForm, price: parseFloat(e.target.value) } : null)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Surface (m²)</label>
            <input
              type="number"
              value={editForm?.area || ''}
              onChange={e => setEditForm(editForm ? { ...editForm, area: e.target.value ? parseFloat(e.target.value) : undefined } : null)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Chambres</label>
            <input
              type="number"
              value={editForm?.bedrooms || ''}
              onChange={e => setEditForm(editForm ? { ...editForm, bedrooms: e.target.value ? parseInt(e.target.value) : undefined } : null)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Salles de bain</label>
            <input
              type="number"
              value={editForm?.bathrooms || ''}
              onChange={e => setEditForm(editForm ? { ...editForm, bathrooms: e.target.value ? parseInt(e.target.value) : undefined } : null)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Ville</label>
            <select
              value={editForm?.city || ''}
              onChange={e => setEditForm(editForm ? { ...editForm, city: e.target.value } : null)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Quartier</label>
            <input
              type="text"
              value={editForm?.district || ''}
              onChange={e => setEditForm(editForm ? { ...editForm, district: e.target.value } : null)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}