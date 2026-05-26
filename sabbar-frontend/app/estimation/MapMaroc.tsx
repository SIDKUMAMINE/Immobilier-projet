'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ── Fix icônes cassées avec Next.js ──────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Coordonnées des 10 villes couvertes ──────────────────────────────────────
const VILLES_COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  casablanca: { lat: 33.5731, lng: -7.5898, label: 'Casablanca' },
  rabat:      { lat: 34.0209, lng: -6.8416, label: 'Rabat'      },
  marrakech:  { lat: 31.6295, lng: -7.9811, label: 'Marrakech'  },
  tanger:     { lat: 35.7595, lng: -5.8340, label: 'Tanger'     },
  agadir:     { lat: 30.4278, lng: -9.5981, label: 'Agadir'     },
  fes:        { lat: 34.0181, lng: -5.0078, label: 'Fès'        },
  meknes:     { lat: 33.8950, lng: -5.5473, label: 'Meknès'     },
  oujda:      { lat: 34.6867, lng: -1.9114, label: 'Oujda'      },
  kenitra:    { lat: 34.2610, lng: -6.5802, label: 'Kénitra'    },
  tetouan:    { lat: 35.5785, lng: -5.3684, label: 'Tétouan'    },
};

// ── Icône dorée dynamique (active ou normale) ────────────────────────────────
function makeIcon(active: boolean): L.DivIcon {
  const size   = active ? 18 : 12;
  const ring   = active ? 5  : 3;
  const color  = active ? '#E2C98A' : '#C8A96E';
  const alpha  = active ? 0.55 : 0.25;
  return new L.DivIcon({
    className: '',
    html: `<div style="
      width:${size}px; height:${size}px; border-radius:50%;
      background:${color}; border:2px solid rgba(255,255,255,0.85);
      box-shadow:0 0 0 ${ring}px rgba(200,169,110,${alpha}), 0 2px 8px rgba(0,0,0,0.4);
      transition:all 0.3s ease;
    "></div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// ── Anime le recentrage de la carte ─────────────────────────────────────────
function FlyTo({ villeKey }: { villeKey: string }) {
  const map = useMap();
  useEffect(() => {
    const c = VILLES_COORDS[villeKey];
    if (c) map.flyTo([c.lat, c.lng], 11, { duration: 1.2 });
    else   map.flyTo([31.7917, -7.0926], 5.5, { duration: 1.2 });
  }, [villeKey, map]);
  return null;
}

// ── Props ────────────────────────────────────────────────────────────────────
interface MapMarocProps {
  selectedVille: string;           // clé normalisée ex: "casablanca" ou ""
  onSelectVille: (label: string) => void; // callback avec label lisible ex: "Casablanca"
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function MapMaroc({ selectedVille, onSelectVille }: MapMarocProps) {
  return (
    <MapContainer
      center={[31.7917, -7.0926]}
      zoom={5.5}
      scrollWheelZoom={false}
      style={{ height: '280px', width: '100%', borderRadius: '12px', zIndex: 0 }}
    >
      {/*
        Tuile sombre CARTO Dark — 100% gratuite, sans clé API.
        Correspond parfaitement au design navy/gold de la page.
      */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='© <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a> © <a href="https://carto.com" target="_blank">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {/* Marqueurs pour chaque ville */}
      {Object.entries(VILLES_COORDS).map(([key, { lat, lng, label }]) => (
        <Marker
          key={key}
          position={[lat, lng]}
          icon={makeIcon(selectedVille === key)}
          eventHandlers={{ click: () => onSelectVille(label) }}
        >
          <Popup closeButton={false}>
            <span style={{
              fontWeight: 600,
              color: '#C8A96E',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: '13px',
            }}>
              {label}
            </span>
          </Popup>
        </Marker>
      ))}

      {/* Recentrage animé sur la ville sélectionnée */}
      <FlyTo villeKey={selectedVille} />
    </MapContainer>
  );
}