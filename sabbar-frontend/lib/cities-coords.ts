// lib/cities-coords.ts
export const CITIES_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'Casablanca': { lat: 33.5731, lon: -7.5898 },
  'Rabat': { lat: 34.0209, lon: -6.8416 },
  'Marrakech': { lat: 31.6295, lon: -8.0096 },
  'Fès': { lat: 34.0331, lon: -5.0033 },
  'Tanger': { lat: 35.7595, lon: -5.8340 },
  'Agadir': { lat: 30.4200, lon: -9.5982 },
  'Meknès': { lat: 33.8869, lon: -5.5491 },
  'Oujda': { lat: 34.6741, lon: -1.9086 },
  'Kénitra': { lat: 34.2644, lon: -6.6035 },
  'Tétouan': { lat: 35.5775, lon: -5.3675 },
};

export function getCoordinates(city: string) {
  return CITIES_COORDINATES[city] || CITIES_COORDINATES['Casablanca'];
}