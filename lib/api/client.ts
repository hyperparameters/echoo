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

export class ApiClient {
  private baseURL: string;
  private credentials: RequestCredentials;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || API_BASE_URL;
    this.credentials = config.credentials || 'include';
  }

  /**
   * Adds basic authentication to the request config if credentials are available in localStorage
   */
  private addBasicAuthToRequest(config: RequestInit): void {
    try {
      // Get credentials from localStorage (stored separately from user data)
      const credentialsData = localStorage.getItem('echooCredentials');
      if (credentialsData) {
        const credentials = JSON.parse(credentialsData);
        if (credentials.email && credentials.password) {
          const auth = btoa(`${credentials.email}:${credentials.password}`);
          config.headers = {
            ...config.headers,
            'Authorization': `Basic ${auth}`,
          };
          console.log('✅ Basic auth added to request for user:', credentials.email);
        } else {
          console.warn('⚠️ Credentials found but missing email or password');
        }
      } else {
        console.log('ℹ️ No credentials found in localStorage - request will be unauthenticated');
      }
    } catch (error) {
      console.warn('Failed to add basic auth to request:', error);
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

    // Add basic auth from localStorage if available
    this.addBasicAuthToRequest(config);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response.text() as unknown as T;
    } catch (error) {
      if (error instanceof ApiError) {
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

  // Basic auth login helper
  async loginWithBasicAuth<T>(
    endpoint: string,
    email: string,
    password: string
  ): Promise<T> {
    const auth = btoa(`${email}:${password}`);
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });
  }

  /**
   * Public method to manually add basic auth to any request
   * Useful for login/register endpoints that need explicit credentials
   */
  addBasicAuth(email: string, password: string): string {
    return btoa(`${email}:${password}`);
  }

  /**
   * Test method to verify that the interceptor is working
   * This will make a test request and log whether auth was added
   */
  async testAuthInterceptor(): Promise<void> {
    try {
      console.log('🧪 Testing auth interceptor...');
      await this.get('/api/v1/test-auth');
    } catch (error) {
      // Expected to fail since this endpoint probably doesn't exist
      console.log('🧪 Auth interceptor test completed (expected to fail)');
    }
  }
}

export const apiClient = new ApiClient();