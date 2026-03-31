'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Home, Maximize2, Heart, ArrowRight, Bath, Check } from 'lucide-react';
import { getAllProperties, Property } from '@/lib/properties-data';

export default function PropertiesPage() {
  // État des filtres
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [surface, setSurface] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [floor, setFloor] = useState('');
  
  // Équipements
  const [amenities, setAmenities] = useState({
    parking: false,
    garden: false,
    elevator: false,
    furnished: false,
    pool: false,
    balcony: false,
  });
  
  const [favorites, setFavorites] = useState<(number | string)[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Récupérer toutes les propriétés
  const allProperties = useMemo(() => getAllProperties(), []);

  // Récupérer les villes uniques
  const cities = useMemo(() => [...new Set(allProperties.map(p => p.city))], [allProperties]);

  // Types de biens et transactions
  const propertyTypes = ['Apartment', 'Villa', 'House', 'Studio', 'Penthouse'];
  const transactionTypes = ['Vente', 'Location', 'Location courte durée'];

  // Filtrer les propriétés
  const filteredProperties = useMemo(() => {
    return allProperties.filter(prop => {
      const matchCity = selectedCity === 'all' || prop.city === selectedCity;
      const matchType = selectedType === 'all' || prop.type === selectedType;
      const matchTransaction = selectedTransaction === 'all' || prop.transaction === selectedTransaction;
      
      // Filtres numériques
      const minPrice = priceRange.min ? parseInt(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseInt(priceRange.max) : Infinity;
      const matchPrice = prop.price >= minPrice && prop.price <= maxPrice;
      
      const matchSurface = !surface || (prop.surface >= parseInt(surface) - 10 && prop.surface <= parseInt(surface) + 10);
      const matchBedrooms = !bedrooms || prop.bedrooms === parseInt(bedrooms);
      const matchBathrooms = !bathrooms || prop.bathrooms === parseInt(bathrooms);
      const matchFloor = !floor || prop.floor === parseInt(floor);

      // Équipements (tous les équipements sélectionnés doivent être présents)
      const selectedAmenities = Object.entries(amenities)
        .filter(([_, selected]) => selected)
        .map(([key]) => key);
      
      const matchAmenities = selectedAmenities.length === 0 || 
        selectedAmenities.every(amenity => prop.amenities?.includes(amenity));

      return matchCity && matchType && matchTransaction && matchPrice && matchSurface && 
             matchBedrooms && matchBathrooms && matchFloor && matchAmenities;
    });
  }, [allProperties, selectedCity, selectedType, selectedTransaction, priceRange, surface, bedrooms, bathrooms, floor, amenities]);

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedType('all');
    setSelectedTransaction('all');
    setPriceRange({ min: '', max: '' });
    setSurface('');
    setBedrooms('');
    setBathrooms('');
    setFloor('');
    setAmenities({
      parking: false,
      garden: false,
      elevator: false,
      furnished: false,
      pool: false,
      balcony: false,
    });
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => ({
      ...prev,
      [amenity]: !prev[amenity]
    }));
  };

  const toggleFavorite = (e: React.MouseEvent, propertyId: number | string) => {
    e.preventDefault();
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('sabbar_favorites', JSON.stringify(newFavorites));
  };

  const amenityLabels = {
    parking: 'Parking',
    garden: 'Jardin',
    elevator: 'Ascenseur',
    furnished: 'Meublé',
    pool: 'Piscine',
    balcony: 'Balcon',
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
      <section className="py-12 px-[5%] bg-[#0f1a2e] border-b border-[rgba(212,175,55,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-[rgba(26,40,71,0.3)] border border-[rgba(212,175,55,0.15)] rounded-lg p-8">
            {/* Filters Title */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-[#d4af37] text-[#0f1a2e] rounded-full flex items-center justify-center font-bold">1</span>
                Informations générales
              </h2>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* City Filter */}
              <div>
                <label className="block text-[#d4af37] font-bold text-sm mb-2">Ville *</label>
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
                <label className="block text-[#d4af37] font-bold text-sm mb-2">Type de transaction *</label>
                <select
                  value={selectedTransaction}
                  onChange={(e) => setSelectedTransaction(e.target.value)}
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
                <label className="block text-[#d4af37] font-bold text-sm mb-2">Type de bien *</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)]"
                >
                  <option value="all">Tous les biens</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-[#d4af37] font-bold text-sm mb-2">Prix min (MAD) *</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  placeholder="Minimum"
                  className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)] placeholder-[#666]"
                />
              </div>
            </div>

            {/* Additional Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Max Price */}
              <div>
                <label className="block text-[#d4af37] font-bold text-sm mb-2">Prix max (MAD) *</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  placeholder="Maximum"
                  className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)] placeholder-[#666]"
                />
              </div>

              {/* Surface */}
              <div>
                <label className="block text-[#d4af37] font-bold text-sm mb-2">Surface (m²)</label>
                <input
                  type="number"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  placeholder="Ex: 90"
                  className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)] placeholder-[#666]"
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-[#d4af37] font-bold text-sm mb-2">Nombre de chambres</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="Ex: 3"
                  className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)] placeholder-[#666]"
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-[#d4af37] font-bold text-sm mb-2">Nombre de salles de bain</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="Ex: 2"
                  className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)] placeholder-[#666]"
                />
              </div>
            </div>

            {/* Advanced Filters Section */}
            <div className="border-t border-[rgba(212,175,55,0.2)] pt-8 mb-8">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2 text-[#d4af37] font-bold hover:text-[#f4d03f] transition-colors"
              >
                <span className="w-6 h-6 bg-[rgba(212,175,55,0.2)] rounded flex items-center justify-center">
                  {showAdvancedFilters ? '-' : '+'}
                </span>
                Critères supplémentaires
              </button>

              {showAdvancedFilters && (
                <div className="mt-6">
                  {/* Floor and Amenities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {/* Floor */}
                    <div>
                      <label className="block text-[#d4af37] font-bold text-sm mb-4">Étage</label>
                      <input
                        type="number"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        placeholder="Ex: 5"
                        className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)] placeholder-[#666]"
                      />
                    </div>

                    {/* Amenities */}
                    <div>
                      <label className="block text-[#d4af37] font-bold text-sm mb-4">Équipements</label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(amenityLabels).map(([key, label]) => (
                          <label key={key} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={amenities[key as keyof typeof amenities]}
                              onChange={() => toggleAmenity(key)}
                              className="w-4 h-4 accent-[#d4af37] cursor-pointer"
                            />
                            <span className="text-[#b0b0b0] text-sm hover:text-[#d4af37] transition-colors">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <div className="flex gap-4">
              <button
                onClick={resetFilters}
                className="w-full md:w-auto bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] text-[#0f1a2e] font-bold px-8 py-3 rounded-lg transition-all"
              >
                Réinitialiser
              </button>
            </div>

            {/* Results Count */}
            <div className="mt-6 text-[#b0b0b0]">
              <span className="text-lg">
                <span className="text-[#d4af37] font-bold">{filteredProperties.length}</span> propriétés trouvées
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          {filteredProperties.length > 0 ? (
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
                        src={property.image}
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

                      {/* Property Type Badge */}
                      <div className="absolute top-4 right-4 bg-[#d4af37] text-[#0f1a2e] px-3 py-1 rounded-full text-xs font-bold">
                        {property.transaction}
                      </div>
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
                        <span>{property.location}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline justify-between mb-4">
                        <div className="text-[#d4af37] font-bold text-lg">
                          {property.price.toLocaleString('fr-FR', { 
                            minimumFractionDigits: 0, 
                            maximumFractionDigits: 0 
                          })}
                        </div>
                        <div className="text-[#b0b0b0] text-xs">MAD</div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-3 gap-2 mb-4 text-[#b0b0b0] text-sm">
                        <div className="flex items-center gap-1">
                          <Maximize2 size={16} />
                          <span>{property.surface}m²</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Home size={16} />
                          <span>{property.bedrooms} ch</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath size={16} />
                          <span>{property.bathrooms} sdb</span>
                        </div>
                      </div>

                      {/* Amenities Display */}
                      {property.amenities && property.amenities.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1">
                          {property.amenities.slice(0, 2).map((amenity, idx) => (
                            <span key={idx} className="bg-[rgba(212,175,55,0.2)] text-[#d4af37] text-xs px-2 py-1 rounded">
                              {amenityLabels[amenity as keyof typeof amenityLabels] || amenity}
                            </span>
                          ))}
                          {property.amenities.length > 2 && (
                            <span className="text-[#b0b0b0] text-xs px-2 py-1">
                              +{property.amenities.length - 2}
                            </span>
                          )}
                        </div>
                      )}

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