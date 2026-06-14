'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users, Phone, Mail, MapPin, DollarSign, Calendar,
  Plus, Trash2, Save, X, Check, RefreshCw, FileText,
  Eye, ChevronDown, ChevronUp, Search, Filter, ArrowLeft
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
  notes?: string; qualification_score?: number; lead_type?: string;
  assigned_to?: string;
}
interface Visit {
  id: string; lead_id: string; visit_date: string;
  address?: string; notes?: string; status: string;
}
interface BuyerGroup {
  id: string; name: string; description?: string; criteria?: any;
  members?: Lead[];
}
interface VisitVoucher {
  id: string; visit_id: string; lead_id: string;
  property_ref?: string; agent_name?: string; sent_at?: string; signed_at?: string;
}

function displayName(l: Lead) {
  return [l.first_name, l.last_name].filter(Boolean).join(' ').trim() || '—';
}
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

export default function AcheteursPage() {
  const [leads, setLeads]         = useState<Lead[]>([]);
  const [visits, setVisits]       = useState<Visit[]>([]);
  const [groups, setGroups]       = useState<BuyerGroup[]>([]);
  const [vouchers, setVouchers]   = useState<VisitVoucher[]>([]);
  const [selected, setSelected]   = useState<Lead | null>(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [tab, setTab]             = useState<'fiche' | 'visites' | 'groupe' | 'calendrier'>('fiche');

  // Formulaires
  const [showVisitForm, setShowVisitForm]   = useState(false);
  const [showGroupForm, setShowGroupForm]   = useState(false);
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [visitForm, setVisitForm]           = useState({ visit_date: '', address: '', notes: '' });
  const [groupForm, setGroupForm]           = useState({ name: '', description: '' });
  const [voucherForm, setVoucherForm]       = useState({ property_ref: '', visit_id: '' });
  const [saving, setSaving]                 = useState(false);

  const load = async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const [l, v, g, gm, vou] = await Promise.all([
      supabase.from('leads').select('*').eq('lead_type', 'acheteur').order('created_at', { ascending: false }),
      supabase.from('visits').select('*').order('visit_date', { ascending: true }),
      supabase.from('buyer_groups').select('*').order('created_at', { ascending: false }),
      supabase.from('buyer_group_members').select('*'),
      supabase.from('visit_vouchers').select('*').order('created_at', { ascending: false }),
    ]);
    setLeads(l.data || []);
    setVisits(v.data || []);
    setVouchers(vou.data || []);
    // Attacher les membres aux groupes
    const members = gm.data || [];
    const leadsData = l.data || [];
    const enriched = (g.data || []).map((gr: BuyerGroup) => ({
      ...gr,
      members: members.filter((m: any) => m.group_id === gr.id)
        .map((m: any) => leadsData.find((ld: Lead) => ld.id === m.lead_id))
        .filter(Boolean) as Lead[],
    }));
    setGroups(enriched);
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
      // Ajouter en tâche du jour
      const today = new Date().toISOString().split('T')[0];
      const visitDay = visitForm.visit_date.split('T')[0];
      if (visitDay === today && supabase) {
        await supabase.from('tasks').insert({
          label: `🏠 Visite acheteur : ${displayName(selected)} — ${visitForm.address || 'adresse à confirmer'}`,
          done: false, urgent: false, due_date: today, lead_id: selected.id, source: 'lead',
        });
      }
    }
    setVisitForm({ visit_date: '', address: '', notes: '' });
    setShowVisitForm(false);
    setSaving(false);
  };

  const updateVisitStatus = async (visitId: string, status: string) => {
    if (!supabase) return;
    await supabase.from('visits').update({ status }).eq('id', visitId);
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status } : v));
  };

  const createGroup = async () => {
    if (!supabase || !groupForm.name) return;
    setSaving(true);
    const { data } = await supabase.from('buyer_groups').insert({
      name: groupForm.name, description: groupForm.description || null,
    }).select().single();
    if (data) setGroups(prev => [...prev, { ...data, members: [] }]);
    setGroupForm({ name: '', description: '' });
    setShowGroupForm(false);
    setSaving(false);
  };

  const addToGroup = async (groupId: string, leadId: string) => {
    if (!supabase) return;
    await supabase.from('buyer_group_members').insert({ group_id: groupId, lead_id: leadId });
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const lead = leads.find(l => l.id === leadId);
      if (!lead || g.members?.find(m => m.id === leadId)) return g;
      return { ...g, members: [...(g.members || []), lead] };
    }));
  };

  const generateVoucher = async () => {
    if (!supabase || !selected || !voucherForm.visit_id) return;
    setSaving(true);
    const { data } = await supabase.from('visit_vouchers').insert({
      visit_id: voucherForm.visit_id, lead_id: selected.id,
      property_ref: voucherForm.property_ref || null,
      agent_name: 'Mohamed Sabbar',
    }).select().single();
    if (data) {
      setVouchers(prev => [...prev, data]);
      // Marquer comme envoyé
      await supabase.from('visit_vouchers').update({ sent_at: new Date().toISOString() }).eq('id', data.id);
    }
    setVoucherForm({ property_ref: '', visit_id: '' });
    setShowVoucherForm(false);
    setSaving(false);
  };

  const deleteVisit = async (id: string) => {
    if (!supabase || !confirm('Supprimer cette visite ?')) return;
    await supabase.from('visits').delete().eq('id', id);
    setVisits(prev => prev.filter(v => v.id !== id));
  };

  const filtered = leads.filter(l =>
    !search || [displayName(l), l.email, l.phone, citiesLabel(l.preferred_cities)]
      .some(s => s?.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedVisits  = visits.filter(v => v.lead_id === selected?.id);
  const selectedVouchers = vouchers.filter(v => v.lead_id === selected?.id);
  const todayVisits = visits.filter(v => v.visit_date?.startsWith(new Date().toISOString().split('T')[0]));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .ach-card{transition:all .18s;cursor:pointer;}
        .ach-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(13,31,60,.08)!important;}
        .ach-card.sel{border-color:#C8A96E!important;box-shadow:0 0 0 2px rgba(200,169,110,.15)!important;}
        input:focus,select:focus,textarea:focus{border-color:rgba(200,169,110,.5)!important;outline:none!important;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(200,169,110,.3);border-radius:2px;}
      `}</style>

      <div style={{ minHeight: '100%', background: T.ivory, padding: '28px 32px', fontFamily: "'DM Sans',system-ui,sans-serif" }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <Link href="/dashboard/leads" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: T.muted, textDecoration: 'none', fontSize: '13px', marginBottom: '8px' }}>
              <ArrowLeft size={13} /> Retour aux leads
            </Link>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '32px', fontWeight: 300, color: T.navy, margin: 0 }}>
              Gestion <span style={{ color: T.gold, fontStyle: 'italic' }}>Acheteurs</span>
            </h1>
            <p style={{ fontSize: '12px', color: T.muted, marginTop: '4px' }}>{leads.length} acheteurs · {todayVisits.length} visite{todayVisits.length !== 1 ? 's' : ''} aujourd'hui</p>
          </div>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#16a34a', color: '#fff', fontSize: '13px', fontWeight: 500, borderRadius: '9px', border: 'none', cursor: 'pointer' }}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Actualiser
          </button>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Total acheteurs', value: leads.length, color: '#2563eb' },
            { label: 'Visites planifiées', value: visits.filter(v => v.status === 'planned' || v.status === 'confirmed').length, color: T.gold },
            { label: 'Visites effectuées', value: visits.filter(v => v.status === 'done').length, color: '#16a34a' },
            { label: 'Groupes', value: groups.length, color: T.terra },
          ].map((k, i) => (
            <div key={i} style={{ ...card, padding: '20px 24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>{k.label}</div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: k.color, fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Layout principal */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '340px 1fr' : '1fr', gap: '20px' }}>

          {/* ── Liste acheteurs ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Recherche */}
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.muted }} />
              <input placeholder="Rechercher acheteur..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...inp, paddingLeft: '36px' }} />
            </div>

            {/* Cards acheteurs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: 'calc(100vh - 320px)', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: T.muted }}>
                  <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 8px' }} />
                  Chargement...
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: T.muted, fontSize: '13px' }}>
                  Aucun acheteur trouvé
                </div>
              ) : filtered.map(lead => {
                const isSel = selected?.id === lead.id;
                const lVisits = visits.filter(v => v.lead_id === lead.id);
                return (
                  <div key={lead.id} className={`ach-card${isSel ? ' sel' : ''}`}
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
                          <div style={{ fontSize: '12px', color: T.muted }}>{lead.email || lead.phone || '—'}</div>
                        </div>
                      </div>
                      {lVisits.length > 0 && (
                        <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
                          {lVisits.length} visite{lVisits.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: T.gold, marginBottom: '6px' }}>
                      {fmtBudget(lead.budget_min, lead.budget_max)}
                    </div>
                    {citiesLabel(lead.preferred_cities) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: T.muted }}>
                        <MapPin size={11} style={{ color: T.gold }} /> {citiesLabel(lead.preferred_cities)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Panneau détail ── */}
          {selected && (
            <div style={{ ...card, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: `1px solid ${T.borderSoft}`, background: '#faf8f5' }}>
                {([
                  { key: 'fiche', label: 'Fiche', icon: '👤' },
                  { key: 'visites', label: 'Visites', icon: '🏠' },
                  { key: 'groupe', label: 'Groupes', icon: '👥' },
                  { key: 'calendrier', label: 'Calendrier', icon: '📅' },
                ] as const).map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    style={{ flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: tab === t.key ? 600 : 400, fontFamily: "'DM Sans',sans-serif", background: 'transparent', color: tab === t.key ? T.navy : T.muted, borderBottom: tab === t.key ? `2px solid ${T.gold}` : '2px solid transparent' }}>
                    {t.icon} {t.label}
                  </button>
                ))}
                <button onClick={() => setSelected(null)} style={{ padding: '14px', border: 'none', cursor: 'pointer', background: 'transparent', color: T.muted }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>

                {/* ── TAB : FICHE ── */}
                {tab === 'fiche' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Identité */}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Informations acheteur</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ background: T.ivory, borderRadius: '8px', padding: '12px' }}>
                          <div style={lbl}>Nom complet</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: T.navy }}>{displayName(selected)}</div>
                        </div>
                        <div style={{ background: T.ivory, borderRadius: '8px', padding: '12px' }}>
                          <div style={lbl}>Téléphone</div>
                          <a href={`tel:${selected.phone}`} style={{ fontSize: '14px', fontWeight: 600, color: '#16a34a', textDecoration: 'none' }}>{selected.phone || '—'}</a>
                        </div>
                        <div style={{ background: T.ivory, borderRadius: '8px', padding: '12px', gridColumn: 'span 2' }}>
                          <div style={lbl}>Email</div>
                          <a href={`mailto:${selected.email}`} style={{ fontSize: '13px', color: T.gold, textDecoration: 'none' }}>{selected.email || '—'}</a>
                        </div>
                      </div>
                    </div>

                    {/* Critères de recherche */}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Critères de recherche</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ background: T.ivory, borderRadius: '8px', padding: '12px' }}>
                          <div style={lbl}>Budget</div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: T.gold }}>{fmtBudget(selected.budget_min, selected.budget_max)}</div>
                        </div>
                        <div style={{ background: T.ivory, borderRadius: '8px', padding: '12px' }}>
                          <div style={lbl}>Villes souhaitées</div>
                          <div style={{ fontSize: '13px', color: T.navy }}>{citiesLabel(selected.preferred_cities) || '—'}</div>
                        </div>
                        <div style={{ background: T.ivory, borderRadius: '8px', padding: '12px' }}>
                          <div style={lbl}>Score qualification</div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: selected.qualification_score && selected.qualification_score >= 70 ? '#16a34a' : '#d97706' }}>
                            {selected.qualification_score ?? '—'} / 100
                          </div>
                        </div>
                        <div style={{ background: T.ivory, borderRadius: '8px', padding: '12px' }}>
                          <div style={lbl}>Priorité</div>
                          <div style={{ fontSize: '13px', color: T.navy, textTransform: 'capitalize' }}>{selected.priority || 'medium'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {selected.notes && (
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes</div>
                        <div style={{ background: T.ivory, borderRadius: '8px', padding: '14px', fontSize: '13px', color: T.navy, lineHeight: 1.6 }}>
                          {selected.notes}
                        </div>
                      </div>
                    )}

                    {/* Actions rapides */}
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

                {/* ── TAB : VISITES ── */}
                {tab === 'visites' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Visites de {displayName(selected)}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setShowVoucherForm(v => !v)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '7px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                          <FileText size={12} /> Bon de visite
                        </button>
                        <button onClick={() => setShowVisitForm(v => !v)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '7px', background: `${T.gold}20`, border: `1px solid ${T.border}`, color: T.gold, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                          <Plus size={12} /> Planifier
                        </button>
                      </div>
                    </div>

                    {/* Formulaire bon de visite */}
                    {showVoucherForm && (
                      <div style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>📄 Générer un bon de visite</div>
                        <div>
                          <label style={lbl}>Sélectionner la visite</label>
                          <select value={voucherForm.visit_id} onChange={e => setVoucherForm(f => ({ ...f, visit_id: e.target.value }))} style={inp}>
                            <option value="">Choisir une visite...</option>
                            {selectedVisits.map(v => (
                              <option key={v.id} value={v.id}>{fmtDate(v.visit_date)} — {v.address || 'Adresse non définie'}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={lbl}>Référence du bien</label>
                          <input value={voucherForm.property_ref} onChange={e => setVoucherForm(f => ({ ...f, property_ref: e.target.value }))} placeholder="Ex: APP-Tanger-001" style={inp} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={generateVoucher} disabled={saving || !voucherForm.visit_id}
                            style={{ flex: 1, padding: '9px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            {saving ? 'Génération...' : 'Générer et envoyer'}
                          </button>
                          <button onClick={() => setShowVoucherForm(false)} style={{ padding: '9px 14px', background: 'transparent', border: `1px solid ${T.borderSoft}`, borderRadius: '7px', cursor: 'pointer', color: T.muted }}>
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Formulaire visite */}
                    {showVisitForm && (
                      <div style={{ background: `${T.gold}08`, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={lbl}>Date et heure *</label>
                          <input type="datetime-local" value={visitForm.visit_date} onChange={e => setVisitForm(f => ({ ...f, visit_date: e.target.value }))} style={inp} />
                        </div>
                        <div>
                          <label style={lbl}>Adresse du bien</label>
                          <input value={visitForm.address} onChange={e => setVisitForm(f => ({ ...f, address: e.target.value }))} placeholder="Adresse complète..." style={inp} />
                        </div>
                        <div>
                          <label style={lbl}>Notes</label>
                          <textarea value={visitForm.notes} onChange={e => setVisitForm(f => ({ ...f, notes: e.target.value }))} placeholder="Informations complémentaires..." rows={2} style={{ ...inp, resize: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={addVisit} disabled={saving || !visitForm.visit_date}
                            style={{ flex: 1, padding: '9px', background: `linear-gradient(135deg,${T.gold},${T.goldLight})`, color: T.navy, border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            {saving ? 'Ajout...' : 'Planifier la visite'}
                          </button>
                          <button onClick={() => setShowVisitForm(false)} style={{ padding: '9px 14px', background: 'transparent', border: `1px solid ${T.borderSoft}`, borderRadius: '7px', cursor: 'pointer', color: T.muted }}>
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Liste des visites */}
                    {selectedVisits.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px', color: T.muted, fontSize: '13px' }}>
                        Aucune visite planifiée
                      </div>
                    ) : selectedVisits.map(visit => {
                      const st = STATUS_VISIT[visit.status] || STATUS_VISIT.planned;
                      const vou = vouchers.find(v => v.visit_id === visit.id);
                      return (
                        <div key={visit.id} style={{ background: T.ivory, borderRadius: '10px', padding: '14px', border: `1px solid ${T.borderSoft}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: T.navy }}>{fmtDate(visit.visit_date)}</div>
                              {visit.address && <div style={{ fontSize: '12px', color: T.muted, marginTop: '2px' }}>📍 {visit.address}</div>}
                            </div>
                            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: st.bg, color: st.color }}>{st.label}</span>
                          </div>
                          {visit.notes && <div style={{ fontSize: '12px', color: T.muted, marginBottom: '8px' }}>{visit.notes}</div>}
                          {vou && (
                            <div style={{ fontSize: '11px', color: '#2563eb', background: 'rgba(37,99,235,0.07)', padding: '4px 8px', borderRadius: '5px', marginBottom: '8px' }}>
                              📄 Bon de visite généré {vou.sent_at ? `— Envoyé ${fmtDate(vou.sent_at)}` : ''}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {Object.entries(STATUS_VISIT).map(([val, s]) => (
                              <button key={val} onClick={() => updateVisitStatus(visit.id, val)}
                                style={{ padding: '4px 9px', borderRadius: '5px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${s.color}40`, background: visit.status === val ? s.color : 'transparent', color: visit.status === val ? '#fff' : s.color }}>
                                {s.label}
                              </button>
                            ))}
                            <button onClick={() => deleteVisit(visit.id)}
                              style={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: '5px', background: 'rgba(181,87,58,0.1)', border: 'none', color: T.terra, cursor: 'pointer' }}>
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── TAB : GROUPES ── */}
                {tab === 'groupe' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Groupes d'acheteurs</div>
                      <button onClick={() => setShowGroupForm(v => !v)}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '7px', background: `${T.gold}20`, border: `1px solid ${T.border}`, color: T.gold, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={12} /> Créer un groupe
                      </button>
                    </div>

                    {showGroupForm && (
                      <div style={{ background: `${T.gold}08`, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={lbl}>Nom du groupe *</label>
                          <input value={groupForm.name} onChange={e => setGroupForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Appart 3ch Tanger 1-2M" style={inp} />
                        </div>
                        <div>
                          <label style={lbl}>Description</label>
                          <input value={groupForm.description} onChange={e => setGroupForm(f => ({ ...f, description: e.target.value }))} placeholder="Critères communs..." style={inp} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={createGroup} disabled={saving || !groupForm.name}
                            style={{ flex: 1, padding: '9px', background: `linear-gradient(135deg,${T.gold},${T.goldLight})`, color: T.navy, border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            {saving ? 'Création...' : 'Créer le groupe'}
                          </button>
                          <button onClick={() => setShowGroupForm(false)} style={{ padding: '9px 14px', background: 'transparent', border: `1px solid ${T.borderSoft}`, borderRadius: '7px', cursor: 'pointer', color: T.muted }}>
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Groupes existants */}
                    {groups.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px', color: T.muted, fontSize: '13px' }}>Aucun groupe créé</div>
                    ) : groups.map(group => (
                      <div key={group.id} style={{ background: T.ivory, borderRadius: '10px', padding: '14px', border: `1px solid ${T.borderSoft}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy }}>{group.name}</div>
                            {group.description && <div style={{ fontSize: '12px', color: T.muted, marginTop: '2px' }}>{group.description}</div>}
                          </div>
                          <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: 'rgba(13,31,60,0.07)', color: T.muted }}>
                            {group.members?.length || 0} membres
                          </span>
                        </div>
                        {/* Membres */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          {group.members?.map(m => (
                            <span key={m.id} style={{ padding: '3px 9px', borderRadius: '20px', fontSize: '11px', background: 'rgba(200,169,110,0.1)', color: T.navy, border: `1px solid ${T.border}` }}>
                              {displayName(m)}
                            </span>
                          ))}
                        </div>
                        {/* Ajouter l'acheteur sélectionné */}
                        {selected && !group.members?.find(m => m.id === selected.id) && (
                          <button onClick={() => addToGroup(group.id, selected.id)}
                            style={{ padding: '5px 12px', borderRadius: '6px', background: `${T.gold}15`, border: `1px solid ${T.border}`, color: T.gold, fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                            + Ajouter {selected.first_name} à ce groupe
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ── TAB : CALENDRIER ── */}
                {tab === 'calendrier' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Calendrier — {displayName(selected)}
                    </div>
                    {/* Visites triées par date */}
                    {selectedVisits.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px', color: T.muted, fontSize: '13px' }}>
                        Aucun événement planifié.<br />
                        <button onClick={() => setTab('visites')} style={{ marginTop: '8px', padding: '7px 14px', borderRadius: '7px', background: `${T.gold}15`, border: `1px solid ${T.border}`, color: T.gold, fontSize: '12px', cursor: 'pointer' }}>
                          Planifier une visite
                        </button>
                      </div>
                    ) : [...selectedVisits].sort((a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime()).map(visit => {
                      const st = STATUS_VISIT[visit.status] || STATUS_VISIT.planned;
                      const d = new Date(visit.visit_date);
                      return (
                        <div key={visit.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px', background: T.ivory, borderRadius: '10px', border: `1px solid ${T.borderSoft}` }}>
                          {/* Date */}
                          <div style={{ textAlign: 'center', minWidth: '48px', background: '#fff', borderRadius: '8px', padding: '8px', border: `1px solid ${T.borderSoft}` }}>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: T.navy, lineHeight: 1 }}>{d.getDate()}</div>
                            <div style={{ fontSize: '10px', color: T.muted, textTransform: 'uppercase' }}>
                              {d.toLocaleDateString('fr-FR', { month: 'short' })}
                            </div>
                            <div style={{ fontSize: '11px', color: T.gold, fontWeight: 600 }}>
                              {d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: T.navy, marginBottom: '3px' }}>
                              🏠 Visite — {visit.address || 'Adresse à confirmer'}
                            </div>
                            {visit.notes && <div style={{ fontSize: '12px', color: T.muted }}>{visit.notes}</div>}
                          </div>
                          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>{st.label}</span>
                        </div>
                      );
                    })}
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