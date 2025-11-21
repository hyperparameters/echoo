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
    (user?.email || user?.instagram_url || user?.description || user?.interests)
  );
};

// Helper function to determine if user has completed selfie step
export const hasSelfie = (user: UserProfile): boolean => {
  return Boolean(user?.selfie_cid || user?.selfie_url);
};

// Helper function to determine if user has completed details step
export const hasDetails = (user: UserProfile): boolean => {
  return Boolean(
    user?.full_name || 
    user?.instagram_url || 
    user?.description || 
    user?.interests
  );
};

// Helper function to determine if user is existing (has any profile data)
export const isExistingUser = (user: UserProfile): boolean => {
  return Boolean(
    user?.full_name || 
    user?.instagram_url || 
    user?.description || 
    user?.interests
  );
};

