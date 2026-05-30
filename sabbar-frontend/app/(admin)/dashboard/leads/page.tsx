'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Users, Phone, Mail, MapPin, DollarSign, Star,
  RefreshCw, Search, Filter, Trash2, Bell, BellOff,
Home, Handshake, BarChart3, ShoppingCart, Tag, FileText,
  Zap, CheckCircle2, Clock
} from 'lucide-react';
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

const SOURCE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  estimation:        { label: 'Estimation',        color: '#7c3aed', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.2)',  icon: '🏠' },
  intermediation:    { label: 'Intermédiation',    color: T.gold,    bg: 'rgba(200,169,110,0.08)', border: 'rgba(200,169,110,0.25)',icon: '🤝' },
  commercialisation: { label: 'Commercialisation', color: T.terra,   bg: 'rgba(181,87,58,0.08)',  border: 'rgba(181,87,58,0.2)',   icon: '📊' },
  contact_form:      { label: 'Contact',           color: '#2563eb', bg: 'rgba(37,99,235,0.08)',   border: 'rgba(37,99,235,0.2)',   icon: '✉️' },
  whatsapp:          { label: 'WhatsApp',          color: '#25D366', bg: 'rgba(37,211,102,0.08)',  border: 'rgba(37,211,102,0.2)',  icon: '💬' },
  email:             { label: 'Email direct',      color: '#6b7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)', icon: '📧' },
  achat:             { label: 'Achat',             color: '#16a34a', bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.2)',   icon: '🛒' },
  vente:             { label: 'Vente',             color: '#d97706', bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.2)',   icon: '💰' },
};

const STATUS_OPTS: Record<string, { label: string; color: string; bg: string }> = {
  new:         { label: 'Nouveau',   color: '#7c3aed', bg: 'rgba(124,58,237,0.1)'  },
  contacted:   { label: 'Contacté', color: '#d97706', bg: 'rgba(217,119,6,0.1)'   },
  in_progress: { label: 'En cours', color: '#2563eb', bg: 'rgba(37,99,235,0.1)'   },
  converted:   { label: 'Converti', color: '#16a34a', bg: 'rgba(22,163,74,0.1)'   },
  lost:        { label: 'Perdu',    color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
};

const TABS = [
  { key: 'all',              label: 'Tous',             icon: '👥' },
  { key: 'estimation',       label: 'Estimation',       icon: '🏠' },
  { key: 'intermediation',   label: 'Intermédiation',   icon: '🤝' },
  { key: 'commercialisation',label: 'Commercialisation',icon: '📊' },
  { key: 'achat',            label: 'Achat',            icon: '🛒' },
  { key: 'vente',            label: 'Vente',            icon: '💰' },
  { key: 'whatsapp',         label: 'WhatsApp',         icon: '💬' },
  { key: 'contact_form',     label: 'Contact',          icon: '✉️' },
];

function getSrcKey(l: Lead): string {
  const s = (l.subject || '').toLowerCase();
  if (s.includes('achet') || s.includes('achat')) return 'achat';
  if (s.includes('vend')  || s.includes('vente')) return 'vente';
  return l.source || 'contact_form';
}

function getSrc(l: Lead) {
  return SOURCE_CONFIG[getSrcKey(l)] || SOURCE_CONFIG['contact_form'];
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return 'À l\'instant';
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h/24)}j`;
}
function isHot(d: string) { return Date.now() - new Date(d).getTime() < 30 * 60 * 1000; }
function fmtBudget(min?: number, max?: number) {
  const f = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : `${Math.round(n/1000)}k`;
  if (min && max) return `${f(min)} – ${f(max)} MAD`;
  if (max) return `≤ ${f(max)} MAD`;
  if (min) return `≥ ${f(min)} MAD`;
  return null;
}

function ScoreBadge({ score }: { score?: number }) {
  if (!score) return null;
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'3px', padding:'2px 8px', borderRadius:'999px', fontSize:'11px', fontWeight:700, fontFamily:"'DM Sans',sans-serif", background:`${color}12`, color, border:`1px solid ${color}25` }}>
      <Star size={8} style={{ fill:color }} /> {score}%
    </span>
  );
}

export default function LeadsPage() {
  const [leads, setLeads]               = useState<Lead[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [search, setSearch]             = useState('');
  const [activeTab, setActiveTab]       = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected]         = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [newLeadAlert, setNewLeadAlert] = useState<Lead | null>(null);
  const alertTimer = useRef<NodeJS.Timeout>();

  // ── Chargement initial ────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true); setError('');
    if (!supabase) { setError('Supabase non configuré'); setLoading(false); return; }
    const { data, error: err } = await supabase
      .from('leads').select('*').order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // ── Realtime Supabase — nouveau lead en temps réel ─────────────────────
  useEffect(() => {
    if (!supabase) return;
    const ch = supabase.channel('leads-realtime-page')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, payload => {
        const newLead = payload.new as Lead;
        setLeads(prev => [newLead, ...prev]);

        // Alerte visuelle nouveau lead
        setNewLeadAlert(newLead);
        clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => setNewLeadAlert(null), 6000);

        // Notification navigateur si autorisée
        if (notifEnabled && Notification.permission === 'granted') {
          new Notification('🔥 Nouveau lead — LANDMARK ESTATE', {
            body: `${newLead.full_name || 'Prospect'} · ${newLead.subject || newLead.city || 'Nouvelle demande'}`,
            icon: '/favicon.ico',
          });
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); clearTimeout(alertTimer.current); };
  }, [notifEnabled]);

  const requestNotifPermission = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setNotifEnabled(perm === 'granted');
  };

  const changeStatus = async (id: string, newStatus: string) => {
    if (!supabase) return;
    setUpdatingStatus(true);
    await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (selected?.id === id) setSelected(s => s ? { ...s, status: newStatus } : null);
    setUpdatingStatus(false);
  };

  const deleteLead = async (id: string) => {
    if (!supabase || !confirm('Supprimer ce lead définitivement ?')) return;
    await supabase.from('leads').delete().eq('id', id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  // ── Filtrage ──────────────────────────────────────────────────────────────
  const tabCount = (key: string) => {
    if (key === 'all') return leads.length;
    return leads.filter(l => getSrcKey(l) === key).length;
  };

  const filtered = leads.filter(l => {
    const matchTab    = activeTab === 'all' || getSrcKey(l) === activeTab;
    const matchSearch = !search || [l.full_name, l.email, l.city, l.subject, l.phone, l.message]
      .some(s => s?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchTab && matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const hotCount = leads.filter(l => isHot(l.created_at)).length;

  const kpis = [
    { label: 'Total',         value: leads.length,                                                                  accent: T.gold,    icon: '👥' },
    { label: 'Nouveaux',      value: leads.filter(l => !l.status || l.status === 'new').length,                     accent: '#7c3aed', icon: '✨' },
    { label: 'Estimation',    value: leads.filter(l => getSrcKey(l) === 'estimation').length,                        accent: '#7c3aed', icon: '🏠' },
    { label: 'Intermédiation',value: leads.filter(l => getSrcKey(l) === 'intermediation').length,                    accent: T.gold,    icon: '🤝' },
    { label: 'Achat',         value: leads.filter(l => getSrcKey(l) === 'achat').length,                             accent: '#16a34a', icon: '🛒' },
    { label: 'Vente',         value: leads.filter(l => getSrcKey(l) === 'vente').length,                             accent: '#d97706', icon: '💰' },
    { label: 'WhatsApp',      value: leads.filter(l => getSrcKey(l) === 'whatsapp').length,                          accent: '#25D366', icon: '💬' },
    { label: 'Convertis',     value: leads.filter(l => l.status === 'converted').length,                             accent: '#16a34a', icon: '✅' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulsedot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp2{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .lm-card{transition:all 0.18s ease;cursor:pointer;}
        .lm-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(13,31,60,0.09)!important;border-color:rgba(200,169,110,0.35)!important;}
        .lm-card.sel{border-color:#C8A96E!important;box-shadow:0 0 0 2px rgba(200,169,110,0.12)!important;}
        .lm-search:focus{border-color:rgba(200,169,110,0.5)!important;box-shadow:0 0 0 3px rgba(200,169,110,0.06)!important;outline:none!important;}
        .lm-tab{transition:all 0.15s;cursor:pointer;border:none;}
        .lm-tab:hover{background:rgba(200,169,110,0.08)!important;}
        .lm-hot{animation:pulsedot 1.5s infinite;}
        .lm-alert{animation:slideDown 0.4s ease;}
        ::placeholder{color:rgba(13,31,60,0.3)!important;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(200,169,110,0.3);border-radius:2px;}
      `}</style>

      <div style={{ minHeight:'100%', background:T.ivory, padding:'28px 32px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>

        {/* ── Alerte nouveau lead ── */}
        {newLeadAlert && (
          <div className="lm-alert" style={{ position:'fixed', top:'20px', right:'20px', zIndex:9999, background:'#fff', borderRadius:'14px', padding:'14px 18px', boxShadow:'0 8px 32px rgba(13,31,60,0.15)', border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:'12px', maxWidth:'340px' }}>
            <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'18px' }}>🔥</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:600, color:T.navy }}>Nouveau lead !</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', color:T.muted }}>{newLeadAlert.full_name} · {newLeadAlert.subject || newLeadAlert.city || 'Nouvelle demande'}</div>
            </div>
            <button onClick={() => setNewLeadAlert(null)} style={{ padding:'4px', borderRadius:'6px', background:'transparent', border:'none', cursor:'pointer', color:T.muted, fontSize:'16px' }}>×</button>
          </div>
        )}

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'4px 12px', borderRadius:'100px', background:'rgba(200,169,110,0.1)', border:`1px solid ${T.border}`, marginBottom:'10px' }}>
              <Users size={11} style={{ color:T.gold }} />
              <span style={{ fontSize:'10px', fontWeight:500, letterSpacing:'0.15em', textTransform:'uppercase', color:T.gold }}>Prospects qualifiés</span>
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'30px', fontWeight:300, color:T.navy, margin:'0 0 4px', lineHeight:1.1 }}>
              Mes <span style={{ color:T.gold, fontStyle:'italic' }}>Clients</span>
            </h1>
            <p style={{ fontSize:'12px', color:T.muted, margin:0, display:'flex', alignItems:'center', gap:'8px' }}>
              {leads.length} lead{leads.length !== 1 ? 's' : ''}
              {hotCount > 0 && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'2px 8px', borderRadius:'999px', background:'rgba(220,38,38,0.1)', color:'#dc2626', fontSize:'11px', fontWeight:600 }}>
                  <span className="lm-hot" style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#dc2626', display:'inline-block' }} />
                  {hotCount} chaud{hotCount > 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>

          <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
            {/* Bouton notifications */}
            <button onClick={requestNotifPermission}
              title={notifEnabled ? 'Notifications activées' : 'Activer les notifications'}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'9px', border:`1px solid ${notifEnabled ? 'rgba(22,163,74,0.3)' : T.borderSoft}`, background:notifEnabled ? 'rgba(22,163,74,0.08)' : '#fff', color:notifEnabled ? '#16a34a' : T.muted, fontSize:'12px', fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' }}>
              {notifEnabled ? <Bell size={13} /> : <BellOff size={13} />}
              {notifEnabled ? 'Notifs ON' : 'Activer notifs'}
            </button>
            <button onClick={load}
              style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 16px', background:'#16a34a', color:'#fff', fontSize:'13px', fontWeight:600, borderRadius:'9px', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              <RefreshCw size={13} style={{ animation:loading ? 'spin 1s linear infinite' : 'none' }} /> Actualiser
            </button>
          </div>
        </div>

        {/* Erreurs */}
        {error && (
          <div style={{ padding:'14px 18px', background:'rgba(181,87,58,0.08)', border:`1px solid rgba(181,87,58,0.25)`, borderRadius:'10px', color:T.terra, fontSize:'13px', marginBottom:'18px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Info webhook ── */}
        {supabase && leads.filter(l => getSrcKey(l) === 'whatsapp' || getSrcKey(l) === 'email').length === 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', background:'rgba(200,169,110,0.06)', border:`1px solid ${T.border}`, borderRadius:'10px', marginBottom:'18px' }}>
            <Zap size={14} style={{ color:T.gold, flexShrink:0 }} />
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', color:T.muted }}>
              <strong style={{ color:T.navy }}>Captures automatiques :</strong> Les leads des formulaires sont sauvegardés automatiquement. 
              Pour capturer les leads WhatsApp, ajoutez la source <code style={{ background:'rgba(13,31,60,0.06)', padding:'1px 5px', borderRadius:'3px' }}>whatsapp</code> dans les inserts Supabase de vos pages contact.
            </div>
          </div>
        )}

        {/* ── KPIs 8 colonnes ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:'10px', marginBottom:'18px' }}>
          {kpis.map(k => (
            <div key={k.label} style={{ background:'#fff', borderRadius:'12px', padding:'12px 14px', border:`1px solid ${T.borderSoft}`, boxShadow:'0 1px 4px rgba(13,31,60,0.04)', cursor:'pointer', transition:'all 0.15s' }}
              onClick={() => setActiveTab(k.label === 'Total' ? 'all' : k.label === 'Nouveaux' ? 'all' : k.label.toLowerCase())}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(13,31,60,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(13,31,60,0.04)'; }}>
              <div style={{ fontSize:'14px', marginBottom:'5px' }}>{k.icon}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'24px', fontWeight:300, color:k.accent, lineHeight:1, marginBottom:'2px' }}>{k.value}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', fontWeight:500, color:T.muted, letterSpacing:'0.03em' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* ── Onglets sources ── */}
        <div style={{ display:'flex', gap:'5px', marginBottom:'14px', overflowX:'auto', scrollbarWidth:'none', paddingBottom:'2px' }}>
          {TABS.map(tab => {
            const count = tabCount(tab.key);
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelected(null); }} className="lm-tab"
                style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'7px 13px', borderRadius:'20px', fontSize:'12px', fontWeight:isActive ? 600 : 400, fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap', background:isActive ? 'rgba(200,169,110,0.12)' : '#fff', color:isActive ? T.navy : T.muted, outline:'none', boxShadow:isActive ? `0 0 0 1px ${T.border}` : '0 1px 3px rgba(13,31,60,0.06)' }}>
                {tab.icon} {tab.label}
                <span style={{ padding:'1px 6px', borderRadius:'10px', background:isActive ? T.gold : 'rgba(13,31,60,0.07)', color:isActive ? T.navy : T.muted, fontSize:'10px', fontWeight:700 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Filtres search + statut ── */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:'220px', maxWidth:'380px' }}>
            <Search size={13} style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:T.muted, pointerEvents:'none' }} />
            <input type="text" placeholder="Nom, email, téléphone, ville, message..." value={search} onChange={e => setSearch(e.target.value)} className="lm-search"
              style={{ width:'100%', padding:'9px 13px 9px 33px', background:'#fff', color:T.navy, border:`1px solid ${T.borderSoft}`, borderRadius:'9px', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box', outline:'none' }} />
          </div>
          <div style={{ position:'relative' }}>
            <Filter size={12} style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:T.muted, pointerEvents:'none' }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding:'9px 26px 9px 30px', background:'#fff', color:T.navy, border:`1px solid ${T.borderSoft}`, borderRadius:'9px', fontSize:'13px', outline:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", appearance:'none' }}>
              <option value="all">Tous les statuts</option>
              <option value="new">Nouveaux</option>
              <option value="contacted">Contactés</option>
              <option value="in_progress">En cours</option>
              <option value="converted">Convertis</option>
              <option value="lost">Perdus</option>
            </select>
          </div>
          <span style={{ fontSize:'12px', color:T.muted, marginLeft:'auto' }}>
            {sorted.length} résultat{sorted.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Contenu principal ── */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'72px' }}>
            <RefreshCw size={26} style={{ color:T.gold, margin:'0 auto 12px', display:'block', animation:'spin 1s linear infinite' }} />
            <p style={{ color:T.muted, fontFamily:"'DM Sans',sans-serif" }}>Chargement depuis Supabase...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign:'center', padding:'64px 40px', background:'#fff', borderRadius:'16px', border:`1px solid ${T.borderSoft}` }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>{TABS.find(t => t.key === activeTab)?.icon || '👥'}</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'20px', color:T.navy, marginBottom:'8px' }}>
              {activeTab === 'all' ? 'Aucun lead pour le moment' : `Aucun lead "${TABS.find(t => t.key === activeTab)?.label}"`}
            </p>
            <p style={{ fontSize:'13px', color:T.muted }}>Les leads arrivent automatiquement depuis les formulaires du site</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:selected ? '1fr 370px' : 'repeat(auto-fill, minmax(290px, 1fr))', gap:'14px', alignItems:'start' }}>

            {/* ── Cards leads ── */}
            <div style={{ display:'grid', gridTemplateColumns:selected ? '1fr' : 'repeat(auto-fill, minmax(290px, 1fr))', gap:'11px' }}>
              {sorted.map(lead => {
                const srcKey = getSrcKey(lead);
                const src    = getSrc(lead);
                const st     = STATUS_OPTS[lead.status || 'new'] || STATUS_OPTS.new;
                const hot    = isHot(lead.created_at);
                const isSel  = selected?.id === lead.id;

                return (
                  <div key={lead.id} onClick={() => setSelected(isSel ? null : lead)} className={`lm-card${isSel ? ' sel' : ''}`}
                    style={{ background:'#fff', borderRadius:'13px', border:`1px solid ${hot && !isSel ? 'rgba(220,38,38,0.25)' : T.borderSoft}`, padding:'15px', boxShadow:'0 1px 4px rgba(13,31,60,0.04)', position:'relative', overflow:'hidden' }}>

                    {/* Bande couleur source */}
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:src.color, opacity:0.5 }} />

                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'10px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                        <div style={{ position:'relative', flexShrink:0 }}>
                          <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`linear-gradient(135deg,${T.navy},#1e3a5f)`, display:'flex', alignItems:'center', justifyContent:'center', color:T.goldLight, fontFamily:"'Cormorant Garamond',serif", fontSize:'14px' }}>
                            {(lead.full_name || '?').charAt(0).toUpperCase()}
                          </div>
                          {hot && <span className="lm-hot" style={{ position:'absolute', top:'-1px', right:'-1px', width:'8px', height:'8px', borderRadius:'50%', background:'#dc2626', border:'2px solid #fff' }} />}
                        </div>
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:600, color:T.navy, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'150px' }}>{lead.full_name}</div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:T.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'150px' }}>{lead.email || lead.phone || '—'}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px', flexShrink:0 }}>
                        <ScoreBadge score={lead.score} />
                        <span style={{ padding:'2px 6px', borderRadius:'5px', fontSize:'10px', fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:st.bg, color:st.color }}>{st.label}</span>
                      </div>
                    </div>

                    {/* Badge source */}
                    <div style={{ marginBottom:'8px' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'2px 8px', borderRadius:'5px', fontSize:'10px', fontWeight:700, fontFamily:"'DM Sans',sans-serif", background:src.bg, color:src.color, border:`1px solid ${src.border}` }}>
                        {src.icon} {src.label}
                      </span>
                    </div>

                    {/* Infos */}
                    <div style={{ display:'flex', flexDirection:'column', gap:'3px', marginBottom:'10px' }}>
                      {lead.subject && <div style={{ fontSize:'12px', color:T.navy, fontFamily:"'DM Sans',sans-serif", fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.subject}</div>}
                      {lead.city && <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', color:T.muted, fontFamily:"'DM Sans',sans-serif" }}><MapPin size={9} style={{ color:T.gold, flexShrink:0 }} />{lead.city}</div>}
                      {fmtBudget(lead.budget_min, lead.budget_max) && <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', color:T.muted, fontFamily:"'DM Sans',sans-serif" }}><DollarSign size={9} style={{ color:T.gold, flexShrink:0 }} />{fmtBudget(lead.budget_min, lead.budget_max)}</div>}
                    </div>

                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:`1px solid ${T.borderSoft}`, paddingTop:'8px' }}>
                      <span style={{ fontSize:'10px', color:hot ? '#dc2626' : T.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:hot ? 600 : 400 }}>{timeAgo(lead.created_at)}</span>
                      <div style={{ display:'flex', gap:'4px' }}>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
                            style={{ padding:'4px 8px', borderRadius:'6px', background:'rgba(22,163,74,0.1)', color:'#16a34a', fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'3px' }}>
                            <Phone size={9} /> Appeler
                          </a>
                        )}
                        {lead.email && (
                          <a href={`mailto:${lead.email}?subject=Suite à votre demande — LANDMARK ESTATE`} onClick={e => e.stopPropagation()}
                            style={{ padding:'4px 8px', borderRadius:'6px', background:'rgba(200,169,110,0.1)', color:T.gold, fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'3px' }}>
                            <Mail size={9} /> Email
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Panneau détail ── */}
            {selected && (() => {
              const src = getSrc(selected);
              return (
                <div style={{ background:'#fff', borderRadius:'16px', border:`1px solid ${T.border}`, overflow:'hidden', boxShadow:'0 4px 24px rgba(13,31,60,0.1)', position:'sticky', top:'24px', alignSelf:'start', maxHeight:'calc(100vh - 120px)', overflowY:'auto' }}>
                  {/* Header */}
                  <div style={{ padding:'20px', background:T.navy, position:'relative' }}>
                    <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'100px', height:'100px', borderRadius:'50%', background:'radial-gradient(circle,rgba(200,169,110,0.15) 0%,transparent 70%)', pointerEvents:'none' }} />
                    <button onClick={() => setSelected(null)} style={{ position:'absolute', top:'12px', right:'12px', width:'24px', height:'24px', borderRadius:'50%', background:'rgba(249,245,239,0.1)', border:'none', color:T.goldLight, cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
                    <div style={{ width:'46px', height:'46px', borderRadius:'50%', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'10px', fontFamily:"'Cormorant Garamond',serif", fontSize:'19px', color:T.navy }}>
                      {selected.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'18px', fontWeight:300, color:'#F9F5EF' }}>{selected.full_name}</div>
                    {selected.email && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(226,201,138,0.5)', marginTop:'2px' }}>{selected.email}</div>}
                    <div style={{ marginTop:'8px', display:'inline-flex', alignItems:'center', gap:'4px', padding:'2px 9px', borderRadius:'5px', fontSize:'10px', fontWeight:700, fontFamily:"'DM Sans',sans-serif", background:src.bg, color:src.color, border:`1px solid ${src.border}` }}>
                      {src.icon} {src.label}
                    </div>
                  </div>

                  <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:'12px' }}>
                    {/* Score */}
                    {!!selected.score && selected.score > 0 && (() => {
                      const c = selected.score >= 80 ? '#16a34a' : selected.score >= 60 ? '#d97706' : '#dc2626';
                      return (
                        <div>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                            <span style={{ fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:T.muted }}>Score qualification</span>
                            <span style={{ fontSize:'12px', fontWeight:700, color:c }}>{selected.score}%</span>
                          </div>
                          <div style={{ height:'5px', borderRadius:'3px', background:T.borderSoft, overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${selected.score}%`, background:`linear-gradient(90deg,${c},${c}99)`, borderRadius:'3px' }} />
                          </div>
                        </div>
                      );
                    })()}

                    {/* Coordonnées */}
                    <div style={{ background:T.ivory, borderRadius:'10px', padding:'12px 14px' }}>
                      <div style={{ fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:T.muted, marginBottom:'7px' }}>Coordonnées</div>
                      {selected.phone && <a href={`tel:${selected.phone}`} style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'5px', color:'#16a34a', textDecoration:'none', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}><Phone size={12} />{selected.phone}</a>}
                      {selected.email && <a href={`mailto:${selected.email}`} style={{ display:'flex', alignItems:'center', gap:'6px', color:T.gold, textDecoration:'none', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}><Mail size={12} />{selected.email}</a>}
                      {!selected.phone && !selected.email && <span style={{ fontSize:'12px', color:T.muted }}>Non renseignées</span>}
                    </div>

                    {/* Demande */}
                    {(selected.subject || selected.message || selected.city) && (
                      <div style={{ background:T.ivory, borderRadius:'10px', padding:'12px 14px' }}>
                        <div style={{ fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:T.muted, marginBottom:'7px' }}>Demande</div>
                        {selected.subject && <div style={{ fontSize:'13px', fontWeight:600, color:T.navy, fontFamily:"'DM Sans',sans-serif", marginBottom:'4px' }}>{selected.subject}</div>}
                        {selected.city && <div style={{ fontSize:'12px', color:T.muted, fontFamily:"'DM Sans',sans-serif", marginBottom:'3px' }}>📍 {selected.city}</div>}
                        {fmtBudget(selected.budget_min, selected.budget_max) && <div style={{ fontSize:'12px', color:T.muted, fontFamily:"'DM Sans',sans-serif", marginBottom:'3px' }}>💰 {fmtBudget(selected.budget_min, selected.budget_max)}</div>}
                        {selected.message && <p style={{ fontSize:'12px', color:T.muted, lineHeight:1.6, margin:'6px 0 0', fontFamily:"'DM Sans',sans-serif" }}>{selected.message}</p>}
                      </div>
                    )}

                    <div style={{ fontSize:'11px', color:T.muted, fontFamily:"'DM Sans',sans-serif", textAlign:'center' }}>
                      Reçu {timeAgo(selected.created_at)} · {fmtDate(selected.created_at)}
                    </div>

                    {/* Statut */}
                    <div>
                      <div style={{ fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:T.muted, marginBottom:'7px' }}>Statut</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                        {Object.entries(STATUS_OPTS).map(([val, st]) => (
                          <button key={val} onClick={() => changeStatus(selected.id, val)} disabled={updatingStatus}
                            style={{ padding:'5px 10px', borderRadius:'999px', fontSize:'10px', fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:updatingStatus ? 'not-allowed' : 'pointer', border:`2px solid ${st.color}`, background:selected.status === val ? st.color : 'transparent', color:selected.status === val ? '#fff' : st.color, opacity:updatingStatus ? 0.6 : 1, transition:'all 0.15s' }}>
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CTAs */}
                    <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
                      {selected.email && (
                        <a href={`mailto:${selected.email}?subject=Suite à votre demande — LANDMARK ESTATE`}
                          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'11px', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, color:T.navy, fontSize:'13px', fontWeight:600, borderRadius:'9px', textDecoration:'none', fontFamily:"'DM Sans',sans-serif" }}>
                          <Mail size={13} /> Envoyer un email
                        </a>
                      )}
                      {selected.phone && (
                        <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'10px', background:'rgba(37,211,102,0.1)', color:'#25D366', fontSize:'13px', fontWeight:600, borderRadius:'9px', textDecoration:'none', fontFamily:"'DM Sans',sans-serif", border:'1px solid rgba(37,211,102,0.25)' }}>
                          💬 Répondre sur WhatsApp
                        </a>
                      )}
                      {selected.phone && (
                        <a href={`tel:${selected.phone}`}
                          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'10px', background:'rgba(22,163,74,0.1)', color:'#16a34a', fontSize:'13px', fontWeight:600, borderRadius:'9px', textDecoration:'none', fontFamily:"'DM Sans',sans-serif", border:'1px solid rgba(22,163,74,0.25)' }}>
                          <Phone size={13} /> Appeler
                        </a>
                      )}
                      <button onClick={() => deleteLead(selected.id)}
                        style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'9px', background:'rgba(181,87,58,0.07)', color:T.terra, fontSize:'12px', fontWeight:500, borderRadius:'9px', border:`1px solid rgba(181,87,58,0.18)`, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                        <Trash2 size={12} /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
}