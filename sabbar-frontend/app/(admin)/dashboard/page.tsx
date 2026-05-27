'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { supabase } from '@/lib/supabase';
import {
  Building2, Users, MessageSquare, TrendingUp,
  ArrowRight, Plus, Bot, Star, Target, Zap,
  CheckCircle2, Clock, Phone, ChevronUp, Trophy,
  Pencil, Trash2, X, Check, AlertCircle, RefreshCw
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

// ─── Stats & leads statiques ──────────────────────────────────────────────────
const stats = [
  { label: 'Annonces actives', value: '12',  sub: '+2 ce mois',          icon: Building2,     href: '/dashboard/properties',   accent: T.gold,    trend: '+17%' },
  { label: 'Leads qualifiés',  value: '28',  sub: '+5 cette semaine',    icon: Users,          href: '/dashboard/leads',         accent: '#16a34a', trend: '+22%' },
  { label: 'Conversations',    value: '45',  sub: '+12 aujourd\'hui',    icon: MessageSquare,  href: '/dashboard/conversations', accent: '#7c3aed', trend: '+36%' },
  { label: 'Taux conversion',  value: '87%', sub: '+3% vs mois dernier', icon: TrendingUp,     href: '/dashboard/leads',         accent: T.terra,   trend: '+3pt' },
];

const recentLeads = [
  { name: 'Karim Alaoui',     type: 'Appartement · Casablanca', score: 92, time: 'Il y a 5 min',  hot: true  },
  { name: 'Sara Benali',      type: 'Villa · Marrakech',        score: 78, time: 'Il y a 18 min', hot: false },
  { name: 'Youssef El Fassi', type: 'Bureau · Rabat',           score: 65, time: 'Il y a 1h',     hot: false },
  { name: 'Nadia Tazi',       type: 'Riad · Fès',               score: 88, time: 'Il y a 2h',     hot: true  },
];

function ScoreBadge({ value }: { value: number }) {
  const color = value >= 80 ? '#16a34a' : value >= 60 ? '#d97706' : '#dc2626';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'4px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:700, fontFamily:"'DM Sans',sans-serif", backgroundColor:`${color}12`, color, border:`1px solid ${color}25` }}>
      <Star size={9} style={{ fill:color, color }} /> {value}
    </span>
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

  // Charger les tâches du jour depuis Supabase
  const loadTasks = async () => {
    if (!supabase) {
      // Fallback statique si Supabase non configuré
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
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('due_date', today)
      .order('created_at', { ascending: true });
    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => { loadTasks(); }, []);

  // ── Toggle done ──────────────────────────────────────────────────────────────
  const toggleDone = async (task: Task) => {
    const updated = !task.done;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: updated } : t));
    if (supabase) {
      await supabase.from('tasks').update({ done: updated }).eq('id', task.id);
    }
  };

  // ── Ajouter tâche ────────────────────────────────────────────────────────────
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

  // ── Supprimer tâche ──────────────────────────────────────────────────────────
  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (supabase) await supabase.from('tasks').delete().eq('id', id);
  };

  // ── Modifier tâche ───────────────────────────────────────────────────────────
  const startEdit = (task: Task) => { setEditId(task.id); setEditLabel(task.label); };
  const saveEdit = async () => {
    if (!editLabel.trim() || !editId) return;
    setTasks(prev => prev.map(t => t.id === editId ? { ...t, label: editLabel.trim() } : t));
    if (supabase) await supabase.from('tasks').update({ label: editLabel.trim() }).eq('id', editId);
    setEditId(null); setEditLabel('');
  };

  // ── Toggle urgent ────────────────────────────────────────────────────────────
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
      {/* Header */}
      <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.borderSoft}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <Target size={15} style={{ color:T.terra }} />
          <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'18px', fontWeight:400, color:T.navy }}>Tâches du jour</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          {totalTasks > 0 && (
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', fontWeight:600, color:T.terra, padding:'2px 8px', borderRadius:'6px', background:`${T.terra}10` }}>
              {totalTasks - doneTasks} restantes
            </span>
          )}
          {/* Bouton actualiser */}
          <button onClick={loadTasks} style={{ padding:'5px', borderRadius:'6px', background:'transparent', border:'none', cursor:'pointer', color:T.muted, display:'flex', alignItems:'center' }}
            title="Actualiser">
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          {/* Bouton ajouter */}
          <button onClick={() => setShowForm(v => !v)}
            style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'5px 10px', borderRadius:'7px', background: showForm ? `${T.terra}10` : `${T.gold}15`, border:`1px solid ${showForm ? T.terra : T.border}`, color: showForm ? T.terra : T.gold, fontSize:'11px', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' }}>
            {showForm ? <><X size={11} /> Annuler</> : <><Plus size={11} /> Ajouter</>}
          </button>
        </div>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div style={{ padding:'14px 22px', background:'rgba(200,169,110,0.04)', borderBottom:`1px solid ${T.borderSoft}`, display:'flex', flexDirection:'column', gap:'10px' }}>
          <input
            type="text"
            placeholder="Nom de la tâche..."
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') setShowForm(false); }}
            autoFocus
            style={{ width:'100%', padding:'9px 12px', borderRadius:'8px', border:`1px solid ${T.border}`, background:T.ivory, color:T.navy, fontSize:'13px', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' }}
          />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'7px', cursor:'pointer', userSelect:'none' }}>
              <div onClick={() => setNewUrgent(v => !v)}
                style={{ width:'16px', height:'16px', borderRadius:'4px', border:`2px solid ${newUrgent ? T.terra : 'rgba(13,31,60,0.2)'}`, background: newUrgent ? T.terra : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s', flexShrink:0 }}>
                {newUrgent && <Check size={10} style={{ color:'#fff' }} />}
              </div>
              <span style={{ fontSize:'12px', color: newUrgent ? T.terra : T.muted, fontFamily:"'DM Sans',sans-serif", fontWeight: newUrgent ? 600 : 400 }}>Urgent</span>
            </label>
            <button onClick={addTask} disabled={adding || !newLabel.trim()}
              style={{ padding:'7px 16px', borderRadius:'8px', background: newLabel.trim() ? `linear-gradient(135deg,${T.gold},${T.goldLight})` : 'rgba(200,169,110,0.3)', color:T.navy, fontSize:'12px', fontWeight:600, border:'none', cursor: newLabel.trim() ? 'pointer' : 'not-allowed', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' }}>
              {adding ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>
      )}

      {/* Liste des tâches */}
      {loading ? (
        <div style={{ padding:'32px', textAlign:'center' }}>
          <RefreshCw size={18} style={{ color:T.gold, margin:'0 auto', display:'block', animation:'spin 1s linear infinite' }} />
        </div>
      ) : tasks.length === 0 ? (
        <div style={{ padding:'32px', textAlign:'center' }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', color:T.muted }}>Aucune tâche pour aujourd'hui</p>
          <button onClick={() => setShowForm(true)} style={{ marginTop:'10px', padding:'8px 16px', borderRadius:'8px', background:`rgba(200,169,110,0.1)`, border:`1px solid ${T.border}`, color:T.gold, fontSize:'12px', fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
            + Ajouter une tâche
          </button>
        </div>
      ) : (
        tasks.map((task, i) => (
          <div key={task.id} className="lm-task-row"
            style={{ padding:'11px 22px', display:'flex', alignItems:'center', gap:'10px', borderBottom: i < tasks.length-1 ? `1px solid ${T.borderSoft}` : 'none', transition:'background 0.15s', opacity: task.done ? 0.5 : 1 }}>

            {/* Checkbox */}
            <button onClick={() => toggleDone(task)}
              style={{ flexShrink:0, width:'20px', height:'20px', borderRadius:'50%', border:`2px solid ${task.done ? '#16a34a' : 'rgba(13,31,60,0.15)'}`, background: task.done ? '#16a34a' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s' }}>
              {task.done && <Check size={11} style={{ color:'#fff' }} />}
            </button>

            {/* Label — mode édition ou affichage */}
            {editId === task.id ? (
              <input
                type="text"
                value={editLabel}
                onChange={e => setEditLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditId(null); }}
                autoFocus
                style={{ flex:1, padding:'5px 8px', borderRadius:'6px', border:`1px solid ${T.gold}`, background:T.ivory, color:T.navy, fontSize:'13px', fontFamily:"'DM Sans',sans-serif", outline:'none' }}
              />
            ) : (
              <span style={{ flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:'13px', color:T.navy, textDecoration: task.done ? 'line-through' : 'none', fontWeight: task.urgent ? 600 : 400 }}>
                {task.label}
              </span>
            )}

            {/* Badges + actions */}
            <div style={{ display:'flex', alignItems:'center', gap:'5px', flexShrink:0 }}>
              {/* Badge urgent cliquable */}
              {!task.done && (
                <button onClick={() => toggleUrgent(task)} title={task.urgent ? 'Marquer non urgent' : 'Marquer urgent'}
                  style={{ padding:'2px 7px', borderRadius:'5px', fontSize:'10px', fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:'pointer', border:`1px solid ${task.urgent ? T.terra+'40' : 'rgba(13,31,60,0.1)'}`, background: task.urgent ? `${T.terra}10` : 'transparent', color: task.urgent ? T.terra : T.muted, transition:'all 0.2s' }}>
                  {task.urgent ? 'Urgent' : '!'}
                </button>
              )}

              {/* Éditer */}
              {editId === task.id ? (
                <>
                  <button onClick={saveEdit} style={{ padding:'4px', borderRadius:'5px', background:'rgba(22,163,74,0.1)', border:'none', cursor:'pointer', color:'#16a34a', display:'flex', alignItems:'center' }}>
                    <Check size={13} />
                  </button>
                  <button onClick={() => setEditId(null)} style={{ padding:'4px', borderRadius:'5px', background:'rgba(181,87,58,0.1)', border:'none', cursor:'pointer', color:T.terra, display:'flex', alignItems:'center' }}>
                    <X size={13} />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(task)} style={{ padding:'4px', borderRadius:'5px', background:'transparent', border:'none', cursor:'pointer', color:T.muted, display:'flex', alignItems:'center', transition:'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = T.gold} onMouseLeave={e => e.currentTarget.style.color = T.muted}>
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => deleteTask(task.id)} style={{ padding:'4px', borderRadius:'5px', background:'transparent', border:'none', cursor:'pointer', color:T.muted, display:'flex', alignItems:'center', transition:'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = T.terra} onMouseLeave={e => e.currentTarget.style.color = T.muted}>
                    <Trash2 size={12} />
                  </button>
                </>
              )}

              {!task.urgent && !task.done && editId !== task.id && <Clock size={11} style={{ color:'rgba(13,31,60,0.2)' }} />}
            </div>
          </div>
        ))
      )}

      {/* Barre de progression */}
      {tasks.length > 0 && (
        <div style={{ padding:'14px 22px', borderTop:`1px solid ${T.borderSoft}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'7px' }}>
            <span style={{ fontSize:'11px', fontFamily:"'DM Sans',sans-serif", color:T.muted }}>Progression journée</span>
            <span style={{ fontSize:'11px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, color:T.navy }}>{taskPct}%</span>
          </div>
          <div style={{ height:'6px', borderRadius:'3px', background:T.borderSoft, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${taskPct}%`, background:`linear-gradient(90deg,${T.gold},${T.goldLight})`, borderRadius:'3px', transition:'width 0.5s ease' }} />
          </div>
          {taskPct === 100 && (
            <div style={{ marginTop:'8px', fontSize:'12px', color:'#16a34a', fontFamily:"'DM Sans',sans-serif", fontWeight:500, textAlign:'center' }}>
              🎉 Toutes les tâches complètes !
            </div>
          )}
        </div>
      )}

      {/* Avertissement si Supabase non configuré */}
      {!supabase && (
        <div style={{ padding:'10px 22px', background:'rgba(181,87,58,0.05)', borderTop:`1px solid rgba(181,87,58,0.1)`, display:'flex', alignItems:'center', gap:'6px' }}>
          <AlertCircle size={11} style={{ color:T.terra, flexShrink:0 }} />
          <span style={{ fontSize:'10px', color:T.terra, fontFamily:"'DM Sans',sans-serif" }}>
            Supabase non configuré — les tâches ne sont pas sauvegardées
          </span>
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
        .lm-stat  { transition:all 0.25s ease; text-decoration:none; display:block; }
        .lm-stat:hover  { transform:translateY(-4px); box-shadow:0 20px 48px rgba(13,31,60,0.1)!important; border-color:rgba(200,169,110,0.4)!important; }
        .lm-lead:hover  { background:rgba(200,169,110,0.04)!important; }
        .lm-task-row:hover { background:rgba(200,169,110,0.03); }
        .lm-newbtn:hover{ transform:translateY(-2px); box-shadow:0 16px 36px rgba(200,169,110,0.35)!important; }
        .lm-conv:hover  { background:rgba(200,169,110,0.1)!important; color:#C8A96E!important; }
        .lm-seeall:hover{ color:#C8A96E!important; }
        .lm-hotdot { animation:pulsedot 1.5s infinite; }
        .lm-activedot { animation:pulsedot 2s infinite; }
        @keyframes pulsedot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .a1{animation:slideUp .4s .05s both} .a2{animation:slideUp .4s .12s both}
        .a3{animation:slideUp .4s .18s both} .a4{animation:slideUp .4s .24s both}
        .a5{animation:slideUp .4s .30s both} .a6{animation:slideUp .4s .36s both}
      `}</style>

      <div style={{ minHeight:'100%', background:T.ivory, fontFamily:"'DM Sans',system-ui,sans-serif" }}>

        {/* ══ HERO BANNER ══ */}
        <div style={{ background:`linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 60%, #091629 100%)`, padding:'36px 40px 44px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'360px', height:'360px', borderRadius:'50%', background:'radial-gradient(circle, rgba(200,169,110,0.1) 0%, transparent 65%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-60px', left:'25%', width:'240px', height:'240px', borderRadius:'50%', background:'radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 65%)', pointerEvents:'none' }} />
          <div style={{ maxWidth:'1200px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1, flexWrap:'wrap', gap:'20px' }}>
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'5px 14px', borderRadius:'100px', background:'rgba(200,169,110,0.1)', border:'1px solid rgba(200,169,110,0.22)', marginBottom:'16px' }}>
                <span className="lm-activedot" style={{ width:'6px', height:'6px', borderRadius:'50%', background:T.gold, display:'inline-block' }} />
                <span style={{ fontSize:'10px', fontWeight:500, letterSpacing:'0.2em', textTransform:'uppercase', color:T.gold, fontFamily:"'DM Sans',sans-serif" }}>
                  {new Date().toLocaleDateString('fr-FR',{ weekday:'long', day:'numeric', month:'long' })}
                </span>
              </div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(32px,4vw,46px)', fontWeight:300, color:'#F9F5EF', margin:'0 0 10px', lineHeight:1.1 }}>
                {greeting}, <span style={{ color:T.gold, fontStyle:'italic' }}>{firstName}</span> 👋
              </h1>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'14px', color:'rgba(226,201,138,0.55)', margin:0, lineHeight:1.6 }}>
                Gérez vos propriétés et leads en un seul endroit
              </p>
            </div>
            <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
              <div style={{ padding:'18px 22px', background:'rgba(200,169,110,0.08)', borderRadius:'14px', border:'1px solid rgba(200,169,110,0.18)', textAlign:'center' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'30px', fontWeight:300, color:T.gold, lineHeight:1 }}>87%</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(226,201,138,0.45)', marginTop:'5px', letterSpacing:'0.12em', textTransform:'uppercase' }}>Conversion</div>
              </div>
              <Link href="/dashboard/properties/new" className="lm-newbtn"
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 26px', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, color:T.navy, fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:600, borderRadius:'12px', textDecoration:'none', transition:'all 0.25s', letterSpacing:'0.03em', boxShadow:'0 4px 20px rgba(200,169,110,0.25)', whiteSpace:'nowrap' }}>
                <Plus size={16} /> Nouvelle annonce
              </Link>
            </div>
          </div>
        </div>

        <div style={{ padding:'32px 40px', maxWidth:'1200px', margin:'0 auto' }}>

          {/* ══ STATS ══ */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <Link key={s.label} href={s.href} className={`lm-stat a${i+1}`}
                  style={{ background:'#fff', borderRadius:'16px', padding:'24px 22px', border:`1px solid ${T.borderSoft}`, boxShadow:'0 2px 12px rgba(13,31,60,0.04)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${s.accent},${s.accent}44)` }} />
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'18px' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`${s.accent}12`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={18} style={{ color:s.accent }} />
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'3px', padding:'3px 8px', borderRadius:'6px', background:'rgba(22,163,74,0.08)', fontSize:'11px', fontWeight:600, color:'#16a34a', fontFamily:"'DM Sans',sans-serif" }}>
                      <ChevronUp size={11} />{s.trend}
                    </div>
                  </div>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'40px', fontWeight:300, color:T.navy, lineHeight:1, marginBottom:'4px' }}>{s.value}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:500, color:T.navy, marginBottom:'6px' }}>{s.label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'#16a34a', fontWeight:500 }}>{s.sub}</div>
                </Link>
              );
            })}
          </div>

          {/* ══ MAIN GRID ══ */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 320px', gap:'20px', marginBottom:'24px' }}>

            {/* Leads */}
            <div className="a5" style={{ background:'#fff', borderRadius:'16px', border:`1px solid ${T.borderSoft}`, overflow:'hidden', boxShadow:'0 2px 12px rgba(13,31,60,0.04)' }}>
              <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.borderSoft}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <Users size={15} style={{ color:T.gold }} />
                  <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'18px', fontWeight:400, color:T.navy }}>Derniers leads</span>
                </div>
                <Link href="/dashboard/leads" className="lm-seeall" style={{ fontSize:'11px', fontFamily:"'DM Sans',sans-serif", fontWeight:500, color:T.muted, textDecoration:'none', display:'flex', alignItems:'center', gap:'4px', transition:'color 0.2s' }}>
                  Voir tout <ArrowRight size={12} />
                </Link>
              </div>
              {recentLeads.map((lead, i) => (
                <div key={lead.name} className="lm-lead" style={{ padding:'13px 22px', display:'flex', alignItems:'center', gap:'13px', borderBottom: i < recentLeads.length-1 ? `1px solid ${T.borderSoft}` : 'none', cursor:'pointer', transition:'background 0.15s' }}>
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`linear-gradient(135deg,${T.navy},#1e3a5f)`, display:'flex', alignItems:'center', justifyContent:'center', color:T.goldLight, fontSize:'14px', fontFamily:"'Cormorant Garamond',serif" }}>
                      {lead.name.charAt(0)}
                    </div>
                    {lead.hot && <span className="lm-hotdot" style={{ position:'absolute', top:'-1px', right:'-1px', width:'9px', height:'9px', borderRadius:'50%', background:'#dc2626', border:'2px solid #fff' }} />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:500, color:T.navy }}>{lead.name}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:T.muted }}>{lead.type}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'3px' }}>
                    <ScoreBadge value={lead.score} />
                    <span style={{ fontSize:'10px', color:T.muted, fontFamily:"'DM Sans',sans-serif" }}>{lead.time}</span>
                  </div>
                </div>
              ))}
              <div style={{ padding:'12px 22px', background:'rgba(200,169,110,0.04)', borderTop:`1px solid ${T.borderSoft}` }}>
                <Link href="/dashboard/leads" style={{ display:'flex', alignItems:'center', gap:'7px', fontSize:'12px', fontFamily:"'DM Sans',sans-serif", fontWeight:500, color:T.gold, textDecoration:'none' }}>
                  <Phone size={12} /> Contacter les leads chauds maintenant
                </Link>
              </div>
            </div>

            {/* ══ TÂCHES DYNAMIQUES ══ */}
            <TasksPanel />

            {/* Agent IA */}
            <div className="a6" style={{ background:T.navy, borderRadius:'16px', padding:'24px', display:'flex', flexDirection:'column', boxShadow:'0 8px 32px rgba(13,31,60,0.2)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle, rgba(200,169,110,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Bot size={20} style={{ color:T.navy }} />
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'17px', fontWeight:400, color:'#F9F5EF' }}>Agent IA</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(226,201,138,0.4)', marginTop:'1px' }}>Qualification auto</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'100px', background:'rgba(22,163,74,0.12)', border:'1px solid rgba(22,163,74,0.2)' }}>
                  <span className="lm-activedot" style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#4ade80', display:'inline-block' }} />
                  <span style={{ fontSize:'10px', fontWeight:500, color:'#4ade80', fontFamily:"'DM Sans',sans-serif" }}>Actif</span>
                </div>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', color:'rgba(226,201,138,0.4)', lineHeight:1.7, margin:'0 0 18px' }}>Qualifie vos prospects 24h/24 et extrait automatiquement leurs critères de recherche.</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'14px' }}>
                {[{ val:'87%', label:'Précision', icon:'🎯' }, { val:'45', label:'Ce mois', icon:'📈' }].map(s => (
                  <div key={s.label} style={{ background:'rgba(200,169,110,0.07)', border:'1px solid rgba(200,169,110,0.12)', borderRadius:'10px', padding:'14px', textAlign:'center' }}>
                    <div style={{ fontSize:'14px', marginBottom:'4px' }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'26px', fontWeight:300, color:T.gold, lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(226,201,138,0.35)', marginTop:'4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(200,169,110,0.06)', borderRadius:'10px', padding:'11px 13px', marginBottom:'14px', border:'1px solid rgba(200,169,110,0.1)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'5px' }}>
                  <Zap size={11} style={{ color:T.gold }} />
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', fontWeight:500, color:T.gold }}>Dernière action</span>
                </div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(226,201,138,0.4)', margin:0, lineHeight:1.5 }}>Lead Karim qualifié — score 92 · Appart. 3ch Casablanca</p>
              </div>
              <Link href="/dashboard/conversations" className="lm-conv"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'12px', borderRadius:'10px', border:'1px solid rgba(200,169,110,0.18)', color:'rgba(226,201,138,0.45)', fontFamily:"'DM Sans',sans-serif", fontSize:'12px', fontWeight:500, textDecoration:'none', transition:'all 0.2s', marginTop:'auto' }}>
                Voir les conversations <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* ══ BARRE OBJECTIF MENSUEL ══ */}
          <div style={{ padding:'20px 28px', background:`linear-gradient(135deg,${T.navy} 0%,#1a3558 100%)`, borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 4px 24px rgba(13,31,60,0.15)', flexWrap:'wrap', gap:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(200,169,110,0.12)', border:'1px solid rgba(200,169,110,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Trophy size={20} style={{ color:T.gold }} />
              </div>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'17px', fontWeight:400, color:'#F9F5EF' }}>
                  Objectif mensuel : <span style={{ color:T.gold, fontStyle:'italic' }}>5 transactions</span>
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', color:'rgba(226,201,138,0.4)', marginTop:'3px' }}>
                  3 conclues · 2 en cours · Vous êtes sur la bonne voie 💪
                </div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <div style={{ width:'160px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'7px' }}>
                  <span style={{ fontSize:'10px', color:'rgba(226,201,138,0.4)', fontFamily:"'DM Sans',sans-serif", letterSpacing:'0.06em' }}>PROGRESSION</span>
                  <span style={{ fontSize:'11px', color:T.gold, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>60%</span>
                </div>
                <div style={{ height:'6px', borderRadius:'3px', background:'rgba(200,169,110,0.12)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:'60%', background:`linear-gradient(90deg,${T.gold},${T.goldLight})`, borderRadius:'3px' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'5px' }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{ width:'10px', height:'10px', borderRadius:'50%', background: n <= 3 ? T.gold : 'rgba(200,169,110,0.2)', border: n <= 3 ? 'none' : '1px solid rgba(200,169,110,0.3)' }} />
                  ))}
                </div>
              </div>
              <Link href="/dashboard/properties/new"
                style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'10px 18px', background:'rgba(200,169,110,0.15)', border:'1px solid rgba(200,169,110,0.25)', borderRadius:'10px', color:T.gold, fontSize:'12px', fontFamily:"'DM Sans',sans-serif", fontWeight:500, textDecoration:'none', whiteSpace:'nowrap' }}>
                <Plus size={13} /> Ajouter une vente
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}