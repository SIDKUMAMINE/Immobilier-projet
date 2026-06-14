'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Home, Phone, Mail, MapPin, DollarSign, Calendar,
  Plus, Trash2, X, Check, RefreshCw, FileText,
  ArrowLeft, Search, Clock
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
  project_location?: string;
}
interface Visit { id: string; lead_id: string; visit_date: string; address?: string; notes?: string; status: string; }
interface Mandat { id: string; lead_id: string; type: string; status: string; sent_at?: string; signed_at?: string; price?: number; commission?: number; notes?: string; }

function displayName(l: Lead) { return [l.first_name, l.last_name].filter(Boolean).join(' ').trim() || '—'; }
function citiesLabel(pc: any): string {
  if (!pc) return '';
  if (Array.isArray(pc)) return pc.filter(Boolean).join(', ');
  try { const a = JSON.parse(pc); return Array.isArray(a) ? a.join(', ') : pc; } catch { return pc; }
}
function fmtBudget(min?: number, max?: number) {
  const f = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}k`;
  if (min && max) return `${f(min)} – ${f(max)} MAD`;
  if (max) return `≤ ${f(max)} MAD`; if (min) return `≥ ${f(min)} MAD`; return 'Non défini';
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_VISIT: Record<string, { label: string; color: string; bg: string }> = {
  planned:   { label: 'Planifiée',  color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  confirmed: { label: 'Confirmée', color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  done:      { label: 'Effectuée', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  cancelled: { label: 'Annulée',   color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
};
const STATUS_MANDAT: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Brouillon', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  sent:      { label: 'Envoyé',    color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  signed:    { label: 'Signé ✓',  color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  cancelled: { label: 'Annulé',    color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
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
const card: React.CSSProperties = {
  background: '#fff', borderRadius: '12px',
  border: `1px solid ${T.borderSoft}`,
  boxShadow: '0 1px 4px rgba(13,31,60,0.04)',
};

export default function ProprietairesPage() {
  const [leads, setLeads]       = useState<Lead[]>([]);
  const [visits, setVisits]     = useState<Visit[]>([]);
  const [mandats, setMandats]   = useState<Mandat[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState<'fiche' | 'bien' | 'visites' | 'mandat' | 'calendrier'>('fiche');
  const [showVisitForm, setShowVisitForm]   = useState(false);
  const [showMandatForm, setShowMandatForm] = useState(false);
  const [visitForm, setVisitForm]   = useState({ visit_date: '', address: '', notes: '' });
  const [mandatForm, setMandatForm] = useState({ price: '', commission: '3', notes: '' });
  const [saving, setSaving]         = useState(false);

  const load = async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const [l, v, m] = await Promise.all([
      supabase.from('leads').select('*').eq('lead_type', 'proprietaire').order('created_at', { ascending: false }),
      supabase.from('visits').select('*').order('visit_date', { ascending: true }),
      supabase.from('mandats').select('*').eq('type', 'vente').order('created_at', { ascending: false }),
    ]);
    setLeads(l.data || []);
    setVisits(v.data || []);
    setMandats(m.data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addVisit = async () => {
    if (!supabase || !selected || !visitForm.visit_date) return;
    setSaving(true);
    const { data } = await supabase.from('visits').insert({
      lead_id: selected.id, visit_date: visitForm.visit_date,
      address: visitForm.address || null, notes: visitForm.notes || null, status: 'planned',
    }).select().single();
    if (data) {
      setVisits(prev => [...prev, data]);
      const today = new Date().toISOString().split('T')[0];
      const visitDay = visitForm.visit_date.split('T')[0];
      if (visitDay === today) {
        await supabase.from('tasks').insert({
          label: `🏠 Visite propriétaire : ${displayName(selected)} — ${visitForm.address || 'adresse à confirmer'}`,
          done: false, urgent: false, due_date: today, lead_id: selected.id, source: 'lead',
        });
      }
    }
    setVisitForm({ visit_date: '', address: '', notes: '' });
    setShowVisitForm(false);
    setSaving(false);
  };

  const createMandat = async () => {
    if (!supabase || !selected || !mandatForm.price) return;
    setSaving(true);
    const { data } = await supabase.from('mandats').insert({
      lead_id: selected.id, type: 'vente', status: 'draft',
      price: parseFloat(mandatForm.price),
      commission: parseFloat(mandatForm.commission) || 3,
      notes: mandatForm.notes || null,
    }).select().single();
    if (data) {
      setMandats(prev => [...prev, data]);
      // Tâche du jour
      await supabase.from('tasks').insert({
        label: `📋 Envoyer mandat de vente à ${displayName(selected)}`,
        done: false, urgent: true, due_date: new Date().toISOString().split('T')[0], lead_id: selected.id, source: 'lead',
      });
    }
    setMandatForm({ price: '', commission: '3', notes: '' });
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

  const updateVisitStatus = async (visitId: string, status: string) => {
    if (!supabase) return;
    await supabase.from('visits').update({ status }).eq('id', visitId);
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status } : v));
  };

  const filtered = leads.filter(l =>
    !search || [displayName(l), l.email, l.phone, citiesLabel(l.preferred_cities), l.project_location]
      .some(s => s?.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedVisits  = visits.filter(v => v.lead_id === selected?.id);
  const selectedMandats = mandats.filter(m => m.lead_id === selected?.id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .prop-card{transition:all .18s;cursor:pointer;}
        .prop-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(13,31,60,.08)!important;}
        .prop-card.sel{border-color:#C8A96E!important;box-shadow:0 0 0 2px rgba(200,169,110,.15)!important;}
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
              Gestion <span style={{ color: T.gold, fontStyle: 'italic' }}>Propriétaires</span>
            </h1>
            <p style={{ fontSize: '12px', color: T.muted, marginTop: '4px' }}>
              {leads.length} propriétaires · {mandats.filter(m => m.status === 'signed').length} mandats signés
            </p>
          </div>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#16a34a', color: '#fff', fontSize: '13px', fontWeight: 500, borderRadius: '9px', border: 'none', cursor: 'pointer' }}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Actualiser
          </button>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Total propriétaires', value: leads.length, color: T.gold },
            { label: 'Mandats brouillon', value: mandats.filter(m => m.status === 'draft').length, color: '#6b7280' },
            { label: 'Mandats envoyés', value: mandats.filter(m => m.status === 'sent').length, color: '#2563eb' },
            { label: 'Mandats signés', value: mandats.filter(m => m.status === 'signed').length, color: '#16a34a' },
          ].map((k, i) => (
            <div key={i} style={{ ...card, padding: '20px 24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>{k.label}</div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: k.color, fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '340px 1fr' : '1fr', gap: '20px' }}>

          {/* Liste propriétaires */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.muted }} />
              <input placeholder="Rechercher propriétaire..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, paddingLeft: '36px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: 'calc(100vh - 320px)', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: T.muted }}>
                  <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 8px' }} />Chargement...
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: T.muted, fontSize: '13px' }}>Aucun propriétaire trouvé</div>
              ) : filtered.map(lead => {
                const isSel = selected?.id === lead.id;
                const hasMandat = mandats.some(m => m.lead_id === lead.id);
                const mandatSigne = mandats.some(m => m.lead_id === lead.id && m.status === 'signed');
                return (
                  <div key={lead.id} className={`prop-card${isSel ? ' sel' : ''}`}
                    onClick={() => { setSelected(isSel ? null : lead); setTab('fiche'); }}
                    style={{ ...card, padding: '16px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${T.gold},${T.goldLight})` }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold, fontWeight: 700, fontSize: '15px' }}>
                          {(displayName(lead)[0] || '?').toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: T.navy }}>{displayName(lead)}</div>
                          <div style={{ fontSize: '12px', color: T.muted }}>{lead.phone || lead.email || '—'}</div>
                        </div>
                      </div>
                      {mandatSigne ? (
                        <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}>✓ Mandat signé</span>
                      ) : hasMandat ? (
                        <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>Mandat en cours</span>
                      ) : null}
                    </div>
                    {lead.budget_min || lead.budget_max ? (
                      <div style={{ fontSize: '13px', fontWeight: 600, color: T.gold, marginBottom: '5px' }}>
                        💰 {fmtBudget(lead.budget_min, lead.budget_max)}
                      </div>
                    ) : null}
                    {(lead.project_location || citiesLabel(lead.preferred_cities)) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: T.muted }}>
                        <MapPin size={11} style={{ color: T.gold }} />
                        {lead.project_location || citiesLabel(lead.preferred_cities)}
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
                  { key: 'fiche',      label: 'Propriétaire', icon: '👤' },
                  { key: 'bien',       label: 'Bien',         icon: '🏠' },
                  { key: 'visites',    label: 'Visites',      icon: '👁️' },
                  { key: 'mandat',     label: 'Mandat',       icon: '📋' },
                  { key: 'calendrier', label: 'Calendrier',   icon: '📅' },
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
                    <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Informations propriétaire</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'Nom complet', value: displayName(selected) },
                        { label: 'Téléphone', value: selected.phone, href: `tel:${selected.phone}`, color: '#16a34a' },
                        { label: 'Email', value: selected.email, href: `mailto:${selected.email}`, color: T.gold, span: 2 },
                        { label: 'Assigné à', value: selected.assigned_to || '—' },
                        { label: 'Priorité', value: selected.priority || 'medium' },
                      ].map((f, i) => (
                        <div key={i} style={{ background: T.ivory, borderRadius: '8px', padding: '12px', gridColumn: f.span ? `span ${f.span}` : 'span 1' }}>
                          <div style={lbl}>{f.label}</div>
                          {f.href ? (
                            <a href={f.href} style={{ fontSize: '13px', fontWeight: 600, color: f.color, textDecoration: 'none' }}>{f.value || '—'}</a>
                          ) : (
                            <div style={{ fontSize: '13px', fontWeight: 600, color: T.navy }}>{f.value || '—'}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    {selected.notes && (
                      <div style={{ background: T.ivory, borderRadius: '8px', padding: '14px', fontSize: '13px', color: T.navy, lineHeight: 1.6 }}>
                        <div style={{ ...lbl, marginBottom: '8px' }}>Notes</div>
                        {selected.notes}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {selected.phone && (
                        <a href={`tel:${selected.phone}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                          <Phone size={14} /> Appeler
                        </a>
                      )}
                      {selected.email && (
                        <a href={`mailto:${selected.email}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', background: '#F5F0E6', color: T.gold, borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                          <Mail size={14} /> Email
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* ── BIEN ── */}
                {tab === 'bien' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Informations du bien</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'Prix de vente souhaité', value: fmtBudget(selected.budget_min, selected.budget_max), color: T.gold },
                        { label: 'Localisation', value: selected.project_location || citiesLabel(selected.preferred_cities) || '—' },
                      ].map((f, i) => (
                        <div key={i} style={{ background: T.ivory, borderRadius: '8px', padding: '12px' }}>
                          <div style={lbl}>{f.label}</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: (f as any).color || T.navy }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                    {selected.notes && (
                      <div style={{ background: T.ivory, borderRadius: '8px', padding: '14px', fontSize: '13px', color: T.navy, lineHeight: 1.6 }}>
                        <div style={{ ...lbl, marginBottom: '8px' }}>Description du bien</div>
                        {selected.notes}
                      </div>
                    )}
                  </div>
                )}

                {/* ── VISITES ── */}
                {tab === 'visites' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visites du bien</div>
                      <button onClick={() => setShowVisitForm(v => !v)}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '7px', background: `${T.gold}20`, border: `1px solid ${T.border}`, color: T.gold, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={12} /> Planifier une visite
                      </button>
                    </div>

                    {showVisitForm && (
                      <div style={{ background: `${T.gold}08`, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div><label style={lbl}>Date et heure *</label><input type="datetime-local" value={visitForm.visit_date} onChange={e => setVisitForm(f => ({ ...f, visit_date: e.target.value }))} style={inp} /></div>
                        <div><label style={lbl}>Adresse</label><input value={visitForm.address} onChange={e => setVisitForm(f => ({ ...f, address: e.target.value }))} placeholder="Adresse du bien..." style={inp} /></div>
                        <div><label style={lbl}>Notes</label><textarea value={visitForm.notes} onChange={e => setVisitForm(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inp, resize: 'none' }} /></div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={addVisit} disabled={saving || !visitForm.visit_date} style={{ flex: 1, padding: '9px', background: `linear-gradient(135deg,${T.gold},${T.goldLight})`, color: T.navy, border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            {saving ? 'Ajout...' : 'Planifier'}
                          </button>
                          <button onClick={() => setShowVisitForm(false)} style={{ padding: '9px 14px', background: 'transparent', border: `1px solid ${T.borderSoft}`, borderRadius: '7px', cursor: 'pointer', color: T.muted }}><X size={14} /></button>
                        </div>
                      </div>
                    )}

                    {selectedVisits.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px', color: T.muted, fontSize: '13px' }}>Aucune visite planifiée</div>
                    ) : selectedVisits.map(visit => {
                      const st = STATUS_VISIT[visit.status] || STATUS_VISIT.planned;
                      return (
                        <div key={visit.id} style={{ background: T.ivory, borderRadius: '10px', padding: '14px', border: `1px solid ${T.borderSoft}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: T.navy }}>{fmtDate(visit.visit_date)}</div>
                              {visit.address && <div style={{ fontSize: '12px', color: T.muted, marginTop: '2px' }}>📍 {visit.address}</div>}
                            </div>
                            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: st.bg, color: st.color }}>{st.label}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {Object.entries(STATUS_VISIT).map(([val, s]) => (
                              <button key={val} onClick={() => updateVisitStatus(visit.id, val)}
                                style={{ padding: '4px 9px', borderRadius: '5px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${s.color}40`, background: visit.status === val ? s.color : 'transparent', color: visit.status === val ? '#fff' : s.color }}>
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── MANDAT ── */}
                {tab === 'mandat' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mandat de vente</div>
                      {selectedMandats.length === 0 && (
                        <button onClick={() => setShowMandatForm(v => !v)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '7px', background: `${T.gold}20`, border: `1px solid ${T.border}`, color: T.gold, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                          <Plus size={12} /> Créer un mandat
                        </button>
                      )}
                    </div>

                    {showMandatForm && (
                      <div style={{ background: `${T.gold}08`, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div><label style={lbl}>Prix de vente (MAD) *</label><input type="number" value={mandatForm.price} onChange={e => setMandatForm(f => ({ ...f, price: e.target.value }))} placeholder="Ex: 2500000" style={inp} /></div>
                        <div><label style={lbl}>Commission (%)</label><input type="number" value={mandatForm.commission} onChange={e => setMandatForm(f => ({ ...f, commission: e.target.value }))} placeholder="3" style={inp} /></div>
                        <div><label style={lbl}>Notes</label><textarea value={mandatForm.notes} onChange={e => setMandatForm(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inp, resize: 'none' }} /></div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={createMandat} disabled={saving || !mandatForm.price} style={{ flex: 1, padding: '9px', background: `linear-gradient(135deg,${T.gold},${T.goldLight})`, color: T.navy, border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
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
                            <div style={{ fontSize: '14px', fontWeight: 700, color: T.navy }}>Mandat de vente</div>
                            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: st.bg, color: st.color }}>{st.label}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                            <div><div style={lbl}>Prix mandaté</div><div style={{ fontSize: '15px', fontWeight: 700, color: T.gold }}>{m.price ? `${(m.price / 1_000_000).toFixed(2)}M MAD` : '—'}</div></div>
                            <div><div style={lbl}>Commission</div><div style={{ fontSize: '15px', fontWeight: 700, color: T.navy }}>{m.commission}%</div></div>
                            {m.sent_at && <div><div style={lbl}>Envoyé le</div><div style={{ fontSize: '12px', color: T.muted }}>{fmtDate(m.sent_at)}</div></div>}
                            {m.signed_at && <div><div style={lbl}>Signé le</div><div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>{fmtDate(m.signed_at)}</div></div>}
                          </div>
                          {m.notes && <div style={{ fontSize: '12px', color: T.muted, marginBottom: '12px' }}>{m.notes}</div>}
                          {/* Progression statut */}
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
                    {selectedVisits.length === 0 && selectedMandats.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px', color: T.muted, fontSize: '13px' }}>Aucun événement planifié</div>
                    ) : (
                      [...selectedVisits.map(v => ({ type: 'visit', date: v.visit_date, label: `🏠 Visite — ${v.address || 'Adresse à confirmer'}`, status: v.status, statusConfig: STATUS_VISIT[v.status] || STATUS_VISIT.planned })),
                       ...selectedMandats.filter(m => m.sent_at || m.signed_at).map(m => ({
                         type: 'mandat', date: m.signed_at || m.sent_at || '', label: m.signed_at ? '✍️ Mandat signé' : '📤 Mandat envoyé',
                         status: m.status, statusConfig: STATUS_MANDAT[m.status] || STATUS_MANDAT.draft,
                       }))]
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((ev, i) => {
                          const d = new Date(ev.date);
                          return (
                            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px', background: T.ivory, borderRadius: '10px', border: `1px solid ${T.borderSoft}` }}>
                              <div style={{ textAlign: 'center', minWidth: '48px', background: '#fff', borderRadius: '8px', padding: '8px', border: `1px solid ${T.borderSoft}` }}>
                                <div style={{ fontSize: '18px', fontWeight: 700, color: T.navy, lineHeight: 1 }}>{d.getDate()}</div>
                                <div style={{ fontSize: '10px', color: T.muted, textTransform: 'uppercase' }}>{d.toLocaleDateString('fr-FR', { month: 'short' })}</div>
                                <div style={{ fontSize: '11px', color: T.gold, fontWeight: 600 }}>{d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: T.navy }}>{ev.label}</div>
                              </div>
                              <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: ev.statusConfig.bg, color: ev.statusConfig.color, whiteSpace: 'nowrap' }}>
                                {ev.statusConfig.label}
                              </span>
                            </div>
                          );
                        })
                    )}
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