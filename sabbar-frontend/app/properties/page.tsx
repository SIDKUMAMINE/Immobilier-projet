'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, ChevronDown, Home, Key } from 'lucide-react';
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
const staticCities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger','Berrchid', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan'];

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

// 🎯 FONCTION UTILITAIRE - RÉCUPÉRER L'ICÔNE DU TYPE DE TRANSACTION
const getTransactionIcon = (transactionType: string) => {
  switch (transactionType) {
    case 'sale':
      return { icon: Home, label: 'À vendre', color: '#C8A96E' };
    case 'rent':
      return { icon: Key, label: 'À louer', color: '#E2C98A' };
    case 'vacation_rental':
      return { icon: Key, label: 'Location vacances', color: '#E2C98A' };
    default:
      return { icon: Home, label: 'Propriété', color: '#C8A96E' };
  }
};

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
    <div className="flex-1 min-w-[160px]">
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
          className="w-full px-3 py-2.5 rounded flex items-center justify-between transition-all duration-200 text-xs"
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

// 🏠 CARTE PROPRIÉTÉ (ICÔNE EN BAS À GAUCHE)
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
  
  // 🎯 RÉCUPÉRER LES INFOS DU TYPE DE TRANSACTION
  const transactionInfo = getTransactionIcon(property.transaction_type);
  const IconComponent = transactionInfo.icon;

  return (
    <Link href={propertyUrl} className="block">
      <div
        className="group rounded-lg overflow-hidden border-2 transition-all duration-300 hover:border-opacity-100 cursor-pointer h-full flex flex-col relative"
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
        <div className="p-4 flex-1 flex flex-col relative">
          {/* Icône Type de Transaction - BAS À GAUCHE 🎯 */}
          <div
            className="absolute -bottom-4 -left-4 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: `1px solid ${transactionInfo.color}`,
            }}
          >
            <IconComponent 
              size={16} 
              style={{ color: transactionInfo.color }}
            />
            <span
              className="text-xs font-semibold whitespace-nowrap"
              style={{
                color: transactionInfo.color,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {transactionInfo.label}
            </span>
          </div>

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
    condition: false, // ← BOOLÉEN pour is_new
    has_parking: false,
    has_garden: false,
    has_pool: false,
    has_elevator: false,
    is_furnished: false,
  });

  // Charger les propriétés
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertiesApi.getProperties({ limit: 100, offset: 0 });
        console.log('✅ Propriétés chargées:', response);
        setProperties(response || []);
        setFilteredProperties(response || []);
      } catch (error) {
        console.error('❌ Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Appliquer les filtres - LOGIQUE DÉBOGUÉE
  useEffect(() => {
    console.log('🔄 Filtres appliqués:', filters);
    console.log('📊 Propriétés totales:', properties.length);

    const filtered = properties.filter(property => {
      // ✅ VILLE
      if (filters.city && property.city !== filters.city) {
        return false;
      }

      // ✅ TYPE DE TRANSACTION
      if (filters.transactionType && property.transaction_type !== filters.transactionType) {
        return false;
      }

      // ✅ TYPE DE BIEN
      if (filters.propertyType && property.property_type !== filters.propertyType) {
        return false;
      }

      // ✅ PRIX MIN
      if (filters.priceMin) {
        const priceMinValue = parseInt(filters.priceMin);
        if (isNaN(priceMinValue) || property.price < priceMinValue) {
          return false;
        }
      }

      // ✅ PRIX MAX
      if (filters.priceMax) {
        const priceMaxValue = parseInt(filters.priceMax);
        if (isNaN(priceMaxValue) || property.price > priceMaxValue) {
          return false;
        }
      }

      // ✅ SURFACE MIN
      if (filters.areaMin && property.area) {
        const areaMinValue = parseInt(filters.areaMin);
        if (isNaN(areaMinValue) || property.area < areaMinValue) {
          return false;
        }
      }

      // ✅ SURFACE MAX
      if (filters.areaMax && property.area) {
        const areaMaxValue = parseInt(filters.areaMax);
        if (isNaN(areaMaxValue) || property.area > areaMaxValue) {
          return false;
        }
      }

      // ✅ CHAMBRES
      if (filters.bedrooms) {
        const bedroomsValue = parseInt(filters.bedrooms);
        if (isNaN(bedroomsValue) || property.bedrooms !== bedroomsValue) {
          return false;
        }
      }

      // ✅ SALLES DE BAIN
      if (filters.bathrooms) {
        const bathroomsValue = parseInt(filters.bathrooms);
        if (isNaN(bathroomsValue) || property.bathrooms !== bathroomsValue) {
          return false;
        }
      }

      // ✅ CONDITION (Neuf) - UTILISER is_new BOOLÉEN
      if (filters.condition && !property.is_new) {
        return false;
      }

      // ✅ ÉQUIPEMENTS - CORRECTIFS AVEC LES BONS NOMS DE CHAMPS
      if (filters.has_parking && !property.has_parking) {
        return false;
      }

      if (filters.has_garden && !property.has_garden) {
        return false;
      }

      if (filters.has_pool && !property.has_pool) {
        return false;
      }

      if (filters.has_elevator && !property.has_elevator) {
        return false;
      }

      if (filters.is_furnished && !property.is_furnished) {
        return false;
      }

      return true;
    });

    console.log('✅ Propriétés filtrées:', filtered.length);
    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleResetFilters = () => {
    console.log('🔄 Réinitialisation des filtres');
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
      condition: false,
      has_parking: false,
      has_garden: false,
      has_pool: false,
      has_elevator: false,
      is_furnished: false,
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

      {/* 🎯 SECTION FILTRES - STRUCTURE COLLAPSIBLE */}
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

          {/* LIGNE 1: Sélecteurs principaux + Critères supplémentaires + Actions */}
          <div className="flex flex-wrap gap-3 items-end mb-4">
            {/* Ville */}
            <FilterSelect
              label="Ville"
              options={staticCities.map(city => ({ original: city, label: city }))}
              value={filters.city}
              onChange={(value) => {
                console.log('✅ Ville changée:', value);
                setFilters({ ...filters, city: value });
              }}
              placeholder="Sélectionner une ville"
            />

            {/* Type de transaction */}
            <FilterSelect
              label="Type de transaction"
              options={staticTransactionTypes}
              value={filters.transactionType}
              onChange={(value) => {
                console.log('✅ Type transaction changé:', value);
                setFilters({ ...filters, transactionType: value });
              }}
              placeholder="Tous les types"
            />

            {/* Type de bien */}
            <FilterSelect
              label="Type de bien"
              options={staticPropertyTypes}
              value={filters.propertyType}
              onChange={(value) => {
                console.log('✅ Type bien changé:', value);
                setFilters({ ...filters, propertyType: value });
              }}
              placeholder="Tous les types"
            />

            {/* Critères supplémentaires button */}
            <button
              onClick={() => {
                console.log('🔄 Critères supplémentaires toggled');
                setExpandCriteria(!expandCriteria);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded font-bold text-sm transition-all"
              style={{
                backgroundColor: expandCriteria ? SABBAR_COLORS.goldAccent + '30' : SABBAR_COLORS.goldAccent + '15',
                color: SABBAR_COLORS.goldAccent,
                fontFamily: "'DM Sans', sans-serif",
                border: `1px solid ${SABBAR_COLORS.goldAccent}`,
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

            {/* Réinitialiser */}
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded text-xs font-bold transition-all"
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

          {/* LIGNE 2: Critères supplémentaires (COLLAPSIBLE) */}
          {expandCriteria && (
            <div
              className="p-6 rounded-lg border mt-4 transition-all"
              style={{
                backgroundColor: SABBAR_COLORS.navyDominant + '80',
                borderColor: SABBAR_COLORS.goldAccent + '30',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Prix Min */}
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase mb-2"
                    style={{
                      color: SABBAR_COLORS.goldAccent,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: '0.5px',
                    }}
                  >
                    Prix Min (MAD)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 100000"
                    value={filters.priceMin}
                    onChange={(e) => {
                      console.log('✅ Prix Min changé:', e.target.value);
                      setFilters({ ...filters, priceMin: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded text-xs"
                    style={{
                      backgroundColor: 'rgba(249, 245, 239, 0.05)',
                      color: SABBAR_COLORS.goldLight,
                      border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* Prix Max */}
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase mb-2"
                    style={{
                      color: SABBAR_COLORS.goldAccent,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: '0.5px',
                    }}
                  >
                    Prix Max (MAD)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 500000"
                    value={filters.priceMax}
                    onChange={(e) => {
                      console.log('✅ Prix Max changé:', e.target.value);
                      setFilters({ ...filters, priceMax: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded text-xs"
                    style={{
                      backgroundColor: 'rgba(249, 245, 239, 0.05)',
                      color: SABBAR_COLORS.goldLight,
                      border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* Surface Min */}
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase mb-2"
                    style={{
                      color: SABBAR_COLORS.goldAccent,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: '0.5px',
                    }}
                  >
                    Surface Min (m²)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 50"
                    value={filters.areaMin}
                    onChange={(e) => {
                      console.log('✅ Surface Min changée:', e.target.value);
                      setFilters({ ...filters, areaMin: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded text-xs"
                    style={{
                      backgroundColor: 'rgba(249, 245, 239, 0.05)',
                      color: SABBAR_COLORS.goldLight,
                      border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* Surface Max */}
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase mb-2"
                    style={{
                      color: SABBAR_COLORS.goldAccent,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: '0.5px',
                    }}
                  >
                    Surface Max (m²)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 200"
                    value={filters.areaMax}
                    onChange={(e) => {
                      console.log('✅ Surface Max changée:', e.target.value);
                      setFilters({ ...filters, areaMax: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded text-xs"
                    style={{
                      backgroundColor: 'rgba(249, 245, 239, 0.05)',
                      color: SABBAR_COLORS.goldLight,
                      border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* Chambres */}
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase mb-2"
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
                    onChange={(e) => {
                      console.log('✅ Chambres changées:', e.target.value);
                      setFilters({ ...filters, bedrooms: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded text-xs"
                    style={{
                      backgroundColor: 'rgba(249, 245, 239, 0.05)',
                      color: SABBAR_COLORS.goldLight,
                      border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* Salles de bain */}
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase mb-2"
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
                    onChange={(e) => {
                      console.log('✅ Salles de bain changées:', e.target.value);
                      setFilters({ ...filters, bathrooms: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded text-xs"
                    style={{
                      backgroundColor: 'rgba(249, 245, 239, 0.05)',
                      color: SABBAR_COLORS.goldLight,
                      border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* État du bien */}
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase mb-2"
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
                      backgroundColor: filters.condition ? SABBAR_COLORS.goldAccent + '20' : 'rgba(249, 245, 239, 0.05)',
                      border: `1px solid ${SABBAR_COLORS.goldAccent}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.condition}
                      onChange={(e) => {
                        const newValue = e.target.checked;
                        console.log('✅ État du bien (Neuf) changé:', newValue);
                        setFilters({ ...filters, condition: newValue });
                      }}
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

                {/* Équipements - AVEC LES BONS NOMS DE CHAMPS */}
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase mb-2"
                    style={{
                      color: SABBAR_COLORS.goldAccent,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: '0.5px',
                    }}
                  >
                    Équipements
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.has_parking}
                        onChange={() => {
                          console.log('✅ Parking changé');
                          setFilters({ ...filters, has_parking: !filters.has_parking });
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: SABBAR_COLORS.goldLight,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Parking
                      </span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.has_garden}
                        onChange={() => {
                          console.log('✅ Jardin changé');
                          setFilters({ ...filters, has_garden: !filters.has_garden });
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: SABBAR_COLORS.goldLight,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Jardin
                      </span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.has_pool}
                        onChange={() => {
                          console.log('✅ Piscine changée');
                          setFilters({ ...filters, has_pool: !filters.has_pool });
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: SABBAR_COLORS.goldLight,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Piscine
                      </span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.is_furnished}
                        onChange={() => {
                          console.log('✅ Meublé changé');
                          setFilters({ ...filters, is_furnished: !filters.is_furnished });
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: SABBAR_COLORS.goldLight,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Meublé
                      </span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer col-span-2">
                      <input
                        type="checkbox"
                        checked={filters.has_elevator}
                        onChange={() => {
                          console.log('✅ Ascenseur changé');
                          setFilters({ ...filters, has_elevator: !filters.has_elevator });
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: SABBAR_COLORS.goldLight,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Ascenseur
                      </span>
                    </label>
                  </div>
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