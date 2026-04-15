'use client';

import { useState, useEffect } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { propertiesApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';


export default function PropertiesSection() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Récupère directement depuis Supabase, épinglés en premier
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Épinglés en priorité, max 3 affichés
      const pinned = (data || []).filter((p: any) => p.is_pinned);
      const recent = (data || []).filter((p: any) => !p.is_pinned);
      setProperties([...pinned, ...recent].slice(0, 3));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
}, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-[#0a0e1a] to-[#0f1424] py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center min-h-96">
          <p className="text-[#8A9BB0]">⏳ Chargement des propriétés...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-b from-[#0a0e1a] to-[#0f1424] py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] text-[#fca5a5] px-6 py-4 rounded-lg text-center">
            ❌ Erreur: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-[#0a0e1a] to-[#0f1424] py-24 px-[5%]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              lineHeight: 1.05,
            }}
          >
            Nos <span className="text-[#C8A96E]">Réalisations</span>
          </h2>
          <p
            className="text-lg text-[#8A9BB0] max-w-3xl mx-auto"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            Découvrez nos projets immobiliers prestigieux au Maroc
          </p>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {properties.map((property) => (
              <div
                key={property.id}
                className="group bg-[rgba(26,40,71,0.3)] border border-[rgba(200,169,110,0.15)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[rgba(200,169,110,0.4)] hover:shadow-[0_20px_40px_rgba(200,169,110,0.2)] hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-[#0a0e1a] flex items-center justify-center">
                  <img 
                    src={property.images?.[0] || property.image || '/placeholder.jpg'} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%231a2847" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23C8A96E" text-anchor="middle" dy=".3em"%3EImage indisponible%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <h3
                    className="text-xl font-bold text-white group-hover:text-[#C8A96E] transition-colors line-clamp-2"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 400,
                    }}
                  >
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
                    <MapPin size={16} className="text-[#C8A96E] flex-shrink-0" />
                    <span
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {property.city && property.quarter ? `${property.city}, ${property.quarter}` : property.city || property.quarter || 'Localisation non disponible'}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="pt-4 border-t border-[rgba(200,169,110,0.1)]">
                    <p
                      className="text-3xl font-bold text-[#C8A96E]"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 300,
                        fontStyle: 'italic',
                      }}
                    >
                      {property.price?.toLocaleString('fr-FR', { 
                        minimumFractionDigits: 0, 
                        maximumFractionDigits: 0 
                      })}
                    </p>
                    <p
                      className="text-xs text-[#8A9BB0]"
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                      }}
                    >
                      MAD
                    </p>
                  </div>

                  {/* See Details Button */}
                  <Link
                    href={`/properties/${property.id}`}
                    className="w-full bg-[#C8A96E] hover:bg-[#E2C98A] text-[#0D1F3C] py-2 rounded-lg font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 mt-4"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Voir les détails <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Properties Message */}
        {!loading && properties.length === 0 && (
          <div className="text-center mb-12">
            <p className="text-[#8A9BB0] text-lg">
              Aucune propriété disponible pour le moment.
            </p>
          </div>
        )}

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/properties"
            className="px-8 py-4 bg-gradient-to-r from-[#C8A96E] to-[#E2C98A] text-[#0D1F3C] font-bold rounded-xl hover:shadow-[0_20px_40px_rgba(200,169,110,0.3)] hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500,
            }}
          >
            Voir tous les biens <ArrowRight size={18} />
          </Link>

          <Link
            href="/contact"
            className="px-8 py-4 border-2 border-[#C8A96E] text-[#C8A96E] font-bold rounded-xl hover:bg-[#C8A96E] hover:text-[#0D1F3C] transition-all duration-300 inline-flex items-center justify-center gap-2"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500,
            }}
          >
            Nous Contacter <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}