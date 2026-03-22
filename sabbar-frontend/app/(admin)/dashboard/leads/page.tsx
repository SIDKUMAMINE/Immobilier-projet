/**
 * Gestion des leads
 * Fichier: app/(admin)/dashboard/leads/page.tsx
 */
'use client';

export default function LeadsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Mes Leads Qualifiés</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">Lead {item}</h3>
                <p className="text-sm text-slate-600">lead{item}@email.com</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                Score: 85%
              </span>
            </div>
            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <p>📍 Casablanca</p>
              <p>🏠 Appartement, 3 chambres</p>
              <p>💰 Budget: 1.5M - 2M MAD</p>
            </div>
            <button className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition">
              Voir les détails
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}