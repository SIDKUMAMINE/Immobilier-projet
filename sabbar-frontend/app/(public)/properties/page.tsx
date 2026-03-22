'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Bed, Square, DollarSign } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  district?: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type: string;
  transaction_type: string;
  images?: string[];
  created_at: string;
  owner_id: string;
}

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    city: '',
    transaction_type: '',
  });

  // Charger les paramètres URL
  useEffect(() => {
    const cityParam = searchParams.get('city');
    const transactionParam = searchParams.get('transaction_type');

    console.log('🔗 Paramètres URL:', { city: cityParam, transaction_type: transactionParam });

    setFilters({
      city: cityParam || '',
      transaction_type: transactionParam || '',
    });
  }, [searchParams]);

  // Récupérer les propriétés
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construire l'URL avec les filtres
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.transaction_type) params.append('transaction_type', filters.transaction_type);
      params.append('limit', '100');

      const url = `http://localhost:8000/api/v1/properties?${params}`;
      console.log('📡 Appel API:', url);

      const response = await fetch(url);
      console.log('✅ Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 Data brutes reçue:', data);
      console.log('📊 Type:', typeof data, '| Array?:', Array.isArray(data));

      // Extraire les propriétés du format correct
      let extractedProperties: Property[] = [];

      if (Array.isArray(data)) {
        // Format 1: Array direct
        extractedProperties = data;
        console.log('✅ Format détecté: Array []');
      } else if (data?.data && Array.isArray(data.data)) {
        // Format 2: {data: []}
        extractedProperties = data.data;
        console.log('✅ Format détecté: {data: []}');
      } else if (data?.results && Array.isArray(data.results)) {
        // Format 3: {results: []}
        extractedProperties = data.results;
        console.log('✅ Format détecté: {results: []}');
      } else if (data?.items && Array.isArray(data.items)) {
        // Format 4: {items: []}
        extractedProperties = data.items;
        console.log('✅ Format détecté: {items: []}');
      } else {
        console.warn('⚠️ Format non reconnu. Clés disponibles:', Object.keys(data || {}));
        extractedProperties = [];
      }

      console.log('🔢 TOTAL PROPRIÉTÉS À AFFICHER:', extractedProperties.length);
      setProperties(extractedProperties);

    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Recharger quand les filtres changent
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  // Gérer les changements de filtres
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      city: '',
      transaction_type: '',
    });
  };

  // Skeleton loader
  const PropertySkeleton = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
      <div className="bg-gray-700 h-48 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Nos Propriétés</h1>
          <p className="text-blue-100">Découvrez tous nos biens immobiliers</p>
        </div>
      </div>

      {/* Container principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="mb-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Filtre Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ville
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">Toutes les villes</option>
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Fes">Fes</option>
                <option value="Agadir">Agadir</option>
              </select>
            </div>

            {/* Filtre Type de transaction */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type de transaction
              </label>
              <select
                name="transaction_type"
                value={filters.transaction_type}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">Tous les types</option>
                <option value="sale">Vente</option>
                <option value="rent">Location</option>
                <option value="vacation_rental">Location vacances</option>
              </select>
            </div>

            {/* Bouton Réinitialiser */}
            <button
              onClick={resetFilters}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
            >
              Réinitialiser
            </button>

            {/* Info filtres actifs */}
            <div className="text-sm text-gray-400">
              {(filters.city || filters.transaction_type) && (
                <p>✅ Filtres actifs</p>
              )}
            </div>
          </div>
        </div>

        {/* Message de chargement */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            ❌ Erreur: {error}
          </div>
        )}

        {/* Pas de propriétés */}
        {!loading && properties.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Aucune propriété trouvée</p>
            {(filters.city || filters.transaction_type) && (
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* Liste des propriétés */}
        {!loading && properties.length > 0 && (
          <div>
            <p className="text-gray-400 mb-6 font-semibold">
              📊 {properties.length} propriété{properties.length > 1 ? 's' : ''} trouvée{properties.length > 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-orange-500 transition transform hover:scale-105">
                    {/* Image */}
                    <div className="bg-gray-800 h-48 w-full flex items-center justify-center relative overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-600 text-center">
                          <div className="text-3xl mb-2">🏠</div>
                          <p>Pas d'image</p>
                        </div>
                      )}

                      {/* Badge Transaction */}
                      <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded">
                        {property.transaction_type === 'sale' && 'Vente'}
                        {property.transaction_type === 'rent' && 'Location'}
                        {property.transaction_type === 'vacation_rental' && 'Location vacances'}
                      </span>
                    </div>

                    {/* Contenu */}
                    <div className="p-4">
                      {/* Titre */}
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-500 transition">
                        {property.title}
                      </h3>

                      {/* Localisation */}
                      <div className="flex items-center text-gray-400 text-sm mb-3">
                        <MapPin size={16} className="mr-2" />
                        <span>
                          {property.city}
                          {property.district && ` - ${property.district}`}
                        </span>
                      </div>

                      {/* Caractéristiques */}
                      <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                        {property.bedrooms !== null && property.bedrooms !== undefined && (
                          <div>
                            <div className="flex items-center justify-center text-orange-500 mb-1">
                              <Bed size={16} />
                            </div>
                            <p className="text-gray-400">{property.bedrooms} Ch.</p>
                          </div>
                        )}
                        {property.area && (
                          <div>
                            <div className="flex items-center justify-center text-orange-500 mb-1">
                              <Square size={16} />
                            </div>
                            <p className="text-gray-400">{property.area} m²</p>
                          </div>
                        )}
                        <div>
                          <div className="flex items-center justify-center text-orange-500 mb-1">
                            <DollarSign size={16} />
                          </div>
                          <p className="text-gray-400">
                            {(property.price / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      </div>

                      {/* Prix */}
                      <div className="pt-3 border-t border-gray-800">
                        <p className="text-2xl font-bold text-orange-500">
                          {property.price.toLocaleString('fr-MA')} MAD
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}