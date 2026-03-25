/**
 * Service d'upload d'images et videos
 * Fichier: lib/uploadService.ts
 *
 * Gere:
 * - Upload d'images multiples
 * - Upload de video
 * - Affichage de la progression
 * - Gestion des erreurs
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResponse {
  status: 'success' | 'error';
  message: string;
  property_id?: string;
  count?: number;
  urls?: string[];
  video_url?: string;
}

/**
 * Upload des images pour une propriete
 * @param propertyId - ID de la propriete
 * @param files - Liste des fichiers image
 * @param onProgress - Callback de progression
 */
export async function uploadPropertyImages(
  propertyId: string,
  files: File[],
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> {
  try {
    if (!propertyId) {
      throw new Error('Property ID manquant');
    }

    if (!files || files.length === 0) {
      throw new Error('Aucun fichier selectione');
    }

    console.log(`Upload ${files.length} image(s) pour propriete: ${propertyId}`);

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
      throw new Error(error.detail || `Upload echoue: ${response.status}`);
    }

    const data: UploadResponse = await response.json();

    console.log(`Images uploadees:`, data);
    return data;

  } catch (error) {
    console.error(`Erreur upload images:`, error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Erreur upload'
    };
  }
}

/**
 * Upload d'une video pour une propriete
 * @param propertyId - ID de la propriete
 * @param file - Fichier video
 * @param onProgress - Callback de progression
 */
export async function uploadPropertyVideo(
  propertyId: string,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> {
  try {
    if (!propertyId) {
      throw new Error('Property ID manquant');
    }

    if (!file) {
      throw new Error('Aucun fichier selectione');
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`Fichier trop volumineux (max 100 MB, vous avez ${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    }

    console.log(`Upload video pour propriete: ${propertyId}`);
    console.log(`   Fichier: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          onProgress?.(progress);
          console.log(`   Progression: ${progress.percentage}%`);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          const data: UploadResponse = JSON.parse(xhr.responseText);
          console.log(`Video uploadee:`, data);
          resolve(data);
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.detail || 'Erreur upload'));
          } catch {
            reject(new Error(`Erreur HTTP ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Erreur reseau'));
      });

      xhr.open(
        'POST',
        `${API_BASE_URL}/api/v1/properties/${propertyId}/video`
      );

      xhr.send(formData);
    });

  } catch (error) {
    console.error(`Erreur upload video:`, error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Erreur upload'
    };
  }
}

/**
 * Supprimer une image
 */
export async function deletePropertyImage(
  propertyId: string,
  imageIndex: number
): Promise<UploadResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/properties/${propertyId}/images/${imageIndex}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error(`Erreur suppression: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erreur suppression image:`, error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Erreur suppression'
    };
  }
}

/**
 * Supprimer la video
 */
export async function deletePropertyVideo(
  propertyId: string
): Promise<UploadResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/properties/${propertyId}/video`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error(`Erreur suppression: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erreur suppression video:`, error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Erreur suppression'
    };
  }
}