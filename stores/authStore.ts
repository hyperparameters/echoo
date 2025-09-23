import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi, isOnboardingComplete } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import type {
  UserProfile,
  LoginCredentials,
  UserCreate,
  UserProfileUpdate,
} from '@/lib/api/types';
import { OnboardingStep } from '@/lib/api/types';

// Enhanced auth state interface
interface AuthState {
  // User & Auth State
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  // Onboarding State
  currentStep: OnboardingStep;
  hasCompletedOnboarding: boolean;

  // Credentials (for auto-login)
  credentials: LoginCredentials | null;

  // Metadata
  lastLogin: string | null;
  error: string | null;
}

interface AuthActions {
  // Auth Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: UserCreate) => Promise<void>;

  // Profile Actions
  updateProfile: (data: UserProfileUpdate) => Promise<void>;
  refreshProfile: () => Promise<void>;

  // Onboarding Actions
  setCurrentStep: (step: OnboardingStep) => void;
  completeOnboardingStep: (step: OnboardingStep, userData?: UserProfile) => void;
  skipCurrentStep: () => void;
  goToNextStep: () => void;

  // Utility Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Initialize auth state (for app startup)
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

// Helper function to determine current step based on user data
const determineCurrentStep = (user: UserProfile | null, hasCompleted: boolean): OnboardingStep => {
  if (!user) return OnboardingStep.LOGIN;
  if (hasCompleted) return OnboardingStep.COMPLETE;

  // Check what steps are missing
  if (!user.selfie_url) return OnboardingStep.SELFIE;
  if (!user.email && !user.instagram_url && !user.description) return OnboardingStep.DETAILS;

  return OnboardingStep.WELCOME;
};

// Helper function to get next step
const getNextStep = (currentStep: OnboardingStep): OnboardingStep => {
  switch (currentStep) {
    case OnboardingStep.LOGIN:
      return OnboardingStep.SELFIE;
    case OnboardingStep.SELFIE:
      return OnboardingStep.DETAILS;
    case OnboardingStep.DETAILS:
      return OnboardingStep.WELCOME;
    case OnboardingStep.WELCOME:
      return OnboardingStep.COMPLETE;
    default:
      return OnboardingStep.COMPLETE;
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isLoggedIn: false,
      isLoading: false,
      currentStep: OnboardingStep.LOGIN,
      hasCompletedOnboarding: false,
      credentials: null,
      lastLogin: null,
      error: null,

      // Auth Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login(credentials);
          const user = response.user;
          const hasCompleted = isOnboardingComplete(user);
          const currentStep = determineCurrentStep(user, hasCompleted);

          set({
            user,
            isLoggedIn: true,
            credentials,
            hasCompletedOnboarding: hasCompleted,
            currentStep,
            lastLogin: new Date().toISOString(),
            isLoading: false,
            error: null,
          });

          console.log('✅ Login successful', { hasCompleted, currentStep });
        } catch (error: any) {
          console.error('❌ Login failed:', error);
          set({
            isLoading: false,
            error: error.message || 'Login failed',
            credentials: null,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          credentials: null,
          hasCompletedOnboarding: false,
          currentStep: OnboardingStep.LOGIN,
          lastLogin: null,
          error: null,
        });

        // Clear React Query cache if available
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },

      register: async (userData: UserCreate) => {
        set({ isLoading: true, error: null });

        try {
          const user = await authApi.register(userData);
          const hasCompleted = isOnboardingComplete(user);
          const currentStep = determineCurrentStep(user, hasCompleted);

          set({
            user,
            isLoggedIn: true,
            hasCompletedOnboarding: hasCompleted,
            currentStep,
            lastLogin: new Date().toISOString(),
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('❌ Registration failed:', error);
          set({
            isLoading: false,
            error: error.message || 'Registration failed',
          });
          throw error;
        }
      },

      // Profile Actions
      updateProfile: async (data: UserProfileUpdate) => {
        const { user } = get();
        if (!user) throw new Error('No user logged in');

        set({ isLoading: true, error: null });

        try {
          const updatedUser = await authApi.updateProfile(data);
          const hasCompleted = isOnboardingComplete(updatedUser);
          const currentStep = determineCurrentStep(updatedUser, hasCompleted);

          set({
            user: updatedUser,
            hasCompletedOnboarding: hasCompleted,
            currentStep,
            isLoading: false,
            error: null,
          });

          console.log('✅ Profile updated successfully');
          return updatedUser;
        } catch (error: any) {
          console.error('❌ Profile update failed:', error);
          set({
            isLoading: false,
            error: error.message || 'Profile update failed',
          });
          throw error;
        }
      },

      refreshProfile: async () => {
        const { credentials } = get();
        if (!credentials) return;

        try {
          const user = await authApi.getProfile();
          const hasCompleted = isOnboardingComplete(user);
          const currentStep = determineCurrentStep(user, hasCompleted);

          set({
            user,
            hasCompletedOnboarding: hasCompleted,
            currentStep,
          });
        } catch (error) {
          console.error('❌ Failed to refresh profile:', error);
          // Don't throw here as this is often called in background
        }
      },

      // Onboarding Actions
      setCurrentStep: (step: OnboardingStep) => {
        set({ currentStep: step });
      },

      completeOnboardingStep: (step: OnboardingStep, userData?: UserProfile) => {
        const state = get();
        const user = userData || state.user;

        if (!user) return;

        const hasCompleted = isOnboardingComplete(user);
        let nextStep = getNextStep(step);

        // If we have completed onboarding requirements, go to welcome or complete
        if (hasCompleted && step !== OnboardingStep.WELCOME) {
          nextStep = OnboardingStep.WELCOME;
        }

        set({
          user,
          currentStep: nextStep,
          hasCompletedOnboarding: hasCompleted,
        });

        console.log('✅ Completed step:', step, '→ Next step:', nextStep);
      },

      skipCurrentStep: () => {
        const { currentStep } = get();
        const nextStep = getNextStep(currentStep);

        set({ currentStep: nextStep });
        console.log('⏭️ Skipped step:', currentStep, '→ Next step:', nextStep);
      },

      goToNextStep: () => {
        const { currentStep } = get();
        const nextStep = getNextStep(currentStep);

        set({ currentStep: nextStep });
        console.log('▶️ Advanced to next step:', nextStep);
      },

      // Utility Actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Initialize auth state (for app startup)
      initialize: async () => {
        const { credentials } = get();

        if (credentials?.email && credentials?.password) {
          console.log('🔄 Found stored credentials, attempting auto-login...');

          try {
            await get().login(credentials);
          } catch (error) {
            console.error('❌ Auto-login failed, clearing credentials');
            set({
              credentials: null,
              user: null,
              isLoggedIn: false,
              currentStep: OnboardingStep.LOGIN,
            });
          }
        } else {
          console.log('ℹ️ No stored credentials found');
          set({ currentStep: OnboardingStep.LOGIN });
        }
      },
    }),
    {
      name: 'echoo-auth-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data
      partialize: (state) => ({
        user: state.user,
        credentials: state.credentials,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        lastLogin: state.lastLogin,
      }),
      // Merge function to handle version changes
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        // Always start with loading false and no error on rehydration
        isLoading: false,
        error: null,
        // Determine current step from persisted data
        currentStep: persistedState?.user
          ? determineCurrentStep(persistedState.user, persistedState.hasCompletedOnboarding)
          : OnboardingStep.LOGIN,
        isLoggedIn: Boolean(persistedState?.user && persistedState?.credentials),
      }),
    }
  )
);

// Selector hooks for common use cases
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isLoggedIn: store.isLoggedIn,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    register: store.register,
    clearError: store.clearError,
  };
};

export const useOnboarding = () => {
  const store = useAuthStore();
  return {
    currentStep: store.currentStep,
    hasCompletedOnboarding: store.hasCompletedOnboarding,
    user: store.user,
    isLoggedIn: store.isLoggedIn,
    isLoading: store.isLoading,
    setCurrentStep: store.setCurrentStep,
    completeOnboardingStep: store.completeOnboardingStep,
    skipCurrentStep: store.skipCurrentStep,
    goToNextStep: store.goToNextStep,
    updateProfile: store.updateProfile,
  };
};

export const useProfile = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    updateProfile: store.updateProfile,
    refreshProfile: store.refreshProfile,
    isLoading: store.isLoading,
    error: store.error,
  };
};

// Initialize API client with auth store connection
// This runs when the module is first imported
if (typeof window !== 'undefined') {
  // Connect API client to auth store for automatic auth handling
  const connectApiClient = () => {
    const authStore = useAuthStore.getState();

    // Create a simplified auth store interface for the API client
    const authStoreInterface = {
      get credentials() {
        return useAuthStore.getState().credentials;
      },
      logout: () => {
        useAuthStore.getState().logout();
      },
      clearError: () => {
        useAuthStore.getState().clearError();
      }
    };

    apiClient.setAuthStore(authStoreInterface);
    console.log('🔗 API Client connected to Zustand auth store on initialization');
  };

  // Connect immediately
  connectApiClient();

  // Also reconnect when the store rehydrates (after page refresh)
  useAuthStore.persist.onFinishHydration(() => {
    connectApiClient();
    console.log('🔄 API Client reconnected after store hydration');
  });
}