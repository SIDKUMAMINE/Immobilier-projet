import { Phone, Mail, MessageCircle } from 'lucide-react';

interface ContactOptionsProps {
  onShowProperties: () => void;
}

export default function ContactOptions({ onShowProperties }: ContactOptionsProps) {
  const handleWhatsApp = () => {
    // Remplace par ton vrai numéro WhatsApp
    const phoneNumber = '212600000000'; // Format international sans +
    const message = encodeURIComponent("Bonjour Mohammed, je voudrais discuter de mon projet immobilier.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+212687935436'; // Remplace par ton numéro
  };

  const handleEmail = () => {
    window.location.href = 'mailto:rakehimohammedamine@gmail.com?subject=Demande d\'information'; // Remplace par ton email
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-200">
      <p className="text-sm font-semibold text-gray-800 mb-3">
        💡 Prochaines étapes :
      </p>
      
      {/* Bouton voir les annonces */}
      <button
        onClick={onShowProperties}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <span>📋</span>
        Voir les annonces correspondantes
      </button>

      <div className="text-xs text-center text-gray-500 my-2">ou</div>

      {/* Bouton WhatsApp */}
      <button
        onClick={handleWhatsApp}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
      >
        <MessageCircle size={18} />
        Contacter via WhatsApp
      </button>

      {/* Bouton Téléphone */}
      <button
        onClick={handleCall}
        className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
      >
        <Phone size={18} />
        Appeler Mohammed Sabbar
      </button>

      {/* Bouton Email */}
      <button
        onClick={handleEmail}
        className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
      >
        <Mail size={18} />
        Envoyer un email
      </button>
    </div>
  );
}