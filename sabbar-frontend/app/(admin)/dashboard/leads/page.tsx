'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Users, Phone, Mail, MapPin, DollarSign, Star,
  RefreshCw, Search, Filter, Trash2, Bell, BellOff,
  Clock
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
  contacted:   { label: 'Contacté',  color: '#d97706', bg: 'rgba(217,119,6,0.1)'   },
  in_progress: { label: 'En cours',  color: '#2563eb', bg: 'rgba(37,99,235,0.1)'   },
  converted:   { label: 'Converti',  color: '#16a34a', bg: 'rgba(22,163,74,0.1)'   },
  lost:        { label: 'Perdu',     color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
};

const TABS = [
  { key: 'all',              label: 'Tous',             icon: '👥' },
  { key: 'estimation',       label: 'Estimation',       icon: '🏠' },
  { key: 'intermediation',   label: 'Intermédiation',   icon: '🤝' },
  { key: 'commercialisation',label: 'Commercialisation',icon: '📊' },
  { key: 'achat',            label: 'Achat',            icon: '🛒' },
  { key: 'vente',            label: 'Vente',            icon: '💰' },
  { key: 'whatsapp',         label: 'WhatsApp',         icon: '💬' },
  { key: 'email',            label: 'Email',            icon: '📧' },
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

  const filtered = leads.filter(l => {
    const matchTab    = activeTab === 'all' || getSrcKey(l) === activeTab;
    const matchSearch = !search || [l.full_name, l.email, l.city, l.subject, l.phone, l.message]
      .some(s => s?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchTab && matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Structure KPI alignée sur la capture d'écran (4 colonnes épurées)
  const kpiData = [
    { label: 'TOTAL LEADS', value: leads.length, color: '#C8A96E' },
    { label: 'NOUVEAUX', value: leads.filter(l => !l.status || l.status === 'new').length, color: '#7c3aed' },
    { label: 'EN COURS', value: leads.filter(l => l.status === 'in_progress' || l.status === 'contacted').length, color: '#2563eb' },
    { label: 'CONVERTIS', value: leads.filter(l => l.status === 'converted').length, color: '#16a34a' }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulsedot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        .lm-card{transition:all 0.18s ease;cursor:pointer;}
        .lm-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(13,31,60,0.06)!important;}
        .lm-card.sel{border-color:#C8A96E!important;box-shadow:0 0 0 2px rgba(200,169,110,0.12)!important;}
        .lm-search:focus{border-color:rgba(200,169,110,0.4)!important;outline:none!important;}
        .lm-tab{transition:all 0.15s;cursor:pointer;border:none;}
        .lm-tab:hover{background:rgba(200,169,110,0.08)!important;}
        ::placeholder{color:rgba(13,31,60,0.3)!important;}
      `}</style>

      <div style={{ minHeight:'100%', background:T.ivory, padding:'28px 32px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>

        {/* Alerte nouveau lead */}
        {newLeadAlert && (
          <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:9999, background:'#fff', borderRadius:'14px', padding:'14px 18px', boxShadow:'0 8px 32px rgba(13,31,60,0.15)', border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:'12px', maxWidth:'340px' }}>
            <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🔥</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'13px', fontWeight:600, color:T.navy }}>Nouveau lead !</div>
              <div style={{ fontSize:'12px', color:T.muted }}>{newLeadAlert.full_name}</div>
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

        {/* Grille KPIs - Format Match Exact Image */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', marginBottom: '24px' }}>
          {kpiData.map((kpi, idx) => (
            <div key={idx} style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', border: `1px solid ${T.borderSoft}` }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: T.muted, letterSpacing: '0.05em', marginBottom: '12px' }}>{kpi.label}</div>
              <div style={{ fontSize: '36px', fontWeight: 300, color: kpi.color, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Barre d'onglets de filtrage par canal (Email / WhatsApp / etc.) */}
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

        {/* Bar de Recherche et Filtres */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'20px', alignItems:'center' }}>
          <div style={{ position:'relative', width:'380px' }}>
            <Search size={14} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:T.muted }} />
            <input type="text" placeholder="Rechercher par nom, email, ville, sujet..." value={search} onChange={e => setSearch(e.target.value)} className="lm-search"
              style={{ width:'100%', padding:'10px 14px 10px 38px', background:'#fff', border:`1px solid ${T.borderSoft}`, borderRadius:'8px', fontSize:'13px' }} />
          </div>
          
          <div style={{ position:'relative' }}>
            <Filter size={13} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:T.muted }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding:'10px 36px 10px 36px', background:'#fff', border:`1px solid ${T.borderSoft}`, borderRadius:'8px', fontSize:'13px', cursor:'pointer', appearance:'none' }}>
              <option value="all">Tous les statuts</option>
              <option value="new">Nouveaux</option>
              <option value="contacted">Contactés</option>
              <option value="in_progress">En cours</option>
              <option value="converted">Convertis</option>
              <option value="lost">Perdus</option>
            </select>
          </div>

          <span style={{ fontSize:'13px', color:T.muted, marginLeft:'auto' }}>
            {sorted.length} résultats
          </span>
        </div>

        {/* Main Layout Content */}
        <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 380px' : 'repeat(auto-fill, minmax(320px, 1fr))', gap:'16px' }}>
          
          {/* Liste des cartes */}
          <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap:'16px' }}>
            {sorted.map(lead => {
              const st = STATUS_OPTS[lead.status || 'new'] || STATUS_OPTS.new;
              return (
                <div key={lead.id} onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
                  style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${T.borderSoft}`, padding: '20px', position: 'relative', cursor: 'pointer' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold, fontSize: '16px', fontWeight: 600 }}>
                        ?
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', color: T.muted, marginBottom: '2px' }}>{lead.email || 'Pas d\'adresse email'}</div>
                        {lead.city && <div style={{ fontSize: '12px', color: T.muted, display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {lead.city}</div>}
                      </div>
                    </div>
                    <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{st.label}</span>
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: 600, color: T.gold, marginBottom: '16px' }}>
                    {fmtBudget(lead.budget_min, lead.budget_max) || 'Budget non spécifié'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${T.borderSoft}`, paddingTop: '12px' }}>
                    <span style={{ fontSize: '12px', color: T.muted }}>
                      {new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ background: '#E8F5E9', color: '#2E7D32', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} /> Appeler
                      </button>
                      <button style={{ background: '#F5F0E6', color: T.gold, border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> Email
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Panneau latéral complet et sécurisé */}
          {selected && (
            <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${T.borderSoft}`, padding: '24px', position: 'sticky', top: '24px', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: T.navy }}>Détails du Lead</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: T.muted }}>×</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: T.muted, textTransform: 'uppercase', display: 'inline-block', marginBottom: '4px' }}>Nom Complet</label>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: T.navy }}>{selected.full_name || '—'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: T.muted, textTransform: 'uppercase', display: 'inline-block', marginBottom: '4px' }}>Message / Demande</label>
                  <div style={{ fontSize: '13px', color: T.navy, background: T.ivory, padding: '12px', borderRadius: '6px', lineHeight: 1.4 }}>
                    {selected.message || 'Aucun message fourni.'}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: T.muted, textTransform: 'uppercase', display: 'inline-block', marginBottom: '6px' }}>Changer le Statut</label>
                  <select value={selected.status || 'new'} onChange={(e) => changeStatus(selected.id, e.target.value)} disabled={updatingStatus}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${T.borderSoft}`, fontSize: '13px' }}>
                    <option value="new">Nouveau</option>
                    <option value="contacted">Contacté</option>
                    <option value="in_progress">En cours</option>
                    <option value="converted">Converti</option>
                    <option value="lost">Perdu</option>
                  </select>
                </div>

                <button onClick={() => deleteLead(selected.id)}
                  style={{ width: '100%', background: '#FFEBEE', color: '#C62828', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
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