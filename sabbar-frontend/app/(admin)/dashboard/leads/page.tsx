'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Users, Phone, Mail, MapPin,
  RefreshCw, Search, Filter, Trash2, Bell, BellOff, Save
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

const PHONE_RE = /^(\+212|0)[5-7][0-9]{8}$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface Lead {
  id: string;
  created_at?: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  status?: string;
  source?: string;
  priority?: string;
  lead_type?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_cities?: any;
  transaction_type?: string;
  qualification_score?: number;
  notes?: string;
  ai_conversation_summary?: string;
  assigned_to?: string;
}

const SOURCE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  whatsapp:     { label: 'WhatsApp',        color: '#25D366', bg: 'rgba(37,211,102,0.08)', border: 'rgba(37,211,102,0.2)',  icon: '💬' },
  email:        { label: 'Email',           color: '#6b7280', bg: 'rgba(107,114,128,0.08)',border: 'rgba(107,114,128,0.2)', icon: '📧' },
  web_form:     { label: 'Formulaire web',  color: '#2563eb', bg: 'rgba(37,99,235,0.08)',  border: 'rgba(37,99,235,0.2)',  icon: '✉️' },
  agent_ia:     { label: 'Agent IA',        color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)', icon: '🤖' },
  phone:        { label: 'Téléphone',       color: '#16a34a', bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.2)',  icon: '📞' },
  referral:     { label: 'Référence',       color: T.gold,    bg: 'rgba(200,169,110,0.08)',border: 'rgba(200,169,110,0.25)',icon: '🔗' },
  social_media: { label: 'Réseaux sociaux', color: '#d97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.2)',  icon: '📱' },
  walk_in:      { label: 'Visite agence',   color: '#0891b2', bg: 'rgba(8,145,178,0.08)',  border: 'rgba(8,145,178,0.2)',  icon: '🚶' },
  other:        { label: 'Autre',           color: '#6b7280', bg: 'rgba(107,114,128,0.08)',border: 'rgba(107,114,128,0.2)',icon: '•'  },
};

const STATUS_OPTS: Record<string, { label: string; color: string; bg: string }> = {
  new:               { label: 'Nouveau',       color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  contacted:         { label: 'Contacté',      color: '#d97706', bg: 'rgba(217,119,6,0.1)'  },
  qualified:         { label: 'Qualifié',      color: '#0891b2', bg: 'rgba(8,145,178,0.1)'  },
  meeting_scheduled: { label: 'RDV programmé', color: '#2563eb', bg: 'rgba(37,99,235,0.1)'  },
  proposal_sent:     { label: 'Proposition',   color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  negotiation:       { label: 'Négociation',   color: '#ea580c', bg: 'rgba(234,88,12,0.1)'  },
  converted:         { label: 'Converti',      color: '#16a34a', bg: 'rgba(22,163,74,0.1)'  },
  lost:              { label: 'Perdu',         color: '#6b7280', bg: 'rgba(107,114,128,0.1)'},
  archived:          { label: 'Archivé',       color: '#475569', bg: 'rgba(71,85,105,0.1)'  },
};

const STATUS_ORDER = ['new','contacted','qualified','meeting_scheduled','proposal_sent','negotiation','converted','lost','archived'];
const EN_COURS     = ['contacted','qualified','meeting_scheduled','proposal_sent','negotiation'];

const PRIORITY_OPTS: Record<string, { label: string; color: string }> = {
  low:    { label: 'Basse',   color: '#6b7280' },
  medium: { label: 'Moyenne', color: '#d97706' },
  high:   { label: 'Haute',   color: '#dc2626' },
  urgent: { label: 'Urgente', color: '#b91c1c' },
};

const TABS = [
  { key: 'all',          label: 'Tous',         icon: '👥' },
  { key: 'whatsapp',     label: 'WhatsApp',     icon: '💬' },
  { key: 'email',        label: 'Email',        icon: '📧' },
  { key: 'web_form',     label: 'Formulaire',   icon: '✉️' },
  { key: 'agent_ia',     label: 'Agent IA',     icon: '🤖' },
  { key: 'phone',        label: 'Téléphone',    icon: '📞' },
  { key: 'social_media', label: 'Réseaux',      icon: '📱' },
  { key: 'referral',     label: 'Référence',    icon: '🔗' },
  { key: 'other',        label: 'Autre',        icon: '•'  },
];

// KPI cards : Acheteur / Propriétaire / Promoteur
const LEAD_TYPE_CONFIG = {
  acheteur:    { label: 'Acheteurs',    icon: '🛒', color: '#2563eb', bg: 'rgba(37,99,235,0.06)'   },
  proprietaire:{ label: 'Propriétaires',icon: '🏠', color: '#C8A96E', bg: 'rgba(200,169,110,0.06)' },
  promoteur:   { label: 'Promoteurs',   icon: '📊', color: '#B5573A', bg: 'rgba(181,87,58,0.06)'   },
};

function displayName(l: Lead)  { return [l.first_name, l.last_name].filter(Boolean).join(' ').trim(); }
function getSrcKey(l: Lead)    { return l.source || 'other'; }
function getSrc(l: Lead)       { return SOURCE_CONFIG[getSrcKey(l)] || SOURCE_CONFIG['other']; }

function citiesLabel(pc: any): string {
  if (!pc) return '';
  if (Array.isArray(pc)) return pc.filter(Boolean).join(', ');
  if (typeof pc === 'string') {
    try { const a = JSON.parse(pc); return Array.isArray(a) ? a.filter(Boolean).join(', ') : pc; }
    catch { return pc; }
  }
  return '';
}

function fmtBudget(min?: number, max?: number) {
  const f = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : `${Math.round(n/1000)}k`;
  if (min && max) return `${f(min)} – ${f(max)} MAD`;
  if (max)  return `≤ ${f(max)} MAD`;
  if (min)  return `≥ ${f(min)} MAD`;
  return null;
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000); if (d > 0) return `Il y a ${d}j`;
  const h = Math.floor(diff / 3600000);  if (h > 0) return `Il y a ${h}h`;
  const m = Math.floor(diff / 60000);    if (m > 0) return `Il y a ${m}min`;
  return "À l'instant";
}

// ── KPI CARD ─────────────────────────────────────────────────
function KpiCard({ icon, label, value, color, bg }: {
  icon: string; label: string; value: number; color: string; bg: string;
}) {
  return (
    <div style={{
      background: '#fff', padding: '24px 28px', borderRadius: '14px',
      border: `1px solid ${T.borderSoft}`, boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      display: 'flex', flexDirection: 'column', gap: '14px',
    }}>
      {/* Icône + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
          {icon}
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif" }}>
          {label}
        </span>
      </div>
      {/* Chiffre en DM Sans — lisible, pas en serif */}
      <div style={{ fontSize: '44px', fontWeight: 700, color, fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────
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
        const nl = payload.new as Lead;
        setLeads(prev => [nl, ...prev]);
        setNewLeadAlert(nl);
        clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => setNewLeadAlert(null), 6000);
        if (notifEnabled && Notification.permission === 'granted') {
          new Notification('🔥 Nouveau lead — LANDMARK ESTATE', {
            body: `${displayName(nl) || 'Prospect'} · ${citiesLabel(nl.preferred_cities) || 'Nouvelle demande'}`,
            icon: '/favicon.ico',
          });
        }
      }).subscribe();
    return () => { supabase.removeChannel(ch); clearTimeout(alertTimer.current); };
  }, [notifEnabled]);

  const requestNotif = async () => {
    if (!('Notification' in window)) return;
    setNotifEnabled((await Notification.requestPermission()) === 'granted');
  };

  const openLead = (lead: Lead) => {
    setSelected(lead);
    setEditForm({
      first_name:  lead.first_name  || '',
      last_name:   lead.last_name   || '',
      email:       lead.email       || '',
      phone:       lead.phone       || '',
      citiesText:  citiesLabel(lead.preferred_cities),
      budget_min:  lead.budget_min,
      budget_max:  lead.budget_max,
      status:      lead.status      || 'new',
      priority:    lead.priority    || 'medium',
      lead_type:   lead.lead_type   || 'acheteur',
      assigned_to: lead.assigned_to || '',
      notes:       lead.notes       || '',
    });
  };

  const validate = (f: any): string | null => {
    if (!f.first_name?.trim() || f.first_name.trim().length < 2) return 'Prénom : minimum 2 caractères.';
    if (!f.last_name?.trim()  || f.last_name.trim().length  < 2) return 'Nom : minimum 2 caractères.';
    if (!f.phone?.trim() || !PHONE_RE.test(f.phone.trim()))      return 'Téléphone invalide (+212XXXXXXXXX ou 0XXXXXXXXX).';
    if (f.email?.trim() && !EMAIL_RE.test(f.email.trim()))       return 'Email invalide.';
    const mn = f.budget_min, mx = f.budget_max;
    if (mn != null && mn <= 0) return 'Budget min doit être > 0.';
    if (mx != null && mx <= 0) return 'Budget max doit être > 0.';
    if (mn != null && mx != null && mx < mn) return 'Budget max doit être ≥ budget min.';
    return null;
  };

  const saveLead = async () => {
    if (!supabase || !selected) return;
    const err = validate(editForm); if (err) { alert(err); return; }
    setSaving(true);
    const cities = editForm.citiesText
      ? String(editForm.citiesText).split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    const patch = {
      first_name:       editForm.first_name.trim(),
      last_name:        editForm.last_name.trim(),
      email:            editForm.email?.trim() || null,
      phone:            editForm.phone.trim(),
      preferred_cities: cities,
      budget_min:       editForm.budget_min || null,
      budget_max:       editForm.budget_max || null,
      status:           editForm.status,
      priority:         editForm.priority   || 'medium',
      lead_type:        editForm.lead_type  || 'acheteur',
      assigned_to:      editForm.assigned_to?.trim() || null,
      notes:            editForm.notes?.trim() || null,
      updated_at:       new Date().toISOString(),
    };
    const { error: e } = await supabase.from('leads').update(patch).eq('id', selected.id);
    if (!e) {
      setLeads(prev => prev.map(l => l.id === selected.id ? { ...l, ...patch } as Lead : l));
      setSelected(s => s ? { ...s, ...patch } as Lead : null);
    } else { alert('Erreur : ' + e.message); }
    setSaving(false);
  };

  const deleteLead = async (id: string) => {
    if (!supabase || !confirm('Supprimer ce lead définitivement ?')) return;
    await supabase.from('leads').delete().eq('id', id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = leads.filter(l => {
    const tab    = activeTab === 'all' || getSrcKey(l) === activeTab;
    const srch   = !search || [displayName(l), l.email, citiesLabel(l.preferred_cities), l.phone, l.notes]
      .some(s => s?.toLowerCase().includes(search.toLowerCase()));
    const status = statusFilter === 'all' || l.status === statusFilter;
    return tab && srch && status;
  });
  const sorted = [...filtered].sort((a, b) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  // ── KPI : comptage par lead_type ──
  const kpis = [
    { key: 'acheteur',     ...LEAD_TYPE_CONFIG.acheteur,     value: leads.filter(l => l.lead_type === 'acheteur').length     },
    { key: 'proprietaire', ...LEAD_TYPE_CONFIG.proprietaire, value: leads.filter(l => l.lead_type === 'proprietaire').length  },
    { key: 'promoteur',    ...LEAD_TYPE_CONFIG.promoteur,    value: leads.filter(l => l.lead_type === 'promoteur').length     },
  ];

  const inp: React.CSSProperties = {
    width:'100%', padding:'9px 11px', borderRadius:'7px',
    border:`1px solid ${T.borderSoft}`, fontSize:'13px',
    fontFamily:"'DM Sans',sans-serif", color:T.navy, background:'#fff', boxSizing:'border-box',
  };
  const lbl: React.CSSProperties = {
    fontSize:'11px', color:T.muted, textTransform:'uppercase',
    display:'inline-block', marginBottom:'5px', letterSpacing:'0.04em',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .lm-card{transition:all .18s ease;cursor:pointer;}
        .lm-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(13,31,60,.06)!important;}
        .lm-card.sel{border-color:#C8A96E!important;box-shadow:0 0 0 2px rgba(200,169,110,.12)!important;}
        .lm-search:focus,.lm-input:focus{border-color:rgba(200,169,110,.4)!important;outline:none!important;}
        .lm-tab{transition:all .15s;cursor:pointer;border:none;}
        .lm-tab:hover{background:rgba(200,169,110,.08)!important;}
        ::placeholder{color:rgba(13,31,60,.3)!important;}
      `}</style>

      <div style={{ minHeight:'100%', background:T.ivory, padding:'28px 32px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>

        {/* ── ALERTE ── */}
        {newLeadAlert && (
          <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:9999, background:'#fff', borderRadius:'14px', padding:'14px 18px', boxShadow:'0 8px 32px rgba(13,31,60,.15)', border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:'12px', maxWidth:'340px' }}>
            <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🔥</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'13px', fontWeight:600, color:T.navy }}>Nouveau lead !</div>
              <div style={{ fontSize:'12px', color:T.muted }}>{displayName(newLeadAlert) || 'Prospect'}</div>
            </div>
            <button onClick={() => setNewLeadAlert(null)} style={{ background:'transparent', border:'none', cursor:'pointer', color:T.muted, fontSize:'16px' }}>×</button>
          </div>
        )}

        {/* ── HEADER ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'28px' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'4px 12px', borderRadius:'100px', background:'rgba(200,169,110,0.1)', border:`1px solid ${T.border}`, marginBottom:'10px' }}>
              <Users size={11} style={{ color:T.gold }} />
              <span style={{ fontSize:'10px', fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', color:T.gold }}>Prospects qualifiés</span>
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'32px', fontWeight:300, color:T.navy, margin:0 }}>
              Mes <span style={{ color:T.gold, fontStyle:'italic' }}>Clients</span>
            </h1>
            <p style={{ fontSize:'12px', color:T.muted, marginTop:'4px' }}>{leads.length} leads — {kpis[0].value} acheteurs · {kpis[1].value} propriétaires · {kpis[2].value} promoteurs</p>
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <button onClick={requestNotif} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 16px', borderRadius:'9px', border:`1px solid ${notifEnabled ? 'rgba(22,163,74,.3)' : T.borderSoft}`, background:'#fff', color:T.muted, fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
              {notifEnabled ? <Bell size={13} style={{ color:'#16a34a' }} /> : <BellOff size={13} />}
              {notifEnabled ? 'Notifications Actives' : 'Notifier les nouveaux leads'}
            </button>
            <button onClick={load} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'#16a34a', color:'#fff', fontSize:'13px', fontWeight:500, borderRadius:'9px', border:'none', cursor:'pointer' }}>
              <RefreshCw size={13} style={{ animation:loading ? 'spin 1s linear infinite' : 'none' }} /> Actualiser
            </button>
          </div>
        </div>

        {/* ── 3 KPI CARDS : Acheteur / Propriétaire / Promoteur ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'28px' }}>
          {kpis.map(k => (
            <KpiCard key={k.key} icon={k.icon} label={k.label} value={k.value} color={k.color} bg={k.bg} />
          ))}
        </div>

        {/* ── ONGLETS source ── */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            const count  = tab.key === 'all' ? leads.length : leads.filter(l => getSrcKey(l) === tab.key).length;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="lm-tab"
                style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 16px', borderRadius:'9px', background:active ? T.navy : '#fff', color:active ? T.gold : T.muted, border:`1px solid ${active ? T.navy : T.borderSoft}`, fontSize:'13px', fontWeight:500 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
                <span style={{ fontSize:'11px', fontWeight:700, padding:'1px 7px', borderRadius:'999px', background:active ? 'rgba(200,169,110,.2)' : 'rgba(13,31,60,.05)', color:active ? T.gold : T.muted }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── RECHERCHE + filtre statut ── */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'20px', alignItems:'center' }}>
          <div style={{ position:'relative', width:'380px' }}>
            <Search size={14} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:T.muted }} />
            <input type="text" placeholder="Rechercher par nom, email, ville, téléphone…" value={search} onChange={e => setSearch(e.target.value)} className="lm-search"
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

        {/* ── GRILLE leads + panneau admin ── */}
        <div style={{ display:'grid', gridTemplateColumns:selected ? '1fr 380px' : 'repeat(auto-fill,minmax(320px,1fr))', gap:'16px' }}>

          <div style={{ display:'grid', gridTemplateColumns:selected ? '1fr' : 'repeat(auto-fill,minmax(320px,1fr))', gap:'16px' }}>
            {sorted.map(lead => {
              const st    = STATUS_OPTS[lead.status || 'new'] || STATUS_OPTS.new;
              const src   = getSrc(lead);
              const isSel = selected?.id === lead.id;
              const name  = displayName(lead);
              const cities= citiesLabel(lead.preferred_cities);
              const prio  = lead.priority ? PRIORITY_OPTS[lead.priority] : null;
              const ltCfg = lead.lead_type ? LEAD_TYPE_CONFIG[lead.lead_type as keyof typeof LEAD_TYPE_CONFIG] : null;
              return (
                <div key={lead.id} className={`lm-card${isSel?' sel':''}`}
                  onClick={() => isSel ? setSelected(null) : openLead(lead)}
                  style={{ background:'#fff', borderRadius:'12px', border:`1px solid ${T.borderSoft}`, padding:'20px', position:'relative', overflow:'hidden' }}>

                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${T.gold},${T.goldLight})` }} />

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'14px' }}>
                    <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                      <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:T.navy, display:'flex', alignItems:'center', justifyContent:'center', color:T.gold, fontSize:'16px', fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>
                        {(name?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize:'14px', fontWeight:600, color:T.navy, marginBottom:'2px' }}>{name || 'Sans nom'}</div>
                        <div style={{ fontSize:'12px', color:T.muted }}>{lead.email || lead.phone || '—'}</div>
                        {cities && <div style={{ fontSize:'12px', color:T.muted, display:'flex', alignItems:'center', gap:'4px', marginTop:'2px' }}><MapPin size={12}/> {cities}</div>}
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'5px' }}>
                      <span style={{ background:st.bg, color:st.color, padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600 }}>{st.label}</span>
                      <span style={{ background:src.bg, color:src.color, padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, border:`1px solid ${src.border}` }}>{src.icon} {src.label}</span>
                      {ltCfg && <span style={{ background:ltCfg.bg, color:ltCfg.color, padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600 }}>{ltCfg.icon} {ltCfg.label.slice(0,-1)}</span>}
                      {prio  && <span style={{ color:prio.color, fontSize:'11px', fontWeight:600 }}>● {prio.label}</span>}
                    </div>
                  </div>

                  <div style={{ fontSize:'14px', fontWeight:600, color:T.gold, marginBottom:'16px' }}>
                    {fmtBudget(lead.budget_min, lead.budget_max) || 'Budget non spécifié'}
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:`1px solid ${T.borderSoft}`, paddingTop:'12px' }}>
                    <span style={{ fontSize:'12px', color:T.muted }}>{timeAgo(lead.created_at)}</span>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button onClick={e => { e.stopPropagation(); lead.phone ? window.open(`tel:${lead.phone}`) : alert('Aucun numéro'); }}
                        style={{ background:'#E8F5E9', color:'#2E7D32', border:'none', padding:'6px 12px', borderRadius:'6px', fontSize:'12px', fontWeight:600, display:'flex', alignItems:'center', gap:'4px', cursor:'pointer' }}>
                        <Phone size={12}/> Appeler
                      </button>
                      <button onClick={e => { e.stopPropagation(); lead.email ? window.open(`mailto:${lead.email}`) : alert('Aucun email'); }}
                        style={{ background:'#F5F0E6', color:T.gold, border:'none', padding:'6px 12px', borderRadius:'6px', fontSize:'12px', fontWeight:600, display:'flex', alignItems:'center', gap:'4px', cursor:'pointer' }}>
                        <Mail size={12}/> Email
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

          {/* ── PANNEAU ADMIN ── */}
          {selected && (
            <div style={{ background:'#fff', borderRadius:'12px', border:`1px solid ${T.borderSoft}`, padding:'24px', position:'sticky', top:'24px', height:'fit-content' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                <h3 style={{ margin:0, fontSize:'16px', color:T.navy, fontFamily:"'Cormorant Garamond',serif", fontWeight:400 }}>Gérer le Lead</h3>
                <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', fontSize:'18px', cursor:'pointer', color:T.muted }}>×</button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                <div style={{ display:'flex', gap:'10px' }}>
                  <div style={{ flex:1 }}><label style={lbl}>Prénom *</label><input className="lm-input" style={inp} value={editForm.first_name||''} onChange={e=>setEditForm((f:any)=>({...f,first_name:e.target.value}))} placeholder="Prénom"/></div>
                  <div style={{ flex:1 }}><label style={lbl}>Nom *</label><input className="lm-input" style={inp} value={editForm.last_name||''} onChange={e=>setEditForm((f:any)=>({...f,last_name:e.target.value}))} placeholder="Nom"/></div>
                </div>

                <div><label style={lbl}>Téléphone *</label><input className="lm-input" style={inp} value={editForm.phone||''} onChange={e=>setEditForm((f:any)=>({...f,phone:e.target.value}))} placeholder="+212600000000"/></div>
                <div><label style={lbl}>Email</label><input className="lm-input" style={inp} type="email" value={editForm.email||''} onChange={e=>setEditForm((f:any)=>({...f,email:e.target.value}))} placeholder="email@exemple.com"/></div>
                <div><label style={lbl}>Villes (séparées par virgules)</label><input className="lm-input" style={inp} value={editForm.citiesText||''} onChange={e=>setEditForm((f:any)=>({...f,citiesText:e.target.value}))} placeholder="Tanger, Casablanca"/></div>

                <div style={{ display:'flex', gap:'10px' }}>
                  <div style={{ flex:1 }}><label style={lbl}>Budget min</label><input className="lm-input" style={inp} type="number" value={editForm.budget_min??''} onChange={e=>setEditForm((f:any)=>({...f,budget_min:e.target.value?Number(e.target.value):undefined}))} placeholder="0"/></div>
                  <div style={{ flex:1 }}><label style={lbl}>Budget max</label><input className="lm-input" style={inp} type="number" value={editForm.budget_max??''} onChange={e=>setEditForm((f:any)=>({...f,budget_max:e.target.value?Number(e.target.value):undefined}))} placeholder="0"/></div>
                </div>

                {/* Type de lead — admin peut modifier */}
                <div>
                  <label style={lbl}>Type de lead</label>
                  <select value={editForm.lead_type||'acheteur'} onChange={e=>setEditForm((f:any)=>({...f,lead_type:e.target.value}))} style={{...inp,cursor:'pointer'}}>
                    <option value="acheteur">🛒 Acheteur</option>
                    <option value="proprietaire">🏠 Propriétaire</option>
                    <option value="promoteur">📊 Promoteur</option>
                  </select>
                </div>

                <div style={{ display:'flex', gap:'10px' }}>
                  <div style={{ flex:1 }}>
                    <label style={lbl}>Statut</label>
                    <select value={editForm.status||'new'} onChange={e=>setEditForm((f:any)=>({...f,status:e.target.value}))} style={{...inp,cursor:'pointer'}}>
                      {STATUS_ORDER.map(s=><option key={s} value={s}>{STATUS_OPTS[s].label}</option>)}
                    </select>
                  </div>
                  <div style={{ flex:1 }}>
                    <label style={lbl}>Priorité</label>
                    <select value={editForm.priority||'medium'} onChange={e=>setEditForm((f:any)=>({...f,priority:e.target.value}))} style={{...inp,cursor:'pointer'}}>
                      {Object.entries(PRIORITY_OPTS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                </div>

                <div><label style={lbl}>Assigné à</label><input className="lm-input" style={inp} value={editForm.assigned_to||''} onChange={e=>setEditForm((f:any)=>({...f,assigned_to:e.target.value}))} placeholder="Nom de l'agent"/></div>

                <div>
                  <label style={lbl}>Notes</label>
                  <textarea className="lm-input" value={editForm.notes||''} onChange={e=>setEditForm((f:any)=>({...f,notes:e.target.value}))}
                    style={{...inp,minHeight:'80px',resize:'vertical',lineHeight:1.4}} placeholder="Notes internes…"/>
                </div>

                {selected.ai_conversation_summary && (
                  <div>
                    <label style={lbl}>Résumé IA</label>
                    <div style={{ fontSize:'13px', color:T.navy, background:T.ivory, padding:'12px', borderRadius:'6px', lineHeight:1.4 }}>{selected.ai_conversation_summary}</div>
                  </div>
                )}

                <button onClick={saveLead} disabled={saving}
                  style={{ width:'100%', background:T.navy, color:T.gold, border:'none', padding:'11px', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:saving?'wait':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', opacity:saving?.7:1 }}>
                  <Save size={14}/> {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
                </button>

                <button onClick={()=>deleteLead(selected.id)}
                  style={{ width:'100%', background:'#FFEBEE', color:'#C62828', border:'none', padding:'10px', borderRadius:'6px', fontSize:'12px', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                  <Trash2 size={14}/> Supprimer le prospect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}