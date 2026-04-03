'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Heart, MapPin, ChevronDown } from 'lucide-react';
import { propertiesApi } from '@/lib/api';

// 🎨 PALETTE SABBAR
const SABBAR_COLORS = {
  navyDominant: '#0D1F3C',
  goldAccent: '#C8A96E',
  goldLight: '#E2C98A',
  terracotta: '#B5573A',
  ivory: '#F9F5EF',
};

// 📋 DATA STATIQUE
const staticCities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan'];

const staticTransactionTypes = [
  { original: 'sale', label: 'Vente' },
  { original: 'rent', label: 'Location' },
  { original: 'vacation_rental', label: 'Location vacances' },
];

const staticPropertyTypes = [
  { original: 'studio', label: 'Studio' },
  { original: 'apartment', label: 'Appartement' },
  { original: 'villa', label: 'Villa' },
  { original: 'maison', label: 'Maison' },
  { original: 'riad', label: 'Riad' },
  { original: 'terrain', label: 'Terrain' },
  { original: 'bureau', label: 'Bureau' },
  { original: 'local-commercial', label: 'Local commercial' },
];

// 🎯 COMPOSANT FILTRE
interface FilterSelectProps {
  label: string;
  options: Array<{ original: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionner une option',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const optionsArray = options.map(opt => ({
    label: typeof opt === 'string' ? opt : opt.label,
    original: typeof opt === 'string' ? opt : opt.original,
  }));

  const getDisplayLabel = () => {
    if (!value || value === placeholder) return placeholder;
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
          className="w-full px-3 py-2 rounded-lg flex items-center justify-between transition-all duration-200 text-sm"
          style={{
            backgroundColor: isOpen ? SABBAR_COLORS.navyDominant : 'rgba(249, 245, 239, 0.05)',
            color: value && value !== placeholder ? SABBAR_COLORS.ivory : SABBAR_COLORS.goldLight,
            border: `2px solid ${SABBAR_COLORS.goldAccent}`,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <span className="truncate">{getDisplayLabel()}</span>
          <ChevronDown
            size={16}
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
              maxHeight: '250px',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left transition-colors text-sm"
              style={{
                backgroundColor: !value ? SABBAR_COLORS.goldAccent + '15' : 'transparent',
                color: !value ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldLight,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
              }}
            >
              {placeholder}
            </button>

            <div style={{ height: '1px', backgroundColor: SABBAR_COLORS.goldAccent + '20' }} />

            {optionsArray.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(option.original);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left transition-colors text-sm"
                style={{
                  backgroundColor: value === option.original ? SABBAR_COLORS.goldAccent + '15' : 'transparent',
                  color: value === option.original ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldLight,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
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

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

// 🏠 CARTE PROPRIÉTÉ
interface PropertyCardProps {
  property: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('sabbar_favorites');
    const favs = savedFavorites ? JSON.parse(savedFavorites) : [];
    setIsFavorite(favs.includes(property.id));
  }, [property.id]);

  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem('sabbar_favorites');
    const favs = savedFavorites ? JSON.parse(savedFavorites) : [];
    const newFavs = favs.includes(property.id) ? favs.filter((id: number) => id !== property.id) : [...favs, property.id];
    localStorage.setItem('sabbar_favorites', JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const image = property.images?.[0] || property.image || '/placeholder.jpg';

  return (
    <Link href={`/properties/${property.id}`}>
      <div
        className="group rounded-lg overflow-hidden border-2 transition-all duration-300 hover:border-opacity-100 cursor-pointer h-full flex flex-col"
        style={{
          backgroundColor: SABBAR_COLORS.navyDominant + '50',
          borderColor: SABBAR_COLORS.goldAccent + '30',
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-48 bg-gray-800">
          <img
            src={image}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Badge Prix */}
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-lg text-sm font-bold text-white"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {property.price.toLocaleString('fr-FR')} MAD
          </div>

          {/* Bouton Favoris */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite();
            }}
            className="absolute top-3 left-3 p-2 rounded-full transition-all"
            style={{
              backgroundColor: isFavorite ? SABBAR_COLORS.goldAccent : 'rgba(0, 0, 0, 0.6)',
              color: isFavorite ? SABBAR_COLORS.navyDominant : 'white',
            }}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-4 flex-1 flex flex-col">
          <h3
            className="text-sm font-bold mb-2 line-clamp-2"
            style={{
              color: SABBAR_COLORS.ivory,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {property.title}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            <MapPin size={14} style={{ color: SABBAR_COLORS.goldAccent }} />
            <span
              className="text-xs"
              style={{
                color: SABBAR_COLORS.goldLight,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {property.city}
            </span>
          </div>

          {/* Infos */}
          <div className="flex gap-3 text-xs flex-wrap">
            {property.bedrooms && (
              <span
                style={{
                  color: SABBAR_COLORS.goldLight,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                🛏️ {property.bedrooms}
              </span>
            )}
            {property.area && (
              <span
                style={{
                  color: SABBAR_COLORS.goldLight,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                📐 {property.area}m²
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// 📄 PAGE PRINCIPALE
export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandCriteria, setExpandCriteria] = useState(false);

  const [filters, setFilters] = useState({
    city: '',
    transactionType: '',
    propertyType: '',
    priceMin: '',
    priceMax: '',
    areaMin: '',
    areaMax: '',
    bedrooms: '',
    bathrooms: '',
    condition: '',
    equipments: [] as string[],
  });

  // Charger les propriétés
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertiesApi.getProperties({ limit: 100, offset: 0 });
        setProperties(response || []);
        setFilteredProperties(response || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    const filtered = properties.filter(property => {
      if (filters.city && property.city !== filters.city) return false;
      if (filters.transactionType && property.transaction_type !== filters.transactionType) return false;
      if (filters.propertyType && property.property_type !== filters.propertyType) return false;
      if (filters.priceMin && property.price < parseInt(filters.priceMin)) return false;
      if (filters.priceMax && property.price > parseInt(filters.priceMax)) return false;
      if (filters.areaMin && property.area < parseInt(filters.areaMin)) return false;
      if (filters.areaMax && property.area > parseInt(filters.areaMax)) return false;
      if (filters.bedrooms && property.bedrooms !== parseInt(filters.bedrooms)) return false;
      if (filters.bathrooms && property.bathrooms !== parseInt(filters.bathrooms)) return false;
      if (filters.condition && property.condition !== filters.condition) return false;
      if (filters.equipments.length > 0) {
        const propertyEquipments = property.equipments || [];
        const hasAllEquipments = filters.equipments.every(eq => 
          propertyEquipments.some(pEq => pEq.toLowerCase() === eq.toLowerCase())
        );
        if (!hasAllEquipments) return false;
      }
      return true;
    });

    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleResetFilters = () => {
    setFilters({
      city: '',
      transactionType: '',
      propertyType: '',
      priceMin: '',
      priceMax: '',
      areaMin: '',
      areaMax: '',
      bedrooms: '',
      bathrooms: '',
      condition: '',
      equipments: [],
    });
  };

  return (
    <main style={{ backgroundColor: SABBAR_COLORS.navyDominant }}>
      {/* Header */}
      <section className="py-12 px-[5%]" style={{ backgroundColor: SABBAR_COLORS.navyDominant }}>
        <div className="max-w-[1400px] mx-auto">
          <h1
            className="text-5xl font-light mb-2"
            style={{
              color: SABBAR_COLORS.ivory,
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Nos <span style={{ color: SABBAR_COLORS.goldAccent }}>Propriétés</span>
          </h1>
          <p
            className="text-lg"
            style={{
              color: SABBAR_COLORS.goldLight,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Découvrez tous nos biens immobiliers disponibles
          </p>
        </div>
      </section>

      {/* 🎯 SECTION FILTRES COMPACT */}
      <section
        className="py-4 px-[5%] border-b"
        style={{
          backgroundColor: SABBAR_COLORS.navyDominant,
          borderColor: SABBAR_COLORS.goldAccent + '30',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ fontSize: '20px' }}>🔍</span>
            <h2
              className="text-base font-bold"
              style={{
                color: SABBAR_COLORS.goldAccent,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              Affiner votre recherche
            </h2>
          </div>

          {/* Grille de filtres compacte */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
            <FilterSelect
              label="Ville"
              options={staticCities.map(city => ({ original: city, label: city }))}
              value={filters.city}
              onChange={(value) => setFilters({ ...filters, city: value })}
              placeholder="Sélectionner une ville"
            />

            <FilterSelect
              label="Type de transaction"
              options={staticTransactionTypes}
              value={filters.transactionType}
              onChange={(value) => setFilters({ ...filters, transactionType: value })}
              placeholder="Tous les types"
            />

            <FilterSelect
              label="Type de bien"
              options={staticPropertyTypes}
              value={filters.propertyType}
              onChange={(value) => setFilters({ ...filters, propertyType: value })}
              placeholder="Tous les types"
            />
          </div>

          {/* Row avec Critères supplémentaires et Réinitialiser */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              onClick={() => setExpandCriteria(!expandCriteria)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap"
              style={{
                backgroundColor: expandCriteria ? SABBAR_COLORS.goldAccent + '30' : SABBAR_COLORS.goldAccent + '15',
                borderColor: SABBAR_COLORS.goldAccent,
                color: SABBAR_COLORS.goldAccent,
                fontFamily: "'DM Sans', sans-serif",
                border: `2px solid ${SABBAR_COLORS.goldAccent}`,
                fontSize: '12px',
              }}
            >
              Critères supplémentaires
              <ChevronDown
                size={16}
                style={{
                  transform: expandCriteria ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms',
                }}
              />
            </button>

            <button
              onClick={handleResetFilters}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all"
              style={{
                backgroundColor: SABBAR_COLORS.goldAccent,
                color: SABBAR_COLORS.navyDominant,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
              }}
            >
              Réinitialiser tous les filtres
            </button>
          </div>

          {/* Critères supplémentaires collapsible - COMPACT */}
          {expandCriteria && (
            <div
              className="p-4 rounded-lg border mt-3 transition-all"
              style={{
                backgroundColor: SABBAR_COLORS.navyDominant + '80',
                borderColor: SABBAR_COLORS.goldAccent + '30',
              }}
            >
              {/* Première rangée : Prix, Surface, Chambres, Salles de bain */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pb-4" style={{ borderBottom: `1px solid ${SABBAR_COLORS.goldAccent}20` }}>
                {/* Prix */}
                <div>
                  <h4
                    className="text-xs font-bold mb-2 uppercase"
                    style={{
                      color: SABBAR_COLORS.goldAccent,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '9px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Prix (MAD)
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                      className="flex-1 px-3 py-2 rounded text-xs"
                      style={{
                        backgroundColor: 'rgba(249, 245, 239, 0.05)',
                        borderColor: SABBAR_COLORS.goldAccent,
                        color: SABBAR_COLORS.goldLight,
                        border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                      className="flex-1 px-3 py-2 rounded text-xs"
                      style={{
                        backgroundColor: 'rgba(249, 245, 239, 0.05)',
                        borderColor: SABBAR_COLORS.goldAccent,
                        color: SABBAR_COLORS.goldLight,
                        border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                  </div>
                </div>

                {/* Surface */}
                <div>
                  <h4
                    className="text-xs font-bold mb-2 uppercase"
                    style={{
                      color: SABBAR_COLORS.goldAccent,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '9px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Surface (m²)
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.areaMin}
                      onChange={(e) => setFilters({ ...filters, areaMin: e.target.value })}
                      className="flex-1 px-3 py-2 rounded text-xs"
                      style={{
                        backgroundColor: 'rgba(249, 245, 239, 0.05)',
                        borderColor: SABBAR_COLORS.goldAccent,
                        color: SABBAR_COLORS.goldLight,
                        border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.areaMax}
                      onChange={(e) => setFilters({ ...filters, areaMax: e.target.value })}
                      className="flex-1 px-3 py-2 rounded text-xs"
                      style={{
                        backgroundColor: 'rgba(249, 245, 239, 0.05)',
                        borderColor: SABBAR_COLORS.goldAccent,
                        color: SABBAR_COLORS.goldLight,
                        border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                  </div>
                </div>

                {/* Chambres */}
                <div>
                  <h4
                    className="text-xs font-bold mb-2 uppercase"
                    style={{
                      color: SABBAR_COLORS.goldAccent,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '9px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Chambres
                  </h4>
                  <input
                    type="number"
                    placeholder="Ex: 2"
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                    className="w-full px-3 py-2 rounded text-xs"
                    style={{
                      backgroundColor: 'rgba(249, 245, 239, 0.05)',
                      borderColor: SABBAR_COLORS.goldAccent,
                      color: SABBAR_COLORS.goldLight,
                      border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* Salles de bain */}
                <div>
                  <h4
                    className="text-xs font-bold mb-2 uppercase"
                    style={{
                      color: SABBAR_COLORS.goldAccent,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '9px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Salles de bain
                  </h4>
                  <input
                    type="number"
                    placeholder="Ex: 1"
                    value={filters.bathrooms}
                    onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                    className="w-full px-3 py-2 rounded text-xs"
                    style={{
                      backgroundColor: 'rgba(249, 245, 239, 0.05)',
                      borderColor: SABBAR_COLORS.goldAccent,
                      color: SABBAR_COLORS.goldLight,
                      border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>
              </div>

              {/* Deuxième rangée : État du bien */}
              <div className="mb-4 pb-4" style={{ borderBottom: `1px solid ${SABBAR_COLORS.goldAccent}20` }}>
                <h4
                  className="text-xs font-bold mb-2 uppercase"
                  style={{
                    color: SABBAR_COLORS.goldAccent,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '9px',
                    letterSpacing: '0.5px',
                  }}
                >
                  État du bien
                </h4>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      value="new"
                      checked={filters.condition === 'new'}
                      onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span
                      className="text-xs"
                      style={{
                        color: SABBAR_COLORS.goldLight,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      🆕 Neuf
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      value="used"
                      checked={filters.condition === 'used'}
                      onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span
                      className="text-xs"
                      style={{
                        color: SABBAR_COLORS.goldLight,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      🏠 Deuxième main
                    </span>
                  </label>
                </div>
              </div>

              {/* Troisième rangée : Équipements */}
              <div>
                <h4
                  className="text-xs font-bold mb-2 uppercase"
                  style={{
                    color: SABBAR_COLORS.goldAccent,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '9px',
                    letterSpacing: '0.5px',
                  }}
                >
                  Équipements
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Parking', 'Jardin', 'Piscine', 'Meublé'].map((eq) => (
                    <label key={eq} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.equipments?.includes(eq) || false}
                        onChange={() => {
                          const newEquipments = filters.equipments?.includes(eq)
                            ? filters.equipments.filter(e => e !== eq)
                            : [...(filters.equipments || []), eq];
                          setFilters({ ...filters, equipments: newEquipments });
                        }}
                        className="w-4 h-4"
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: SABBAR_COLORS.goldLight,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {eq}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Résultats */}
      <section className="py-8 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <p
            className="mb-6 text-sm"
            style={{
              color: SABBAR_COLORS.goldLight,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {filteredProperties.length} propriété{filteredProperties.length !== 1 ? 's' : ''} trouvée{filteredProperties.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div style={{ color: SABBAR_COLORS.goldLight }}>Chargement...</div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div
              className="px-6 py-12 rounded-lg border text-center"
              style={{
                backgroundColor: SABBAR_COLORS.navyDominant + '50',
                borderColor: SABBAR_COLORS.goldAccent + '30',
                color: SABBAR_COLORS.goldLight,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Aucune propriété ne correspond à vos critères
            </div>
          )}
        </div>
      </section>
    </main>
  );
}