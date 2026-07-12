'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, X, RefreshCw, ArrowLeft, Lock, Save, AlertTriangle, Tag } from 'lucide-react';
import Link from 'next/link';

const T = {
  navy: '#0D1F3C', gold: '#C8A96E', goldLight: '#E2C98A',
  terra: '#B5573A', ivory: '#F9F5EF', muted: 'rgba(13,31,60,0.45)',
  border: 'rgba(200,169,110,0.18)', borderSoft: 'rgba(13,31,60,0.08)',
};

const COLOR_PRESETS = ['#C8A96E', '#2563eb', '#16a34a', '#B5573A', '#7c3aed', '#0891b2', '#d97706', '#db2777'];

interface LeadType {
  id: string; name: string; slug: string; color: string;
  is_system: boolean; sort_order: number;
}

const card: React.CSSProperties = {
  background: '#fff', borderRadius: '12px',
  border: `1px solid ${T.borderSoft}`, boxShadow: '0 1px 4px rgba(13,31,60,0.04)',
};
const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: `1px solid ${T.borderSoft}`, fontSize: '13px',
  fontFamily: "'DM Sans',sans-serif", color: T.navy,
  background: '#fff', boxSizing: 'border-box', outline: 'none',
};
const lbl: React.CSSProperties = {
  fontSize: '11px', color: T.muted, textTransform: 'uppercase',
  display: 'block', marginBottom: '5px', letterSpacing: '0.05em',
  fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
};

// Transforme "Investisseur VIP" → "investisseur-vip"
function slugify(s: string) {
  return s.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function LeadTypesPage() {
  const [types, setTypes]     = useState<LeadType[]>([]);
  const [counts, setCounts]   = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ name: '', color: COLOR_PRESETS[0] });
  const [creating, setCreating] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const [t, l] = await Promise.all([
      supabase.from('lead_types').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
      supabase.from('leads').select('lead_type'),
    ]);
    setTypes(t.data || []);
    // Compter les leads par type
    const c: Record<string, number> = {};
    (l.data || []).forEach((row: any) => {
      const k = row.lead_type || '—';
      c[k] = (c[k] || 0) + 1;
    });
    setCounts(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createType = async () => {
    if (!supabase || !form.name.trim()) return;
    const slug = slugify(form.name);
    if (!slug) { alert('Nom invalide.'); return; }
    if (types.find(t => t.slug === slug)) { alert('Ce type existe déjà.'); return; }
    setCreating(true);
    const nextOrder = Math.max(0, ...types.map(t => t.sort_order || 0)) + 1;
    const { data, error } = await supabase.from('lead_types').insert({
      name: form.name.trim(), slug, color: form.color, is_system: false, sort_order: nextOrder,
    }).select().single();
    if (error) {
      alert('Erreur lors de la création : ' + error.message);
    } else if (data) {
      setTypes(prev => [...prev, data]);
      setForm({ name: '', color: COLOR_PRESETS[0] });
      setShowForm(false);
    }
    setCreating(false);
  };

  const deleteType = async (t: LeadType) => {
    if (!supabase) return;
    const used = counts[t.slug] || 0;
    if (used > 0) {
      alert(`Impossible de supprimer « ${t.name} » : ${used} lead(s) utilisent encore ce type. Réaffecte-les d'abord.`);
      setDeleteConfirm(null);
      return;
    }
    const { error } = await supabase.from('lead_types').delete().eq('id', t.id);
    if (error) {
      alert('Erreur lors de la suppression : ' + error.message);
    } else {
      setTypes(prev => prev.filter(x => x.id !== t.id));
      setDeleteConfirm(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        input:focus,select:focus{border-color:rgba(200,169,110,.5)!important;outline:none!important;}
      `}</style>

      <div style={{ minHeight: '100%', background: T.ivory, padding: '28px 32px', fontFamily: "'DM Sans',system-ui,sans-serif" }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <Link href="/dashboard/leads" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: T.muted, textDecoration: 'none', fontSize: '13px', marginBottom: '8px' }}>
              <ArrowLeft size={13} /> Retour aux leads
            </Link>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '32px', fontWeight: 300, color: T.navy, margin: 0 }}>
              Types de <span style={{ color: T.gold, fontStyle: 'italic' }}>leads</span>
            </h1>
            <p style={{ fontSize: '12px', color: T.muted, marginTop: '4px' }}>{types.length} catégorie{types.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: `linear-gradient(135deg,${T.gold},${T.goldLight})`, color: T.navy, fontSize: '13px', fontWeight: 600, borderRadius: '9px', border: 'none', cursor: 'pointer' }}>
              <Plus size={14} /> Nouveau type
            </button>
            <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#16a34a', color: '#fff', fontSize: '13px', fontWeight: 500, borderRadius: '9px', border: 'none', cursor: 'pointer' }}>
              <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Actualiser
            </button>
          </div>
        </div>

        {/* Formulaire création */}
        {showForm && (
          <div style={{ ...card, padding: '20px', marginBottom: '20px', maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nouveau type de lead</div>
              <button onClick={() => setShowForm(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: T.muted }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lbl}>Nom du type *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Investisseur, Locataire..." style={inp} />
                {form.name.trim() && <div style={{ fontSize: '11px', color: T.muted, marginTop: '5px' }}>Identifiant : <code style={{ color: T.gold }}>{slugify(form.name) || '—'}</code></div>}
              </div>
              <div>
                <label style={lbl}>Couleur</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {COLOR_PRESETS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, cursor: 'pointer', border: form.color === c ? `3px solid ${T.navy}` : '2px solid #fff', boxShadow: '0 0 0 1px rgba(13,31,60,0.1)' }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={createType} disabled={creating || !form.name.trim()} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: `linear-gradient(135deg,${T.gold},${T.goldLight})`, color: T.navy, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: (!form.name.trim() || creating) ? 0.6 : 1 }}>
                  <Save size={13} /> {creating ? 'Création...' : 'Créer le type'}
                </button>
                <button onClick={() => setShowForm(false)} style={{ padding: '10px 18px', background: 'transparent', border: `1px solid ${T.borderSoft}`, borderRadius: '8px', cursor: 'pointer', color: T.muted }}>Annuler</button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des types */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '760px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: T.muted }}>
              <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 8px' }} /> Chargement...
            </div>
          ) : types.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: T.muted, fontSize: '13px' }}>Aucun type. Lance le SQL puis crée ton premier type.</div>
          ) : types.map(t => {
            const used = counts[t.slug] || 0;
            const isConfirm = deleteConfirm === t.id;
            return (
              <div key={t.id} style={{ ...card, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: T.navy }}>{t.name}</span>
                        {t.is_system && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 7px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: 'rgba(13,31,60,0.06)', color: T.muted }}>
                            <Lock size={9} /> Système
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: T.muted, marginTop: '2px' }}>
                        <code style={{ color: T.gold }}>{t.slug}</code> · {used} lead{used !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {!t.is_system && (
                    isConfirm ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                        <button onClick={() => deleteType(t)} style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Confirmer</button>
                        <button onClick={() => setDeleteConfirm(null)} style={{ padding: '6px 12px', background: 'transparent', border: `1px solid ${T.borderSoft}`, borderRadius: '7px', fontSize: '12px', color: T.muted, cursor: 'pointer' }}>Annuler</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(t.id)} title="Supprimer ce type"
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '7px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                        <Trash2 size={12} /> Supprimer
                      </button>
                    )
                  )}
                </div>

                {/* Avertissement si utilisé */}
                {isConfirm && used > 0 && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '12px', padding: '10px 12px', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>
                    <AlertTriangle size={14} style={{ color: '#d97706', flexShrink: 0, marginTop: '1px' }} />
                    <span>{used} lead(s) utilisent ce type. La suppression sera bloquée tant qu'ils ne sont pas réaffectés.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
