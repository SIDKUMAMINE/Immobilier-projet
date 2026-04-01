'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Heart, ArrowRight } from 'lucide-react';
import { propertiesApi } from '@/lib/api';

export default function PropertiesPage() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTransactionType, setSelectedTransactionType] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [favorites, setFavorites] = useState<(number | string)[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📡 Fetching properties from API...');
        
        const response = await propertiesApi.getProperties({
          limit: 100,
          offset: 0
        });
        
        console.log('✅ Properties loaded:', response);
        setAllProperties(response || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
        console.error('❌ Erreur:', message);
        setError(message);
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Extract unique cities from API data
  const cities = useMemo(() => [...new Set(allProperties.map(p => p.city).filter(Boolean))], [allProperties]);

  // Extract unique transaction types from API data
  const transactionTypes = useMemo(() => [...new Set(allProperties.map(p => p.transaction_type).filter(Boolean))], [allProperties]);

  // Extract unique property types from API data
  const propertyTypes = useMemo(() => [...new Set(allProperties.map(p => p.property_type).filter(Boolean))], [allProperties]);

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    return allProperties.filter(prop => {
      const matchCity = selectedCity === 'all' || prop.city === selectedCity;
      const matchTransactionType = selectedTransactionType === 'all' || prop.transaction_type === selectedTransactionType;
      const matchPropertyType = selectedPropertyType === 'all' || prop.property_type === selectedPropertyType;
      return matchCity && matchTransactionType && matchPropertyType;
    });
  }, [allProperties, selectedCity, selectedTransactionType, selectedPropertyType]);

  const toggleFavorite = (e: React.MouseEvent, propertyId: number | string) => {
    e.preventDefault();
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('sabbar_favorites', JSON.stringify(newFavorites));
  };

  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedTransactionType('all');
    setSelectedPropertyType('all');
  };

  return (
    <main className="bg-gradient-to-b from-[#0a0e1a] to-[#0f1424] min-h-screen">
      {/* Back Button */}
      <div className="bg-[#0f1a2e] py-4 px-[5%] border-b border-[rgba(212,175,55,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f4d03f] transition-colors">
            <ArrowLeft size={20} />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-24 px-[5%] bg-gradient-to-r from-[#0f1a2e] to-[#1a2847]">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Nos <span className="text-[#d4af37]">Propriétés</span>
          </h1>
          <p className="text-xl text-[#b0b0b0]">
            Découvrez tous nos biens immobiliers disponibles
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-[5%] bg-[#0f1a2e] border-b border-[rgba(212,175,55,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* City Filter */}
            <div>
              <label className="block text-[#d4af37] font-bold text-sm mb-2">Ville</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)]"
              >
                <option value="all">Toutes les villes</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Transaction Type Filter */}
            <div>
              <label className="block text-[#d4af37] font-bold text-sm mb-2">Type de transaction</label>
              <select
                value={selectedTransactionType}
                onChange={(e) => setSelectedTransactionType(e.target.value)}
                className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)]"
              >
                <option value="all">Tous les types</option>
                {transactionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-[#d4af37] font-bold text-sm mb-2">Type de propriété</label>
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)]"
              >
                <option value="all">Tous les types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] text-[#0f1a2e] font-bold px-4 py-3 rounded-lg transition-all"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-[#b0b0b0]">
            {loading ? (
              <span className="text-lg">⏳ Chargement des propriétés...</span>
            ) : error ? (
              <span className="text-lg text-red-400">❌ Erreur: {error}</span>
            ) : (
              <span className="text-lg">
                <span className="text-[#d4af37] font-bold">{filteredProperties.length}</span> propriétés trouvées
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-[#b0b0b0] text-lg">⏳ Chargement des propriétés...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-400 text-lg mb-6">❌ Erreur: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0f1a2e] font-bold rounded-xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all"
              >
                Réessayer
              </button>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group"
                >
                  <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.15)] rounded-2xl overflow-hidden hover:border-[rgba(212,175,55,0.4)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden bg-[rgba(26,40,71,0.5)]">
                      <img
                        src={property.images?.[0] || property.image || '/placeholder.jpg'}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Heart Icon - Favoris */}
                      <button
                        onClick={(e) => toggleFavorite(e, property.id)}
                        className={`absolute top-4 left-4 p-2 rounded-full transition-all ${
                          favorites.includes(property.id)
                            ? 'bg-[#d4af37] text-[#0f1a2e]'
                            : 'bg-[rgba(0,0,0,0.5)] hover:bg-[#d4af37] text-white'
                        }`}
                      >
                        <Heart 
                          size={20} 
                          fill={favorites.includes(property.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Transaction & Property Type Badge */}
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {property.transaction_type && (
                          <span className="px-3 py-1 bg-[rgba(212,175,55,0.2)] text-[#d4af37] text-xs font-bold rounded-full border border-[rgba(212,175,55,0.3)]">
                            {property.transaction_type}
                          </span>
                        )}
                        {property.property_type && (
                          <span className="px-3 py-1 bg-[rgba(176,176,176,0.1)] text-[#b0b0b0] text-xs font-bold rounded-full border border-[rgba(176,176,176,0.2)]">
                            {property.property_type}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-[#b0b0b0] text-sm mb-4">
                        <MapPin size={16} />
                        <span>{property.city}{property.district ? `, ${property.district}` : ''}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline justify-between mb-4">
                        <div className="text-[#d4af37] font-bold text-lg">
                          {property.price?.toLocaleString('fr-FR', { 
                            minimumFractionDigits: 0, 
                            maximumFractionDigits: 0 
                          })}
                        </div>
                        <div className="text-[#b0b0b0] text-xs">MAD</div>
                      </div>

                      {/* Property Details */}
                      <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-[#b0b0b0]">
                        {property.bedrooms && (
                          <div>
                            <div className="font-bold text-[#d4af37]">{property.bedrooms}</div>
                            <div>Chambres</div>
                          </div>
                        )}
                        {property.area && (
                          <div>
                            <div className="font-bold text-[#d4af37]">{property.area} m²</div>
                            <div>Surface</div>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div>
                            <div className="font-bold text-[#d4af37]">{property.bathrooms}</div>
                            <div>Salles bain</div>
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <div
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-[#d4af37] text-[#d4af37] font-bold rounded-lg hover:bg-[#d4af37] hover:text-[#0f1a2e] transition-all duration-300"
                      >
                        Voir détails
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#b0b0b0] text-lg mb-6">
                Aucune propriété ne correspond à vos critères.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0f1a2e] font-bold rounded-xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-[5%] bg-[#0f1a2e] border-t border-[rgba(212,175,55,0.2)]">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Vous ne trouvez pas votre <span className="text-[#d4af37]">propriété idéale</span>?
          </h2>
          <p className="text-[#b0b0b0] text-lg mb-8">
            Contactez-nous pour découvrir d'autres propriétés ou pour un accompagnement personnalisé
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0f1a2e] font-bold rounded-xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all"
            >
              Nous Contacter
            </Link>
            <a
              href="tel:+212561511251"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#d4af37] text-[#d4af37] font-bold rounded-xl hover:bg-[#d4af37] hover:text-[#0f1a2e] transition-all"
            >
              +212 5 61 51 12 51
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}