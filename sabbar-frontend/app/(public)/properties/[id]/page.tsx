/**
 * Page détail d'une propriété
 * Route: /properties/[id]
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Bed, Square, DollarSign, ArrowLeft, Phone, Mail, Bath } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  district?: string;
  address?: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type: string;
  transaction_type: string;
  images?: string[];
  video?: string;
  floor?: number;
  has_parking: boolean;
  has_garden: boolean;
  has_pool: boolean;
  has_elevator: boolean;
  is_furnished: boolean;
  is_available: boolean;
  created_at: string;
  owner_id: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Récupérer le détail de la propriété
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Fetching property:', propertyId);

        const response = await fetch(
          `http://localhost:8000/api/v1/properties/${propertyId}`
        );

        console.log('✅ Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: Propriété non trouvée`);
        }

        const data = await response.json();
        console.log('✅ Property data:', data);
        setProperty(data);
      } catch (err) {
        console.error('❌ Erreur récupération propriété:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🏠</div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          <Link href="/properties" className="flex items-center text-orange-500 hover:text-orange-600 mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Retour aux annonces
          </Link>
          <div className="bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded">
            ❌ {error || 'Propriété non trouvée'}
          </div>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [];
  const currentImage = images.length > 0 ? images[currentImageIndex] : null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const transactionLabel = {
    sale: 'Vente',
    rent: 'Location',
    vacation_rental: 'Location vacances',
  }[property.transaction_type] || property.transaction_type;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Bouton retour */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link href="/properties" className="flex items-center text-orange-500 hover:text-orange-600 transition">
            <ArrowLeft size={20} className="mr-2" />
            Retour aux annonces
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Images et description */}
          <div className="lg:col-span-2">
            {/* Galerie d'images */}
            <div className="mb-8">
              {currentImage ? (
                <div className="relative bg-gray-800 rounded-lg overflow-hidden h-96 lg:h-[500px] flex items-center justify-center group">
                  <img
                    src={currentImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Boutons navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                      >
                        ◀
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                      >
                        ▶
                      </button>
                    </>
                  )}

                  {/* Indicateur */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg h-96 lg:h-[500px] flex items-center justify-center text-gray-600">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🏠</div>
                    <p>Pas d'image disponible</p>
                  </div>
                </div>
              )}

              {/* Miniatures */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-20 rounded overflow-hidden border-2 transition ${
                        idx === currentImageIndex
                          ? 'border-orange-500'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            {/* Caractéristiques */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Caractéristiques</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {property.bedrooms !== null && property.bedrooms !== undefined && (
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="flex items-center text-orange-500 mb-2">
                      <Bed size={20} className="mr-2" />
                      <span className="font-semibold">Chambres</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{property.bedrooms}</p>
                  </div>
                )}

                {property.bathrooms !== null && property.bathrooms !== undefined && (
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="flex items-center text-orange-500 mb-2">
                      <Bath size={20} className="mr-2" />
                      <span className="font-semibold">Salles de bain</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{property.bathrooms}</p>
                  </div>
                )}

                {property.area && (
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="flex items-center text-orange-500 mb-2">
                      <Square size={20} className="mr-2" />
                      <span className="font-semibold">Surface</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{property.area} m²</p>
                  </div>
                )}

                {property.floor !== null && property.floor !== undefined && (
                  <div className="bg-gray-800 p-4 rounded">
                    <span className="font-semibold text-white">Étage</span>
                    <p className="text-2xl font-bold text-orange-500">{property.floor}</p>
                  </div>
                )}

                {property.has_parking && (
                  <div className="bg-gray-800 p-4 rounded text-center">
                    <p className="text-xl mb-1">🅿️</p>
                    <span className="text-sm text-gray-300">Parking</span>
                  </div>
                )}

                {property.has_garden && (
                  <div className="bg-gray-800 p-4 rounded text-center">
                    <p className="text-xl mb-1">🌳</p>
                    <span className="text-sm text-gray-300">Jardin</span>
                  </div>
                )}

                {property.has_pool && (
                  <div className="bg-gray-800 p-4 rounded text-center">
                    <p className="text-xl mb-1">🏊</p>
                    <span className="text-sm text-gray-300">Piscine</span>
                  </div>
                )}

                {property.has_elevator && (
                  <div className="bg-gray-800 p-4 rounded text-center">
                    <p className="text-xl mb-1">🛗</p>
                    <span className="text-sm text-gray-300">Ascenseur</span>
                  </div>
                )}

                {property.is_furnished && (
                  <div className="bg-gray-800 p-4 rounded text-center">
                    <p className="text-xl mb-1">🛋️</p>
                    <span className="text-sm text-gray-300">Meublé</span>
                  </div>
                )}
              </div>

              {/* Disponibilité */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <span className="text-gray-300">Disponibilité:</span>
                <span className={`font-bold ${property.is_available ? 'text-green-500' : 'text-red-500'}`}>
                  {property.is_available ? '✅ Disponible' : '❌ Non disponible'}
                </span>
              </div>
            </div>
          </div>

          {/* Colonne droite - Prix et contact */}
          <div className="lg:col-span-1">
            {/* Carte de prix */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 mb-6 sticky top-8">
              <div className="text-gray-100 text-sm mb-2">Prix</div>
              <div className="text-4xl font-bold text-white mb-4">
                {property.price.toLocaleString('fr-MA')} MAD
              </div>

              <div className="bg-white/20 rounded p-3 mb-4">
                <p className="text-white text-sm">
                  <strong>Type de bien:</strong> {property.property_type}
                </p>
                <p className="text-white text-sm">
                  <strong>Transaction:</strong> {transactionLabel}
                </p>
              </div>

              <button className="w-full bg-white text-orange-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition">
                Demander un devis
              </button>
            </div>

            {/* Localisation */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MapPin size={24} className="mr-2 text-orange-500" />
                Localisation
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Ville</p>
                  <p className="text-white font-semibold">{property.city}</p>
                </div>

                {property.district && (
                  <div>
                    <p className="text-gray-400 text-sm">Quartier</p>
                    <p className="text-white font-semibold">{property.district}</p>
                  </div>
                )}

                {property.address && (
                  <div>
                    <p className="text-gray-400 text-sm">Adresse complète</p>
                    <p className="text-white font-semibold">{property.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Agent de contact (placeholder) */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Agent Immobilier</h3>

              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl mr-3">
                  👤
                </div>
                <div>
                  <p className="text-white font-semibold">Agent SABBAR</p>
                  <p className="text-gray-400 text-sm">Immobilier Marocain</p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition mb-2">
                <Phone size={16} className="mr-2" />
                Appeler
              </button>

              <button className="w-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-lg transition">
                <Mail size={16} className="mr-2" />
                E-mail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}