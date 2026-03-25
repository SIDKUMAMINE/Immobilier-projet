/**
 * Composant formulaire propriété avec upload
 * Fichier: components/PropertyFormUpload.tsx
 *
 * Inclut:
 * - Formulaire de création de propriété
 * - Upload d'images (multiple)
 * - Upload de vidéo
 * - Aperçu des images
 */

'use client';

import { useState } from 'react';
import { uploadPropertyImages, uploadPropertyVideo } from '@/lib/uploadService';

interface FormData {
  title: string;
  description: string;
  price: number;
  city: string;
  district: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  transaction_type: string;
  property_type: string;
}

export default function PropertyFormUpload() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: 0,
    city: '',
    district: '',
    address: '',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    transaction_type: 'sale',
    property_type: 'apartment'
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [propertyId, setPropertyId] = useState<string>('');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur creation propriete');
      }

      const property = await response.json();
      setPropertyId(property.id);
      setMessage({ type: 'success', text: 'Propriete creee. Upload des images...' });

      if (selectedImages.length > 0) {
        console.log(`Upload ${selectedImages.length} image(s)...`);
        const imageResult = await uploadPropertyImages(property.id, selectedImages);
        
        if (imageResult.status === 'success') {
          setMessage({ type: 'success', text: `${imageResult.count} image(s) uploadee(s)` });
        } else {
          setMessage({ type: 'error', text: `Erreur upload images: ${imageResult.message}` });
        }
      }

      if (selectedVideo) {
        console.log(`Upload video...`);
        const videoResult = await uploadPropertyVideo(property.id, selectedVideo, (progress) => {
          setUploadProgress(progress.percentage);
        });

        if (videoResult.status === 'success') {
          setMessage({ type: 'success', text: 'Propriete, images et video uploadees avec succes' });
        } else {
          setMessage({ type: 'error', text: `Erreur upload video: ${videoResult.message}` });
        }
      } else {
        setMessage({ type: 'success', text: 'Propriete et images uploadees avec succes' });
      }

      setFormData({
        title: '',
        description: '',
        price: 0,
        city: '',
        district: '',
        address: '',
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        transaction_type: 'sale',
        property_type: 'apartment'
      });
      setSelectedImages([]);
      setSelectedVideo(null);
      setImagePreviews([]);
      setVideoPreview('');

    } catch (error) {
      setMessage({
        type: 'error',
        text: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-dark-card rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-6">Nouvelle Propriete</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleCreateProperty} className="space-y-6">
        
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Informations generales</h2>
          
          <input
            type="text"
            name="title"
            placeholder="Titre de l'annonce"
            value={formData.title}
            onChange={handleFormChange}
            required
            className="w-full p-3 bg-gray-700 text-white rounded mb-3"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleFormChange}
            rows={4}
            className="w-full p-3 bg-gray-700 text-white rounded mb-3"
          />

          <input
            type="number"
            name="price"
            placeholder="Prix (MAD)"
            value={formData.price}
            onChange={handleFormChange}
            required
            className="w-full p-3 bg-gray-700 text-white rounded mb-3"
          />

          <select
            name="transaction_type"
            value={formData.transaction_type}
            onChange={handleFormChange}
            className="w-full p-3 bg-gray-700 text-white rounded mb-3"
          >
            <option value="sale">Vente</option>
            <option value="rent">Location</option>
            <option value="vacation_rental">Meuble</option>
          </select>

          <select
            name="property_type"
            value={formData.property_type}
            onChange={handleFormChange}
            className="w-full p-3 bg-gray-700 text-white rounded"
          >
            <option value="apartment">Appartement</option>
            <option value="house">Maison</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="land">Terrain</option>
          </select>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Localisation</h2>
          
          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={formData.city}
            onChange={handleFormChange}
            required
            className="w-full p-3 bg-gray-700 text-white rounded mb-3"
          />

          <input
            type="text"
            name="district"
            placeholder="Quartier"
            value={formData.district}
            onChange={handleFormChange}
            className="w-full p-3 bg-gray-700 text-white rounded mb-3"
          />

          <input
            type="text"
            name="address"
            placeholder="Adresse complete"
            value={formData.address}
            onChange={handleFormChange}
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Details</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="bedrooms"
              placeholder="Chambres"
              value={formData.bedrooms}
              onChange={handleFormChange}
              className="p-3 bg-gray-700 text-white rounded"
            />

            <input
              type="number"
              name="bathrooms"
              placeholder="Salles de bain"
              value={formData.bathrooms}
              onChange={handleFormChange}
              className="p-3 bg-gray-700 text-white rounded"
            />

            <input
              type="number"
              name="area"
              placeholder="Surface (m2)"
              value={formData.area}
              onChange={handleFormChange}
              className="p-3 bg-gray-700 text-white rounded col-span-2"
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Images</h2>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesSelect}
            className="w-full p-3 bg-gray-700 text-white rounded mb-4"
          />

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Apercu ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImages(prev => prev.filter((_, i) => i !== index));
                      setImagePreviews(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-gray-400 text-sm mt-2">
            {selectedImages.length > 0 
              ? `${selectedImages.length} image(s) selectionnee(s)`
              : 'Aucune image selectionnee'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Video</h2>
          
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className="w-full p-3 bg-gray-700 text-white rounded mb-4"
          />

          {videoPreview && (
            <div className="relative mb-4">
              <video
                src={videoPreview}
                controls
                className="w-full h-48 rounded bg-black"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedVideo(null);
                  setVideoPreview('');
                }}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded"
              >
                X
              </button>
            </div>
          )}

          <p className="text-gray-400 text-sm">
            {selectedVideo 
              ? `Video selectionnee: ${selectedVideo.name}`
              : 'Aucune video selectionnee (optionnel)'}
          </p>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-gray-400 text-sm mt-1">Upload: {uploadProgress}%</p>
            </div>
          )}
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
        >
          {loading ? 'Creation en cours...' : 'Creer la propriete'}
        </button>
      </form>
    </div>
  );
}