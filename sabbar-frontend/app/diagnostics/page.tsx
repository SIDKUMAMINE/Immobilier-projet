'use client';

import { useEffect, useState } from 'react';

export default function DiagnosticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAPI = async () => {
      try {
        // 1️⃣ Test 1: Récupérer TOUTES les propriétés SANS filtre
        console.log('=== TEST 1: Sans filtre ===');
        const res1 = await fetch('http://localhost:8000/api/v1/properties?limit=100');
        const data1 = await res1.json();
        const count1 = Array.isArray(data1) ? data1.length : data1?.data?.length || 0;
        console.log(`✅ Total propriétés (sans filtre): ${count1}`);
        console.log('Données:', data1);

        // 2️⃣ Test 2: Avec filtre status=available
        console.log('\n=== TEST 2: Avec status=available ===');
        const res2 = await fetch('http://localhost:8000/api/v1/properties?limit=100&status=available');
        const data2 = await res2.json();
        const count2 = Array.isArray(data2) ? data2.length : data2?.data?.length || 0;
        console.log(`✅ Total propriétés (status=available): ${count2}`);

        // 3️⃣ Test 3: Avec filtre status=inactive
        console.log('\n=== TEST 3: Avec status=inactive ===');
        const res3 = await fetch('http://localhost:8000/api/v1/properties?limit=100&status=inactive');
        const data3 = await res3.json();
        const count3 = Array.isArray(data3) ? data3.length : data3?.data?.length || 0;
        console.log(`✅ Total propriétés (status=inactive): ${count3}`);

        // 4️⃣ Test 4: Avec filtre status=sold
        console.log('\n=== TEST 4: Avec status=sold ===');
        const res4 = await fetch('http://localhost:8000/api/v1/properties?limit=100&status=sold');
        const data4 = await res4.json();
        const count4 = Array.isArray(data4) ? data4.length : data4?.data?.length || 0;
        console.log(`✅ Total propriétés (status=sold): ${count4}`);

        // 5️⃣ Test 5: Vérifier la structure des données
        console.log('\n=== TEST 5: Structure des données ===');
        const firstProp = Array.isArray(data1) ? data1[0] : data1?.data?.[0];
        if (firstProp) {
          console.log('Clés disponibles:', Object.keys(firstProp));
          console.log('Exemple propriété:', firstProp);
        }

        // Stocker pour affichage
        setData({
          test1: { count: count1, data: data1 },
          test2: { count: count2, data: data2 },
          test3: { count: count3, data: data3 },
          test4: { count: count4, data: data4 },
          firstProperty: firstProp
        });

        setLoading(false);
      } catch (err) {
        console.error('❌ Erreur:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
        setLoading(false);
      }
    };

    checkAPI();
  }, []);

  if (loading) return <div className="p-8 text-white">Diagnostic en cours...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔍 Diagnostic API - Annonces</h1>

      {error && (
        <div className="bg-red-900 p-4 rounded mb-8">
          ❌ Erreur: {error}
        </div>
      )}

      {data && (
        <div className="space-y-8">
          {/* Test 1 */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4">
              📊 Test 1: Sans filtre (limit=100)
            </h2>
            <p className="text-2xl text-green-400 mb-4">
              ✅ Total: {data.test1.count} propriétés
            </p>
            <details>
              <summary className="cursor-pointer text-orange-400 hover:text-orange-300">
                Afficher les détails
              </summary>
              <pre className="mt-4 bg-black p-4 rounded text-sm overflow-auto max-h-64">
                {JSON.stringify(data.test1.data, null, 2)}
              </pre>
            </details>
          </div>

          {/* Test 2 */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4">
              📊 Test 2: Avec status=available
            </h2>
            <p className="text-2xl text-blue-400 mb-4">
              ✅ Total: {data.test2.count} propriétés
            </p>
          </div>

          {/* Test 3 */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4">
              📊 Test 3: Avec status=inactive
            </h2>
            <p className="text-2xl text-yellow-400 mb-4">
              ✅ Total: {data.test3.count} propriétés (ANNONCES ANCIENNES?)
            </p>
          </div>

          {/* Test 4 */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4">
              📊 Test 4: Avec status=sold
            </h2>
            <p className="text-2xl text-red-400 mb-4">
              ✅ Total: {data.test4.count} propriétés
            </p>
          </div>

          {/* Résumé */}
          <div className="bg-gray-900 p-6 rounded-lg border border-green-700">
            <h2 className="text-xl font-bold mb-4">📋 Résumé</h2>
            <div className="space-y-2 text-lg">
              <p>
                <span className="font-bold">Sans filtre:</span>{' '}
                <span className="text-green-400">{data.test1.count}</span>
              </p>
              <p>
                <span className="font-bold">status=available:</span>{' '}
                <span className="text-blue-400">{data.test2.count}</span>
              </p>
              <p>
                <span className="font-bold">status=inactive:</span>{' '}
                <span className="text-yellow-400">{data.test3.count}</span>
              </p>
              <p>
                <span className="font-bold">status=sold:</span>{' '}
                <span className="text-red-400">{data.test4.count}</span>
              </p>
            </div>

            {data.test1.count > data.test2.count && (
              <div className="mt-4 p-4 bg-yellow-900 rounded text-yellow-200 border border-yellow-700">
                ⚠️ Les annonces anciennes ont probablement un status différent de
                "available"!
              </div>
            )}
          </div>

          {/* Structure */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4">🔑 Structure des données</h2>
            <pre className="bg-black p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(data.firstProperty, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-900 p-6 rounded-lg border border-blue-700">
        <h3 className="text-lg font-bold mb-2">💡 Comment lire ces résultats?</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-100">
          <li>Si Test 1 &gt; Test 2: Il y a des annonces avec un status différent</li>
          <li>Vérifiez si Test 3 (inactive) ou Test 4 (sold) a des résultats</li>
          <li>Ouvrez la console (F12) pour voir tous les détails</li>
          <li>Copiez les résultats pour m'aider à déboguer</li>
        </ul>
      </div>
    </div>
  );
}