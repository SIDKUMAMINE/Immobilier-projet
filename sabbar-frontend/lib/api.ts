const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export class ApiCallError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'ApiCallError';
  }
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {}
      throw new ApiCallError(`HTTP_${response.status}`, errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiCallError) throw error;
    throw new ApiCallError('NETWORK_ERROR', String(error));
  }
}

export const propertiesApi = {
  // ✅ Récupérer toutes les propriétés
  async getProperties(filters?: { city?: string; transaction_type?: string; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.transaction_type) params.append('transaction_type', filters.transaction_type);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));

    return apiCall(`/api/v1/properties?${params}`);
  },

  // ✅ Récupérer une propriété
  async getProperty(id: string) {
    return apiCall(`/api/v1/properties/${id}`);
  },

  // ✅ Créer une propriété
  async createProperty(data: any) {
    return apiCall('/api/v1/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ✅ Mettre à jour une propriété
  async updateProperty(id: string, data: any) {
    return apiCall(`/api/v1/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // ✅ Supprimer une propriété
  async deleteProperty(id: string) {
    return apiCall(`/api/v1/properties/${id}`, {
      method: 'DELETE',
    });
  },

  // Upload d'images
  async uploadImages(propertyId: string, files: File[]): Promise<any> {
    if (!propertyId || !files || files.length === 0) {
      throw new ApiCallError('INVALID_INPUT', 'Property ID et fichiers sont requis');
    }

    console.log(`📸 Upload ${files.length} image(s) pour propriété: ${propertyId}`);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(
        `${API_BASE_URL}/api/v1/properties/${propertyId}/images`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: `Erreur HTTP ${response.status}`
        }));
        throw new ApiCallError(`HTTP_${response.status}`, error.detail);
      }

      const result = await response.json();
      console.log(`✅ ${files.length} image(s) uploadée(s):`, result);
      return result;

    } catch (error) {
      if (error instanceof ApiCallError) throw error;
      const message = error instanceof Error ? error.message : 'Erreur upload';
      console.error(`❌ Erreur upload images:`, message);
      throw new ApiCallError('UPLOAD_ERROR', message);
    }
  },

  // Upload de vidéo
  async uploadVideo(propertyId: string, file: File): Promise<any> {
    if (!propertyId || !file) {
      throw new ApiCallError('INVALID_INPUT', 'Property ID et fichier sont requis');
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new ApiCallError(
        'FILE_TOO_LARGE',
        `Fichier trop volumineux (max 100 MB, vous avez ${(file.size / 1024 / 1024).toFixed(2)} MB)`
      );
    }

    console.log(`🎥 Upload vidéo pour propriété: ${propertyId}`);
    console.log(`   Fichier: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/properties/${propertyId}/video`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: `Erreur HTTP ${response.status}`
        }));
        throw new ApiCallError(`HTTP_${response.status}`, error.detail);
      }

      const result = await response.json();
      console.log(`✅ Vidéo uploadée:`, result);
      return result;

    } catch (error) {
      if (error instanceof ApiCallError) throw error;
      const message = error instanceof Error ? error.message : 'Erreur upload';
      console.error(`❌ Erreur upload vidéo:`, message);
      throw new ApiCallError('UPLOAD_ERROR', message);
    }
  },

  // Supprimer une image
  async deleteImage(propertyId: string, imageIndex: number) {
    console.log(`🗑️ Suppression image ${imageIndex} pour propriété: ${propertyId}`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/properties/${propertyId}/images/${imageIndex}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new ApiCallError('DELETE_ERROR', `Erreur suppression: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Image supprimée:`, result);
      return result;

    } catch (error) {
      if (error instanceof ApiCallError) throw error;
      const message = error instanceof Error ? error.message : 'Erreur suppression';
      throw new ApiCallError('DELETE_ERROR', message);
    }
  },

  // Supprimer la vidéo
  async deleteVideo(propertyId: string) {
    console.log(`🎬 Suppression vidéo pour propriété: ${propertyId}`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/properties/${propertyId}/video`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new ApiCallError('DELETE_ERROR', `Erreur suppression: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Vidéo supprimée:`, result);
      return result;

    } catch (error) {
      if (error instanceof ApiCallError) throw error;
      const message = error instanceof Error ? error.message : 'Erreur suppression';
      throw new ApiCallError('DELETE_ERROR', message);
    }
  },
};