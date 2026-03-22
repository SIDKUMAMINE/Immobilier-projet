/**
 * Page Mes Annonces - Tableau des propriétés
 * Fichier: app/(admin)/dashboard/properties/page.tsx
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, RefreshCw, Eye, Pencil, Trash2, Search, Building2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

interface Property {
  id: string;
  title: string;
  transaction_type: string;
  property_type: string;
  city: string;
  district?: string;
  price: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  status: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  available: { label: 'Disponible', color: 'bg-green-100 text-green-700' },
  sold:      { label: 'Vendu',      color: 'bg-red-100 text-red-700' },
  rented:    { label: 'Loué',       color: 'bg-blue-100 text-blue-700' },
  pending:   { label: 'En attente', color: 'bg-amber-100 text-amber-700' },
};

const TRANSACTION_LABELS: Record<string, { label: string; color: string }> = {
  sale:          { label: 'Vente',    color: 'bg-blue-100 text-blue-700' },
  rent:          { label: 'Location', color: 'bg-purple-100 text-purple-700' },
  vacation_rent: { label: 'Vacances', color: 'bg-orange-100 text-orange-700' },
};

const TYPE_LABELS: Record<string, string> = {
  apartment: 'Appartement', villa: 'Villa', house: 'Maison',
  riad: 'Riad', land: 'Terrain', office: 'Bureau', commercial: 'Commercial',
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentification requise');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/properties?limit=50`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setProperties(Array.isArray(data) ? data : data.data || []);
    } catch (e: any) {
      console.error('❌ Erreur:', e);
      setError(e.message || 'Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = properties.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.transaction_type === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
      const token = localStorage.getItem('accessToken');

      const res = await fetch(`${API_BASE_URL}/api/v1/properties/${id}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Agent-ID': '550e8400-e29b-41d4-a716-446655440000',
        },
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      alert('Erreur: ' + e.message);
    }
  };

  return (
    <div className="p-6 space-y-5">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Mes Annonces</h2>
          <p className="text-sm text-slate-400 mt-0.5">{properties.length} annonces au total</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Recharger
          </button>
          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
          >
            <Plus size={15} />
            Nouvelle annonce
          </Link>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par titre ou ville..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 text-white text-sm rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">Toutes les transactions</option>
          <option value="sale">Vente</option>
          <option value="rent">Location</option>
          <option value="vacation_rent">Location vacances</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw size={24} className="animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto">
              <Building2 size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm mt-3">Aucune annonce trouvée</p>
            <Link
              href="/dashboard/properties/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg"
            >
              <Plus size={14} /> Créer une annonce
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Annonce', 'Type', 'Localisation', 'Prix', 'Détails', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => {
                const status = STATUS_LABELS[p.status] || { label: p.status, color: 'bg-slate-100 text-slate-600' };
                const tx = TRANSACTION_LABELS[p.transaction_type] || { label: p.transaction_type, color: 'bg-slate-100 text-slate-600' };
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Building2 size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 line-clamp-1 max-w-[220px]">{p.title}</p>
                          <p className="text-xs text-slate-400">ID: {String(p.id).slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${tx.color}`}>{tx.label}</span>
                      <p className="text-xs text-slate-400 mt-1">{TYPE_LABELS[p.property_type] || p.property_type}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700 font-medium">{p.city}</p>
                      <p className="text-xs text-slate-400">{p.district || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-blue-700">{p.price.toLocaleString('fr-MA')} MAD</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {p.area && <p>{p.area} m²</p>}
                      {p.bedrooms && <p>{p.bedrooms} chambre{p.bedrooms > 1 ? 's' : ''}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/properties/${p.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Voir l'annonce">
                          <Eye size={15} />
                        </Link>
                        <Link href={`/dashboard/properties/${p.id}`} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Modifier l'annonce">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Supprimer l'annonce">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}