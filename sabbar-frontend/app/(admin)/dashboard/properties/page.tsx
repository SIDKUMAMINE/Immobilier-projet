'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, RefreshCw, Eye, Pencil, Trash2,
  Search, Building2, AlertCircle, Pin, PinOff
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { supabase } from '@/lib/supabase';

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
  is_pinned?: boolean;
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
  const [pinning, setPinning] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { setError('Authentification requise'); return; }

      const res = await fetch(`${API_BASE_URL}/api/v1/properties?limit=50`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const list: Property[] = Array.isArray(data) ? data : data.data || [];

      if (!supabase) {
        // ✅ Fallback sans is_pinned si Supabase non configuré
        setProperties(list);
        return;
      }

      const { data: pinData } = await supabase
        .from('properties')
        .select('id, is_pinned');

      const pinMap: Record<string, boolean> = {};
      (pinData || []).forEach((p: any) => { pinMap[p.id] = p.is_pinned; });

      const merged = list.map(p => ({ ...p, is_pinned: pinMap[p.id] ?? false }));
      setProperties(merged);
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    setPinning(id);
    try {
      if (!supabase) {
        // ✅ Message clair avec instructions
        alert(
          '⚠️ Supabase non configuré sur Vercel.\n\n' +
          'Pour activer l\'épinglage :\n' +
          '1. Allez sur Vercel → Settings → Environment Variables\n' +
          '2. Ajoutez NEXT_PUBLIC_SUPABASE_URL\n' +
          '3. Ajoutez NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
          '4. Redéployez le projet'
        );
        return;
      }

      const { error } = await supabase
        .from('properties')
        .update({ is_pinned: !currentPinned })
        .eq('id', id);

      if (error) throw error;

      setProperties(prev =>
        prev.map(p => p.id === id ? { ...p, is_pinned: !currentPinned } : p)
      );
    } catch (e: any) {
      alert('Erreur épinglage: ' + e.message);
    } finally {
      setPinning(null);
    }
  };

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

  const filtered = properties.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.transaction_type === filter;
    return matchSearch && matchFilter;
  });

  const sorted = [...filtered].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));

  return (
    <div className="p-6 space-y-5">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {/* ✅ Bannière warning si Supabase non configuré */}
      {!supabase && (
        <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertCircle size={14} className="text-orange-500 shrink-0" />
          <span className="text-xs text-orange-700">
            <strong>Épinglage désactivé</strong> — Ajoutez{' '}
            <code className="bg-orange-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> et{' '}
            <code className="bg-orange-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{' '}
            dans Vercel → Settings → Environment Variables puis redéployez.
          </span>
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
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Recharger
          </button>
          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
          >
            <Plus size={15} /> Nouvelle annonce
          </Link>
        </div>
      </div>

      {supabase && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <Pin size={13} className="text-amber-500 shrink-0" />
          <span className="text-xs text-amber-700">
            Les biens épinglés apparaissent en priorité sur la page d'accueil et la page des biens
          </span>
        </div>
      )}

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
        ) : sorted.length === 0 ? (
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
                {['Annonce', 'Type', 'Localisation', 'Prix', 'Détails', 'Statut', 'Épinglé', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sorted.map((p) => {
                const status = STATUS_LABELS[p.status] || { label: p.status, color: 'bg-slate-100 text-slate-600' };
                const tx = TRANSACTION_LABELS[p.transaction_type] || { label: p.transaction_type, color: 'bg-slate-100 text-slate-600' };
                return (
                  <tr key={p.id} className={`hover:bg-slate-50 transition ${p.is_pinned ? 'bg-amber-50/40' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Building2 size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            {p.is_pinned && <Pin size={12} className="text-amber-500 shrink-0" />}
                            <p className="text-sm font-medium text-slate-800 line-clamp-1 max-w-[200px]">{p.title}</p>
                          </div>
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

                    {/* ✅ COLONNE ÉPINGLÉ */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePin(p.id, !!p.is_pinned)}
                        disabled={pinning === p.id}
                        title={p.is_pinned ? 'Désépingler' : "Épingler sur la page d'accueil"}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                          p.is_pinned
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                        } ${pinning === p.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {pinning === p.id ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : p.is_pinned ? (
                          <><PinOff size={13} /> Épinglé</>
                        ) : (
                          <><Pin size={13} /> Épingler</>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/properties/${p.id}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          href={`/dashboard/properties/${p.id}`}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
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