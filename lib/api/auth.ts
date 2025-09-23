// Authentication API functions

import { apiClient } from './client';
import type {
  UserLoginResponse,
  UserProfile,
  UserCreate,
  UserProfileUpdate,
  LoginCredentials,
} from './types';

// API Functions
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<UserLoginResponse> => {
    return apiClient.loginWithBasicAuth<UserLoginResponse>(
      '/api/v1/login',
      credentials.email,
      credentials.password
    );
  },

  register: async (userData: UserCreate): Promise<UserProfile> => {
    return apiClient.post<UserProfile>('/api/v1/register', userData);
  },

  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/api/v1/profile');
  },

  updateProfile: async (data: UserProfileUpdate): Promise<UserProfile> => {
    return apiClient.put<UserProfile>('/api/v1/profile', data);
  },
};


// Helper function to determine if onboarding is complete
export const isOnboardingComplete = (user: UserProfile): boolean => {
  return Boolean(
    user?.username &&
    user?.selfie_url &&
    (user?.email || user?.instagram_url || user?.description)
  );
};

