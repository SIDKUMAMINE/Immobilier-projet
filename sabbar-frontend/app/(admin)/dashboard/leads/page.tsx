'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Users, Phone, Mail, MapPin, DollarSign, Star,
  RefreshCw, Search, Filter, Trash2, Bell, BellOff,
  Clock, Save, UserCheck
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

// Validations alignées sur les CHECK constraints de la base
const PHONE_RE = /^(\+212|0)[5-7][0-9]{8}$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface Lead {
  id: string;
  created_at?: string;
  updated_at?: string;
  last_contacted_at?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  status?: string;
  source?: string;
  priority?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_cities?: any;
  preferred_districts?: any;
  property_types?: any;
  transaction_type?: string;
  min_area?: number;
  max_area?: number;
  min_bedrooms?: number;
  min_bathrooms?: number;
  qualification_score?: number;
  notes?: string;
  ai_conversation_summary?: string;
  assigned_to?: string;
}

// SOURCES réelles autorisées par la base (+ whatsapp ajouté via SQL)
const SOURCE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  whatsapp:     { label: 'WhatsApp',         color: '#25D366', bg: 'rgba(37,211,102,0.08)', border: 'rgba(37,211,102,0.2)', icon: '💬' },
  email:        { label: 'Email',            color: '#6b7280', bg: 'rgba(107,114,128,0.08)',border: 'rgba(107,114,128,0.2)',icon: '📧' },
  web_form:     { label: 'Formulaire web',   color: '#2563eb', bg: 'rgba(37,99,235,0.08)',  border: 'rgba(37,99,235,0.2)',  icon: '✉️' },
  agent_ia:     { label: 'Agent IA',         color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)', icon: '🤖' },
  phone:        { label: 'Téléphone',        color: '#16a34a', bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.2)',  icon: '📞' },
  referral:     { label: 'Référence',        color: T.gold,    bg: 'rgba(200,169,110,0.08)',border: 'rgba(200,169,110,0.25)',icon: '🔗' },
  social_media: { label: 'Réseaux sociaux',  color: '#d97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.2)',  icon: '📱' },
  walk_in:      { label: 'Visite agence',    color: '#0891b2', bg: 'rgba(8,145,178,0.08)',  border: 'rgba(8,145,178,0.2)',  icon: '🚶' },
  other:        { label: 'Autre',            color: '#6b7280', bg: 'rgba(107,114,128,0.08)',border: 'rgba(107,114,128,0.2)',icon: '•'  },
};

// STATUTS réels autorisés par la base
const STATUS_OPTS: Record<string, { label: string; color: string; bg: string }> = {
  new:               { label: 'Nouveau',        color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  contacted:         { label: 'Contacté',       color: '#d97706', bg: 'rgba(217,119,6,0.1)'  },
  qualified:         { label: 'Qualifié',       color: '#0891b2', bg: 'rgba(8,145,178,0.1)'  },
  meeting_scheduled: { label: 'RDV programmé',   color: '#2563eb', bg: 'rgba(37,99,235,0.1)'  },
  proposal_sent:     { label: 'Proposition',    color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  negotiation:       { label: 'Négociation',    color: '#ea580c', bg: 'rgba(234,88,12,0.1)'  },
  converted:         { label: 'Converti',       color: '#16a34a', bg: 'rgba(22,163,74,0.1)'  },
  lost:              { label: 'Perdu',          color: '#6b7280', bg: 'rgba(107,114,128,0.1)'},
  archived:          { label: 'Archivé',        color: '#475569', bg: 'rgba(71,85,105,0.1)'  },
};

const STATUS_ORDER = ['new','contacted','qualified','meeting_scheduled','proposal_sent','negotiation','converted','lost','archived'];
const EN_COURS = ['contacted','qualified','meeting_scheduled','proposal_sent','negotiation'];

const PRIORITY_OPTS: Record<string, { label: string; color: string }> = {
  low:    { label: 'Basse',   color: '#6b7280' },
  medium: { label: 'Moyenne', color: '#d97706' },
  high:   { label: 'Haute',   color: '#dc2626' },
  urgent: { label: 'Urgente', color: '#b91c1c' },
};

// Onglets basés sur les vraies valeurs de source
const TABS = [
  { key: 'all',          label: 'Tous',            icon: '👥' },
  { key: 'whatsapp',     label: 'WhatsApp',        icon: '💬' },
  { key: 'email',        label: 'Email',           icon: '📧' },
  { key: 'web_form',     label: 'Formulaire',      icon: '✉️' },
  { key: 'agent_ia',     label: 'Agent IA',        icon: '🤖' },
  { key: 'phone',        label: 'Téléphone',       icon: '📞' },
  { key: 'social_media', label: 'Réseaux',         icon: '📱' },
  { key: 'referral',     label: 'Référence',       icon: '🔗' },
  { key: 'other',        label: 'Autre',           icon: '•'  },
];

function displayName(l: Lead): string {
  return [l.first_name, l.last_name].filter(Boolean).join(' ').trim();
}

function citiesLabel(pc: any): string {
  if (!pc) return '';
  if (Array.isArray(pc)) return pc.filter(Boolean).join(', ');
  if (typeof pc === 'string') {
    try { const a = JSON.parse(pc); return Array.isArray(a) ? a.filter(Boolean).join(', ') : pc; }
    catch { return pc; }
  }
  return '';
}

function getSrcKey(l: Lead): string {
  return l.source || 'other';
}

function getSrc(l: Lead) {
  return SOURCE_CONFIG[getSrcKey(l)] || SOURCE_CONFIG['other'];
}

function fmtBudget(min?: number, max?: number) {
  const f = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : `${Math.round(n/1000)}k`;
  if (min && max) return `${f(min)} – ${f(max)} MAD`;
  if (max) return `≤ ${f(max)} MAD`;
  if (min) return `≥ ${f(min)} MAD`;
  return null;
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 0)  return `Il y a ${days}j`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `Il y a ${hours}h`;
  const mins = Math.floor(diff / 60000);
  if (mins > 0)  return `Il y a ${mins}min`;
  return "À l'instant";
}

export default function LeadsPage() {
  const [leads, setLeads]               = useState<Lead[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [search, setSearch]             = useState('');
  const [activeTab, setActiveTab]       = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected]         = useState<Lead | null>(null);
  const [editForm, setEditForm]         = useState<any>({});
  const [saving, setSaving]             = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [newLeadAlert, setNewLeadAlert] = useState<Lead | null>(null);
  const alertTimer = useRef<any>();

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

  useEffect(() => {
    if (!supabase) return;
    const ch = supabase.channel('leads-realtime-page')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, payload => {
        const newLead = payload.new as Lead;
        setLeads(prev => [newLead, ...prev]);

        setNewLeadAlert(newLead);
        clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => setNewLeadAlert(null), 6000);

        if (notifEnabled && Notification.permission === 'granted') {
          new Notification('🔥 Nouveau lead — LANDMARK ESTATE', {
            body: `${displayName(newLead) || 'Prospect'} · ${citiesLabel(newLead.preferred_cities) || 'Nouvelle demande'}`,
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

  const openLead = (lead: Lead) => {
    setSelected(lead);
    setEditForm({
      first_name:  lead.first_name || '',
      last_name:   lead.last_name || '',
      email:       lead.email || '',
      phone:       lead.phone || '',
      citiesText:  citiesLabel(lead.preferred_cities),
      budget_min:  lead.budget_min,
      budget_max:  lead.budget_max,
      status:      lead.status || 'new',
      priority:    lead.priority || 'medium',
      assigned_to: lead.assigned_to || '',
      notes:       lead.notes || '',
    });
  };

  // Validation locale = mêmes règles que les CHECK constraints
  const validate = (f: any): string | null => {
    if (!f.first_name?.trim() || f.first_name.trim().length < 2) return 'Le prénom doit faire au moins 2 caractères.';
    if (!f.last_name?.trim()  || f.last_name.trim().length < 2)  return 'Le nom doit faire au moins 2 caractères.';
    if (!f.phone?.trim() || !PHONE_RE.test(f.phone.trim()))      return 'Téléphone invalide. Format attendu : +2126XXXXXXXX ou 06XXXXXXXX.';
    if (f.email?.trim() && !EMAIL_RE.test(f.email.trim()))       return 'Adresse email invalide.';
    const bmin = f.budget_min, bmax = f.budget_max;
    if (bmin != null && bmin <= 0) return 'Le budget min doit être supérieur à 0.';
    if (bmax != null && bmax <= 0) return 'Le budget max doit être supérieur à 0.';
    if (bmin != null && bmax != null && bmax < bmin) return 'Le budget max doit être ≥ au budget min.';
    return null;
  };

  const saveLead = async () => {
    if (!supabase || !selected) return;
    const errMsg = validate(editForm);
    if (errMsg) { alert(errMsg); return; }
    setSaving(true);

    const cities = editForm.citiesText
      ? String(editForm.citiesText).split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const patch = {
      first_name:       editForm.first_name.trim(),
      last_name:        editForm.last_name.trim(),
      email:            editForm.email?.trim() || null,
      phone:            editForm.phone.trim(),
      preferred_cities: cities,
      budget_min:       editForm.budget_min || null,
      budget_max:       editForm.budget_max || null,
      status:           editForm.status,
      priority:         editForm.priority || 'medium',
      assigned_to:      editForm.assigned_to?.trim() || null,
      notes:            editForm.notes?.trim() || null,
      updated_at:       new Date().toISOString(),
    };

    const { error: err } = await supabase.from('leads').update(patch).eq('id', selected.id);
    if (!err) {
      setLeads(prev => prev.map(l => l.id === selected.id ? { ...l, ...patch } as Lead : l));
      setSelected(s => s ? { ...s, ...patch } as Lead : null);
    } else {
      alert('Erreur lors de l\'enregistrement : ' + err.message);
    }
    setSaving(false);
  };

  const deleteLead = async (id: string) => {
    if (!supabase || !confirm('Supprimer ce lead définitivement ?')) return;
    await supabase.from('leads').delete().eq('id', id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = leads.filter(l => {
    const matchTab    = activeTab === 'all' || getSrcKey(l) === activeTab;
    const matchSearch = !search || [displayName(l), l.email, citiesLabel(l.preferred_cities), l.phone, l.notes, l.assigned_to]
      .some(s => s?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchTab && matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  const kpiData = [
    { label: 'TOTAL LEADS', value: leads.length, color: '#C8A96E' },
    { label: 'NOUVEAUX', value: leads.filter(l => !l.status || l.status === 'new').length, color: '#7c3aed' },
    { label: 'EN COURS', value: leads.filter(l => EN_COURS.includes(l.status || '')).length, color: '#2563eb' },
    { label: 'CONVERTIS', value: leads.filter(l => l.status === 'converted').length, color: '#16a34a' }
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 11px', borderRadius: '7px',
    border: `1px solid ${T.borderSoft}`, fontSize: '13px',
    fontFamily: "'DM Sans',sans-serif", color: T.navy, background: '#fff',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '11px', color: T.muted, textTransform: 'uppercase',
    display: 'inline-block', marginBottom: '5px', letterSpacing: '0.04em',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        .lm-card{transition:all 0.18s ease;cursor:pointer;}
        .lm-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(13,31,60,0.06)!important;}
        .lm-card.sel{border-color:#C8A96E!important;box-shadow:0 0 0 2px rgba(200,169,110,0.12)!important;}
        .lm-search:focus{border-color:rgba(200,169,110,0.4)!important;outline:none!important;}
        .lm-input:focus{border-color:rgba(200,169,110,0.45)!important;outline:none!important;}
        .lm-tab{transition:all 0.15s;cursor:pointer;border:none;}
        .lm-tab:hover{background:rgba(200,169,110,0.08)!important;}
        ::placeholder{color:rgba(13,31,60,0.3)!important;}
      `}</style>

      <div style={{ minHeight:'100%', background:T.ivory, padding:'28px 32px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>

        {newLeadAlert && (
          <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:9999, background:'#fff', borderRadius:'14px', padding:'14px 18px', boxShadow:'0 8px 32px rgba(13,31,60,0.15)', border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:'12px', maxWidth:'340px' }}>
            <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🔥</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'13px', fontWeight:600, color:T.navy }}>Nouveau lead !</div>
              <div style={{ fontSize:'12px', color:T.muted }}>{displayName(newLeadAlert) || 'Prospect'}</div>
            </div>
            <button onClick={() => setNewLeadAlert(null)} style={{ background:'transparent', border:'none', cursor:'pointer', color:T.muted, fontSize:'16px' }}>×</button>
          </div>
        )}

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'4px 12px', borderRadius:'100px', background:'rgba(200,169,110,0.1)', border:`1px solid ${T.border}`, marginBottom:'10px' }}>
              <Users size={11} style={{ color:T.gold }} />
              <span style={{ fontSize:'10px', fontWeight:500, letterSpacing:'0.15em', textTransform:'uppercase', color:T.gold }}>Prospects qualifiés</span>
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'32px', fontWeight:300, color:T.navy, margin:0 }}>
              Mes <span style={{ color:T.gold, fontStyle:'italic' }}>Clients</span>
            </h1>
            <p style={{ fontSize:'12px', color:T.muted, marginTop:'4px' }}>{leads.length} leads depuis Supabase</p>
          </div>

          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <button onClick={requestNotifPermission}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 16px', borderRadius:'9px', border:`1px solid ${notifEnabled ? 'rgba(22,163,74,0.3)' : T.borderSoft}`, background:'#fff', color:T.muted, fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
              {notifEnabled ? <Bell size={13} style={{ color: '#16a34a' }} /> : <BellOff size={13} />}
              {notifEnabled ? 'Notifications Actives' : 'Notifier les nouveaux leads'}
            </button>
            <button onClick={load}
              style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'#16a34a', color:'#fff', fontSize:'13px', fontWeight:500, borderRadius:'9px', border:'none', cursor:'pointer' }}>
              <RefreshCw size={13} style={{ animation:loading ? 'spin 1s linear infinite' : 'none' }} /> Actualiser
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', marginBottom: '24px' }}>
          {kpiData.map((kpi, idx) => (
            <div key={idx} style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', border: `1px solid ${T.borderSoft}` }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: T.muted, letterSpacing: '0.05em', marginBottom: '12px' }}>{kpi.label}</div>
              <div style={{ fontSize: '36px', fontWeight: 300, color: kpi.color, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Onglets par source */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const count = tab.key === 'all'
              ? leads.length
              : leads.filter(l => getSrcKey(l) === tab.key).length;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="lm-tab"
                style={{
                  display:'flex', alignItems:'center', gap:'7px',
                  padding:'9px 16px', borderRadius:'9px',
                  background: isActive ? T.navy : '#fff',
                  color: isActive ? T.gold : T.muted,
                  border:`1px solid ${isActive ? T.navy : T.borderSoft}`,
                  fontSize:'13px', fontWeight:500, fontFamily:"'DM Sans',sans-serif"
                }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span style={{
                  fontSize:'11px', fontWeight:600,
                  padding:'1px 7px', borderRadius:'999px',
                  background: isActive ? 'rgba(200,169,110,0.2)' : 'rgba(13,31,60,0.05)',
                  color: isActive ? T.gold : T.muted
                }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Recherche + filtre statut */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'20px', alignItems:'center' }}>
          <div style={{ position:'relative', width:'380px' }}>
            <Search size={14} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:T.muted }} />
            <input type="text" placeholder="Rechercher par nom, email, ville, téléphone..." value={search} onChange={e => setSearch(e.target.value)} className="lm-search"
              style={{ width:'100%', padding:'10px 14px 10px 38px', background:'#fff', border:`1px solid ${T.borderSoft}`, borderRadius:'8px', fontSize:'13px' }} />
          </div>

          <div style={{ position:'relative' }}>
            <Filter size={13} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:T.muted }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding:'10px 36px 10px 36px', background:'#fff', border:`1px solid ${T.borderSoft}`, borderRadius:'8px', fontSize:'13px', cursor:'pointer', appearance:'none' }}>
              <option value="all">Tous les statuts</option>
              {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_OPTS[s].label}</option>)}
            </select>
          </div>

          <span style={{ fontSize:'13px', color:T.muted, marginLeft:'auto' }}>{sorted.length} résultats</span>
        </div>

        {/* Contenu */}
        <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 380px' : 'repeat(auto-fill, minmax(320px, 1fr))', gap:'16px' }}>

          <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap:'16px' }}>
            {sorted.map(lead => {
              const st = STATUS_OPTS[lead.status || 'new'] || STATUS_OPTS.new;
              const src = getSrc(lead);
              const isSel = selected?.id === lead.id;
              const name = displayName(lead);
              const cities = citiesLabel(lead.preferred_cities);
              const prio = lead.priority ? PRIORITY_OPTS[lead.priority] : null;
              return (
                <div key={lead.id} className={`lm-card${isSel ? ' sel' : ''}`}
                  onClick={() => isSel ? setSelected(null) : openLead(lead)}
                  style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${T.borderSoft}`, padding: '20px', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>

                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${T.gold},${T.goldLight})` }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold, fontSize: '16px', fontWeight: 600 }}>
                        {(name?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: T.navy, marginBottom: '2px' }}>{name || 'Sans nom'}</div>
                        <div style={{ fontSize: '12px', color: T.muted }}>{lead.email || lead.phone || 'Pas de coordonnées'}</div>
                        {cities && <div style={{ fontSize: '12px', color: T.muted, display: 'flex', alignItems: 'center', gap: '4px', marginTop:'2px' }}><MapPin size={12} /> {cities}</div>}
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px' }}>
                      <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{st.label}</span>
                      <span style={{ background: src.bg, color: src.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, border:`1px solid ${src.border}` }}>{src.icon} {src.label}</span>
                      {prio && <span style={{ color: prio.color, fontSize: '11px', fontWeight: 600 }}>● {prio.label}</span>}
                    </div>
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: 600, color: T.gold, marginBottom: '16px' }}>
                    {fmtBudget(lead.budget_min, lead.budget_max) || 'Budget non spécifié'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${T.borderSoft}`, paddingTop: '12px' }}>
                    <span style={{ fontSize: '12px', color: T.muted }}>{timeAgo(lead.created_at)}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (lead.phone) window.open(`tel:${lead.phone}`); else alert('Aucun numéro de téléphone'); }}
                        style={{ background: '#E8F5E9', color: '#2E7D32', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor:'pointer' }}>
                        <Phone size={12} /> Appeler
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (lead.email) window.open(`mailto:${lead.email}`); else alert('Aucune adresse email'); }}
                        style={{ background: '#F5F0E6', color: T.gold, border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor:'pointer' }}>
                        <Mail size={12} /> Email
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {!loading && sorted.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'48px', color:T.muted, fontSize:'14px' }}>
                Aucun lead pour ce filtre.
              </div>
            )}
          </div>

          {/* Panneau de GESTION admin */}
          {selected && (
            <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${T.borderSoft}`, padding: '24px', position: 'sticky', top: '24px', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: T.navy, fontFamily:"'Cormorant Garamond',serif", fontWeight:400 }}>Gérer le Lead</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: T.muted }}>×</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display:'flex', gap:'10px' }}>
                  <div style={{ flex:1 }}>
                    <label style={labelStyle}>Prénom *</label>
                    <input className="lm-input" style={inputStyle} value={editForm.first_name || ''}
                      onChange={e => setEditForm((f: any) => ({ ...f, first_name: e.target.value }))} placeholder="Prénom" />
                  </div>
                  <div style={{ flex:1 }}>
                    <label style={labelStyle}>Nom *</label>
                    <input className="lm-input" style={inputStyle} value={editForm.last_name || ''}
                      onChange={e => setEditForm((f: any) => ({ ...f, last_name: e.target.value }))} placeholder="Nom" />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Téléphone *</label>
                  <input className="lm-input" style={inputStyle} value={editForm.phone || ''}
                    onChange={e => setEditForm((f: any) => ({ ...f, phone: e.target.value }))} placeholder="+212600000000 ou 0600000000" />
                </div>

                <div>
                  <label style={labelStyle}>Email</label>
                  <input className="lm-input" style={inputStyle} type="email" value={editForm.email || ''}
                    onChange={e => setEditForm((f: any) => ({ ...f, email: e.target.value }))} placeholder="email@exemple.com" />
                </div>

                <div>
                  <label style={labelStyle}>Villes préférées (séparées par des virgules)</label>
                  <input className="lm-input" style={inputStyle} value={editForm.citiesText || ''}
                    onChange={e => setEditForm((f: any) => ({ ...f, citiesText: e.target.value }))} placeholder="Tanger, Casablanca" />
                </div>

                <div style={{ display:'flex', gap:'10px' }}>
                  <div style={{ flex:1 }}>
                    <label style={labelStyle}>Budget min</label>
                    <input className="lm-input" style={inputStyle} type="number" value={editForm.budget_min ?? ''}
                      onChange={e => setEditForm((f: any) => ({ ...f, budget_min: e.target.value ? Number(e.target.value) : undefined }))} placeholder="0" />
                  </div>
                  <div style={{ flex:1 }}>
                    <label style={labelStyle}>Budget max</label>
                    <input className="lm-input" style={inputStyle} type="number" value={editForm.budget_max ?? ''}
                      onChange={e => setEditForm((f: any) => ({ ...f, budget_max: e.target.value ? Number(e.target.value) : undefined }))} placeholder="0" />
                  </div>
                </div>

                <div style={{ display:'flex', gap:'10px' }}>
                  <div style={{ flex:1 }}>
                    <label style={labelStyle}>Statut</label>
                    <select value={editForm.status || 'new'} onChange={e => setEditForm((f: any) => ({ ...f, status: e.target.value }))}
                      style={{ ...inputStyle, cursor:'pointer' }}>
                      {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_OPTS[s].label}</option>)}
                    </select>
                  </div>
                  <div style={{ flex:1 }}>
                    <label style={labelStyle}>Priorité</label>
                    <select value={editForm.priority || 'medium'} onChange={e => setEditForm((f: any) => ({ ...f, priority: e.target.value }))}
                      style={{ ...inputStyle, cursor:'pointer' }}>
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Assigné à</label>
                  <input className="lm-input" style={inputStyle} value={editForm.assigned_to || ''}
                    onChange={e => setEditForm((f: any) => ({ ...f, assigned_to: e.target.value }))} placeholder="Nom de l'agent" />
                </div>

                <div>
                  <label style={labelStyle}>Notes</label>
                  <textarea className="lm-input" value={editForm.notes || ''}
                    onChange={e => setEditForm((f: any) => ({ ...f, notes: e.target.value }))}
                    style={{ ...inputStyle, minHeight:'80px', resize:'vertical', lineHeight:1.4 }} placeholder="Notes internes (max 2000 caractères)..." />
                </div>

                {selected.ai_conversation_summary && (
                  <div>
                    <label style={labelStyle}>Résumé conversation IA</label>
                    <div style={{ fontSize:'13px', color:T.navy, background:T.ivory, padding:'12px', borderRadius:'6px', lineHeight:1.4 }}>
                      {selected.ai_conversation_summary}
                    </div>
                  </div>
                )}

                <button onClick={saveLead} disabled={saving}
                  style={{ width:'100%', background:T.navy, color:T.gold, border:'none', padding:'11px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor: saving ? 'wait' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', opacity: saving ? 0.7 : 1 }}>
                  <Save size={14} /> {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
                </button>

                <button onClick={() => deleteLead(selected.id)}
                  style={{ width: '100%', background: '#FFEBEE', color: '#C62828', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Trash2 size={14} /> Supprimer le prospect
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}