'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ── Fix icônes cassées avec Next.js ──
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Coordonnées des 10 villes ──
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

// ── Icône dorée normale ──
const makeIcon = (active: boolean) => new L.DivIcon({
  className: '',
  html: `<div style="
    width:${active ? 18 : 13}px;
    height:${active ? 18 : 13}px;
    border-radius:50%;
    background:${active ? '#E2C98A' : '#C8A96E'};
    border:2px solid rgba(255,255,255,0.8);
    box-shadow:0 0 0 ${active ? 5 : 3}px rgba(200,169,110,${active ? 0.5 : 0.25});
    transition:all 0.3s;
  "></div>`,
  iconSize: [active ? 18 : 13, active ? 18 : 13],
  iconAnchor: [active ? 9 : 6, active ? 9 : 6],
});

// ── Recentre la carte sur la ville sélectionnée ──
function FlyTo({ villeKey }: { villeKey: string }) {
  const map = useMap();
  useEffect(() => {
    const c = VILLES_COORDS[villeKey];
    if (c) map.flyTo([c.lat, c.lng], 11, { duration: 1.2 });
    else   map.flyTo([31.7917, -7.0926], 5.5, { duration: 1.2 });
  }, [villeKey, map]);
  return null;
}

interface MapMarocProps {
  selectedVille: string; // clé normalisée ex: "casablanca"
  onSelectVille: (villeLabel: string) => void;
}

export default function MapMaroc({ selectedVille, onSelectVille }: MapMarocProps) {
  return (
    <MapContainer
      center={[31.7917, -7.0926]}
      zoom={5.5}
      scrollWheelZoom={false}
      style={{ height: '280px', width: '100%', borderRadius: '12px', zIndex: 0 }}
    >
      {/* Tuile sombre style Carto Dark — gratuit, sans clé API */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='© <a href="https://www.openstreetmap.org">OpenStreetMap</a> © <a href="https://carto.com">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {Object.entries(VILLES_COORDS).map(([key, { lat, lng, label }]) => (
        <Marker
          key={key}
          position={[lat, lng]}
          icon={makeIcon(selectedVille === key)}
          eventHandlers={{ click: () => onSelectVille(label) }}
        >
          <Popup>
            <span style={{ fontWeight: 600, color: '#0D1F3C' }}>{label}</span>
          </Popup>
        </Marker>
      ))}

      <FlyTo villeKey={selectedVille} />
    </MapContainer>
  );
}