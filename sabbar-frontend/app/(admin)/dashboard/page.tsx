/**
 * Dashboard Vue d'ensemble — Style LANDMARK ESTATE
 * app/(admin)/dashboard/page.tsx
 */
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { Building2, Users, MessageSquare, TrendingUp, ArrowRight, Plus, Bot, Star } from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  navy:      '#0D1F3C',
  gold:      '#C8A96E',
  goldLight: '#E2C98A',
  terra:     '#B5573A',
  ivory:     '#F9F5EF',
  muted:     'rgba(13,31,60,0.5)',
  border:    'rgba(200,169,110,0.18)',
  borderSoft:'rgba(13,31,60,0.08)',
};

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { label: 'Propriétés',         value: '12',  sub: '+2 ce mois',          icon: Building2,     href: '/dashboard/properties',   accent: T.gold },
  { label: 'Leads qualifiés',    value: '28',  sub: '+5 cette semaine',    icon: Users,          href: '/dashboard/leads',         accent: '#16a34a' },
  { label: 'Conversations',      value: '45',  sub: '+12 aujourd\'hui',    icon: MessageSquare,  href: '/dashboard/conversations', accent: '#7c3aed' },
  { label: 'Taux qualification', value: '87%', sub: '+3% vs mois dernier', icon: TrendingUp,     href: '/dashboard/leads',         accent: T.terra },
];

const recentLeads = [
  { name: 'Karim Alaoui',     type: 'Appartement · Casablanca', score: 92 },
  { name: 'Sara Benali',      type: 'Villa · Marrakech',        score: 78 },
  { name: 'Youssef El Fassi', type: 'Bureau · Rabat',           score: 65 },
  { name: 'Nadia Tazi',       type: 'Riad · Fès',               score: 88 },
];

function ScoreBadge({ value }: { value: number }) {
  const color = value >= 80 ? '#16a34a' : value >= 60 ? '#d97706' : '#dc2626';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}>
      <Star size={9} style={{ fill: color, color }} /> {value}
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(' ')[0] || 'Agent';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        .lm-stat-card { transition: all 0.25s ease; }
        .lm-stat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(13,31,60,0.1) !important; border-color: rgba(200,169,110,0.4) !important; }
        .lm-lead-row { transition: background 0.15s ease; }
        .lm-lead-row:hover { background: rgba(200,169,110,0.04) !important; }
        .lm-btn-conv:hover { background: rgba(200,169,110,0.1) !important; color: #C8A96E !important; }
        .lm-see-all:hover { color: #C8A96E !important; }
        .lm-new-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(200,169,110,0.3) !important; }
      `}</style>

      <div style={{ minHeight: '100%', background: T.ivory, padding: '36px 40px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '100px', background: 'rgba(200,169,110,0.1)', border: `1px solid ${T.border}`, marginBottom: '14px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.gold, display: 'inline-block' }} />
                <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.gold, fontFamily: "'DM Sans', sans-serif" }}>Tableau de bord</span>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '40px', fontWeight: 300, color: T.navy, margin: '0 0 6px', lineHeight: 1.1 }}>
                Bonjour, <span style={{ color: T.gold, fontStyle: 'italic' }}>{firstName}</span> 👋
              </h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: T.muted, margin: 0 }}>
                Gérez vos propriétés et leads en un seul endroit
              </p>
            </div>
            <Link
              href="/dashboard/properties/new"
              className="lm-new-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 24px', background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, borderRadius: '10px', textDecoration: 'none', transition: 'all 0.25s', letterSpacing: '0.03em', boxShadow: '0 4px 16px rgba(200,169,110,0.2)' }}
            >
              <Plus size={16} /> Nouvelle annonce
            </Link>
          </div>

          {/* ── Stats Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className="lm-stat-card"
                  style={{ background: '#fff', borderRadius: '16px', padding: '28px 24px', border: `1px solid ${T.borderSoft}`, textDecoration: 'none', display: 'block', boxShadow: '0 2px 12px rgba(13,31,60,0.05)' }}
                >
                  {/* Icône */}
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${s.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <Icon size={20} style={{ color: s.accent }} />
                  </div>
                  {/* Valeur */}
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', fontWeight: 300, color: T.navy, lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
                  {/* Label */}
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: T.navy, marginBottom: '8px' }}>{s.label}</div>
                  {/* Sub */}
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 500, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                    {s.sub}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Main Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>

            {/* Derniers leads */}
            <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${T.borderSoft}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(13,31,60,0.05)' }}>
              {/* Header */}
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 400, color: T.navy, margin: 0 }}>Derniers leads</h3>
                </div>
                <Link href="/dashboard/leads" className="lm-see-all" style={{ fontSize: '12px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: T.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}>
                  Voir tout <ArrowRight size={13} />
                </Link>
              </div>
              {/* Rows */}
              {recentLeads.map((lead, i) => (
                <div key={lead.name} className="lm-lead-row" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: i < recentLeads.length - 1 ? `1px solid ${T.borderSoft}` : 'none' }}>
                  {/* Avatar */}
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.navy}, #1a3558)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.goldLight, fontSize: '15px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, flexShrink: 0 }}>
                    {lead.name.charAt(0)}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: T.navy, marginBottom: '2px' }}>{lead.name}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.muted }}>{lead.type}</div>
                  </div>
                  <ScoreBadge value={lead.score} />
                </div>
              ))}
            </div>

            {/* Agent IA */}
            <div style={{ background: T.navy, borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 32px rgba(13,31,60,0.2)', position: 'relative', overflow: 'hidden' }}>
              {/* Glow décoratif */}
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

              {/* Header agent */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={22} style={{ color: T.navy }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', fontWeight: 400, color: T.ivory }}>Agent IA</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(226,201,138,0.5)', marginTop: '2px' }}>Qualification automatique</div>
                    </div>
                  </div>
                  {/* Badge actif */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '100px', background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.25)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#4ade80', fontFamily: "'DM Sans', sans-serif" }}>Actif</span>
                  </div>
                </div>

                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(226,201,138,0.5)', lineHeight: 1.7, margin: 0 }}>
                  L'agent qualifie vos prospects automatiquement en français et extrait leurs critères de recherche avec précision.
                </p>
              </div>

              {/* Stats agent */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '24px 0' }}>
                {[{ val: '87%', label: 'Précision' }, { val: '45', label: 'Ce mois' }].map(s => (
                  <div key={s.label} style={{ background: 'rgba(200,169,110,0.07)', border: `1px solid ${T.border}`, borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 300, color: T.gold, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(226,201,138,0.45)', marginTop: '6px', letterSpacing: '0.05em' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Bouton */}
              <Link href="/dashboard/conversations" className="lm-btn-conv" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '10px', border: `1px solid ${T.border}`, color: T.muted, fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }}>
                Voir les conversations <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* ── Footer info ── */}
          <div style={{ marginTop: '32px', padding: '16px 24px', background: 'rgba(200,169,110,0.05)', borderRadius: '12px', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px' }}>📊</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.muted }}>
              Données mises à jour en temps réel · LANDMARK ESTATE Dashboard
            </span>
          </div>

        </div>
      </div>
    </>
  );
}