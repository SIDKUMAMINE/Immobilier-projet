'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Heart, MapPin, ChevronDown, Home, Key, Pin } from 'lucide-react';
import { propertiesApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';

// ─── Quartiers par ville ──────────────────────────────────────────────────────
const QUARTIERS_PAR_VILLE: Record<string, string[]> = {
  'Casablanca': ['Anfa','Maarif','Gauthier','Ain Diab','Bourgogne','Sidi Maarouf','Bouskoura','Hay Hassani','Californie','Val Fleuri','Oulfa','Bernoussi','Ain Sbaa','Hay Mohammadi','Sidi Bernoussi','Sbata','Derb Sultan','Ben Msik','Salmia','Roches Noires','Polo','Racine','CIL','Beauséjour','Oasis','Quartier des Hopitaux','Hay Nour','Lissasfa','Attacharouk','Lahraouiyine','Dar Bouazza','Mediouna','Nassim','Les Princesses','Hay Oulfa','Ain Chock','Belvedere','Palmier','Ghandi','Maarif Extension','Hay Ennakhil','Sidi Belyout','Habous','Triangle d\'Or','Quartier Riviera','Ain Sebaa','Zenata','Medina'],
  'Rabat': ['Agdal','Hassan','Souissi','Les Orangers','Hay Riad','Youssoufia','Akkari','Hay Nahda','Ocean','Diour Jamaa','Aviation','Madinat Al Irfane','Takaddoum','Hay Salam','Temara','Salé','Hay Karima','Hay Inara','Medina Rabat','Ryad','Hay Fadila','Quartier des Ministères'],
  'Marrakech': ['Gueliz','Hivernage','Palmeraie','Mellah','Agdal','Targa','Medina','Sidi Ghanem','Semlalia','Massira','Mhamid','Amelkis','Route de Fès','Hay Hassani','Bab Doukkala','Sidi Youssef Ben Ali','Route de Casablanca','Nouvelle Ville'],
  'Tanger': ['Malabata','Marchane','Iberia','Val Fleuri','Boukhalef','Moghogha','Medina','California','Mesnana','Charf','Beni Makada','Tanja Balia','Cap Spartel','Gzenaya','Souani','Dradeb','Branes','Hay Al Amal','Quartier Administratif','Achakar'],
  'Agadir': ['Founty','Hay Mohammadi','Talborjt','Cité Suisse','Anza','Hay Dakhla','Tilila','Bensergao','Tikiouine','Hay Massira','Agadir Marina','Quartier Industriel','Hay Al Matar','Cité Al Wahda'],
  'Fès': ['Saiss','Route d\'Imouzzer','Montfleuri','Atlas','Les Mérinides','Narjiss','Andalous','Agdal','Medina','Aouinet Hajjaj','Ville Nouvelle','Zouagha','Hay Amal','Ain Chkef','Bensouda'],
  'Meknès': ['Hamria','Nouvelle Ville','Medina','Hay Salam','Marjane','Bassatine','Zitoune'],
  'Oujda': ['Hay Qods','Hay Al Wifaq','Centre Ville','Sidi Yahya','Lazaret'],
  'Kénitra': ['Centre Ville','Bir Rami','Hay Mahtat','Saknia'],
  'Tétouan': ['Martil','M\'diq','Centre Ville','Cabo Negro','Medina'],
  'Mohammedia': ['Centre Ville','Hay Hana','Ain Harrouda','Beni Yakhlef'],
  'Essaouira': ['Medina','Hay Dakhla','Diabat'],
  'Salé': ['Hay Salam','Tabriquet','Laayayda','Hay Karima'],
};

// 🇲🇦 VILLES
const MOROCCAN_CITIES = Object.keys(QUARTIERS_PAR_VILLE).concat([
  'Berrechid','Settat','Al Hoceïma','Taza','Taounate','Safi','Ouarzazate','Taroudant',
  'Errachidia','Erfoud','Merzouga','Inezgane','Tiznit','Guelmim','Béni Mellal',
  'Khénifra','Berkane','Nador','Driouch','Dakhla','Laâyoune',
]);

// Normalisation pour la recherche
function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

// ✅ STATUTS
const STATUS_OPTIONS = [
  { value: 'available',       label: 'Disponible',      color: '#16a34a' },
  { value: 'sold',            label: 'Vendu',           color: '#dc2626' },
  { value: 'rented',         label: 'Loué / Occupé',   color: '#2563eb' },
  { value: 'reserved',       label: 'Réservé',         color: '#d97706' },
  { value: 'under_offer',    label: 'Sous offre',      color: '#7c3aed' },
  { value: 'under_contract', label: 'Sous compromis',  color: '#db2777' },
  { value: 'unavailable',    label: 'Non disponible',  color: '#6b7280' },
];

const SABBAR_COLORS = {
  navyDominant: '#0D1F3C',
  goldAccent: '#C8A96E',
  goldLight: '#E2C98A',
  terracotta: '#B5573A',
  ivory: '#F9F5EF',
};

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
  { original: 'commercial', label: 'Local commercial' },
];

const getTransactionIcon = (transactionType: string) => {
  switch (transactionType) {
    case 'sale': return { icon: Home, label: 'À vendre', color: '#C8A96E' };
    case 'rent': return { icon: Key, label: 'À louer', color: '#E2C98A' };
    case 'vacation_rental': return { icon: Key, label: 'Location vacances', color: '#E2C98A' };
    default: return { icon: Home, label: 'Propriété', color: '#C8A96E' };
  }
};

// ─── FilterSelect ─────────────────────────────────────────────────────────────
interface FilterSelectProps {
  label: string;
  options: Array<{ original: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, options, value, onChange, placeholder = 'Sélectionner' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const getDisplayLabel = () => {
    if (!value) return placeholder;
    const found = options.find(opt => opt.original === value);
    return found ? found.label : value;
  };
  return (
    <div className="flex-1 min-w-[160px]">
      <label className="block text-[10px] font-bold uppercase mb-1.5" style={{ color: SABBAR_COLORS.goldAccent, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>{label}</label>
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full px-3 py-2.5 rounded flex items-center justify-between transition-all duration-200 text-xs"
          style={{ backgroundColor: isOpen ? SABBAR_COLORS.navyDominant : 'rgba(249,245,239,0.05)', color: value ? SABBAR_COLORS.ivory : SABBAR_COLORS.goldLight, border: `1px solid ${SABBAR_COLORS.goldAccent}`, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
          <span className="truncate text-[12px]">{getDisplayLabel()}</span>
          <ChevronDown size={16} className="flex-shrink-0 ml-2" style={{ color: SABBAR_COLORS.goldAccent, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }} />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded shadow-lg z-50 border" style={{ backgroundColor: SABBAR_COLORS.navyDominant, borderColor: SABBAR_COLORS.goldAccent, maxHeight: '250px', overflowY: 'auto' }}>
            <button onClick={() => { onChange(''); setIsOpen(false); }} className="w-full px-3 py-2 text-left text-[12px]" style={{ backgroundColor: !value ? SABBAR_COLORS.goldAccent + '20' : 'transparent', color: !value ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>{placeholder}</button>
            <div style={{ height: '0.5px', backgroundColor: SABBAR_COLORS.goldAccent + '15' }} />
            {options.map((option, i) => (
              <button key={i} onClick={() => { onChange(option.original); setIsOpen(false); }} className="w-full px-3 py-2 text-left text-[12px]"
                style={{ backgroundColor: value === option.original ? SABBAR_COLORS.goldAccent + '20' : 'transparent', color: value === option.original ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif", fontWeight: value === option.original ? 600 : 500, borderBottom: `0.5px solid ${SABBAR_COLORS.goldAccent}08` }}>
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

// ─── QuartierSearch — autocomplete ────────────────────────────────────────────
interface QuartierSearchProps {
  ville: string;
  value: string;
  onChange: (v: string) => void;
}

const QuartierSearch: React.FC<QuartierSearchProps> = ({ ville, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const quartiers = QUARTIERS_PAR_VILLE[ville] || [];
  const suggestions = value.length > 0
    ? quartiers.filter(q => normalize(q).includes(normalize(value)))
    : quartiers;
  const showDropdown = focused && quartiers.length > 0;

  return (
    <div style={{ flex: '1', minWidth: '160px' }}>
      <label className="block text-[10px] font-bold uppercase mb-1.5" style={{ color: SABBAR_COLORS.goldAccent, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
        Quartier
      </label>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={ville ? `${quartiers.length} quartiers disponibles...` : 'Sélectionnez une ville'}
          disabled={!ville}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: '6px',
            backgroundColor: focused ? SABBAR_COLORS.navyDominant : 'rgba(249,245,239,0.05)',
            color: value ? SABBAR_COLORS.ivory : SABBAR_COLORS.goldLight,
            border: `1px solid ${focused ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldAccent}`,
            fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500,
            outline: 'none', opacity: ville ? 1 : 0.5,
            cursor: ville ? 'text' : 'not-allowed',
            boxSizing: 'border-box',
          }}
        />
        {/* Badge ville reconnue */}
        {ville && !focused && !value && (
          <div style={{ marginTop: '4px', fontSize: '10px', color: SABBAR_COLORS.goldAccent, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: SABBAR_COLORS.goldAccent, display: 'inline-block' }} />
            {quartiers.length} quartiers · cliquez pour filtrer
          </div>
        )}
        {/* Dropdown */}
        {showDropdown && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            zIndex: 300, background: 'rgba(7,18,32,0.98)',
            border: `1px solid ${SABBAR_COLORS.goldAccent}`,
            borderRadius: '8px', maxHeight: '200px', overflowY: 'auto',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}>
            {/* Option "Tous les quartiers" */}
            <div
              onMouseDown={() => { onChange(''); setFocused(false); }}
              style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '12px', color: SABBAR_COLORS.goldAccent, fontFamily: "'DM Sans', sans-serif", borderBottom: `1px solid ${SABBAR_COLORS.goldAccent}20`, fontWeight: 600 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,169,110,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Tous les quartiers
            </div>
            {suggestions.map((q, i) => (
              <div
                key={q}
                onMouseDown={() => { onChange(q); setFocused(false); }}
                style={{
                  padding: '10px 14px', cursor: 'pointer', fontSize: '12px',
                  color: value === q ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.ivory,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: value === q ? 600 : 400,
                  borderBottom: i < suggestions.length - 1 ? `1px solid rgba(200,169,110,0.08)` : 'none',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: value === q ? 'rgba(200,169,110,0.1)' : 'transparent',
                }}
                onMouseEnter={e => { if (value !== q) e.currentTarget.style.background = 'rgba(200,169,110,0.06)'; }}
                onMouseLeave={e => { if (value !== q) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: SABBAR_COLORS.goldAccent, opacity: 0.5, flexShrink: 0 }} />
                {q}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PropertyCard ─────────────────────────────────────────────────────────────
const PropertyCard: React.FC<{ property: any }> = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('sabbar_favorites') || '[]');
    setIsFavorite(favs.includes(property.id));
  }, [property.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('sabbar_favorites') || '[]');
    const newFavs = favs.includes(property.id) ? favs.filter((id: number) => id !== property.id) : [...favs, property.id];
    localStorage.setItem('sabbar_favorites', JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const image = property.images?.[0] || property.image || '/placeholder.jpg';
  const transactionInfo = getTransactionIcon(property.transaction_type);
  const IconComponent = transactionInfo.icon;

  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="group rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer h-full flex flex-col"
        style={{ backgroundColor: SABBAR_COLORS.navyDominant + '50', borderColor: property.is_pinned ? SABBAR_COLORS.goldAccent : SABBAR_COLORS.goldAccent + '30' }}>
        <div className="relative overflow-hidden h-48 bg-gray-800">
          <img src={image} alt={property.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute top-3 right-3 px-3 py-1 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: 'rgba(0,0,0,0.7)', fontFamily: "'DM Sans', sans-serif" }}>
            {property.price.toLocaleString('fr-FR')} MAD
          </div>
          <button onClick={toggleFavorite} className="absolute top-3 left-3 p-2 rounded-full transition-all"
            style={{ backgroundColor: isFavorite ? SABBAR_COLORS.goldAccent : 'rgba(0,0,0,0.6)', color: isFavorite ? SABBAR_COLORS.navyDominant : 'white' }}>
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          {property.is_pinned && (
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg flex items-center gap-1" style={{ backgroundColor: 'rgba(200,169,110,0.95)', color: '#0D1F3C' }}>
              <Pin size={11} />
              <span className="text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>À la une</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-sm font-bold line-clamp-2 mb-2" style={{ color: SABBAR_COLORS.ivory, fontFamily: "'DM Sans', sans-serif" }}>{property.title}</h3>
          <div className="flex justify-end mb-3">
            <div className="px-2 py-1 rounded-lg flex items-center gap-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: `1px solid ${transactionInfo.color}`, width: 'fit-content' }}>
              <IconComponent size={14} style={{ color: transactionInfo.color }} />
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: transactionInfo.color, fontFamily: "'DM Sans', sans-serif" }}>{transactionInfo.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mb-3">
            <MapPin size={14} style={{ color: SABBAR_COLORS.goldAccent }} />
            <span className="text-xs" style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
              {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}
            </span>
          </div>
          <div className="flex gap-3 text-xs flex-wrap">
            {property.bedrooms && <span style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>🛏️ {property.bedrooms}</span>}
            {property.area && <span style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>📐 {property.area}m²</span>}
          </div>
          {property.status && (() => {
            const s = STATUS_OPTIONS.find(x => x.value === property.status);
            if (!s) return null;
            return (
              <div className="mt-2">
                <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", backgroundColor: `${s.color}20`, color: s.color, border: `1px solid ${s.color}50` }}>
                  {s.label}
                </span>
              </div>
            );
          })()}
        </div>
      </div>
    </Link>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────
export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandCriteria, setExpandCriteria] = useState(false);

  const [filters, setFilters] = useState({
    city: '', neighborhood: '', transactionType: '', propertyType: '',
    priceMin: '', priceMax: '', areaMin: '', areaMax: '',
    bedrooms: '', bathrooms: '',
    condition: false, has_parking: false, has_garden: false,
    has_pool: false, has_elevator: false, is_furnished: false,
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertiesApi.getProperties({ limit: 100, offset: 0 });
        const list = response || [];
        if (!supabase) { setProperties(list); setFilteredProperties(list); return; }
        const { data: pinData } = await supabase.from('properties').select('id, is_pinned');
        const pinMap: Record<string, boolean> = {};
        (pinData || []).forEach((p: any) => { pinMap[p.id] = p.is_pinned; });
        const merged = list.map((p: any) => ({ ...p, is_pinned: pinMap[p.id] ?? false }));
        setProperties(merged);
        setFilteredProperties(merged);
      } catch (error) {
        console.error('❌ Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const filtered = properties.filter(property => {
      if (filters.city && property.city !== filters.city) return false;
      // Filtre quartier — cherche dans neighborhood ou district
      if (filters.neighborhood) {
        const propNeighborhood = normalize(property.neighborhood || property.district || '');
        if (!propNeighborhood.includes(normalize(filters.neighborhood))) return false;
      }
      if (filters.transactionType && property.transaction_type !== filters.transactionType) return false;
      if (filters.propertyType && property.property_type !== filters.propertyType) return false;
      if (filters.priceMin && !isNaN(+filters.priceMin) && property.price < +filters.priceMin) return false;
      if (filters.priceMax && !isNaN(+filters.priceMax) && property.price > +filters.priceMax) return false;
      if (filters.areaMin && property.area && !isNaN(+filters.areaMin) && property.area < +filters.areaMin) return false;
      if (filters.areaMax && property.area && !isNaN(+filters.areaMax) && property.area > +filters.areaMax) return false;
      if (filters.bedrooms && !isNaN(+filters.bedrooms) && property.bedrooms !== +filters.bedrooms) return false;
      if (filters.bathrooms && !isNaN(+filters.bathrooms) && property.bathrooms !== +filters.bathrooms) return false;
      if (filters.condition && !property.is_new) return false;
      if (filters.has_parking && !property.has_parking) return false;
      if (filters.has_garden && !property.has_garden) return false;
      if (filters.has_pool && !property.has_pool) return false;
      if (filters.has_elevator && !property.has_elevator) return false;
      if (filters.is_furnished && !property.is_furnished) return false;
      return true;
    });
    const sorted = [...filtered].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
    setFilteredProperties(sorted);
  }, [filters, properties]);

  const handleResetFilters = () => setFilters({
    city: '', neighborhood: '', transactionType: '', propertyType: '',
    priceMin: '', priceMax: '', areaMin: '', areaMax: '',
    bedrooms: '', bathrooms: '',
    condition: false, has_parking: false, has_garden: false,
    has_pool: false, has_elevator: false, is_furnished: false,
  });

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '6px',
    backgroundColor: 'rgba(249,245,239,0.05)', color: SABBAR_COLORS.goldLight,
    border: `1px solid ${SABBAR_COLORS.goldAccent}`,
    fontFamily: "'DM Sans', sans-serif", fontSize: '12px', outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <main style={{ backgroundColor: SABBAR_COLORS.navyDominant }}>
      {/* Header */}
      <section className="py-12 px-[5%]" style={{ backgroundColor: SABBAR_COLORS.navyDominant }}>
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-5xl font-light mb-2" style={{ color: SABBAR_COLORS.ivory, fontFamily: "'Cormorant Garamond', serif" }}>
            Nos <span style={{ color: SABBAR_COLORS.goldAccent }}>Propriétés</span>
          </h1>
          <p className="text-lg" style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
            Découvrez tous nos biens immobiliers disponibles
          </p>
        </div>
      </section>

      {/* FILTRES */}
      <section className="py-6 px-[5%] border-b" style={{ backgroundColor: SABBAR_COLORS.navyDominant, borderColor: SABBAR_COLORS.goldAccent + '30' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ fontSize: '20px' }}>🔍</span>
            <h2 className="text-sm font-bold" style={{ color: SABBAR_COLORS.goldAccent, fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
              Affiner votre recherche
            </h2>
          </div>

          {/* Ligne 1 : Ville + Quartier + Transaction + Type + boutons */}
          <div className="flex flex-wrap gap-3 items-end mb-4">
            {/* Ville */}
            <FilterSelect
              label="Ville"
              options={MOROCCAN_CITIES.map(c => ({ original: c, label: c }))}
              value={filters.city}
              onChange={v => setFilters({ ...filters, city: v, neighborhood: '' })}
              placeholder="Sélectionner une ville"
            />

            {/* Quartier — autocomplete */}
            <QuartierSearch
              ville={filters.city}
              value={filters.neighborhood}
              onChange={v => setFilters({ ...filters, neighborhood: v })}
            />

            <FilterSelect
              label="Type de transaction"
              options={staticTransactionTypes}
              value={filters.transactionType}
              onChange={v => setFilters({ ...filters, transactionType: v })}
              placeholder="Tous les types"
            />
            <FilterSelect
              label="Type de bien"
              options={staticPropertyTypes}
              value={filters.propertyType}
              onChange={v => setFilters({ ...filters, propertyType: v })}
              placeholder="Tous les types"
            />

            <button onClick={() => setExpandCriteria(!expandCriteria)}
              className="flex items-center gap-2 px-4 py-2.5 rounded font-bold text-sm transition-all"
              style={{ backgroundColor: expandCriteria ? SABBAR_COLORS.goldAccent + '30' : SABBAR_COLORS.goldAccent + '15', color: SABBAR_COLORS.goldAccent, fontFamily: "'DM Sans', sans-serif", border: `1px solid ${SABBAR_COLORS.goldAccent}` }}>
              Critères supplémentaires
              <ChevronDown size={16} style={{ transform: expandCriteria ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }} />
            </button>

            <button onClick={handleResetFilters}
              className="px-6 py-2.5 rounded text-xs font-bold transition-all"
              style={{ backgroundColor: SABBAR_COLORS.goldAccent, color: SABBAR_COLORS.navyDominant, fontFamily: "'DM Sans', sans-serif", fontSize: '12px' }}>
              Réinitialiser tous les filtres
            </button>
          </div>

          {/* Chips quartiers actifs */}
          {filters.city && filters.neighborhood && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: SABBAR_COLORS.goldAccent, fontFamily: "'DM Sans', sans-serif" }}>Quartier :</span>
              <span style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(200,169,110,0.15)', border: `1px solid ${SABBAR_COLORS.goldAccent}`, color: SABBAR_COLORS.goldAccent, fontSize: '12px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {filters.neighborhood}
                <button onClick={() => setFilters({ ...filters, neighborhood: '' })} style={{ background: 'none', border: 'none', color: SABBAR_COLORS.goldAccent, cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0 }}>×</button>
              </span>
            </div>
          )}

          {/* Critères supplémentaires */}
          {expandCriteria && (
            <div className="p-6 rounded-lg border mt-4" style={{ backgroundColor: SABBAR_COLORS.navyDominant + '80', borderColor: SABBAR_COLORS.goldAccent + '30' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { key: 'priceMin', label: 'Prix Min (MAD)', placeholder: 'Ex: 100000' },
                  { key: 'priceMax', label: 'Prix Max (MAD)', placeholder: 'Ex: 500000' },
                  { key: 'areaMin',  label: 'Surface Min (m²)', placeholder: 'Ex: 50' },
                  { key: 'areaMax',  label: 'Surface Max (m²)', placeholder: 'Ex: 200' },
                  { key: 'bedrooms', label: 'Chambres', placeholder: 'Ex: 2' },
                  { key: 'bathrooms',label: 'Salles de bain', placeholder: 'Ex: 1' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold uppercase mb-2" style={{ color: SABBAR_COLORS.goldAccent, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>{label}</label>
                    <input type="number" placeholder={placeholder} value={(filters as any)[key]}
                      onChange={e => setFilters({ ...filters, [key]: e.target.value })}
                      style={inputStyle} />
                  </div>
                ))}

                {/* État du bien */}
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-2" style={{ color: SABBAR_COLORS.goldAccent, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>État du bien</label>
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border rounded"
                    style={{ backgroundColor: filters.condition ? SABBAR_COLORS.goldAccent + '20' : 'rgba(249,245,239,0.05)', border: `1px solid ${SABBAR_COLORS.goldAccent}` }}>
                    <input type="checkbox" checked={filters.condition} onChange={e => setFilters({ ...filters, condition: e.target.checked })} className="w-4 h-4 cursor-pointer" />
                    <span className="text-xs" style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>🆕 Neuf</span>
                  </label>
                </div>

                {/* Équipements */}
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-2" style={{ color: SABBAR_COLORS.goldAccent, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>Équipements</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'has_parking', label: 'Parking' },
                      { key: 'has_garden',  label: 'Jardin' },
                      { key: 'has_pool',    label: 'Piscine' },
                      { key: 'is_furnished',label: 'Meublé' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={(filters as any)[key]} onChange={() => setFilters({ ...filters, [key]: !(filters as any)[key] })} className="w-4 h-4 cursor-pointer" />
                        <span className="text-xs" style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                      </label>
                    ))}
                    <label className="flex items-center gap-1.5 cursor-pointer col-span-2">
                      <input type="checkbox" checked={filters.has_elevator} onChange={() => setFilters({ ...filters, has_elevator: !filters.has_elevator })} className="w-4 h-4 cursor-pointer" />
                      <span className="text-xs" style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>Ascenseur</span>
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
          <p className="mb-6 text-sm" style={{ color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
            {filteredProperties.length} propriété{filteredProperties.length !== 1 ? 's' : ''} trouvée{filteredProperties.length !== 1 ? 's' : ''}
            {filters.city && <span style={{ color: SABBAR_COLORS.goldAccent }}> · {filters.city}{filters.neighborhood ? `, ${filters.neighborhood}` : ''}</span>}
          </p>
          {loading ? (
            <div style={{ color: SABBAR_COLORS.goldLight }}>Chargement...</div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => <PropertyCard key={property.id} property={property} />)}
            </div>
          ) : (
            <div className="px-6 py-12 rounded-lg border text-center"
              style={{ backgroundColor: SABBAR_COLORS.navyDominant + '50', borderColor: SABBAR_COLORS.goldAccent + '30', color: SABBAR_COLORS.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
              Aucune propriété ne correspond à vos critères
            </div>
          )}
        </div>
      </section>
    </main>
  );
}