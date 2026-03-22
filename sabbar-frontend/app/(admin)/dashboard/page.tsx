/**
 * Page principale du dashboard - Design épuré
 * Fichier: app/(admin)/dashboard/page.tsx
 */
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import {
  Building2, Users, MessageSquare, TrendingUp,
  ArrowRight, Plus, Bot, Star,
} from 'lucide-react';

const stats = [
  { label: 'Propriétés',          value: '12',  sub: '+2 ce mois',        icon: Building2,    bg: 'bg-amber-50',  text: 'text-amber-600',  href: '/dashboard/properties' },
  { label: 'Leads qualifiés',     value: '28',  sub: '+5 cette semaine',  icon: Users,        bg: 'bg-blue-50',   text: 'text-blue-600',   href: '/dashboard/leads' },
  { label: 'Conversations',       value: '45',  sub: '+12 aujourd\'hui',  icon: MessageSquare,bg: 'bg-green-50',  text: 'text-green-600',  href: '/dashboard/conversations' },
  { label: 'Taux qualification',  value: '87%', sub: '+3% vs mois dernier', icon: TrendingUp, bg: 'bg-purple-50', text: 'text-purple-600', href: '/dashboard/leads' },
];

const recentLeads = [
  { name: 'Karim Alaoui',     type: 'Appartement • Casablanca', score: 92 },
  { name: 'Sara Benali',      type: 'Villa • Marrakech',        score: 78 },
  { name: 'Youssef El Fassi', type: 'Bureau • Rabat',           score: 65 },
  { name: 'Nadia Tazi',       type: 'Riad • Fès',               score: 88 },
];

function Score({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-green-100 text-green-700' : value >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
      <Star size={9} className="fill-current" /> {value}
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Bonjour, {user?.full_name || 'Agent'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Voici votre activité du jour</p>
        </div>
        {/* ✅ Lien corrigé → /dashboard/properties */}
        <Link
          href="/dashboard/properties"
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-amber-200"
        >
          <Plus size={15} />
          Nouvelle annonce
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                <Icon size={18} className={s.text} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-green-600 font-medium mt-2">{s.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* ── Grille : Leads + Agent IA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Leads récents */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
            <h3 className="font-semibold text-slate-800 text-sm">Derniers leads</h3>
            <Link href="/dashboard/leads" className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 transition">
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          <div>
            {recentLeads.map((lead, i) => (
              <div
                key={lead.name}
                className={`px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition ${i < recentLeads.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{lead.name}</p>
                  <p className="text-xs text-slate-400 truncate">{lead.type}</p>
                </div>
                <Score value={lead.score} />
              </div>
            ))}
          </div>
        </div>

        {/* Agent IA */}
        <div className="lg:col-span-2 bg-[#0f1117] rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                  <Bot size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Agent IA</p>
                  <p className="text-white/40 text-xs">Qualification auto</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Actif
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">
              L'agent qualifie vos prospects automatiquement en français et extrait leurs critères de recherche.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">87%</p>
              <p className="text-white/35 text-xs mt-1">Précision</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">45</p>
              <p className="text-white/35 text-xs mt-1">Ce mois</p>
            </div>
          </div>

          <Link
            href="/dashboard/conversations"
            className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-sm font-medium transition"
          >
            Voir les conversations <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}