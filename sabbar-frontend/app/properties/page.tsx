'use client';

import { useEffect, useState } from 'react';
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

// 🎯 COMPOSANT FILTRE SELECT
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
  placeholder = 'Sélectionner',
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
    <div className="flex-1 min-w-[180px]">
      <label
        className="block text-[10px] font-bold uppercase mb-1.5"
        style={{
          color: SABBAR_COLORS.goldAccent,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </label>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 rounded flex items-center justify-between transition-all duration-200 text-xs"
          style={{
            backgroundColor: isOpen ? SABBAR_COLORS.navyDominant : 'rgba(249, 245, 239, 0.05)',
            color: value && value !== placeholder ? SABBAR_COLORS.ivory : SABBAR_COLORS.goldLight,
            border: `1px solid ${SABBAR_COLORS.goldAccent}`,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}
        >
          <span className="truncate text-[12px]">{getDisplayLabel()}</span>
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
            className="absolute top-full left-0 right-0 mt-1 rounded shadow-lg z-50 overflow-hidden border"
            style={{
              backgroundColor: SABBAR_COLORS.navyDominant,
              borderColor: SABBAR_COLORS.goldAccent,
              boxShadow: `0 4px 12px rgba(200, 169, 110, 0.15)`,
              maxHeight: '250px',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left transition-colors text-[12px]"
              style={{
                backgroundColor: !value ? SABBAR_COLORS.goldAccent + '20' : 'transparent',
                color: !value ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldLight,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {placeholder}
            </button>

            <div style={{ height: '0.5px', backgroundColor: SABBAR_COLORS.goldAccent + '15' }} />

            {optionsArray.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(option.original);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left transition-colors text-[12px]"
                style={{
                  backgroundColor: value === option.original ? SABBAR_COLORS.goldAccent + '20' : 'transparent',
                  color: value === option.original ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldLight,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: value === option.original ? 600 : 500,
                  borderBottom: `0.5px solid ${SABBAR_COLORS.goldAccent}08`,
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

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const savedFavorites = localStorage.getItem('sabbar_favorites');
    const favs = savedFavorites ? JSON.parse(savedFavorites) : [];
    const newFavs = favs.includes(property.id) ? favs.filter((id: number) => id !== property.id) : [...favs, property.id];
    localStorage.setItem('sabbar_favorites', JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const image = property.images?.[0] || property.image || '/placeholder.jpg';
  const propertyUrl = `/properties/${property.id}`;

  return (
    <Link href={propertyUrl} className="block">
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
            onClick={toggleFavorite}
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

      if (filters.areaMin && property.area && property.area < parseInt(filters.areaMin)) return false;
      if (filters.areaMax && property.area && property.area > parseInt(filters.areaMax)) return false;

      if (filters.bedrooms && property.bedrooms !== parseInt(filters.bedrooms)) return false;
      if (filters.bathrooms && property.bathrooms !== parseInt(filters.bathrooms)) return false;

      if (
        filters.condition &&
        property.condition?.toLowerCase() !== filters.condition.toLowerCase()
      ) return false;

      if (filters.equipments.length > 0) {
        const propertyEquipments = property.equipments || [];

        const hasAllEquipments = filters.equipments.every(eq =>
          propertyEquipments.some(pEq => {
            const value =
              typeof pEq === 'string'
                ? pEq
                : pEq?.name;

            return value?.toLowerCase() === eq.toLowerCase();
          })
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

      {/* 🎯 SECTION FILTRES - STRUCTURE CLAIRE ET ORGANISÉE */}
      <section
        className="py-6 px-[5%] border-b"
        style={{
          backgroundColor: SABBAR_COLORS.navyDominant,
          borderColor: SABBAR_COLORS.goldAccent + '30',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Titre */}
          <div className="flex items-center gap-3 mb-4">
            <span style={{ fontSize: '20px' }}>🔍</span>
            <h2
              className="text-sm font-bold"
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

          {/* LIGNE 1: Filtres de base (Prix, Surface, Chambres, Salles de bain, État, Équipements) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            {/* Prix Min/Max */}
            <div className="sm:col-span-1 lg:col-span-1">
              <label
                className="block text-[10px] font-bold uppercase mb-1.5"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.5px',
                }}
              >
                Prix (MAD)
              </label>
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

            {/* Surface Min/Max */}
            <div className="sm:col-span-1 lg:col-span-1">
              <label
                className="block text-[10px] font-bold uppercase mb-1.5"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.5px',
                }}
              >
                Surface (m²)
              </label>
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
              <label
                className="block text-[10px] font-bold uppercase mb-1.5"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.5px',
                }}
              >
                Chambres
              </label>
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
              <label
                className="block text-[10px] font-bold uppercase mb-1.5"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.5px',
                }}
              >
                Salles de bain
              </label>
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

            {/* État du bien - Checkbox "Neuf" */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase mb-1.5"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.5px',
                }}
              >
                État du bien
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer px-3 py-2 border rounded"
                style={{
                  backgroundColor: 'rgba(249, 245, 239, 0.05)',
                  borderColor: SABBAR_COLORS.goldAccent,
                  border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.condition === 'new'}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.checked ? 'new' : '' })}
                  className="w-4 h-4 cursor-pointer"
                />
                <span
                  className="text-xs whitespace-nowrap"
                  style={{
                    color: SABBAR_COLORS.goldLight,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  🆕 Neuf
                </span>
              </label>
            </div>

            {/* Équipements - 4 checkboxes */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase mb-1.5"
                style={{
                  color: SABBAR_COLORS.goldAccent,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.5px',
                }}
              >
                Équipements
              </label>
              <div className="flex flex-wrap gap-2">
                {['Parking', 'Jardin', 'Piscine', 'Meublé'].map((eq) => (
                  <label
                    key={eq}
                    className="flex items-center gap-1 cursor-pointer px-2 py-2 border rounded text-[10px] whitespace-nowrap"
                    style={{
                      backgroundColor: filters.equipments.includes(eq)
                        ? SABBAR_COLORS.goldAccent + '25'
                        : 'rgba(249, 245, 239, 0.05)',
                      borderColor: filters.equipments.includes(eq)
                        ? SABBAR_COLORS.goldAccent
                        : SABBAR_COLORS.goldAccent + '50',
                      border: `1px solid`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.equipments?.includes(eq) || false}
                      onChange={() => {
                        const newEquipments = filters.equipments?.includes(eq)
                          ? filters.equipments.filter(e => e !== eq)
                          : [...(filters.equipments || []), eq];
                        setFilters({ ...filters, equipments: newEquipments });
                      }}
                      className="w-3 h-3 cursor-pointer"
                    />
                    <span
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

          {/* LIGNE 2: Sélecteurs + Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <FilterSelect
              label="Ville"
              options={staticCities.map(city => ({ original: city, label: city }))}
              value={filters.city}
              onChange={(value) => setFilters({ ...filters, city: value })}
              placeholder="Toutes"
            />

            <FilterSelect
              label="Type de transaction"
              options={staticTransactionTypes}
              value={filters.transactionType}
              onChange={(value) => setFilters({ ...filters, transactionType: value })}
              placeholder="Tous"
            />

            <FilterSelect
              label="Type de bien"
              options={staticPropertyTypes}
              value={filters.propertyType}
              onChange={(value) => setFilters({ ...filters, propertyType: value })}
              placeholder="Tous"
            />

            {/* Bouton Réinitialiser */}
            <button
              onClick={handleResetFilters}
              className="px-6 py-2 rounded text-xs font-bold transition-all h-full"
              style={{
                backgroundColor: SABBAR_COLORS.goldAccent,
                color: SABBAR_COLORS.navyDominant,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
              }}
            >
              Réinitialiser
            </button>
          </div>
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