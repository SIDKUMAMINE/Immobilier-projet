'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Heart, ArrowRight, ChevronDown } from 'lucide-react';
import { propertiesApi } from '@/lib/api';

// 🎨 PALETTE SABBAR
const SABBAR_COLORS = {
  navyDominant: '#0D1F3C',
  goldAccent: '#C8A96E',
  goldLight: '#E2C98A',
  terracotta: '#B5573A',
  ivory: '#F9F5EF',
};

// Static cities list
const staticCities = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan'
];

// Static transaction types
const staticTransactionTypes = [
  { original: 'sale', label: 'Vente' },
  { original: 'rent', label: 'Location' },
  { original: 'vacation_rental', label: 'Location vacances' }
];

// Static property types
const staticPropertyTypes = [
  { original: 'studio', label: 'Studio' },
  { original: 'apartment', label: 'Appartement' },
  { original: 'villa', label: 'Villa' },
  { original: 'maison', label: 'Maison' },
  { original: 'riad', label: 'Riad' },
  { original: 'terrain', label: 'Terrain' },
  { original: 'bureau', label: 'Bureau' },
  { original: 'local-commercial', label: 'Local commercial' }
];

// Static equipment list
const staticEquipments = [
  'Parking',
  'Jardin',
  'Piscine',
  'Meublé',
  '🆕 Neuf'
];

const transactionTypeMap: { [key: string]: string } = {
  'sale': 'Vente',
  'vente': 'Vente',
  'rent': 'Location',
  'location': 'Location',
  'vacation_rental': 'Location vacances',
  'vacation rental': 'Location vacances',
  'vacation': 'Location vacances',
  'location vacances': 'Location vacances',
  'location-vacances': 'Location vacances',
  'vacances': 'Location vacances',
};

const getTransactionTypeLabel = (type: string): string => {
  return transactionTypeMap[type.toLowerCase()] || type;
};

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
  'local-commercial': 'Local commercial',
  'studio': 'Studio',
};

const getPropertyTypeLabel = (type: string): string => {
  return propertyTypeMap[type.toLowerCase()] || type;
};

// 🎯 COMPOSANT FILTRE SABBAR - CORRIGÉ
interface FilterSelectProps {
  label: string;
  options: Array<{ original?: string; label: string }> | string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionner une option'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const optionsArray: Array<{ original: string; label: string }> = useMemo(() => {
    if (!Array.isArray(options) || options.length === 0) return [];
    
    if (typeof options[0] === 'string') {
      return (options as string[]).map(opt => ({ label: opt, original: opt }));
    }
    
    return (options as Array<{ original?: string; label: string }>).map(opt => ({
      label: opt.label,
      original: opt.original || opt.label
    }));
  }, [options]);

  const getDisplayLabel = (): string => {
    if (!value || value === 'all') {
      return placeholder;
    }
    const found = optionsArray.find(opt => opt.original === value);
    return found ? found.label : value;
  };

  return (
    <div className="w-full">
      <label
        className="block text-xs font-bold uppercase mb-2"
        style={{
          color: SABBAR_COLORS.goldAccent,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '10px',
          letterSpacing: '1px',
          fontWeight: 700,
        }}
      >
        {label}
      </label>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-200"
          style={{
            backgroundColor: isOpen ? SABBAR_COLORS.navyDominant : 'rgba(249, 245, 239, 0.05)',
            color: value && value !== 'all' ? SABBAR_COLORS.ivory : SABBAR_COLORS.goldLight,
            border: `2px solid ${SABBAR_COLORS.goldAccent}`,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <span className="truncate">
            {getDisplayLabel()}
          </span>
          <ChevronDown
            size={18}
            className="flex-shrink-0 ml-2 transition-transform duration-200"
            style={{
              color: SABBAR_COLORS.goldAccent,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-xl z-50 overflow-hidden border-2"
            style={{
              backgroundColor: SABBAR_COLORS.navyDominant,
              borderColor: SABBAR_COLORS.goldAccent,
              boxShadow: `0 10px 30px rgba(200, 169, 110, 0.2)`,
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => {
                onChange('all');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left transition-colors"
              style={{
                backgroundColor: value === 'all' ? SABBAR_COLORS.goldAccent + '15' : 'transparent',
                color: value === 'all' ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldLight,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              {placeholder}
            </button>

            <div
              style={{
                height: '1px',
                backgroundColor: SABBAR_COLORS.goldAccent + '20',
              }}
            />

            {optionsArray.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(option.original);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left transition-colors text-sm"
                style={{
                  backgroundColor: value === option.original ? SABBAR_COLORS.goldAccent + '15' : 'transparent',
                  color: value === option.original ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldLight,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: value === option.original ? 600 : 500,
                  borderBottom: `1px solid ${SABBAR_COLORS.goldAccent}10`,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default function PropertiesPage() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTransactionType, setSelectedTransactionType] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [hasElevator, setHasElevator] = useState(false);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [minBathrooms, setMinBathrooms] = useState('');
  const [isNewOnly, setIsNewOnly] = useState(false);
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

  const cities = staticCities;
  const transactionTypes = staticTransactionTypes;
  const propertyTypes = staticPropertyTypes;

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

  const equipmentsList = staticEquipments;

  const filteredProperties = useMemo(() => {
    return allProperties.filter(prop => {
      const matchCity = selectedCity === 'all' || prop.city === selectedCity;
      const matchTransactionType = selectedTransactionType === 'all' || prop.transaction_type === selectedTransactionType;
      const matchPropertyType = selectedPropertyType === 'all' || prop.property_type === selectedPropertyType;
      const matchFloor = !selectedFloor || String(prop.floor) === selectedFloor;
      const matchElevator = !hasElevator || (prop.elevator === true || prop.has_elevator === true);
      const matchIsNew = !isNewOnly || (prop.is_new === true);
      const matchEquipments = selectedEquipments.length === 0 || 
        (prop.equipments && Array.isArray(prop.equipments) && 
         selectedEquipments.some(eq => prop.equipments.includes(eq)));
      
      const price = prop.price || 0;
      const matchPriceMin = !priceMin || price >= parseInt(priceMin);
      const matchPriceMax = !priceMax || price <= parseInt(priceMax);
      
      const area = prop.area || 0;
      const matchAreaMin = !minArea || area >= parseInt(minArea);
      const matchAreaMax = !maxArea || area <= parseInt(maxArea);
      
      const bedrooms = prop.bedrooms || 0;
      const matchBedrooms = !minBedrooms || bedrooms >= parseInt(minBedrooms);
      
      const bathrooms = prop.bathrooms || 0;
      const matchBathrooms = !minBathrooms || bathrooms >= parseInt(minBathrooms);
      
      return matchCity && matchTransactionType && matchPropertyType && matchFloor && matchElevator && 
             matchIsNew && matchEquipments && matchPriceMin && matchPriceMax && matchAreaMin && matchAreaMax && 
             matchBedrooms && matchBathrooms;
    });
  }, [allProperties, selectedCity, selectedTransactionType, selectedPropertyType, selectedFloor, hasElevator, 
      isNewOnly, selectedEquipments, priceMin, priceMax, minArea, maxArea, minBedrooms, minBathrooms]);

  const toggleFavorite = (e: React.MouseEvent, propertyId: number | string) => {
    e.preventDefault();
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('sabbar_favorites', JSON.stringify(newFavorites));
  };

  const toggleEquipment = (equipment: string) => {
    if (equipment === '🆕 Neuf') {
      setIsNewOnly(!isNewOnly);
    } else {
      setSelectedEquipments(prev => 
        prev.includes(equipment) 
          ? prev.filter(eq => eq !== equipment)
          : [...prev, equipment]
      );
    }
  };

  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedTransactionType('all');
    setSelectedPropertyType('all');
    setSelectedFloor('');
    setHasElevator(false);
    setSelectedEquipments([]);
    setIsNewOnly(false);
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
    selectedFloor ? 1 : 0,
    hasElevator ? 1 : 0,
    selectedEquipments.length > 0 ? 1 : 0,
    isNewOnly ? 1 : 0,
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
      <section
        className="py-6 sm:py-8 px-[5%] border-b"
        style={{
          backgroundColor: SABBAR_COLORS.navyDominant,
          borderColor: SABBAR_COLORS.goldAccent + '30',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <h2
            className="text-lg font-bold mb-6"
            style={{
              color: SABBAR_COLORS.goldAccent,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            🔍 Affiner votre recherche
          </h2>

          {/* Main Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <FilterSelect
              label="Ville"
              options={cities}
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="Sélectionner une ville"
            />

            <FilterSelect
              label="Type de transaction"
              options={transactionTypes}
              value={selectedTransactionType}
              onChange={setSelectedTransactionType}
              placeholder="Tous les types"
            />

            <FilterSelect
              label="Type de bien"
              options={propertyTypes}
              value={selectedPropertyType}
              onChange={setSelectedPropertyType}
              placeholder="Tous les types"
            />
          </div>

          {/* Advanced Criteria Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setExpandCriteria(!expandCriteria)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all"
              style={{
                backgroundColor: SABBAR_COLORS.goldAccent + '20',
                borderColor: SABBAR_COLORS.goldAccent,
                color: SABBAR_COLORS.goldAccent,
                fontFamily: "'DM Sans', sans-serif",
                border: `2px solid ${SABBAR_COLORS.goldAccent}`,
              }}
            >
              Critères supplémentaires {activeFiltersCount > 3 && <span style={{
                backgroundColor: SABBAR_COLORS.goldAccent,
                color: SABBAR_COLORS.navyDominant,
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>{activeFiltersCount - 3}</span>}
              <ChevronDown size={18} style={{
                transform: expandCriteria ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms'
              }} />
            </button>
          </div>

          {/* Advanced Criteria Section */}
          {expandCriteria && (
            <div
              className="p-6 rounded-lg mb-6 border"
              style={{
                backgroundColor: SABBAR_COLORS.navyDominant + '80',
                borderColor: SABBAR_COLORS.goldAccent + '30',
              }}
            >
              {/* Price Range */}
              <div className="mb-6">
                <h3
                  className="text-sm font-bold mb-3"
                  style={{
                    color: SABBAR_COLORS.goldAccent,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Prix (MAD)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="Min"
                    className="px-4 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: SABBAR_COLORS.navyDominant + '50',
                      borderColor: SABBAR_COLORS.goldAccent + '30',
                      color: SABBAR_COLORS.goldLight,
                      border: `1px solid ${SABBAR_COLORS.goldAccent}30`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="Max"
                    className="px-4 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: SABBAR_COLORS.navyDominant + '50',
                      borderColor: SABBAR_COLORS.goldAccent + '30',
                      color: SABBAR_COLORS.goldLight,
                      border: `1px solid ${SABBAR_COLORS.goldAccent}30`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 rounded-lg font-bold text-sm transition-all"
                style={{
                  backgroundColor: SABBAR_COLORS.goldAccent,
                  color: SABBAR_COLORS.navyDominant,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          )}

          {/* Results Count */}
          <div
            style={{
              color: SABBAR_COLORS.goldLight,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading ? (
              <span className="text-lg">⏳ Chargement des propriétés...</span>
            ) : error ? (
              <span className="text-lg" style={{ color: SABBAR_COLORS.terracotta }}>❌ Erreur: {error}</span>
            ) : (
              <span className="text-lg">
                <span style={{ color: SABBAR_COLORS.goldAccent, fontWeight: 'bold' }}>{filteredProperties.length}</span> propriétés trouvées
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
              <p style={{ color: SABBAR_COLORS.goldLight }}>⏳ Chargement des propriétés...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p style={{ color: SABBAR_COLORS.terracotta }} className="mb-6">❌ Erreur: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all"
                style={{
                  backgroundColor: SABBAR_COLORS.goldAccent,
                  color: SABBAR_COLORS.navyDominant,
                }}
              >
                Réessayer
              </button>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                      {property.is_new && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0f1a2e] px-3 py-1 rounded-full font-bold text-xs">
                          🆕 Neuf
                        </div>
                      )}
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
              <p style={{ color: SABBAR_COLORS.goldLight }} className="mb-6">
                Aucune propriété ne correspond à vos critères.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all"
                style={{
                  backgroundColor: SABBAR_COLORS.goldAccent,
                  color: SABBAR_COLORS.navyDominant,
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-[5%] border-t border-[rgba(212,175,55,0.2)]" style={{ backgroundColor: '#0f1a2e' }}>
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
              href="tel:+212605585720"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#d4af37] text-[#d4af37] font-bold rounded-xl hover:bg-[#d4af37] hover:text-[#0f1a2e] transition-all"
            >
              +212 6 05 58 57 20
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}