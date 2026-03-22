'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Home, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Property {
  id: string;
  title: string;
  city: string;
  district?: string;
  price: number;
  property_type: string;
  transaction_type: string;
  images?: string[];
  video?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

export default function PropertiesSection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('🔄 Fetching properties from /api/v1/properties?limit=3...');
        const response = await fetch('/api/v1/properties?limit=3');
        
        console.log('✅ Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error:', response.status, errorText);
          setError(`Erreur API: ${response.status}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('✅ Data received:', data);
        
        if (Array.isArray(data)) {
          console.log('✅ Setting properties (array):', data.length);
          setProperties(data);
        } else if (data && typeof data === 'object') {
          const propArray = data.properties || data.data || data.rows || [];
          setProperties(Array.isArray(propArray) ? propArray : []);
        } else {
          setProperties([]);
        }
        
        setError(null);
      } catch (error) {
        console.error('❌ Fetch error:', error);
        setError(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTransactionType = (type: string) => {
    const types: { [key: string]: string } = {
      'sale': 'Vente',
      'rent': 'Location',
      'vacation_rental': 'Location vacances'
    };
    return types[type] || type;
  };

  return (
    <section id="annonces" className="bg-gradient-to-b from-sabbar-900 to-sabbar-800 py-24 px-4 border-t border-turquoise-500/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="text-white">Nos dernières annonces</span>
        </h2>
        <p className="text-center text-gray-300 text-xl mb-16 max-w-2xl mx-auto">
          Découvrez nos propriétés les plus récentes et exclusives
        </p>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-sabbar-700 border-t-turquoise-500 rounded-full"></div>
            </div>
            <p className="text-gray-300 mt-4">Chargement des propriétés...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 text-center">
            <p className="text-red-400">❌ {error}</p>
            <p className="text-gray-400 mt-2 text-sm">Vérifiez la console (F12) pour plus de détails</p>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <div className="bg-sabbar-700/20 border border-turquoise-500/30 rounded-xl overflow-hidden hover:border-turquoise-500/60 transition-all duration-300 group hover:shadow-lg hover:shadow-turquoise-500/20">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-sabbar-800">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          console.error(`❌ Image failed to load: ${property.images?.[0]}`);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sabbar-700 to-sabbar-800">
                        <div className="text-center">
                          <Home size={48} className="text-sabbar-600 mx-auto mb-2" />
                          <p className="text-sabbar-500 text-xs">Pas d'image</p>
                        </div>
                      </div>
                    )}
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-turquoise-600 to-turquoise-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      {getTransactionType(property.transaction_type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                      <MapPin size={16} className="text-turquoise-500" />
                      <span className="text-sm">{property.city}</span>
                      {property.district && <span className="text-sm">- {property.district}</span>}
                    </div>

                    {/* Details */}
                    {(property.bedrooms || property.area) && (
                      <div className="flex gap-4 mb-4 py-4 border-y border-sabbar-700">
                        {property.bedrooms && (
                          <div className="text-sm text-gray-300">
                            <span className="block font-semibold text-white">{property.bedrooms}</span>
                            <span>Chambres</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="text-sm text-gray-300">
                            <span className="block font-semibold text-white">{property.area} m²</span>
                            <span>Surface</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-turquoise-500" />
                        <span className="text-2xl font-bold text-turquoise-500">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                      <button className="bg-gradient-to-r from-turquoise-600 to-turquoise-500 hover:from-turquoise-500 hover:to-turquoise-400 text-white p-2 rounded-lg transition-all group-hover:scale-110">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Properties State */}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">Aucune propriété disponible pour le moment.</p>
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && properties.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-turquoise-600 to-turquoise-500 hover:from-turquoise-500 hover:to-turquoise-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Voir toutes les annonces
              <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}