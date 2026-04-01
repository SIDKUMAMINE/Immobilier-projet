'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Heart, ArrowRight, ChevronDown } from 'lucide-react';
import { propertiesApi } from '@/lib/api';

// Mapping pour traduire les types de transaction en français
const transactionTypeMap: { [key: string]: string } = {
  'sale': 'Vente',
  'rental': 'Location',
  'vacation rental': 'Location vacances',
  'location vacances': 'Location vacances',
  'vente': 'Vente',
  'location': 'Location',
  'vacation': 'Location vacances',
  'vacances': 'Location vacances',
};

const getTransactionTypeLabel = (type: string): string => {
  return transactionTypeMap[type.toLowerCase()] || type;
};

// Mapping pour traduire les types de propriété en français
const propertyTypeMap: { [key: string]: string } = {
  'apartment': 'Appartement',
  'villa': 'Villa',
  'house': 'Maison',
  'riad': 'Riad',
  'land': 'Terrain',
  'office': 'Bureau',
  'commercial': 'Local commercial',
  'apartement': 'Appartement',
  'maison': 'Maison',
  'terrain': 'Terrain',
  'bureau': 'Bureau',
  'local commercial': 'Local commercial',
};

const getPropertyTypeLabel = (type: string): string => {
  return propertyTypeMap[type.toLowerCase()] || type;
};

export default function PropertiesPage() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTransactionType, setSelectedTransactionType] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [hasElevator, setHasElevator] = useState(false);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [minBathrooms, setMinBathrooms] = useState('');
  const [favorites, setFavorites] = useState<(number | string)[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandCriteria, setExpandCriteria] = useState(false);

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
  const cities = useMemo(() => 
    [...new Set(allProperties.map(p => p.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr-FR')),
    [allProperties]
  );

  // Extract unique transaction types from API data - avec traduction
  const transactionTypes = useMemo(() => {
    const types = new Set(allProperties.map(p => p.transaction_type).filter(Boolean));
    return Array.from(types).map(type => ({
      original: type,
      label: getTransactionTypeLabel(type)
    })).sort((a, b) => a.label.localeCompare(b.label, 'fr-FR'));
  }, [allProperties]);

  // Extract unique property types from API data - avec traduction
  const propertyTypes = useMemo(() => {
    const types = new Set(allProperties.map(p => p.property_type).filter(Boolean));
    return Array.from(types).map(type => ({
      original: type,
      label: getPropertyTypeLabel(type)
    })).sort((a, b) => a.label.localeCompare(b.label, 'fr-FR'));
  }, [allProperties]);

  // Extract unique floors from API data
  const floors = useMemo(() => {
    const floorSet = new Set<string>();
    allProperties.forEach(p => {
      if (p.floor) floorSet.add(String(p.floor));
    });
    return Array.from(floorSet).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b, 'fr-FR');
    });
  }, [allProperties]);

  // Extract unique equipments from API data
  const equipmentsList = useMemo(() => {
    const equipments = new Set<string>();
    allProperties.forEach(p => {
      if (p.equipments && Array.isArray(p.equipments)) {
        p.equipments.forEach((eq: string) => equipments.add(eq));
      }
    });
    return Array.from(equipments).sort((a, b) => a.localeCompare(b, 'fr-FR'));
  }, [allProperties]);

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    return allProperties.filter(prop => {
      const matchCity = selectedCity === 'all' || prop.city === selectedCity;
      const matchTransactionType = selectedTransactionType === 'all' || prop.transaction_type === selectedTransactionType;
      const matchPropertyType = selectedPropertyType === 'all' || prop.property_type === selectedPropertyType;
      const matchFloor = selectedFloor === 'all' || String(prop.floor) === selectedFloor;
      const matchElevator = !hasElevator || (prop.elevator === true || prop.has_elevator === true);
      const matchEquipments = selectedEquipments.length === 0 || 
        (prop.equipments && Array.isArray(prop.equipments) && 
         selectedEquipments.some(eq => prop.equipments.includes(eq)));
      
      // Price filter
      const price = prop.price || 0;
      const matchPriceMin = !priceMin || price >= parseInt(priceMin);
      const matchPriceMax = !priceMax || price <= parseInt(priceMax);
      
      // Area filter
      const area = prop.area || 0;
      const matchAreaMin = !minArea || area >= parseInt(minArea);
      const matchAreaMax = !maxArea || area <= parseInt(maxArea);
      
      // Bedrooms filter
      const bedrooms = prop.bedrooms || 0;
      const matchBedrooms = !minBedrooms || bedrooms >= parseInt(minBedrooms);
      
      // Bathrooms filter
      const bathrooms = prop.bathrooms || 0;
      const matchBathrooms = !minBathrooms || bathrooms >= parseInt(minBathrooms);
      
      return matchCity && matchTransactionType && matchPropertyType && matchFloor && matchElevator && 
             matchEquipments && matchPriceMin && matchPriceMax && matchAreaMin && matchAreaMax && 
             matchBedrooms && matchBathrooms;
    });
  }, [allProperties, selectedCity, selectedTransactionType, selectedPropertyType, selectedFloor, hasElevator, 
      selectedEquipments, priceMin, priceMax, minArea, maxArea, minBedrooms, minBathrooms]);

  const toggleFavorite = (e: React.MouseEvent, propertyId: number | string) => {
    e.preventDefault();
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('sabbar_favorites', JSON.stringify(newFavorites));
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipments(prev => 
      prev.includes(equipment) 
        ? prev.filter(eq => eq !== equipment)
        : [...prev, equipment]
    );
  };

  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedTransactionType('all');
    setSelectedPropertyType('all');
    setSelectedFloor('all');
    setHasElevator(false);
    setSelectedEquipments([]);
    setPriceMin('');
    setPriceMax('');
    setMinArea('');
    setMaxArea('');
    setMinBedrooms('');
    setMinBathrooms('');
  };

  const activeFiltersCount = [
    selectedCity !== 'all' ? 1 : 0,
    selectedTransactionType !== 'all' ? 1 : 0,
    selectedPropertyType !== 'all' ? 1 : 0,
    selectedFloor !== 'all' ? 1 : 0,
    hasElevator ? 1 : 0,
    selectedEquipments.length > 0 ? 1 : 0,
    priceMin || priceMax ? 1 : 0,
    minArea || maxArea ? 1 : 0,
    minBedrooms ? 1 : 0,
    minBathrooms ? 1 : 0
  ].reduce((a, b) => a + b, 0);

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
          {/* Main Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {/* City Filter */}
            <div>
              <label className="block text-[#d4af37] font-bold text-sm mb-2">Ville</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)]"
              >
                <option value="all">Sélectionner une ville</option>
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
                  <option key={type.original} value={type.original}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-[#d4af37] font-bold text-sm mb-2">Type de bien</label>
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors hover:border-[rgba(212,175,55,0.3)]"
              >
                <option value="all">Tous les types</option>
                {propertyTypes.map(type => (
                  <option key={type.original} value={type.original}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Advanced Criteria Toggle */}
            <div className="flex items-end">
              <button
                onClick={() => setExpandCriteria(!expandCriteria)}
                className="w-full bg-[rgba(212,175,55,0.2)] hover:bg-[rgba(212,175,55,0.3)] border border-[#d4af37] text-[#d4af37] font-bold px-4 py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2"
              >
                Critères supplémentaires {activeFiltersCount > 3 && <span className="bg-[#d4af37] text-[#0f1a2e] px-2 py-0.5 rounded-full text-xs font-bold">{activeFiltersCount - 3}</span>}
                <ChevronDown size={18} className={`transition-transform ${expandCriteria ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced Criteria Section */}
          {expandCriteria && (
            <div className="mb-6 p-6 bg-[rgba(26,40,71,0.2)] border border-[rgba(212,175,55,0.2)] rounded-lg">
              {/* 1. Caractéristiques */}
              <div className="mb-8">
                <h3 className="text-[#d4af37] font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="bg-[#d4af37] text-[#0f1a2e] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Caractéristiques
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Floor Filter */}
                  <div>
                    <label className="block text-[#b0b0b0] font-bold text-sm mb-2">Étage</label>
                    <select
                      value={selectedFloor}
                      onChange={(e) => setSelectedFloor(e.target.value)}
                      className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors"
                    >
                      <option value="all">Tous les étages</option>
                      {floors.map(floor => (
                        <option key={floor} value={floor}>{floor}</option>
                      ))}
                    </select>
                  </div>

                  {/* Elevator Checkbox */}
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasElevator}
                        onChange={(e) => setHasElevator(e.target.checked)}
                        className="w-4 h-4 accent-[#d4af37] bg-[#d4af37] border-2 border-[#d4af37] rounded cursor-pointer"
                      />
                      <span className="text-[#b0b0b0] font-bold">Ascenseur</span>
                    </label>
                  </div>

                  {/* Min Bedrooms */}
                  <div>
                    <label className="block text-[#b0b0b0] font-bold text-sm mb-2">Chambres min</label>
                    <input
                      type="number"
                      value={minBedrooms}
                      onChange={(e) => setMinBedrooms(e.target.value)}
                      placeholder="Ex: 2"
                      min="0"
                      className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors placeholder-[#666]"
                    />
                  </div>

                  {/* Min Bathrooms */}
                  <div>
                    <label className="block text-[#b0b0b0] font-bold text-sm mb-2">Salles bain min</label>
                    <input
                      type="number"
                      value={minBathrooms}
                      onChange={(e) => setMinBathrooms(e.target.value)}
                      placeholder="Ex: 1"
                      min="0"
                      className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors placeholder-[#666]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Prix */}
              <div className="mb-8 pt-6 border-t border-[rgba(212,175,55,0.2)]">
                <h3 className="text-[#d4af37] font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="bg-[#d4af37] text-[#0f1a2e] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Prix (MAD)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#b0b0b0] font-bold text-sm mb-2">Prix min</label>
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="Ex: 500000"
                      min="0"
                      className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors placeholder-[#666]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#b0b0b0] font-bold text-sm mb-2">Prix max</label>
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="Ex: 5000000"
                      min="0"
                      className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors placeholder-[#666]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Surface */}
              <div className="mb-8 pt-6 border-t border-[rgba(212,175,55,0.2)]">
                <h3 className="text-[#d4af37] font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="bg-[#d4af37] text-[#0f1a2e] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Surface (m²)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#b0b0b0] font-bold text-sm mb-2">Surface min</label>
                    <input
                      type="number"
                      value={minArea}
                      onChange={(e) => setMinArea(e.target.value)}
                      placeholder="Ex: 50"
                      min="0"
                      className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors placeholder-[#666]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#b0b0b0] font-bold text-sm mb-2">Surface max</label>
                    <input
                      type="number"
                      value={maxArea}
                      onChange={(e) => setMaxArea(e.target.value)}
                      placeholder="Ex: 500"
                      min="0"
                      className="w-full bg-[rgba(26,40,71,0.5)] border border-[rgba(212,175,55,0.2)] text-[#b0b0b0] px-4 py-3 rounded-lg focus:border-[#d4af37] focus:outline-none transition-colors placeholder-[#666]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Équipements */}
              {equipmentsList.length > 0 && (
                <div className="pt-6 border-t border-[rgba(212,175,55,0.2)]">
                  <h3 className="text-[#d4af37] font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="bg-[#d4af37] text-[#0f1a2e] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    Équipements
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {equipmentsList.map(equipment => (
                      <label key={equipment} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedEquipments.includes(equipment)}
                          onChange={() => toggleEquipment(equipment)}
                          className="w-4 h-4 accent-[#d4af37] bg-[#d4af37] border-2 border-[#d4af37] rounded cursor-pointer"
                        />
                        <span className="text-[#b0b0b0] text-sm group-hover:text-[#d4af37] transition-colors">{equipment}</span>
                      </label>
                    ))}
                  </div>

                  {selectedEquipments.length > 0 && (
                    <button
                      onClick={() => setSelectedEquipments([])}
                      className="text-[#d4af37] text-xs hover:text-[#f4d03f] transition-colors"
                    >
                      Effacer la sélection
                    </button>
                  )}
                </div>
              )}

              {/* Reset Button */}
              <div className="mt-8 pt-6 border-t border-[rgba(212,175,55,0.2)]">
                <button
                  onClick={resetFilters}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] text-[#0f1a2e] font-bold px-4 py-3 rounded-lg transition-all"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            </div>
          )}

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
                            {getTransactionTypeLabel(property.transaction_type)}
                          </span>
                        )}
                        {property.property_type && (
                          <span className="px-3 py-1 bg-[rgba(212,175,55,0.15)] text-[#d4af37] text-xs font-bold rounded-full border border-[rgba(212,175,55,0.3)]">
                            {getPropertyTypeLabel(property.property_type)}
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