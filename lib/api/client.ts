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

// Type for auth store to avoid circular dependencies
interface AuthStore {
  credentials: { email: string; password: string } | null;
  logout: () => void;
  clearError: () => void;
}

export class ApiClient {
  private baseURL: string;
  private credentials: RequestCredentials;
  private authStore: AuthStore | null = null;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || API_BASE_URL;
    this.credentials = config.credentials || 'include';
  }

  /**
   * Initialize the auth store reference for automatic auth handling
   */
  setAuthStore(authStore: AuthStore) {
    this.authStore = authStore;
    console.log('🔗 API Client connected to Zustand auth store');
  }

  /**
   * Adds basic authentication to the request config using Zustand auth store
   */
  private addBasicAuthToRequest(config: RequestInit): void {
    try {
      // Get credentials from Zustand store (preferred) or fallback to localStorage
      let credentials = this.authStore?.credentials || null;

      // Fallback to localStorage for backward compatibility
      if (!credentials) {
        const credentialsData = localStorage.getItem('echooCredentials');
        if (credentialsData) {
          credentials = JSON.parse(credentialsData);
        }
      }

      if (credentials?.email && credentials?.password) {
        const auth = btoa(`${credentials.email}:${credentials.password}`);
        config.headers = {
          ...config.headers,
          'Authorization': `Basic ${auth}`,
        };
        console.log('✅ Basic auth added to request for user:', credentials.email);
      } else {
        console.log('ℹ️ No credentials found - request will be unauthenticated');
      }
    } catch (error) {
      console.warn('⚠️ Failed to add basic auth to request:', error);
    }
  }

  /**
   * Handles unauthorized responses by logging out and redirecting to login
   */
  private handleUnauthorizedResponse(status: number, endpoint: string): void {
    if (status === 401 || status === 403) {
      console.warn(`🚨 Unauthorized access (${status}) on ${endpoint} - logging out user`);

      if (this.authStore) {
        // Clear auth state through Zustand store
        this.authStore.logout();
      } else {
        // Fallback: clear localStorage directly
        localStorage.removeItem('echooUser');
        localStorage.removeItem('echooCredentials');
        console.warn('⚠️ Auth store not available, cleared localStorage directly');
      }

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

    // Add basic auth from Zustand store if available
    this.addBasicAuthToRequest(config);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle unauthorized responses automatically
        this.handleUnauthorizedResponse(response.status, endpoint);

        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;

        // Clear any previous errors in auth store
        if (this.authStore && (response.status === 401 || response.status === 403)) {
          this.authStore.clearError();
        }

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
   * Test method to verify auth integration and unauthorized handling
   */
  async testAuthIntegration(): Promise<void> {
    console.log('🧪 Testing auth integration...');
    console.log('  - Auth store connected:', this.authStore !== null);
    console.log('  - Credentials available:', !!this.authStore?.credentials);

    if (this.authStore?.credentials) {
      console.log('  - User authenticated as:', this.authStore.credentials.email);
    }

    try {
      // Test with a protected endpoint (will show auth behavior)
      await this.get('/api/v1/profile');
      console.log('✅ Auth integration test passed');
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        console.log('✅ Auth integration test passed - unauthorized handling triggered');
      } else {
        console.log('⚠️ Auth integration test completed with error:', error);
      }
    }
  }
}

export const apiClient = new ApiClient();