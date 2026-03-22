interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  type: string;
  bedrooms: number;
  surface: number;
  images: string[];
}

interface PropertySuggestionsProps {
  properties: Property[];
}

export default function PropertySuggestions({ properties }: PropertySuggestionsProps) {
  if (properties.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-sm text-gray-700">
          😔 Aucune annonce ne correspond exactement à vos critères pour le moment. 
          Contactez-moi directement pour que je trouve la perle rare !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-800">
        🏠 Annonces correspondantes ({properties.length}) :
      </p>
      
      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => window.open(`/properties/${property.id}`, '_blank')}
        >
          {/* Image */}
          {property.images && property.images.length > 0 && (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-32 object-cover"
            />
          )}
          
          {/* Infos */}
          <div className="p-3">
            <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
              {property.title}
            </h4>
            
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>📍 {property.city}</span>
              <span>{property.type}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>🛏️ {property.bedrooms} chambres</span>
              <span>📐 {property.surface} m²</span>
            </div>
            
            <div className="text-blue-600 font-bold text-lg">
              {property.price.toLocaleString()} MAD
            </div>
          </div>
        </div>
      ))}
      
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
        Voir toutes les annonces →
      </button>
    </div>
  );
}