/**
 * Configuration globale du projet SABBAR
 * Fichier: lib/config.ts
 */

// URL de base pour l'API FastAPI
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// URLs des endpoints
export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/api/v1/auth/login`,
  register: `${API_BASE_URL}/api/v1/auth/register`,
  
  // Properties
  properties: `${API_BASE_URL}/api/v1/properties`,
  
  // Leads
  leads: `${API_BASE_URL}/api/v1/leads`,
  
  // Conversations
  conversations: `${API_BASE_URL}/api/v1/conversations`,
  
  // Users
  users: `${API_BASE_URL}/api/v1/users`,
};

// Données métier
export const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
];

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Appartement' },
  { value: 'villa', label: 'Villa' },
  { value: 'house', label: 'Maison' },
  { value: 'riad', label: 'Riad' },
  { value: 'land', label: 'Terrain' },
  { value: 'office', label: 'Bureau' },
  { value: 'commercial', label: 'Local commercial' },
];

export const TRANSACTION_TYPES = [
  { value: 'sale', label: 'Vente' },
  { value: 'rent', label: 'Location' },
  { value: 'vacation_rent', label: 'Location vacances' },
];