'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, RefreshCw, Eye, Pencil, Trash2,
  Search, Building2, AlertCircle, Pin, PinOff, Filter
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { supabase } from '@/lib/supabase';

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

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  available:      { label: 'Disponible',     color: '#16a34a', bg: '#16a34a12', border: '#16a34a30' },
  sold:           { label: 'Vendu',          color: '#dc2626', bg: '#dc262612', border: '#dc262630' },
  rented:         { label: 'Loué / Occupé',  color: '#2563eb', bg: '#2563eb12', border: '#2563eb30' },
  reserved:       { label: 'Réservé',        color: '#d97706', bg: '#d9770612', border: '#d9770630' },
  under_offer:    { label: 'Sous offre',     color: '#7c3aed', bg: '#7c3aed12', border: '#7c3aed30' },
  under_contract: { label: 'Sous compromis', color: '#db2777', bg: '#db277712', border: '#db277730' },
  unavailable:    { label: 'Non disponible', color: '#6b7280', bg: '#6b728012', border: '#6b728030' },
  pending:        { label: 'En attente',     color: '#d97706', bg: '#d9770612', border: '#d9770630' },
};

const TX_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  sale:          { label: 'Vente',    color: T.gold,    bg: 'rgba(200,169,110,0.12)' },
  rent:          { label: 'Location', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)'  },
  vacation_rent: { label: 'Vacances', color: T.terra,   bg: 'rgba(181,87,58,0.1)'   },
};

const TYPE_LABELS: Record<string, string> = {
  apartment:'Appartement', villa:'Villa', house:'Maison',
  riad:'Riad', land:'Terrain', office:'Bureau', commercial:'Commercial',
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('all');
  const [pinning, setPinning]       = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { setError('Authentification requise'); return; }
      const res = await fetch(`${API_BASE_URL}/api/v1/properties?limit=100`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      const list: Property[] = Array.isArray(data) ? data : data.data || [];
      if (!supabase) { setProperties(list); return; }
      const { data: pinData } = await supabase.from('properties').select('id, is_pinned');
      const pinMap: Record<string, boolean> = {};
      (pinData || []).forEach((p: any) => { pinMap[p.id] = p.is_pinned; });
      setProperties(list.map(p => ({ ...p, is_pinned: pinMap[p.id] ?? false })));
    } catch (e: any) {
      setError(e.message || 'Erreur chargement');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    setPinning(id);
    try {
      if (!supabase) { alert('Supabase non configuré'); return; }
      const { error } = await supabase.from('properties').update({ is_pinned: !currentPinned }).eq('id', id);
      if (error) throw error;
      setProperties(prev => prev.map(p => p.id === id ? { ...p, is_pinned: !currentPinned } : p));
    } catch (e: any) { alert('Erreur épinglage: ' + e.message); }
    finally { setPinning(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette annonce définitivement ?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/v1/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'X-Agent-ID': '550e8400-e29b-41d4-a716-446655440000' },
      });
      if (!res.ok) throw new Error('Erreur suppression');
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (e: any) { alert('Erreur: ' + e.message); }
  };

  const filtered = properties.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.transaction_type === filter;
    return matchSearch && matchFilter;
  });

  const sorted = [...filtered].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
  const pinnedCount = sorted.filter(p => p.is_pinned).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        .lm-row { transition: background 0.15s ease; }
        .lm-row:hover { background: rgba(200,169,110,0.04) !important; }
        .lm-row.pinned { background: rgba(200,169,110,0.05); }
        .lm-row.pinned:hover { background: rgba(200,169,110,0.09) !important; }
        .lm-btn:hover { opacity: 0.8; }
        .lm-action:hover { background: rgba(200,169,110,0.1) !important; color: #C8A96E !important; }
        .lm-action-del:hover { background: rgba(181,87,58,0.1) !important; color: #B5573A !important; }
        .lm-reload:hover { background: rgba(22,163,74,0.9) !important; }
        .lm-newbtn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,169,110,0.3) !important; }
        .lm-pin-on:hover  { background: rgba(200,169,110,0.2) !important; }
        .lm-pin-off:hover { background: rgba(200,169,110,0.12) !important; color: #C8A96E !important; }
        .lm-search:focus  { border-color: rgba(200,169,110,0.5) !important; box-shadow: 0 0 0 3px rgba(200,169,110,0.06) !important; }
        thead tr th { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(13,31,60,0.4); padding: 14px 16px; text-align: left; background: #faf7f3; border-bottom: 1px solid rgba(13,31,60,0.07); }
      `}</style>

      <div style={{ minHeight: '100%', background: T.ivory, padding: '32px 36px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(200,169,110,0.1)', border: `1px solid ${T.border}`, marginBottom: '10px' }}>
              <Building2 size={11} style={{ color: T.gold }} />
              <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.gold }}>Gestion des annonces</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 300, color: T.navy, margin: '0 0 4px', lineHeight: 1.1 }}>
              Mes <span style={{ color: T.gold, fontStyle: 'italic' }}>Annonces</span>
            </h1>
            <p style={{ fontSize: '13px', color: T.muted, margin: 0 }}>
              {properties.length} annonces au total
              {pinnedCount > 0 && <span style={{ marginLeft: '8px', color: T.gold, fontWeight: 500 }}>· {pinnedCount} épinglée{pinnedCount > 1 ? 's' : ''}</span>}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', background: '#16a34a', color: '#fff', fontSize: '13px', fontWeight: 600, borderRadius: '10px', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', fontFamily: "'DM Sans', sans-serif" }} className="lm-reload">
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Recharger
            </button>
            <Link href="/dashboard/properties/new" className="lm-newbtn" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, fontSize: '13px', fontWeight: 600, borderRadius: '10px', textDecoration: 'none', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 2px 12px rgba(200,169,110,0.2)', letterSpacing: '0.02em' }}>
              <Plus size={15} /> Nouvelle annonce
            </Link>
          </div>
        </div>

        {/* ── Erreur ── */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(181,87,58,0.08)', border: `1px solid rgba(181,87,58,0.25)`, borderRadius: '10px', color: T.terra, fontSize: '13px', marginBottom: '20px' }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}

        {/* ── Bannière épinglage ── */}
        {supabase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(200,169,110,0.07)', border: `1px solid ${T.border}`, borderRadius: '10px', marginBottom: '20px' }}>
            <Pin size={13} style={{ color: T.gold, flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: T.muted }}>
              Les biens épinglés apparaissent en priorité sur la page d'accueil et la page des biens
            </span>
          </div>
        )}

        {/* ── Filtres ── */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.muted, pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Rechercher par titre ou ville..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="lm-search"
              style={{ width: '100%', padding: '10px 14px 10px 36px', background: '#fff', color: T.navy, border: `1px solid ${T.borderSoft}`, borderRadius: '10px', fontSize: '13px', outline: 'none', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }}
            />
          </div>
          {/* Filter */}
          <div style={{ position: 'relative' }}>
            <Filter size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.muted, pointerEvents: 'none' }} />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ padding: '10px 16px 10px 32px', background: '#fff', color: T.navy, border: `1px solid ${T.borderSoft}`, borderRadius: '10px', fontSize: '13px', outline: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", appearance: 'none', paddingRight: '32px' }}
            >
              <option value="all">Toutes les transactions</option>
              <option value="sale">Vente</option>
              <option value="rent">Location</option>
              <option value="vacation_rent">Location vacances</option>
            </select>
          </div>
          {/* Count */}
          <span style={{ fontSize: '12px', color: T.muted, marginLeft: 'auto', fontFamily: "'DM Sans', sans-serif" }}>
            {sorted.length} résultat{sorted.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Table ── */}
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${T.borderSoft}`, overflow: 'hidden', boxShadow: '0 2px 16px rgba(13,31,60,0.05)' }}>
          {loading ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <RefreshCw size={24} style={{ color: T.gold, margin: '0 auto 12px', display: 'block', animation: 'spin 1s linear infinite' }} />
              <p style={{ color: T.muted, fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>Chargement des annonces...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `rgba(200,169,110,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Building2 size={24} style={{ color: T.gold }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 400, color: T.navy, marginBottom: '8px' }}>Aucune annonce trouvée</p>
              <p style={{ fontSize: '13px', color: T.muted, marginBottom: '20px', fontFamily: "'DM Sans', sans-serif" }}>Créez votre première annonce pour commencer</p>
              <Link href="/dashboard/properties/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, fontSize: '13px', fontWeight: 600, borderRadius: '10px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                <Plus size={14} /> Créer une annonce
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Annonce', 'Type', 'Localisation', 'Prix', 'Détails', 'Statut', 'Épinglé', 'Actions'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p, idx) => {
                    const st = STATUS_STYLES[p.status] || { label: p.status, color: '#6b7280', bg: '#6b728012', border: '#6b728030' };
                    const tx = TX_STYLES[p.transaction_type] || { label: p.transaction_type, color: T.muted, bg: 'rgba(13,31,60,0.06)' };
                    const isPinned = !!p.is_pinned;
                    return (
                      <tr key={p.id} className={`lm-row${isPinned ? ' pinned' : ''}`}
                        style={{ borderBottom: idx < sorted.length - 1 ? `1px solid ${T.borderSoft}` : 'none' }}>

                        {/* Annonce */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isPinned ? 'rgba(200,169,110,0.15)' : 'rgba(13,31,60,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: isPinned ? `1px solid ${T.border}` : 'none' }}>
                              <Building2 size={16} style={{ color: isPinned ? T.gold : T.muted }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {isPinned && <Pin size={11} style={{ color: T.gold, flexShrink: 0 }} />}
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: T.navy, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{p.title}</span>
                              </div>
                              <span style={{ fontSize: '11px', color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>ID: {String(p.id).slice(0, 8)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", background: tx.bg, color: tx.color }}>{tx.label}</span>
                          <div style={{ fontSize: '11px', color: T.muted, marginTop: '3px', fontFamily: "'DM Sans', sans-serif" }}>{TYPE_LABELS[p.property_type] || p.property_type}</div>
                        </td>

                        {/* Localisation */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: T.navy }}>{p.city}</div>
                          <div style={{ fontSize: '11px', color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>{p.district || '—'}</div>
                        </td>

                        {/* Prix */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: 400, color: T.navy }}>{p.price.toLocaleString('fr-MA')}</div>
                          <div style={{ fontSize: '10px', color: T.gold, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: '0.05em' }}>MAD</div>
                        </td>

                        {/* Détails */}
                        <td style={{ padding: '14px 16px' }}>
                          {p.area    && <div style={{ fontSize: '12px', color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>{p.area} m²</div>}
                          {p.bedrooms && <div style={{ fontSize: '12px', color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>{p.bedrooms} ch.</div>}
                          {!p.area && !p.bedrooms && <span style={{ fontSize: '12px', color: 'rgba(13,31,60,0.2)' }}>—</span>}
                        </td>

                        {/* Statut */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
                        </td>

                        {/* Épinglé */}
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => handleTogglePin(p.id, isPinned)}
                            disabled={pinning === p.id}
                            className={isPinned ? 'lm-pin-on' : 'lm-pin-off'}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: pinning === p.id ? 'not-allowed' : 'pointer', opacity: pinning === p.id ? 0.5 : 1, transition: 'all 0.2s', border: 'none', background: isPinned ? 'rgba(200,169,110,0.15)' : 'rgba(13,31,60,0.05)', color: isPinned ? T.gold : T.muted }}
                          >
                            {pinning === p.id
                              ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                              : isPinned
                                ? <><PinOff size={12} /> Épinglé</>
                                : <><Pin size={12} /> Épingler</>
                            }
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Link href={`/dashboard/properties/${p.id}`} className="lm-action"
                              style={{ padding: '7px', borderRadius: '8px', color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', background: 'transparent' }}
                              title="Voir">
                              <Eye size={15} />
                            </Link>
                            <Link href={`/dashboard/properties/${p.id}`} className="lm-action"
                              style={{ padding: '7px', borderRadius: '8px', color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', background: 'transparent' }}
                              title="Modifier">
                              <Pencil size={15} />
                            </Link>
                            <button onClick={() => handleDelete(p.id)} className="lm-action-del"
                              style={{ padding: '7px', borderRadius: '8px', color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', background: 'transparent', border: 'none', cursor: 'pointer' }}
                              title="Supprimer">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {sorted.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
              {sorted.length} annonce{sorted.length > 1 ? 's' : ''} affichée{sorted.length > 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(200,169,110,0.4)', fontFamily: "'DM Sans', sans-serif" }}>
              LANDMARK ESTATE · Gestion Annonces
            </span>
          </div>
        )}

        <style>{`
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        `}</style>
      </div>
    </>
  );
}