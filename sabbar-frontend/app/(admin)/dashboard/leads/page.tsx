'use client';

import { useState, useEffect } from 'react';
import { Users, Phone, Mail, MapPin, Home, DollarSign, Star, RefreshCw, Search, Filter, MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  city?: string;
  property_type?: string;
  transaction_type?: string;
  budget_min?: number;
  budget_max?: number;
  bedrooms?: number;
  score?: number;
  status?: string;
  source?: string;
}

const STATUS_OPTS: Record<string, { label: string; color: string; bg: string }> = {
  new:         { label: 'Nouveau',   color: '#7c3aed', bg: 'rgba(124,58,237,0.1)'  },
  contacted:   { label: 'Contacté', color: '#d97706', bg: 'rgba(217,119,6,0.1)'   },
  in_progress: { label: 'En cours', color: '#2563eb', bg: 'rgba(37,99,235,0.1)'   },
  converted:   { label: 'Converti', color: '#16a34a', bg: 'rgba(22,163,74,0.1)'   },
  lost:        { label: 'Perdu',    color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
};

const SOURCE_LABELS: Record<string, string> = {
  contact_form: '📋 Formulaire contact',
  estimation:   '🏠 Estimation',
  intermediation: '🤝 Intermédiation',
  commercialisation: '📊 Commercialisation',
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtBudget(min?: number, max?: number) {
  const fmt = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : `${Math.round(n/1000)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} MAD`;
  if (max) return `≤ ${fmt(max)} MAD`;
  if (min) return `≥ ${fmt(min)} MAD`;
  return null;
}

function ScoreBadge({ score }: { score?: number }) {
  if (!score) return null;
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'3px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:700, fontFamily:"'DM Sans',sans-serif", background:`${color}12`, color, border:`1px solid ${color}25` }}>
      <Star size={9} style={{ fill:color }} /> {score}%
    </span>
  );
}

export default function LeadsPage() {
  const [leads, setLeads]           = useState<Lead[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected]     = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    if (!supabase) { setError('Supabase non configuré'); setLoading(false); return; }
    const { data, error: err } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Changer le statut d'un lead
  const changeStatus = async (id: string, newStatus: string) => {
    if (!supabase) return;
    setUpdatingStatus(true);
    const { error: err } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    if (!err) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (selected?.id === id) setSelected(s => s ? { ...s, status: newStatus } : null);
    }
    setUpdatingStatus(false);
  };

  // Supprimer un lead
  const deleteLead = async (id: string) => {
    if (!supabase || !confirm('Supprimer ce lead ?')) return;
    await supabase.from('leads').delete().eq('id', id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = leads.filter(l => {
    const matchSearch = !search || [l.full_name, l.email, l.city, l.subject].some(s => s?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // KPIs
  const kpis = [
    { label: 'Total leads',  value: leads.length, accent: T.gold },
    { label: 'Nouveaux',     value: leads.filter(l => !l.status || l.status === 'new').length, accent: '#7c3aed' },
    { label: 'En cours',     value: leads.filter(l => l.status === 'in_progress' || l.status === 'contacted').length, accent: '#2563eb' },
    { label: 'Convertis',    value: leads.filter(l => l.status === 'converted').length, accent: '#16a34a' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .lm-card{transition:all 0.2s ease;cursor:pointer;}
        .lm-card:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(13,31,60,0.1)!important;border-color:rgba(200,169,110,0.4)!important;}
        .lm-card.sel{border-color:#C8A96E!important;box-shadow:0 0 0 3px rgba(200,169,110,0.1)!important;}
        .lm-search:focus{border-color:rgba(200,169,110,0.5)!important;box-shadow:0 0 0 3px rgba(200,169,110,0.06)!important;outline:none;}
        .lm-st-btn{transition:all 0.15s;cursor:pointer;}
        .lm-st-btn:hover{transform:translateY(-1px);}
        ::placeholder{color:rgba(13,31,60,0.3)!important;}
      `}</style>

      <div style={{ minHeight:'100%', background:T.ivory, padding:'32px 36px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'4px 12px', borderRadius:'100px', background:'rgba(200,169,110,0.1)', border:`1px solid ${T.border}`, marginBottom:'10px' }}>
              <Users size={11} style={{ color:T.gold }} />
              <span style={{ fontSize:'10px', fontWeight:500, letterSpacing:'0.15em', textTransform:'uppercase', color:T.gold }}>Prospects qualifiés</span>
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'32px', fontWeight:300, color:T.navy, margin:'0 0 4px', lineHeight:1.1 }}>
              Mes <span style={{ color:T.gold, fontStyle:'italic' }}>Clients</span>
            </h1>
            <p style={{ fontSize:'13px', color:T.muted, margin:0 }}>{leads.length} lead{leads.length !== 1 ? 's' : ''} depuis Supabase</p>
          </div>
          <button onClick={load} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'10px 18px', background:'#16a34a', color:'#fff', fontSize:'13px', fontWeight:600, borderRadius:'10px', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
            <RefreshCw size={14} style={{ animation:loading ? 'spin 1s linear infinite' : 'none' }} /> Actualiser
          </button>
        </div>

        {/* Erreur Supabase */}
        {!supabase && (
          <div style={{ padding:'16px 20px', background:'rgba(181,87,58,0.08)', border:`1px solid rgba(181,87,58,0.25)`, borderRadius:'12px', color:T.terra, fontSize:'13px', marginBottom:'20px', fontFamily:"'DM Sans',sans-serif" }}>
            ⚠️ Supabase non configuré — ajoutez <code>NEXT_PUBLIC_SUPABASE_URL</code> et <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans Vercel → Settings → Environment Variables
          </div>
        )}
        {error && (
          <div style={{ padding:'14px 18px', background:'rgba(181,87,58,0.08)', border:`1px solid rgba(181,87,58,0.25)`, borderRadius:'10px', color:T.terra, fontSize:'13px', marginBottom:'20px' }}>
            ❌ {error}
          </div>
        )}

        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'24px' }}>
          {kpis.map(k => (
            <div key={k.label} style={{ background:'#fff', borderRadius:'14px', padding:'18px 20px', border:`1px solid ${T.borderSoft}`, boxShadow:'0 2px 8px rgba(13,31,60,0.04)' }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:T.muted, marginBottom:'8px' }}>{k.label}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'36px', fontWeight:300, color:k.accent, lineHeight:1 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:'240px', maxWidth:'380px' }}>
            <Search size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:T.muted, pointerEvents:'none' }} />
            <input type="text" placeholder="Rechercher par nom, email, ville, sujet..." value={search} onChange={e => setSearch(e.target.value)} className="lm-search"
              style={{ width:'100%', padding:'10px 14px 10px 36px', background:'#fff', color:T.navy, border:`1px solid ${T.borderSoft}`, borderRadius:'10px', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' }} />
          </div>
          <div style={{ position:'relative' }}>
            <Filter size={13} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:T.muted, pointerEvents:'none' }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding:'10px 28px 10px 32px', background:'#fff', color:T.navy, border:`1px solid ${T.borderSoft}`, borderRadius:'10px', fontSize:'13px', outline:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", appearance:'none' }}>
              <option value="all">Tous les statuts</option>
              <option value="new">Nouveaux</option>
              <option value="contacted">Contactés</option>
              <option value="in_progress">En cours</option>
              <option value="converted">Convertis</option>
              <option value="lost">Perdus</option>
            </select>
          </div>
          <span style={{ fontSize:'12px', color:T.muted, marginLeft:'auto' }}>{sorted.length} résultat{sorted.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Contenu */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'80px' }}>
            <RefreshCw size={28} style={{ color:T.gold, margin:'0 auto 14px', display:'block', animation:'spin 1s linear infinite' }} />
            <p style={{ color:T.muted, fontFamily:"'DM Sans',sans-serif" }}>Chargement depuis Supabase...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 40px', background:'#fff', borderRadius:'16px', border:`1px solid ${T.borderSoft}` }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'14px', background:'rgba(200,169,110,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Users size={24} style={{ color:T.gold }} />
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'20px', color:T.navy, marginBottom:'8px' }}>
              {supabase ? 'Aucun lead pour le moment' : 'Supabase non configuré'}
            </p>
            <p style={{ fontSize:'13px', color:T.muted }}>
              {supabase ? 'Les leads apparaîtront ici dès qu\'un client remplira le formulaire de contact' : 'Configurez Supabase pour voir vos leads'}
            </p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 380px' : 'repeat(auto-fill, minmax(320px, 1fr))', gap:'16px' }}>

            {/* ── Grille de leads ── */}
            <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap:'14px' }}>
              {sorted.map(lead => {
                const st = STATUS_OPTS[lead.status || 'new'] || STATUS_OPTS.new;
                const isSel = selected?.id === lead.id;
                return (
                  <div key={lead.id} onClick={() => setSelected(isSel ? null : lead)} className={`lm-card${isSel ? ' sel' : ''}`}
                    style={{ background:'#fff', borderRadius:'14px', border:`1px solid ${T.borderSoft}`, padding:'18px', boxShadow:'0 2px 8px rgba(13,31,60,0.04)' }}>
                    {/* Top */}
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'12px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'11px' }}>
                        <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:`linear-gradient(135deg,${T.navy},#1e3a5f)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:T.goldLight, fontFamily:"'Cormorant Garamond',serif", fontSize:'16px' }}>
                          {lead.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:600, color:T.navy }}>{lead.full_name}</div>
                          {lead.email && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:T.muted }}>{lead.email}</div>}
                        </div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'5px' }}>
                        <ScoreBadge score={lead.score} />
                        <span style={{ padding:'2px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:st.bg, color:st.color }}>{st.label}</span>
                      </div>
                    </div>

                    {/* Infos */}
                    <div style={{ display:'flex', flexDirection:'column', gap:'5px', marginBottom:'12px' }}>
                      {lead.subject && <div style={{ fontSize:'12px', color:T.navy, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>{lead.subject}</div>}
                      {lead.city && <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:T.muted, fontFamily:"'DM Sans',sans-serif" }}><MapPin size={11} style={{ color:T.gold }} />{lead.city}</div>}
                      {fmtBudget(lead.budget_min, lead.budget_max) && <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:T.muted, fontFamily:"'DM Sans',sans-serif" }}><DollarSign size={11} style={{ color:T.gold }} />{fmtBudget(lead.budget_min, lead.budget_max)}</div>}
                    </div>

                    {/* Footer */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:`1px solid ${T.borderSoft}`, paddingTop:'10px' }}>
                      <span style={{ fontSize:'10px', color:T.muted, fontFamily:"'DM Sans',sans-serif" }}>{fmtDate(lead.created_at)}</span>
                      <div style={{ display:'flex', gap:'6px' }}>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
                            style={{ padding:'5px 9px', borderRadius:'7px', background:'rgba(22,163,74,0.1)', color:'#16a34a', fontSize:'11px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'3px' }}>
                            <Phone size={10} /> Appeler
                          </a>
                        )}
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()}
                            style={{ padding:'5px 9px', borderRadius:'7px', background:'rgba(200,169,110,0.1)', color:T.gold, fontSize:'11px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'3px' }}>
                            <Mail size={10} /> Email
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Panneau détail ── */}
            {selected && (
              <div style={{ background:'#fff', borderRadius:'16px', border:`1px solid ${T.border}`, overflow:'hidden', boxShadow:'0 4px 24px rgba(13,31,60,0.1)', position:'sticky', top:'24px', alignSelf:'start', maxHeight:'calc(100vh - 160px)', overflowY:'auto' }}>
                {/* Header navy */}
                <div style={{ padding:'22px', background:T.navy, position:'relative' }}>
                  <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'120px', height:'120px', borderRadius:'50%', background:'radial-gradient(circle,rgba(200,169,110,0.15) 0%,transparent 70%)', pointerEvents:'none' }} />
                  <button onClick={() => setSelected(null)} style={{ position:'absolute', top:'12px', right:'12px', width:'24px', height:'24px', borderRadius:'50%', background:'rgba(249,245,239,0.1)', border:'none', color:T.goldLight, cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
                  <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'10px', fontFamily:"'Cormorant Garamond',serif", fontSize:'20px', color:T.navy }}>
                    {selected.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'19px', fontWeight:300, color:'#F9F5EF' }}>{selected.full_name}</div>
                  {selected.email && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(226,201,138,0.5)', marginTop:'2px' }}>{selected.email}</div>}
                  {selected.source && <div style={{ marginTop:'8px', fontSize:'10px', color:'rgba(226,201,138,0.4)', fontFamily:"'DM Sans',sans-serif" }}>{SOURCE_LABELS[selected.source] || selected.source}</div>}
                </div>

                <div style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:'14px' }}>
                  {/* Score */}
                  {selected.score && selected.score > 0 && (() => {
                    const c = selected.score >= 80 ? '#16a34a' : selected.score >= 60 ? '#d97706' : '#dc2626';
                    return (
                      <div>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                          <span style={{ fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:T.muted }}>Score qualification</span>
                          <span style={{ fontSize:'12px', fontWeight:700, color:c, fontFamily:"'DM Sans',sans-serif" }}>{selected.score}%</span>
                        </div>
                        <div style={{ height:'5px', borderRadius:'3px', background:T.borderSoft, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${selected.score}%`, background:`linear-gradient(90deg,${c},${c}99)`, borderRadius:'3px' }} />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Coordonnées */}
                  <div style={{ background:T.ivory, borderRadius:'10px', padding:'12px 14px' }}>
                    <div style={{ fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:T.muted, marginBottom:'8px' }}>Coordonnées</div>
                    {selected.phone && <a href={`tel:${selected.phone}`} style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'6px', color:'#16a34a', textDecoration:'none', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}><Phone size={13} />{selected.phone}</a>}
                    {selected.email && <a href={`mailto:${selected.email}`} style={{ display:'flex', alignItems:'center', gap:'7px', color:T.gold, textDecoration:'none', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}><Mail size={13} />{selected.email}</a>}
                    {!selected.phone && !selected.email && <span style={{ fontSize:'12px', color:T.muted }}>Non renseignées</span>}
                  </div>

                  {/* Sujet + message */}
                  {(selected.subject || selected.message) && (
                    <div style={{ background:T.ivory, borderRadius:'10px', padding:'12px 14px' }}>
                      <div style={{ fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:T.muted, marginBottom:'8px' }}>Demande</div>
                      {selected.subject && <div style={{ fontSize:'13px', fontWeight:600, color:T.navy, fontFamily:"'DM Sans',sans-serif", marginBottom:'6px' }}>{selected.subject}</div>}
                      {selected.message && <p style={{ fontSize:'12px', color:T.muted, lineHeight:1.6, margin:0, fontFamily:"'DM Sans',sans-serif" }}>{selected.message}</p>}
                    </div>
                  )}

                  {/* Date */}
                  <div style={{ fontSize:'11px', color:T.muted, fontFamily:"'DM Sans',sans-serif", textAlign:'center' }}>
                    Reçu le {fmtDate(selected.created_at)}
                  </div>

                  {/* Changer statut */}
                  <div>
                    <div style={{ fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:T.muted, marginBottom:'8px' }}>Changer le statut</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                      {Object.entries(STATUS_OPTS).map(([val, st]) => (
                        <button key={val} onClick={() => changeStatus(selected.id, val)} className="lm-st-btn" disabled={updatingStatus}
                          style={{ padding:'6px 12px', borderRadius:'999px', fontSize:'11px', fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:updatingStatus ? 'not-allowed' : 'pointer', border:`2px solid ${st.color}`, background:selected.status === val ? st.color : 'transparent', color:selected.status === val ? '#fff' : st.color, opacity:updatingStatus ? 0.6 : 1 }}>
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                    {selected.email && (
                      <a href={`mailto:${selected.email}?subject=Suite à votre demande — LANDMARK ESTATE`}
                        style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'12px', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, color:T.navy, fontSize:'13px', fontWeight:600, borderRadius:'10px', textDecoration:'none', fontFamily:"'DM Sans',sans-serif" }}>
                        <Mail size={14} /> Envoyer un email
                      </a>
                    )}
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`}
                        style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'11px', background:'rgba(22,163,74,0.1)', color:'#16a34a', fontSize:'13px', fontWeight:600, borderRadius:'10px', textDecoration:'none', fontFamily:"'DM Sans',sans-serif", border:'1px solid rgba(22,163,74,0.25)' }}>
                        <Phone size={14} /> Appeler
                      </a>
                    )}
                    <button onClick={() => deleteLead(selected.id)}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'10px', background:'rgba(181,87,58,0.08)', color:T.terra, fontSize:'12px', fontWeight:500, borderRadius:'10px', border:`1px solid rgba(181,87,58,0.2)`, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                      <Trash2 size={13} /> Supprimer ce lead
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}