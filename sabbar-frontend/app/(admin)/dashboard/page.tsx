'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { supabase } from '@/lib/supabase';
import {
  Building2, Users, MessageSquare, TrendingUp,
  ArrowRight, Plus, Bot, Zap,
  Clock, Phone, ChevronUp, Trophy,
  Pencil, Trash2, X, Check, AlertCircle, RefreshCw,
  Target, Mail, Star, Home, HandshakeIcon, BarChart3
} from 'lucide-react';

const T = {
  navy:      '#0D1F3C',
  navyMid:   '#122440',
  gold:      '#C8A96E',
  goldLight: '#E2C98A',
  terra:     '#B5573A',
  ivory:     '#F9F5EF',
  muted:     'rgba(13,31,60,0.45)',
  border:    'rgba(200,169,110,0.18)',
  borderSoft:'rgba(13,31,60,0.07)',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Task {
  id: string;
  label: string;
  done: boolean;
  urgent: boolean;
  due_date?: string;
}

interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  email?: string;
  phone?: string;
  subject?: string;
  city?: string;
  source?: string;
  status?: string;
  score?: number;
}

// ─── Source config ────────────────────────────────────────────────────────────
const SOURCE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  estimation:        { label: 'Estimation',       color: '#7c3aed', bg: 'rgba(124,58,237,0.1)',  icon: '🏠' },
  intermediation:    { label: 'Intermédiation',   color: T.gold,    bg: 'rgba(200,169,110,0.1)', icon: '🤝' },
  commercialisation: { label: 'Commercialisation',color: T.terra,   bg: 'rgba(181,87,58,0.1)',   icon: '📊' },
  contact_form:      { label: 'Contact',          color: '#2563eb', bg: 'rgba(37,99,235,0.1)',   icon: '✉️' },
  achat:             { label: 'Achat',            color: '#16a34a', bg: 'rgba(22,163,74,0.1)',   icon: '🛒' },
  vente:             { label: 'Vente',            color: '#d97706', bg: 'rgba(217,119,6,0.1)',   icon: '💰' },
};

function getSource(lead: Lead) {
  const s = lead.source || 'contact_form';
  // Détecter achat/vente depuis le subject
  if (lead.subject?.toLowerCase().includes('achet') || lead.subject?.toLowerCase().includes('achat')) {
    return SOURCE_CONFIG['achat'] || SOURCE_CONFIG['contact_form'];
  }
  if (lead.subject?.toLowerCase().includes('vend') || lead.subject?.toLowerCase().includes('vente')) {
    return SOURCE_CONFIG['vente'] || SOURCE_CONFIG['contact_form'];
  }
  return SOURCE_CONFIG[s] || SOURCE_CONFIG['contact_form'];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'À l\'instant';
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
}

function isHot(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < 30 * 60 * 1000; // < 30 min
}

// ─── Stats statiques ──────────────────────────────────────────────────────────
const stats = [
  { label: 'Annonces actives', value: '12',  sub: '+2 ce mois',          icon: Building2,     href: '/dashboard/properties',   accent: T.gold,    trend: '+17%' },
  { label: 'Leads qualifiés',  value: '28',  sub: '+5 cette semaine',    icon: Users,          href: '/dashboard/leads',         accent: '#16a34a', trend: '+22%' },
  { label: 'Conversations',    value: '45',  sub: '+12 aujourd\'hui',    icon: MessageSquare,  href: '/dashboard/conversations', accent: '#7c3aed', trend: '+36%' },
  { label: 'Taux conversion',  value: '87%', sub: '+3% vs mois dernier', icon: TrendingUp,     href: '/dashboard/leads',         accent: T.terra,   trend: '+3pt' },
];

// ─── Composant Leads dynamiques ───────────────────────────────────────────────
function LeadsPanel() {
  const [leads, setLeads]         = useState<Lead[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const TABS = [
    { key: 'all',              label: 'Tous',            icon: '👥' },
    { key: 'estimation',       label: 'Estimation',      icon: '🏠' },
    { key: 'intermediation',   label: 'Intermédiation',  icon: '🤝' },
    { key: 'commercialisation',label: 'Commercialisation',icon: '📊' },
    { key: 'achat',            label: 'Achat',           icon: '🛒' },
    { key: 'vente',            label: 'Vente',           icon: '💰' },
  ];

  const loadLeads = async () => {
    setLoading(true);
    if (!supabase) {
      setLeads([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('leads')
      .select('id, created_at, full_name, email, phone, subject, city, source, status, score')
      .order('created_at', { ascending: false })
      .limit(20);
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => { loadLeads(); }, []);

  // Realtime — nouveau lead = mise à jour automatique
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, payload => {
        setLeads(prev => [payload.new as Lead, ...prev].slice(0, 20));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Filtrage par onglet
  const filtered = leads.filter(l => {
    if (activeTab === 'all') return true;
    if (activeTab === 'achat') {
      return l.subject?.toLowerCase().includes('achet') || l.subject?.toLowerCase().includes('achat');
    }
    if (activeTab === 'vente') {
      return l.subject?.toLowerCase().includes('vend') || l.subject?.toLowerCase().includes('vente');
    }
    return l.source === activeTab;
  }).slice(0, 5);

  const hotCount = leads.filter(l => isHot(l.created_at)).length;

  return (
    <div style={{ background:'#fff', borderRadius:'16px', border:`1px solid ${T.borderSoft}`, overflow:'hidden', boxShadow:'0 2px 12px rgba(13,31,60,0.04)' }}>
      {/* Header */}
      <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.borderSoft}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <Users size={15} style={{ color:T.gold }} />
          <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'18px', fontWeight:400, color:T.navy }}>Derniers leads</span>
          {hotCount > 0 && (
            <span style={{ padding:'2px 8px', borderRadius:'999px', fontSize:'10px', fontWeight:700, background:'rgba(220,38,38,0.1)', color:'#dc2626', border:'1px solid rgba(220,38,38,0.2)', fontFamily:"'DM Sans',sans-serif" }}>
              🔥 {hotCount} chaud{hotCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <button onClick={loadLeads} style={{ padding:'4px', borderRadius:'6px', background:'transparent', border:'none', cursor:'pointer', color:T.muted, display:'flex' }}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <Link href="/dashboard/leads" style={{ fontSize:'11px', fontFamily:"'DM Sans',sans-serif", fontWeight:500, color:T.muted, textDecoration:'none', display:'flex', alignItems:'center', gap:'3px' }}>
            Voir tout <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* Onglets sources */}
      <div style={{ display:'flex', gap:'4px', padding:'10px 16px', borderBottom:`1px solid ${T.borderSoft}`, overflowX:'auto', scrollbarWidth:'none' }}>
        {TABS.map(tab => {
          const count = tab.key === 'all' ? leads.length
            : tab.key === 'achat' ? leads.filter(l => l.subject?.toLowerCase().includes('achet') || l.subject?.toLowerCase().includes('achat')).length
            : tab.key === 'vente' ? leads.filter(l => l.subject?.toLowerCase().includes('vend') || l.subject?.toLowerCase().includes('vente')).length
            : leads.filter(l => l.source === tab.key).length;

          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight: activeTab === tab.key ? 600 : 400, fontFamily:"'DM Sans',sans-serif", cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s', border: `1px solid ${activeTab === tab.key ? T.border : 'transparent'}`, background: activeTab === tab.key ? 'rgba(200,169,110,0.1)' : 'transparent', color: activeTab === tab.key ? T.navy : T.muted }}>
              {tab.icon} {tab.label}
              {count > 0 && <span style={{ padding:'1px 5px', borderRadius:'10px', background: activeTab === tab.key ? T.gold : 'rgba(13,31,60,0.08)', color: activeTab === tab.key ? T.navy : T.muted, fontSize:'10px', fontWeight:700 }}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Liste leads */}
      {loading ? (
        <div style={{ padding:'28px', textAlign:'center' }}>
          <RefreshCw size={18} style={{ color:T.gold, margin:'0 auto', display:'block', animation:'spin 1s linear infinite' }} />
        </div>
      ) : !supabase ? (
        <div style={{ padding:'20px', textAlign:'center' }}>
          <AlertCircle size={18} style={{ color:T.terra, margin:'0 auto 8px', display:'block' }} />
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', color:T.terra }}>Supabase non configuré</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding:'28px', textAlign:'center' }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', color:T.muted }}>Aucun lead pour ce filtre</p>
        </div>
      ) : (
        filtered.map((lead, i) => {
          const src = getSource(lead);
          const hot = isHot(lead.created_at);
          return (
            <div key={lead.id} className="lm-lead"
              style={{ padding:'11px 20px', display:'flex', alignItems:'center', gap:'11px', borderBottom: i < filtered.length-1 ? `1px solid ${T.borderSoft}` : 'none', cursor:'pointer', transition:'background 0.15s' }}>
              {/* Avatar */}
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:`linear-gradient(135deg,${T.navy},#1e3a5f)`, display:'flex', alignItems:'center', justifyContent:'center', color:T.goldLight, fontSize:'13px', fontFamily:"'Cormorant Garamond',serif" }}>
                  {lead.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                {hot && <span className="lm-hotdot" style={{ position:'absolute', top:'-1px', right:'-1px', width:'8px', height:'8px', borderRadius:'50%', background:'#dc2626', border:'2px solid #fff' }} />}
              </div>

              {/* Infos */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'2px' }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:500, color:T.navy, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {lead.full_name}
                  </span>
                  {/* Badge source */}
                  <span style={{ flexShrink:0, padding:'1px 6px', borderRadius:'4px', fontSize:'9px', fontWeight:700, fontFamily:"'DM Sans',sans-serif", background:src.bg, color:src.color }}>
                    {src.icon} {src.label}
                  </span>
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:T.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {lead.subject || lead.city || lead.email || '—'}
                </div>
              </div>

              {/* Actions rapides + temps */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px', flexShrink:0 }}>
                <div style={{ display:'flex', gap:'4px' }}>
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
                      style={{ width:'24px', height:'24px', borderRadius:'6px', background:'rgba(22,163,74,0.1)', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}
                      title={`Appeler ${lead.phone}`}>
                      <Phone size={11} style={{ color:'#16a34a' }} />
                    </a>
                  )}
                  {lead.email && (
                    <a href={`mailto:${lead.email}?subject=Suite à votre demande — LANDMARK ESTATE`} onClick={e => e.stopPropagation()}
                      style={{ width:'24px', height:'24px', borderRadius:'6px', background:'rgba(200,169,110,0.1)', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}
                      title={`Email ${lead.email}`}>
                      <Mail size={11} style={{ color:T.gold }} />
                    </a>
                  )}
                </div>
                <span style={{ fontSize:'10px', color:T.muted, fontFamily:"'DM Sans',sans-serif" }}>{timeAgo(lead.created_at)}</span>
              </div>
            </div>
          );
        })
      )}

      {/* Footer */}
      <div style={{ padding:'10px 20px', background:'rgba(200,169,110,0.04)', borderTop:`1px solid ${T.borderSoft}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/dashboard/leads" style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', fontFamily:"'DM Sans',sans-serif", fontWeight:500, color:T.gold, textDecoration:'none' }}>
          <Phone size={11} /> Gérer tous les leads
        </Link>
        {leads.length > 0 && (
          <span style={{ fontSize:'10px', color:T.muted, fontFamily:"'DM Sans',sans-serif" }}>
            {leads.length} lead{leads.length > 1 ? 's' : ''} total
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Composant Tâches dynamiques ─────────────────────────────────────────────
function TasksPanel() {
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [loading, setLoading]     = useState(true);
  const [newLabel, setNewLabel]   = useState('');
  const [newUrgent, setNewUrgent] = useState(false);
  const [adding, setAdding]       = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    if (!supabase) {
      setTasks([
        { id: '1', label: 'Rappeler Karim Alaoui',      done: true,  urgent: false },
        { id: '2', label: 'Visite villa Marrakech 14h', done: false, urgent: true  },
        { id: '3', label: 'Envoyer offre Youssef',      done: false, urgent: false },
        { id: '4', label: 'Mise à jour annonce Anfa',   done: false, urgent: false },
      ]);
      setLoading(false);
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('tasks').select('*').eq('due_date', today).order('created_at', { ascending: true });
    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => { loadTasks(); }, []);

  const toggleDone = async (task: Task) => {
    const updated = !task.done;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: updated } : t));
    if (supabase) await supabase.from('tasks').update({ done: updated }).eq('id', task.id);
  };

  const addTask = async () => {
    if (!newLabel.trim()) return;
    setAdding(true);
    const today = new Date().toISOString().split('T')[0];
    const newTask: Task = { id: crypto.randomUUID(), label: newLabel.trim(), done: false, urgent: newUrgent, due_date: today };
    if (supabase) {
      const { data } = await supabase.from('tasks').insert({ label: newLabel.trim(), done: false, urgent: newUrgent, due_date: today }).select().single();
      if (data) newTask.id = data.id;
    }
    setTasks(prev => [...prev, newTask]);
    setNewLabel(''); setNewUrgent(false); setShowForm(false); setAdding(false);
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (supabase) await supabase.from('tasks').delete().eq('id', id);
  };

  const startEdit = (task: Task) => { setEditId(task.id); setEditLabel(task.label); };
  const saveEdit = async () => {
    if (!editLabel.trim() || !editId) return;
    setTasks(prev => prev.map(t => t.id === editId ? { ...t, label: editLabel.trim() } : t));
    if (supabase) await supabase.from('tasks').update({ label: editLabel.trim() }).eq('id', editId);
    setEditId(null); setEditLabel('');
  };

  const toggleUrgent = async (task: Task) => {
    const updated = !task.urgent;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, urgent: updated } : t));
    if (supabase) await supabase.from('tasks').update({ urgent: updated }).eq('id', task.id);
  };

  const doneTasks  = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;
  const taskPct    = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div style={{ background:'#fff', borderRadius:'16px', border:`1px solid ${T.borderSoft}`, overflow:'hidden', boxShadow:'0 2px 12px rgba(13,31,60,0.04)' }}>
      <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.borderSoft}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <Target size={15} style={{ color:T.terra }} />
          <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'18px', fontWeight:400, color:T.navy }}>Tâches du jour</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
          {totalTasks > 0 && (
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', fontWeight:600, color:T.terra, padding:'2px 7px', borderRadius:'6px', background:`${T.terra}10` }}>
              {totalTasks - doneTasks} restantes
            </span>
          )}
          <button onClick={loadTasks} style={{ padding:'4px', borderRadius:'6px', background:'transparent', border:'none', cursor:'pointer', color:T.muted, display:'flex' }}>
            <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button onClick={() => setShowForm(v => !v)}
            style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'4px 9px', borderRadius:'7px', background: showForm ? `${T.terra}10` : `${T.gold}15`, border:`1px solid ${showForm ? T.terra : T.border}`, color: showForm ? T.terra : T.gold, fontSize:'11px', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
            {showForm ? <><X size={10} /> Annuler</> : <><Plus size={10} /> Ajouter</>}
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ padding:'12px 20px', background:'rgba(200,169,110,0.04)', borderBottom:`1px solid ${T.borderSoft}`, display:'flex', flexDirection:'column', gap:'9px' }}>
          <input type="text" placeholder="Nom de la tâche..." value={newLabel} onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') setShowForm(false); }}
            autoFocus
            style={{ width:'100%', padding:'8px 11px', borderRadius:'8px', border:`1px solid ${T.border}`, background:T.ivory, color:T.navy, fontSize:'13px', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' }} />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', userSelect:'none' }}>
              <div onClick={() => setNewUrgent(v => !v)}
                style={{ width:'15px', height:'15px', borderRadius:'4px', border:`2px solid ${newUrgent ? T.terra : 'rgba(13,31,60,0.2)'}`, background: newUrgent ? T.terra : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s', flexShrink:0 }}>
                {newUrgent && <Check size={9} style={{ color:'#fff' }} />}
              </div>
              <span style={{ fontSize:'12px', color: newUrgent ? T.terra : T.muted, fontFamily:"'DM Sans',sans-serif", fontWeight: newUrgent ? 600 : 400 }}>Urgent</span>
            </label>
            <button onClick={addTask} disabled={adding || !newLabel.trim()}
              style={{ padding:'6px 14px', borderRadius:'7px', background: newLabel.trim() ? `linear-gradient(135deg,${T.gold},${T.goldLight})` : 'rgba(200,169,110,0.3)', color:T.navy, fontSize:'12px', fontWeight:600, border:'none', cursor: newLabel.trim() ? 'pointer' : 'not-allowed', fontFamily:"'DM Sans',sans-serif" }}>
              {adding ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding:'28px', textAlign:'center' }}>
          <RefreshCw size={16} style={{ color:T.gold, margin:'0 auto', display:'block', animation:'spin 1s linear infinite' }} />
        </div>
      ) : tasks.length === 0 ? (
        <div style={{ padding:'28px', textAlign:'center' }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', color:T.muted }}>Aucune tâche pour aujourd'hui</p>
          <button onClick={() => setShowForm(true)} style={{ marginTop:'8px', padding:'7px 14px', borderRadius:'8px', background:`rgba(200,169,110,0.1)`, border:`1px solid ${T.border}`, color:T.gold, fontSize:'12px', fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
            + Ajouter une tâche
          </button>
        </div>
      ) : (
        tasks.map((task, i) => (
          <div key={task.id} className="lm-task-row"
            style={{ padding:'10px 20px', display:'flex', alignItems:'center', gap:'9px', borderBottom: i < tasks.length-1 ? `1px solid ${T.borderSoft}` : 'none', transition:'background 0.15s', opacity: task.done ? 0.5 : 1 }}>
            <button onClick={() => toggleDone(task)}
              style={{ flexShrink:0, width:'18px', height:'18px', borderRadius:'50%', border:`2px solid ${task.done ? '#16a34a' : 'rgba(13,31,60,0.15)'}`, background: task.done ? '#16a34a' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s' }}>
              {task.done && <Check size={10} style={{ color:'#fff' }} />}
            </button>

            {editId === task.id ? (
              <input type="text" value={editLabel} onChange={e => setEditLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditId(null); }}
                autoFocus
                style={{ flex:1, padding:'4px 7px', borderRadius:'6px', border:`1px solid ${T.gold}`, background:T.ivory, color:T.navy, fontSize:'13px', fontFamily:"'DM Sans',sans-serif", outline:'none' }} />
            ) : (
              <span style={{ flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:'13px', color:T.navy, textDecoration: task.done ? 'line-through' : 'none', fontWeight: task.urgent ? 600 : 400 }}>{task.label}</span>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:'4px', flexShrink:0 }}>
              {!task.done && (
                <button onClick={() => toggleUrgent(task)}
                  style={{ padding:'1px 6px', borderRadius:'4px', fontSize:'9px', fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:'pointer', border:`1px solid ${task.urgent ? T.terra+'40' : 'rgba(13,31,60,0.1)'}`, background: task.urgent ? `${T.terra}10` : 'transparent', color: task.urgent ? T.terra : T.muted }}>
                  {task.urgent ? 'Urgent' : '!'}
                </button>
              )}
              {editId === task.id ? (
                <>
                  <button onClick={saveEdit} style={{ padding:'3px', borderRadius:'4px', background:'rgba(22,163,74,0.1)', border:'none', cursor:'pointer', color:'#16a34a', display:'flex' }}><Check size={11} /></button>
                  <button onClick={() => setEditId(null)} style={{ padding:'3px', borderRadius:'4px', background:'rgba(181,87,58,0.1)', border:'none', cursor:'pointer', color:T.terra, display:'flex' }}><X size={11} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(task)} style={{ padding:'3px', borderRadius:'4px', background:'transparent', border:'none', cursor:'pointer', color:T.muted, display:'flex' }}
                    onMouseEnter={e => e.currentTarget.style.color = T.gold} onMouseLeave={e => e.currentTarget.style.color = T.muted}>
                    <Pencil size={11} />
                  </button>
                  <button onClick={() => deleteTask(task.id)} style={{ padding:'3px', borderRadius:'4px', background:'transparent', border:'none', cursor:'pointer', color:T.muted, display:'flex' }}
                    onMouseEnter={e => e.currentTarget.style.color = T.terra} onMouseLeave={e => e.currentTarget.style.color = T.muted}>
                    <Trash2 size={11} />
                  </button>
                </>
              )}
              {!task.urgent && !task.done && editId !== task.id && <Clock size={10} style={{ color:'rgba(13,31,60,0.15)' }} />}
            </div>
          </div>
        ))
      )}

      {tasks.length > 0 && (
        <div style={{ padding:'12px 20px', borderTop:`1px solid ${T.borderSoft}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
            <span style={{ fontSize:'11px', fontFamily:"'DM Sans',sans-serif", color:T.muted }}>Progression journée</span>
            <span style={{ fontSize:'11px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, color:T.navy }}>{taskPct}%</span>
          </div>
          <div style={{ height:'5px', borderRadius:'3px', background:T.borderSoft, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${taskPct}%`, background:`linear-gradient(90deg,${T.gold},${T.goldLight})`, borderRadius:'3px', transition:'width 0.5s ease' }} />
          </div>
          {taskPct === 100 && <div style={{ marginTop:'6px', fontSize:'11px', color:'#16a34a', fontFamily:"'DM Sans',sans-serif", fontWeight:500, textAlign:'center' }}>🎉 Toutes les tâches complètes !</div>}
        </div>
      )}

      {!supabase && (
        <div style={{ padding:'8px 20px', background:'rgba(181,87,58,0.05)', borderTop:`1px solid rgba(181,87,58,0.1)`, display:'flex', alignItems:'center', gap:'5px' }}>
          <AlertCircle size={10} style={{ color:T.terra }} />
          <span style={{ fontSize:'10px', color:T.terra, fontFamily:"'DM Sans',sans-serif" }}>Supabase non configuré — tâches non sauvegardées</span>
        </div>
      )}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(' ')[0] || 'Agent';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@400;500;600&display=swap');
        .lm-stat { transition:all 0.25s ease; text-decoration:none; display:block; }
        .lm-stat:hover { transform:translateY(-4px); box-shadow:0 20px 48px rgba(13,31,60,0.1)!important; border-color:rgba(200,169,110,0.4)!important; }
        .lm-lead:hover { background:rgba(200,169,110,0.04)!important; }
        .lm-task-row:hover { background:rgba(200,169,110,0.03); }
        .lm-newbtn:hover { transform:translateY(-2px); box-shadow:0 16px 36px rgba(200,169,110,0.35)!important; }
        .lm-conv:hover { background:rgba(200,169,110,0.1)!important; color:#C8A96E!important; }
        .lm-hotdot { animation:pulsedot 1.5s infinite; }
        .lm-activedot { animation:pulsedot 2s infinite; }
        @keyframes pulsedot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .a1{animation:slideUp .4s .05s both} .a2{animation:slideUp .4s .12s both}
        .a3{animation:slideUp .4s .18s both} .a4{animation:slideUp .4s .24s both}
        .a5{animation:slideUp .4s .30s both} .a6{animation:slideUp .4s .36s both}
        ::-webkit-scrollbar{display:none}
      `}</style>

      <div style={{ minHeight:'100%', background:T.ivory, fontFamily:"'DM Sans',system-ui,sans-serif" }}>

        {/* ══ HERO ══ */}
        <div style={{ background:`linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 60%,#091629 100%)`, padding:'32px 40px 40px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'360px', height:'360px', borderRadius:'50%', background:'radial-gradient(circle,rgba(200,169,110,0.1) 0%,transparent 65%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-60px', left:'25%', width:'240px', height:'240px', borderRadius:'50%', background:'radial-gradient(circle,rgba(200,169,110,0.06) 0%,transparent 65%)', pointerEvents:'none' }} />
          <div style={{ maxWidth:'1200px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1, flexWrap:'wrap', gap:'16px' }}>
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'4px 13px', borderRadius:'100px', background:'rgba(200,169,110,0.1)', border:'1px solid rgba(200,169,110,0.22)', marginBottom:'14px' }}>
                <span className="lm-activedot" style={{ width:'6px', height:'6px', borderRadius:'50%', background:T.gold, display:'inline-block' }} />
                <span style={{ fontSize:'10px', fontWeight:500, letterSpacing:'0.2em', textTransform:'uppercase', color:T.gold, fontFamily:"'DM Sans',sans-serif" }}>
                  {new Date().toLocaleDateString('fr-FR',{ weekday:'long', day:'numeric', month:'long' })}
                </span>
              </div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(28px,3.5vw,42px)', fontWeight:300, color:'#F9F5EF', margin:'0 0 8px', lineHeight:1.1 }}>
                {greeting}, <span style={{ color:T.gold, fontStyle:'italic' }}>{firstName}</span> 👋
              </h1>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', color:'rgba(226,201,138,0.5)', margin:0 }}>Gérez vos propriétés et leads en un seul endroit</p>
            </div>
            <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
              <div style={{ padding:'14px 18px', background:'rgba(200,169,110,0.08)', borderRadius:'12px', border:'1px solid rgba(200,169,110,0.18)', textAlign:'center' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'26px', fontWeight:300, color:T.gold, lineHeight:1 }}>87%</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(226,201,138,0.4)', marginTop:'4px', letterSpacing:'0.1em', textTransform:'uppercase' }}>Conversion</div>
              </div>
              <Link href="/dashboard/properties/new" className="lm-newbtn"
                style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'13px 22px', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, color:T.navy, fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:600, borderRadius:'12px', textDecoration:'none', transition:'all 0.25s', letterSpacing:'0.03em', boxShadow:'0 4px 20px rgba(200,169,110,0.25)', whiteSpace:'nowrap' }}>
                <Plus size={15} /> Nouvelle annonce
              </Link>
            </div>
          </div>
        </div>

        <div style={{ padding:'28px 40px', maxWidth:'1200px', margin:'0 auto' }}>

          {/* ══ STATS ══ */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'24px' }}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <Link key={s.label} href={s.href} className={`lm-stat a${i+1}`}
                  style={{ background:'#fff', borderRadius:'14px', padding:'20px', border:`1px solid ${T.borderSoft}`, boxShadow:'0 2px 12px rgba(13,31,60,0.04)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${s.accent},${s.accent}44)` }} />
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'14px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'9px', background:`${s.accent}12`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={16} style={{ color:s.accent }} />
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'2px', padding:'2px 7px', borderRadius:'6px', background:'rgba(22,163,74,0.08)', fontSize:'10px', fontWeight:600, color:'#16a34a', fontFamily:"'DM Sans',sans-serif" }}>
                      <ChevronUp size={10} />{s.trend}
                    </div>
                  </div>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'36px', fontWeight:300, color:T.navy, lineHeight:1, marginBottom:'3px' }}>{s.value}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', fontWeight:500, color:T.navy, marginBottom:'5px' }}>{s.label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'#16a34a', fontWeight:500 }}>{s.sub}</div>
                </Link>
              );
            })}
          </div>

          {/* ══ MAIN GRID ══ */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 300px', gap:'18px', marginBottom:'22px' }}>
            {/* ══ LEADS DYNAMIQUES ══ */}
            <LeadsPanel />
            {/* ══ TÂCHES DYNAMIQUES ══ */}
            <TasksPanel />

            {/* Agent IA */}
            <div className="a6" style={{ background:T.navy, borderRadius:'16px', padding:'22px', display:'flex', flexDirection:'column', boxShadow:'0 8px 32px rgba(13,31,60,0.2)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'180px', height:'180px', borderRadius:'50%', background:'radial-gradient(circle,rgba(200,169,110,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'11px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'11px', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Bot size={19} style={{ color:T.navy }} />
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'16px', fontWeight:400, color:'#F9F5EF' }}>Agent IA</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(226,201,138,0.4)' }}>Qualification auto</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 9px', borderRadius:'100px', background:'rgba(22,163,74,0.12)', border:'1px solid rgba(22,163,74,0.2)' }}>
                  <span className="lm-activedot" style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#4ade80', display:'inline-block' }} />
                  <span style={{ fontSize:'10px', fontWeight:500, color:'#4ade80', fontFamily:"'DM Sans',sans-serif" }}>Actif</span>
                </div>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', color:'rgba(226,201,138,0.4)', lineHeight:1.7, margin:'0 0 16px' }}>Qualifie vos prospects 24h/24 et extrait automatiquement leurs critères.</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'9px', marginBottom:'12px' }}>
                {[{ val:'87%', label:'Précision', icon:'🎯' }, { val:'45', label:'Ce mois', icon:'📈' }].map(s => (
                  <div key={s.label} style={{ background:'rgba(200,169,110,0.07)', border:'1px solid rgba(200,169,110,0.12)', borderRadius:'9px', padding:'12px', textAlign:'center' }}>
                    <div style={{ fontSize:'13px', marginBottom:'3px' }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'24px', fontWeight:300, color:T.gold, lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(226,201,138,0.35)', marginTop:'3px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(200,169,110,0.06)', borderRadius:'9px', padding:'10px 12px', marginBottom:'12px', border:'1px solid rgba(200,169,110,0.1)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'4px' }}>
                  <Zap size={10} style={{ color:T.gold }} />
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', fontWeight:500, color:T.gold }}>Dernière action</span>
                </div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(226,201,138,0.4)', margin:0, lineHeight:1.5 }}>Lead Karim qualifié — score 92 · Appart. 3ch Casablanca</p>
              </div>
              <Link href="/dashboard/conversations" className="lm-conv"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'11px', borderRadius:'9px', border:'1px solid rgba(200,169,110,0.18)', color:'rgba(226,201,138,0.45)', fontFamily:"'DM Sans',sans-serif", fontSize:'12px', fontWeight:500, textDecoration:'none', transition:'all 0.2s', marginTop:'auto' }}>
                Voir les conversations <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* ══ BARRE OBJECTIF ══ */}
          <div style={{ padding:'18px 26px', background:`linear-gradient(135deg,${T.navy} 0%,#1a3558 100%)`, borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 4px 24px rgba(13,31,60,0.15)', flexWrap:'wrap', gap:'14px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'rgba(200,169,110,0.12)', border:'1px solid rgba(200,169,110,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Trophy size={18} style={{ color:T.gold }} />
              </div>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'16px', fontWeight:400, color:'#F9F5EF' }}>
                  Objectif mensuel : <span style={{ color:T.gold, fontStyle:'italic' }}>5 transactions</span>
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(226,201,138,0.4)', marginTop:'2px' }}>3 conclues · 2 en cours · Vous êtes sur la bonne voie 💪</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ width:'150px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <span style={{ fontSize:'10px', color:'rgba(226,201,138,0.4)', fontFamily:"'DM Sans',sans-serif", letterSpacing:'0.06em' }}>PROGRESSION</span>
                  <span style={{ fontSize:'11px', color:T.gold, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>60%</span>
                </div>
                <div style={{ height:'5px', borderRadius:'3px', background:'rgba(200,169,110,0.12)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:'60%', background:`linear-gradient(90deg,${T.gold},${T.goldLight})`, borderRadius:'3px' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'5px' }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{ width:'9px', height:'9px', borderRadius:'50%', background: n<=3 ? T.gold : 'rgba(200,169,110,0.2)', border: n<=3 ? 'none' : '1px solid rgba(200,169,110,0.3)' }} />
                  ))}
                </div>
              </div>
              <Link href="/dashboard/properties/new"
                style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'9px 16px', background:'rgba(200,169,110,0.15)', border:'1px solid rgba(200,169,110,0.25)', borderRadius:'9px', color:T.gold, fontSize:'12px', fontFamily:"'DM Sans',sans-serif", fontWeight:500, textDecoration:'none', whiteSpace:'nowrap' }}>
                <Plus size={12} /> Ajouter une vente
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}