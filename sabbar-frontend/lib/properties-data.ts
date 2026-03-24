// lib/properties-data.ts
// 📍 TOUTES les propriétés du dashboard admin

export interface Property {
  id: number | string;
  title: string;
  name?: string;
  location: string;
  city: string;
  district: string;
  price: number;
  image: string;
  createdAt: Date;
}

// ✅ LISTE COMPLÈTE DES PROPRIÉTÉS
// Ordonnées du PLUS ANCIEN au PLUS RÉCENT
export const allProperties: Property[] = [
  // Propriété 1 (créée en premier)
  {
    id: 1,
    title: 'Local commercial spacieux centre-ville',
    location: 'Rabat, Médina',
    city: 'Rabat',
    district: 'Médina',
    price: 1800000,
    image: 'https://images.unsplash.com/photo-1554995207-c18231b6ce1f?w=600&h=400&fit=crop&q=80',
    createdAt: new Date('2026-03-20')
  },
  
  // Propriété 2
  {
    id: 2,
    title: 'Penthouse Luxe Vue Panoramique',
    location: 'Casablanca, Maarif',
    city: 'Casablanca',
    district: 'Maarif',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&q=80',
    createdAt: new Date('2026-03-21')
  },
  
  // Propriété 3
  {
     id: 3,
  title: 'Villa Moderne Ain Diab Vue Mer',
  location: 'Casablanca, Ain Diab',
  city: 'Casablanca',
  district: 'Ain Diab',
  price: 4500000,
  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&q=80',  // ← NOUVELLE
  createdAt: new Date('2026-03-22')
  },
  
  // Propriété 4
  {
    id: 4,
    title: 'Bel appartement 3 chambres neuf avec terrasse',
    location: 'Marrakech, Gueliz',
    city: 'Marrakech',
    district: 'Gueliz',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop&q=80',
    createdAt: new Date('2026-03-23')
  },
  
  // Propriété 5 (créée en dernier - sera dans les 3 dernières)
  {
    id: 5,
    title: 'Studio moderne équipé avec balcon',
    location: 'Casablanca, Ville Nouvelle',
    city: 'Casablanca',
    district: 'Ville Nouvelle',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&q=80',
    createdAt: new Date('2026-03-24')
  }
];

// ✅ FONCTION CLÉE - Récupère les 3 DERNIÈRES propriétés créées
export function getLatestProperties(count: number = 3): Property[] {
  // Trier par date décroissante (les plus récentes en premier)
  // Puis prendre seulement les N dernières
  return allProperties
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

// Récupère une propriété par ID
export function getPropertyById(id: number | string): Property | undefined {
  return allProperties.find(p => p.id === id);
}

// Récupère toutes les propriétés
export function getAllProperties(): Property[] {
  return allProperties;
}