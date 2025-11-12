// API Client configuration and base functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClientConfig {
  baseURL?: string;
  credentials?: RequestCredentials;
}

// Function to get Privy access token
// This will be set by the PrivyProvider wrapper
let getAccessTokenFn: (() => Promise<string | null>) | null = null;

export function setPrivyAccessTokenGetter(fn: () => Promise<string | null>) {
  getAccessTokenFn = fn;
  console.log('🔗 API Client connected to Privy authentication');
}

export class ApiClient {
  private baseURL: string;
  private credentials: RequestCredentials;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || API_BASE_URL;
    this.credentials = config.credentials || 'include';
  }

  /**
   * Adds Privy Bearer token authentication to the request
   */
  private async addPrivyAuthToRequest(config: RequestInit): Promise<void> {
    try {
      if (!getAccessTokenFn) {
        console.log('ℹ️ Privy access token getter not initialized - request will be unauthenticated');
        return;
      }

      const token = await getAccessTokenFn();
      
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
        console.log('✅ Privy Bearer token added to request');
      } else {
        console.log('ℹ️ No Privy access token available - request will be unauthenticated');
      }
    } catch (error) {
      console.warn('⚠️ Failed to add Privy auth to request:', error);
    }
  }

  /**
   * Handles unauthorized responses by redirecting to login
   */
  private handleUnauthorizedResponse(status: number, endpoint: string): void {
    if (status === 401 || status === 403) {
      console.warn(`🚨 Unauthorized access (${status}) on ${endpoint}`);

      // Redirect to login page (only in browser environment)
      if (typeof window !== 'undefined') {
        console.log('🔄 Redirecting to login page...');
        window.location.href = '/';
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      credentials: this.credentials,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add Privy Bearer token authentication
    await this.addPrivyAuthToRequest(config);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle unauthorized responses automatically
        this.handleUnauthorizedResponse(response.status, endpoint);

        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`;

        throw new ApiError(errorMessage, response.status, errorData);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response.text() as unknown as T;
    } catch (error) {
      if (error instanceof ApiError) {
        // Handle unauthorized errors that might not come from HTTP status
        if (error.status === 401 || error.status === 403) {
          this.handleUnauthorizedResponse(error.status, endpoint);
        }
        throw error;
      }
      throw new ApiError('Network error or server unavailable', 0, error);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();