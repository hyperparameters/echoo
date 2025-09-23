// Authentication API functions and React Query hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  UserLoginResponse,
  UserProfile,
  UserCreate,
  UserProfileUpdate,
  LoginCredentials,
  LocalUserData,
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

// Local Storage Helpers
export const localStorageHelpers = {
  saveUserData: (loginResponse: UserLoginResponse, credentials: LoginCredentials) => {
    const userData: LocalUserData = {
      user: loginResponse.user,
      onboardingCompleted: isOnboardingComplete(loginResponse.user),
      lastLogin: new Date().toISOString(),
    };

    // Store user data
    localStorage.setItem('echooUser', JSON.stringify(userData));

    // Store credentials for API calls (in production, use secure token-based auth)
    localStorage.setItem('echooCredentials', JSON.stringify(credentials));
  },

  getUserData: (): LocalUserData | null => {
    try {
      const data = localStorage.getItem('echooUser');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getCredentials: (): LoginCredentials | null => {
    try {
      const data = localStorage.getItem('echooCredentials');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearUserData: () => {
    localStorage.removeItem('echooUser');
    localStorage.removeItem('echooCredentials');
  },

  updateUserData: (user: UserProfile) => {
    const existingData = localStorageHelpers.getUserData();
    if (existingData) {
      const updatedData: LocalUserData = {
        ...existingData,
        user,
        onboardingCompleted: isOnboardingComplete(user),
      };
      localStorage.setItem('echooUser', JSON.stringify(updatedData));
    }
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

// React Query Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data, variables) => {
      // Save to local storage
      localStorageHelpers.saveUserData(data, variables);

      // Update query cache
      queryClient.setQueryData(['user', 'profile'], data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Login failed:', error);
      localStorageHelpers.clearUserData();
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['user', 'profile'], data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: authApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      // Update query cache
      queryClient.setQueryData(['user', 'profile'], data);

      // Update local storage
      localStorageHelpers.updateUserData(data);

      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      localStorageHelpers.clearUserData();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/';
    },
  });
};