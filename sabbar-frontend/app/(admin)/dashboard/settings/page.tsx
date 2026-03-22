/**
 * Paramètres du compte
 * Fichier: app/(admin)/dashboard/settings/page.tsx
 */
'use client';

import { useAuth } from '@/lib/auth/context';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Paramètres</h1>

      {/* Profil */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Profil</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              defaultValue={user?.full_name}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              disabled
            />
          </div>
          <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition">
            Enregistrer
          </button>
        </div>
      </div>

      {/* Agence */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Agence</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom de l'agence
            </label>
            <input
              type="text"
              defaultValue={user?.agency_name}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              defaultValue={user?.phone_number}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}