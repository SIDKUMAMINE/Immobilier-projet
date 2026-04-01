/**
 * Page principale du dashboard - Design professionnel épuré
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
  { label: 'Propriétés',          value: '12',  sub: '+2 ce mois',        icon: Building2,    bg: 'bg-blue-50',      text: 'text-blue-600',      href: '/dashboard/properties' },
  { label: 'Leads qualifiés',     value: '28',  sub: '+5 cette semaine',  icon: Users,        bg: 'bg-emerald-50',   text: 'text-emerald-600',   href: '/dashboard/leads' },
  { label: 'Conversations',       value: '45',  sub: '+12 aujourd\'hui',  icon: MessageSquare,bg: 'bg-purple-50',    text: 'text-purple-600',    href: '/dashboard/conversations' },
  { label: 'Taux qualification',  value: '87%', sub: '+3% vs mois dernier', icon: TrendingUp, bg: 'bg-orange-50',   text: 'text-orange-600',    href: '/dashboard/leads' },
];

const recentLeads = [
  { name: 'Karim Alaoui',     type: 'Appartement • Casablanca', score: 92 },
  { name: 'Sara Benali',      type: 'Villa • Marrakech',        score: 78 },
  { name: 'Youssef El Fassi', type: 'Bureau • Rabat',           score: 65 },
  { name: 'Nadia Tazi',       type: 'Riad • Fès',               score: 88 },
];

function Score({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-emerald-100 text-emerald-700' : value >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
      <Star size={9} className="fill-current" /> {value}
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Bonjour, {user?.full_name || 'Agent'} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-2">Gérez vos propriétés et leads en un seul endroit</p>
          </div>
          {/* ✅ Lien corrigé → /dashboard/properties */}
          <Link
            href="/dashboard/properties"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-blue-200"
          >
            <Plus size={16} />
            Nouvelle annonce
          </Link>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.label}
                href={s.href}
                className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-lg ${s.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={s.text} />
                </div>
                <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-600 mt-1 font-medium">{s.label}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-3">{s.sub}</p>
              </Link>
            );
          })}
        </div>

        {/* ── Main Grid: Leads + AI Agent ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Leads Card */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <h3 className="font-semibold text-slate-900 text-base">Derniers leads</h3>
              <Link href="/dashboard/leads" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 transition">
                Voir tout <ArrowRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <div
                  key={lead.name}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-blue-50 transition duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{lead.type}</p>
                  </div>
                  <Score value={lead.score} />
                </div>
              ))}
            </div>
          </div>

          {/* AI Agent Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Agent IA</p>
                    <p className="text-slate-400 text-xs mt-0.5">Qualification automatique</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Actif
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                L'agent qualifie vos prospects automatiquement en français et extrait leurs critères de recherche avec précision.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition">
                <p className="text-3xl font-bold text-blue-400">87%</p>
                <p className="text-slate-400 text-xs mt-2">Précision</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition">
                <p className="text-3xl font-bold text-blue-400">45</p>
                <p className="text-slate-400 text-xs mt-2">Ce mois</p>
              </div>
            </div>

            <Link
              href="/dashboard/conversations"
              className="mt-5 flex items-center justify-center gap-2 py-3 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-sm font-semibold transition duration-200"
            >
              Voir les conversations <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}