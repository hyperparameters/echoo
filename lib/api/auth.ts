// Authentication API functions

import { apiClient } from './client';
import type {
  UserLoginResponse,
  UserProfile,
  UserProfileUpdate,
} from './types';

// API Functions
export const authApi = {
  /**
   * Authenticate with Privy token (auto login/register)
   * Token is automatically sent via Bearer header by the API client
   */
  privyAuth: async (): Promise<UserLoginResponse> => {
    return apiClient.post<UserLoginResponse>('/api/v1/auth/privy', {});
  },

  /**
   * Get current user's profile
   */
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/api/v1/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UserProfileUpdate): Promise<UserProfile> => {
    return apiClient.put<UserProfile>('/api/v1/profile', data);
  },
};

// Helper function to determine if onboarding is complete
export const isOnboardingComplete = (user: UserProfile): boolean => {
  return Boolean(
    user?.username &&
    user?.selfie_url &&
    (user?.email || user?.instagram_url || user?.description || user?.interests)
  );
};

