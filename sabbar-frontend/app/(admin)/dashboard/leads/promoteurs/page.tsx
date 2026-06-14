'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Building2, Phone, Mail, MapPin, DollarSign,
  Plus, Trash2, X, Check, RefreshCw, FileText,
  ArrowLeft, Search, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const T = {
  navy: '#0D1F3C', gold: '#C8A96E', goldLight: '#E2C98A',
  terra: '#B5573A', ivory: '#F9F5EF', muted: 'rgba(13,31,60,0.45)',
  border: 'rgba(200,169,110,0.18)', borderSoft: 'rgba(13,31,60,0.08)',
};

interface Lead {
  id: string; created_at: string; first_name?: string; last_name?: string;
  email?: string; phone?: string; status?: string; priority?: string;
  budget_min?: number; budget_max?: number; preferred_cities?: any;
  notes?: string; lead_type?: string; assigned_to?: string;
  project_phase?: string; project_units?: number;
  project_location?: string; company_name?: string;
}
interface Action {
  id: string; lead_id: string; type: string;
  date: string; notes?: string; done: boolean;
}
interface Mandat {
  id: string; lead_id: string; type: string; status: string;
  sent_at?: string; signed_at?: string; price?: number; commission?: number; notes?: string;
}

const PHASES: Record<string, { label: string; color: string; bg: string; step: number }> = {
  prospection:      { label: 'Prospection',      color: '#6b7280', bg: 'rgba(107,114,128,0.1)', step: 1 },
  negociation:      { label: 'Négociation',      color: '#d97706', bg: 'rgba(217,119,6,0.1)',   step: 2 },
  mandat_signe:     { label: 'Mandat signé',     color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', step: 3 },
  commercialisation:{ label: 'Commercialisation',color: '#2563eb', bg: 'rgba(37,99,235,0.1)',   step: 4 },
  livraison:        { label: 'Livraison',        color: T.terra,   bg: 'rgba(181,87,58,0.1)',   step: 5 },
  solde:            { label: 'Soldé ✓',          color: '#16a34a', bg: 'rgba(22,163,74,0.1)',   step: 6 },
};

const ACTION_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  call:     { label: 'Appel',    icon: '📞', color: '#16a34a' },
  callback: { label: 'Rappel',   icon: '🔄', color: '#d97706' },
  meeting:  { label: 'RDV',      icon: '🤝', color: '#2563eb' },
  visit:    { label: 'Visite',   icon: '🏗️', color: T.terra   },
  note:     { label: 'Note',     icon: '📝', color: '#6b7280' },
};

const STATUS_MANDAT: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Brouillon', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  sent:      { label: 'Envoyé',    color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  signed:    { label: 'Signé ✓',  color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  cancelled: { label: 'Annulé',    color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
};

function displayName(l: Lead) { return [l.first_name, l.last_name].filter(Boolean).join(' ').trim() || '—'; }
function citiesLabel(pc: any): string {
  if (!pc) return '';
  if (Array.isArray(pc)) return pc.filter(Boolean).join(', ');
  try { const a = JSON.parse(pc); return Array.isArray(a) ? a.join(', ') : pc; } catch { return pc; }
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

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
const card: React.CSSProperties = {
  background: '#fff', borderRadius: '12px',
  border: `1px solid ${T.borderSoft}`,
  boxShadow: '0 1px 4px rgba(13,31,60,0.04)',
};

export default function PromoteursPage() {
  const [leads, setLeads]       = useState<Lead[]>([]);
  const [actions, setActions]   = useState<Action[]>([]);
  const [mandats, setMandats]   = useState<Mandat[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState<'fiche' | 'projet' | 'suivi' | 'mandat' | 'calendrier'>('fiche');
  const [showActionForm, setShowActionForm]   = useState(false);
  const [showMandatForm, setShowMandatForm]   = useState(false);
  const [actionForm, setActionForm] = useState({ type: 'call', date: '', notes: '' });
  const [mandatForm, setMandatForm] = useState({ commission: '2.5', notes: '' });
  const [saving, setSaving]         = useState(false);
  const [updatingPhase, setUpdatingPhase] = useState(false);

  const load = async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const [l, a, m] = await Promise.all([
      supabase.from('leads').select('*').eq('lead_type', 'promoteur').order('created_at', { ascending: false }),
      supabase.from('promoteur_actions').select('*').order('date', { ascending: false }),
      supabase.from('mandats').select('*').eq('type', 'commercialisation').order('created_at', { ascending: false }),
    ]);
    setLeads(l.data || []);
    setActions(a.data || []);
    setMandats(m.data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updatePhase = async (phase: string) => {
    if (!supabase || !selected) return;
    setUpdatingPhase(true);
    await supabase.from('leads').update({ project_phase: phase }).eq('id', selected.id);
    setLeads(prev => prev.map(l => l.id === selected.id ? { ...l, project_phase: phase } : l));
    setSelected(s => s ? { ...s, project_phase: phase } : null);
    setUpdatingPhase(false);
  };

  const addAction = async () => {
    if (!supabase || !selected || !actionForm.date) return;
    setSaving(true);
    const { data } = await supabase.from('promoteur_actions').insert({
      lead_id: selected.id, type: actionForm.type,
      date: actionForm.date, notes: actionForm.notes || null, done: false,
    }).select().single();
    if (data) {
      setActions(prev => [data, ...prev]);
      // Tâche du jour
      const today = new Date().toISOString().split('T')[0];
      const actionDay = actionForm.date.split('T')[0];
      if (actionDay === today) {
        await supabase.from('tasks').insert({
          label: `${ACTION_TYPES[actionForm.type].icon} ${ACTION_TYPES[actionForm.type].label} promoteur : ${displayName(selected)}`,
          done: false, urgent: actionForm.type === 'callback', due_date: today, lead_id: selected.id, source: 'lead',
        });
      }
    }
    setActionForm({ type: 'call', date: '', notes: '' });
    setShowActionForm(false);
    setSaving(false);
  };

  const toggleActionDone = async (a: Action) => {
    if (!supabase) return;
    await supabase.from('promoteur_actions').update({ done: !a.done }).eq('id', a.id);
    setActions(prev => prev.map(x => x.id === a.id ? { ...x, done: !a.done } : x));
  };

  const createMandat = async () => {
    if (!supabase || !selected) return;
    setSaving(true);
    const { data } = await supabase.from('mandats').insert({
      lead_id: selected.id, type: 'commercialisation', status: 'draft',
      commission: parseFloat(mandatForm.commission) || 2.5,
      notes: mandatForm.notes || null,
    }).select().single();
    if (data) {
      setMandats(prev => [...prev, data]);
      await supabase.from('tasks').insert({
        label: `📋 Envoyer mandat de commercialisation à ${displayName(selected)}`,
        done: false, urgent: true, due_date: new Date().toISOString().split('T')[0], lead_id: selected.id, source: 'lead',
      });
      // Passer à la phase mandat_signe si non encore fait
      if (!selected.project_phase || selected.project_phase === 'negociation') {
        await updatePhase('mandat_signe');
      }
    }
    setMandatForm({ commission: '2.5', notes: '' });
    setShowMandatForm(false);
    setSaving(false);
  };

  const updateMandatStatus = async (mandatId: string, status: string) => {
    if (!supabase) return;
    const patch: any = { status };
    if (status === 'sent')   patch.sent_at   = new Date().toISOString();
    if (status === 'signed') patch.signed_at = new Date().toISOString();
    await supabase.from('mandats').update(patch).eq('id', mandatId);
    setMandats(prev => prev.map(m => m.id === mandatId ? { ...m, ...patch } : m));
  };

  const filtered = leads.filter(l =>
    !search || [displayName(l), l.email, l.phone, l.company_name, l.project_location]
      .some(s => s?.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedActions = actions.filter(a => a.lead_id === selected?.id);
  const selectedMandats = mandats.filter(m => m.lead_id === selected?.id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .prom-card{transition:all .18s;cursor:pointer;}
        .prom-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(13,31,60,.08)!important;}
        .prom-card.sel{border-color:#C8A96E!important;box-shadow:0 0 0 2px rgba(200,169,110,.15)!important;}
        input:focus,select:focus,textarea:focus{border-color:rgba(200,169,110,.5)!important;outline:none!important;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(200,169,110,.3);border-radius:2px;}
      `}</style>

      <div style={{ minHeight: '100%', background: T.ivory, padding: '28px 32px', fontFamily: "'DM Sans',system-ui,sans-serif" }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <Link href="/dashboard/leads" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: T.muted, textDecoration: 'none', fontSize: '13px', marginBottom: '8px' }}>
              <ArrowLeft size={13} /> Retour aux leads
            </Link>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '32px', fontWeight: 300, color: T.navy, margin: 0 }}>
              Gestion <span style={{ color: T.gold, fontStyle: 'italic' }}>Promoteurs</span>
            </h1>
            <p style={{ fontSize: '12px', color: T.muted, marginTop: '4px' }}>
              {leads.length} promoteurs · {mandats.filter(m => m.status === 'signed').length} mandats signés
            </p>
          </div>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#16a34a', color: '#fff', fontSize: '13px', fontWeight: 500, borderRadius: '9px', border: 'none', cursor: 'pointer' }}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Actualiser
          </button>
        </div>

        {/* KPIs par phase */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '24px' }}>
          {Object.entries(PHASES).map(([key, phase]) => (
            <div key={key} style={{ ...card, padding: '14px 16px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: T.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>{phase.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: phase.color, fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }}>
                {leads.filter(l => l.project_phase === key).length}
              </div>
            </div>
          ))}
        </div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '340px 1fr' : '1fr', gap: '20px' }}>

          {/* Liste promoteurs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.muted }} />
              <input placeholder="Rechercher promoteur..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, paddingLeft: '36px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: 'calc(100vh - 360px)', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: T.muted }}>
                  <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 8px' }} />Chargement...
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: T.muted, fontSize: '13px' }}>Aucun promoteur trouvé</div>
              ) : filtered.map(lead => {
                const isSel = selected?.id === lead.id;
                const phase = lead.project_phase ? PHASES[lead.project_phase] : null;
                const leadActions = actions.filter(a => a.lead_id === lead.id);
                return (
                  <div key={lead.id} className={`prom-card${isSel ? ' sel' : ''}`}
                    onClick={() => { setSelected(isSel ? null : lead); setTab('fiche'); }}
                    style={{ ...card, padding: '16px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: phase ? phase.color : T.terra }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold, fontWeight: 700, fontSize: '15px' }}>
                          {(displayName(lead)[0] || '?').toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: T.navy }}>{displayName(lead)}</div>
                          {lead.company_name && <div style={{ fontSize: '11px', color: T.muted }}>{lead.company_name}</div>}
                        </div>
                      </div>
                      {phase && (
                        <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: phase.bg, color: phase.color }}>
                          {phase.label}
                        </span>
                      )}
                    </div>
                    {lead.project_location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: T.muted, marginBottom: '4px' }}>
                        <MapPin size={11} style={{ color: T.gold }} /> {lead.project_location}
                      </div>
                    )}
                    {lead.project_units && (
                      <div style={{ fontSize: '12px', color: T.muted }}>🏗️ {lead.project_units} unités</div>
                    )}
                    {leadActions.length > 0 && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: T.muted }}>
                        {leadActions.length} action{leadActions.length > 1 ? 's' : ''} · {leadActions.filter(a => !a.done).length} en attente
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panneau détail */}
          {selected && (
            <div style={{ ...card, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: `1px solid ${T.borderSoft}`, background: '#faf8f5', overflowX: 'auto' }}>
                {([
                  { key: 'fiche',      label: 'Promoteur',  icon: '👤' },
                  { key: 'projet',     label: 'Projet',     icon: '🏗️' },
                  { key: 'suivi',      label: 'Suivi',      icon: '📞' },
                  { key: 'mandat',     label: 'Mandat',     icon: '📋' },
                  { key: 'calendrier', label: 'Calendrier', icon: '📅' },
                ] as const).map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    style={{ flex: 1, padding: '13px 10px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: tab === t.key ? 600 : 400, fontFamily: "'DM Sans',sans-serif", background: 'transparent', color: tab === t.key ? T.navy : T.muted, borderBottom: tab === t.key ? `2px solid ${T.gold}` : '2px solid transparent', whiteSpace: 'nowrap' }}>
                    {t.icon} {t.label}
                  </button>
                ))}
                <button onClick={() => setSelected(null)} style={{ padding: '13px', border: 'none', cursor: 'pointer', background: 'transparent', color: T.muted }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>

                {/* ── FICHE ── */}
                {tab === 'fiche' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Informations promoteur</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'Nom complet', value: displayName(selected) },
                        { label: 'Société', value: selected.company_name || '—' },
                        { label: 'Téléphone', value: selected.phone, href: `tel:${selected.phone}`, color: '#16a34a' },
                        { label: 'Email', value: selected.email, href: `mailto:${selected.email}`, color: T.gold },
                        { label: 'Assigné à', value: selected.assigned_to || '—' },
                        { label: 'Priorité', value: selected.priority || 'medium' },
                      ].map((f, i) => (
                        <div key={i} style={{ background: T.ivory, borderRadius: '8px', padding: '12px' }}>
                          <div style={lbl}>{f.label}</div>
                          {(f as any).href ? (
                            <a href={(f as any).href} style={{ fontSize: '13px', fontWeight: 600, color: (f as any).color, textDecoration: 'none' }}>{f.value || '—'}</a>
                          ) : (
                            <div style={{ fontSize: '13px', fontWeight: 600, color: T.navy }}>{f.value || '—'}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    {selected.notes && (
                      <div style={{ background: T.ivory, borderRadius: '8px', padding: '14px', fontSize: '13px', color: T.navy, lineHeight: 1.6 }}>
                        <div style={{ ...lbl, marginBottom: '8px' }}>Notes</div>{selected.notes}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {selected.phone && <a href={`tel:${selected.phone}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}><Phone size={14} /> Appeler</a>}
                      {selected.email && <a href={`mailto:${selected.email}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', background: '#F5F0E6', color: T.gold, borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}><Mail size={14} /> Email</a>}
                    </div>
                  </div>
                )}

                {/* ── PROJET ── */}
                {tab === 'projet' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Informations du projet</div>

                    {/* Infos projet */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'Localisation', value: selected.project_location || citiesLabel(selected.preferred_cities) || '—' },
                        { label: 'Nombre d\'unités', value: selected.project_units ? `${selected.project_units} unités` : '—' },
                      ].map((f, i) => (
                        <div key={i} style={{ background: T.ivory, borderRadius: '8px', padding: '12px' }}>
                          <div style={lbl}>{f.label}</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: T.navy }}>{f.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Pipeline de phases */}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phase du projet</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Object.entries(PHASES).map(([key, phase]) => {
                          const isCurrent = selected.project_phase === key;
                          const currentStep = selected.project_phase ? PHASES[selected.project_phase]?.step || 0 : 0;
                          const isPast = phase.step < currentStep;
                          return (
                            <button key={key} onClick={() => updatePhase(key)} disabled={updatingPhase}
                              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', border: `2px solid ${isCurrent ? phase.color : isPast ? `${phase.color}30` : T.borderSoft}`, background: isCurrent ? phase.bg : isPast ? `${phase.bg}50` : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isCurrent ? phase.color : isPast ? `${phase.color}50` : T.borderSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {isPast || isCurrent ? <Check size={12} style={{ color: '#fff' }} /> : <span style={{ fontSize: '10px', fontWeight: 700, color: T.muted }}>{phase.step}</span>}
                              </div>
                              <span style={{ fontSize: '13px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? phase.color : isPast ? T.muted : T.navy }}>
                                {phase.label}
                              </span>
                              {isCurrent && <ChevronRight size={14} style={{ marginLeft: 'auto', color: phase.color }} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SUIVI ── */}
                {tab === 'suivi' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Suivi — {displayName(selected)}
                      </div>
                      <button onClick={() => setShowActionForm(v => !v)}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '7px', background: `${T.gold}20`, border: `1px solid ${T.border}`, color: T.gold, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={12} /> Ajouter
                      </button>
                    </div>

                    {showActionForm && (
                      <div style={{ background: `${T.gold}08`, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={lbl}>Type d'action</label>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {Object.entries(ACTION_TYPES).map(([key, at]) => (
                              <button key={key} onClick={() => setActionForm(f => ({ ...f, type: key }))}
                                style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${actionForm.type === key ? at.color : T.borderSoft}`, background: actionForm.type === key ? `${at.color}15` : 'transparent', color: actionForm.type === key ? at.color : T.muted }}>
                                {at.icon} {at.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div><label style={lbl}>Date et heure *</label><input type="datetime-local" value={actionForm.date} onChange={e => setActionForm(f => ({ ...f, date: e.target.value }))} style={inp} /></div>
                        <div><label style={lbl}>Notes</label><textarea value={actionForm.notes} onChange={e => setActionForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Compte-rendu, informations..." style={{ ...inp, resize: 'none' }} /></div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={addAction} disabled={saving || !actionForm.date} style={{ flex: 1, padding: '9px', background: `linear-gradient(135deg,${T.gold},${T.goldLight})`, color: T.navy, border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            {saving ? 'Ajout...' : 'Enregistrer'}
                          </button>
                          <button onClick={() => setShowActionForm(false)} style={{ padding: '9px 14px', background: 'transparent', border: `1px solid ${T.borderSoft}`, borderRadius: '7px', cursor: 'pointer', color: T.muted }}><X size={14} /></button>
                        </div>
                      </div>
                    )}

                    {selectedActions.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px', color: T.muted, fontSize: '13px' }}>Aucune action enregistrée</div>
                    ) : selectedActions.map(action => {
                      const at = ACTION_TYPES[action.type] || ACTION_TYPES.note;
                      return (
                        <div key={action.id} style={{ background: action.done ? 'rgba(107,114,128,0.04)' : T.ivory, borderRadius: '10px', padding: '12px 14px', border: `1px solid ${T.borderSoft}`, opacity: action.done ? 0.6 : 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '16px' }}>{at.icon}</span>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: at.color }}>{at.label}</div>
                                <div style={{ fontSize: '11px', color: T.muted }}>{fmtDate(action.date)}</div>
                              </div>
                            </div>
                            <button onClick={() => toggleActionDone(action)}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${action.done ? '#16a34a' : 'rgba(13,31,60,0.15)'}`, background: action.done ? '#16a34a' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                              {action.done && <Check size={11} style={{ color: '#fff' }} />}
                            </button>
                          </div>
                          {action.notes && <div style={{ fontSize: '12px', color: T.muted, marginTop: '5px', paddingLeft: '26px' }}>{action.notes}</div>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── MANDAT ── */}
                {tab === 'mandat' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mandat de commercialisation</div>
                      {selectedMandats.length === 0 && (
                        <button onClick={() => setShowMandatForm(v => !v)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '7px', background: `${T.gold}20`, border: `1px solid ${T.border}`, color: T.gold, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                          <Plus size={12} /> Créer un mandat
                        </button>
                      )}
                    </div>

                    {showMandatForm && (
                      <div style={{ background: `${T.gold}08`, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div><label style={lbl}>Commission (%) *</label><input type="number" value={mandatForm.commission} onChange={e => setMandatForm(f => ({ ...f, commission: e.target.value }))} placeholder="2.5" style={inp} /></div>
                        <div><label style={lbl}>Notes</label><textarea value={mandatForm.notes} onChange={e => setMandatForm(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inp, resize: 'none' }} /></div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={createMandat} disabled={saving} style={{ flex: 1, padding: '9px', background: `linear-gradient(135deg,${T.gold},${T.goldLight})`, color: T.navy, border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            {saving ? 'Création...' : 'Créer le mandat'}
                          </button>
                          <button onClick={() => setShowMandatForm(false)} style={{ padding: '9px 14px', background: 'transparent', border: `1px solid ${T.borderSoft}`, borderRadius: '7px', cursor: 'pointer', color: T.muted }}><X size={14} /></button>
                        </div>
                      </div>
                    )}

                    {selectedMandats.length === 0 && !showMandatForm ? (
                      <div style={{ textAlign: 'center', padding: '32px', color: T.muted, fontSize: '13px' }}>Aucun mandat créé</div>
                    ) : selectedMandats.map(m => {
                      const st = STATUS_MANDAT[m.status] || STATUS_MANDAT.draft;
                      return (
                        <div key={m.id} style={{ background: T.ivory, borderRadius: '10px', padding: '16px', border: `1px solid ${T.borderSoft}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: T.navy }}>Mandat de commercialisation</div>
                            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: st.bg, color: st.color }}>{st.label}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                            <div><div style={lbl}>Commission</div><div style={{ fontSize: '15px', fontWeight: 700, color: T.gold }}>{m.commission}%</div></div>
                            {m.sent_at && <div><div style={lbl}>Envoyé le</div><div style={{ fontSize: '12px', color: T.muted }}>{fmtDate(m.sent_at)}</div></div>}
                            {m.signed_at && <div><div style={lbl}>Signé le</div><div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>{fmtDate(m.signed_at)}</div></div>}
                          </div>
                          {m.notes && <div style={{ fontSize: '12px', color: T.muted, marginBottom: '12px' }}>{m.notes}</div>}
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {Object.entries(STATUS_MANDAT).filter(([val]) => val !== 'cancelled').map(([val, s]) => (
                              <button key={val} onClick={() => updateMandatStatus(m.id, val)}
                                style={{ flex: 1, padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${s.color}40`, background: m.status === val ? s.color : 'transparent', color: m.status === val ? '#fff' : s.color }}>
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── CALENDRIER ── */}
                {tab === 'calendrier' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calendrier — {displayName(selected)}</div>
                    {selectedActions.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px', color: T.muted, fontSize: '13px' }}>
                        Aucun événement planifié.<br />
                        <button onClick={() => setTab('suivi')} style={{ marginTop: '8px', padding: '7px 14px', borderRadius: '7px', background: `${T.gold}15`, border: `1px solid ${T.border}`, color: T.gold, fontSize: '12px', cursor: 'pointer' }}>
                          Ajouter une action
                        </button>
                      </div>
                    ) : [...selectedActions]
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((action, i) => {
                        const at = ACTION_TYPES[action.type] || ACTION_TYPES.note;
                        const d = new Date(action.date);
                        return (
                          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px', background: action.done ? 'rgba(107,114,128,0.05)' : T.ivory, borderRadius: '10px', border: `1px solid ${T.borderSoft}`, opacity: action.done ? 0.6 : 1 }}>
                            <div style={{ textAlign: 'center', minWidth: '48px', background: '#fff', borderRadius: '8px', padding: '8px', border: `1px solid ${T.borderSoft}` }}>
                              <div style={{ fontSize: '18px', fontWeight: 700, color: T.navy, lineHeight: 1 }}>{d.getDate()}</div>
                              <div style={{ fontSize: '10px', color: T.muted, textTransform: 'uppercase' }}>{d.toLocaleDateString('fr-FR', { month: 'short' })}</div>
                              <div style={{ fontSize: '11px', color: T.gold, fontWeight: 600 }}>{d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: at.color }}>{at.icon} {at.label}</div>
                              {action.notes && <div style={{ fontSize: '12px', color: T.muted, marginTop: '3px' }}>{action.notes}</div>}
                            </div>
                            {action.done && <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: 'rgba(22,163,74,0.1)', color: '#16a34a', whiteSpace: 'nowrap' }}>✓ Fait</span>}
                          </div>
                        );
                      })
                    }
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}