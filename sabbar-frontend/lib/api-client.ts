/**
 * Client API avec gestion automatique du refresh token
 * Intercepte les requêtes pour ajouter le Authorization header
 * Intercepte les réponses 401 pour rafraîchir le token
 */

import { API_BASE_URL } from './config';

interface RequestInit extends globalThis.RequestInit {
  skipAuth?: boolean;
}

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private async getRefreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  private async setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      await this.setTokens(data.access_token, data.refresh_token);
      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      return false;
    }
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string; status: number }> {
    const url = `${this.baseUrl}${endpoint}`;
    const skipAuth = options.skipAuth;

    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Ajouter le token d'authentification
    if (!skipAuth) {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Si 401 Unauthorized, essayer de rafraîchir le token
    if (response.status === 401 && !skipAuth) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Réessayer avec le nouveau token
        const newAccessToken = await this.getAccessToken();
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      }
    }

    // Parser la réponse
    try {
      const data = await response.json();
      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? (data.detail || 'Unknown error') : undefined,
        status: response.status,
      };
    } catch {
      return {
        error: 'Failed to parse response',
        status: response.status,
      };
    }
  }

  async get<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T = any>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new APIClient(API_BASE_URL);