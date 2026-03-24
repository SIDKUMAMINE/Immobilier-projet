'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Home, Maximize2, Heart, ArrowRight, Droplets } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  city: string;
  district: string;
  type: string;
  price: number;
  bedrooms: number;
  area: number;
  bathrooms?: number;
  image?: string;
}

export default function PropertiesPage() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Charger les propriétés de l'API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:8000/api/v1/properties');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des propriétés');
        }

        const data = await response.json();
        console.log('📦 Propriétés reçues:', data);

        // Adapter le format des données
        const formattedProperties = (Array.isArray(data) ? data : data.data || []).map((prop: any) => ({
          id: prop.id,
          title: prop.title,
          city: prop.city,
          district: prop.district || 'N/A',
          type: prop.transaction_type === 'sale' ? 'Vente' : prop.transaction_type === 'rent' ? 'Location' : 'Autre',
          price: prop.price,
          bedrooms: prop.bedrooms || 0,
          area: prop.area,
          bathrooms: prop.bathrooms,
          image: prop.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&q=80'
        }));

        setProperties(formattedProperties);

        // Charger les favoris du localStorage
        const savedFavorites = localStorage.getItem('sabbar_favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (err) {
        console.error('❌ Erreur:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        // Utiliser les données de fallback en cas d'erreur
        setProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Sauvegarder les favoris dans localStorage
  const toggleFavorite = (e: React.MouseEvent, propertyId: number) => {
    e.preventDefault();
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('sabbar_favorites', JSON.stringify(newFavorites));
  };

  const filteredProperties = properties.filter(prop => {
    const matchCity = selectedCity === 'all' || prop.city === selectedCity;
    const matchType = selectedType === 'all' || prop.type === selectedType;
    return matchCity && matchType;
  });

  const cities = [...new Set(properties.map(p => p.city))];

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-[#0a0e1a] to-[#0f1424] min-h-screen">
        <div className="py-24 px-[5%]">
          <div className="max-w-[1400px] mx-auto text-center">
            <div className="animate-spin text-5xl mb-4">🏠</div>
            <p className="text-[#b0b0b0] text-lg">Chargement des propriétés...</p>
          </div>
        </div>
      </main>
    );
  }

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Type Filter */}
            <div>
              <label className="block text-[#d4af37] font-bold text-sm mb-2">Type de transaction</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)]"
              >
                <option value="all">Tous les types</option>
                <option value="Vente">Vente</option>
                <option value="Location">Location</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedType('all');
                }}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] text-[#0f1a2e] font-bold px-4 py-3 rounded-lg transition-all"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-[#b0b0b0]">
            <span className="text-lg">
              <span className="text-[#d4af37] font-bold">{filteredProperties.length}</span> propriétés trouvées
            </span>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="py-6 px-[5%]">
          <div className="max-w-[1400px] mx-auto bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] text-[#fca5a5] px-6 py-4 rounded-lg">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div key={property.id} className="group">
                <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.15)] rounded-2xl overflow-hidden hover:border-[rgba(212,175,55,0.4)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-[rgba(26,40,71,0.5)]">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0f1a2e] px-4 py-2 rounded-full font-bold text-sm">
                      {property.type}
                    </div>
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
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                      {property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-[#b0b0b0] text-sm mb-4">
                      <MapPin size={16} />
                      <span>{property.city} - {property.district}</span>
                    </div>

                    {/* Features Grid - 3 colonnes (chambres + m² + SDB) */}
                    <div className="grid grid-cols-3 gap-2 mb-6 py-3 border-y border-[rgba(212,175,55,0.1)]">
                      <div className="text-center">
                        <div className="flex justify-center text-[#d4af37] mb-1">
                          <Home size={16} />
                        </div>
                        <div className="text-[#d4af37] font-bold text-sm">{property.bedrooms}</div>
                        <div className="text-[#b0b0b0] text-xs">Ch.</div>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center text-[#d4af37] mb-1">
                          <Maximize2 size={16} />
                        </div>
                        <div className="text-[#d4af37] font-bold text-sm">{property.area}</div>
                        <div className="text-[#b0b0b0] text-xs">m²</div>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center text-[#d4af37] mb-1">
                          <Droplets size={16} />
                        </div>
                        <div className="text-[#d4af37] font-bold text-sm">{property.bathrooms || 0}</div>
                        <div className="text-[#b0b0b0] text-xs">SDB</div>
                      </div>
                    </div>

                    {/* Price - Formaté avec séparateurs (890,000.00 MAD) */}
                    <div className="flex items-baseline justify-between mb-4">
                      <div className="text-[#d4af37] font-bold text-lg">
                        {property.price.toLocaleString('fr-FR', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </div>
                      <div className="text-[#b0b0b0] text-xs">MAD</div>
                    </div>

                    {/* CTA Button - Lien vers détails */}
                    <Link
                      href={`/properties/${property.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-[#d4af37] text-[#d4af37] font-bold rounded-lg hover:bg-[#d4af37] hover:text-[#0f1a2e] transition-all duration-300"
                    >
                      Voir détails
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#b0b0b0] text-lg mb-6">
                Aucune propriété ne correspond à vos critères.
              </p>
              <button
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedType('all');
                }}
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
            Contactez-nous pour découvrir d\'autres propriétés ou pour un accompagnement personnalisé
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

// Données de fallback en cas d'erreur API
const fallbackProperties: Property[] = [
  {
    id: 1,
    title: 'Apartment Standing Maarif',
    city: 'Casablanca',
    district: 'Maarif',
    type: 'Vente',
    price: 2800000,
    bedrooms: 3,
    area: 120,
    bathrooms: 2.8,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Apartment moderne 3 chambres - Maarif',
    city: 'Casablanca',
    district: 'Maarif',
    type: 'Vente',
    price: 950000,
    bedrooms: 3,
    area: 110,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a9917c81d?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Apartment 2 chambres - Hay Hassani',
    city: 'Casablanca',
    district: 'Hay Hassani',
    type: 'Vente',
    price: 680000,
    bedrooms: 2,
    area: 75,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&q=80'
  }
];