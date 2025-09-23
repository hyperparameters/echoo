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
    const userData = localStorage.getItem('echooUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.credentials) {
          const auth = btoa(`${user.credentials.email}:${user.credentials.password}`);
          config.headers = {
            ...config.headers,
            'Authorization': `Basic ${auth}`,
          };
        }
      } catch (error) {
        console.warn('Failed to parse user data from localStorage:', error);
      }
    }

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
}

export const apiClient = new ApiClient();