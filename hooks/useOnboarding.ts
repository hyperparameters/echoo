"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  localStorageHelpers,
  isOnboardingComplete,
  authApi,
  type UserProfile,
  OnboardingStep,
  type OnboardingState,
  type LocalUserData,
  type LoginCredentials
} from '@/lib/api';

export function useOnboarding() {
  const router = useRouter();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isLoggedIn: false,
    user: null,
    hasCompletedOnboarding: false,
    currentStep: OnboardingStep.LOGIN,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize onboarding state with auto-login check
  useEffect(() => {
    const initializeOnboarding = async () => {
      try {
        // Check if we have stored credentials
        const credentials = localStorageHelpers.getCredentials();
        const userData = localStorageHelpers.getUserData();

        if (credentials && credentials.email && credentials.password) {
          console.log('🔄 Found stored credentials, attempting auto-login...');

          try {
            // Attempt to login with stored credentials
            const loginResponse = await authApi.login(credentials);
            console.log('✅ Auto-login successful');

            // Update stored user data with fresh data from server
            localStorageHelpers.saveUserData(loginResponse, credentials);

            const user = loginResponse.user;
            const completedOnboarding = isOnboardingComplete(user);
            const nextStep = determinCurrentStep(user, completedOnboarding);

            setOnboardingState({
              isLoggedIn: true,
              user,
              hasCompletedOnboarding: completedOnboarding,
              currentStep: nextStep,
            });

            // Redirect based on onboarding completion
            if (completedOnboarding) {
              console.log('🏠 Redirecting to home - onboarding complete');
              router.push('/home');
            } else {
              console.log('📝 Redirecting to onboarding - profile incomplete');
              // Stay on current page to show onboarding step
            }
          } catch (loginError) {
            console.error('❌ Auto-login failed:', loginError);
            // Clear invalid credentials and redirect to login
            localStorageHelpers.clearUserData();
            setOnboardingState({
              isLoggedIn: false,
              user: null,
              hasCompletedOnboarding: false,
              currentStep: OnboardingStep.LOGIN,
            });
          }
        } else if (userData?.user) {
          // We have user data but no credentials - this shouldn't happen normally
          // but we'll handle it gracefully
          console.log('⚠️ Found user data but no credentials, clearing data');
          localStorageHelpers.clearUserData();
          setOnboardingState({
            isLoggedIn: false,
            user: null,
            hasCompletedOnboarding: false,
            currentStep: OnboardingStep.LOGIN,
          });
        } else {
          // No stored data, start with login
          console.log('ℹ️ No stored credentials found, starting with login');
          setOnboardingState({
            isLoggedIn: false,
            user: null,
            hasCompletedOnboarding: false,
            currentStep: OnboardingStep.LOGIN,
          });
        }
      } catch (error) {
        console.error('Failed to initialize onboarding:', error);
        // Clear corrupted data and start fresh
        localStorageHelpers.clearUserData();
        setOnboardingState({
          isLoggedIn: false,
          user: null,
          hasCompletedOnboarding: false,
          currentStep: OnboardingStep.LOGIN,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeOnboarding();
  }, [router]);

  // Determine the current step based on user data and completion status
  const determinCurrentStep = (user: UserProfile, hasCompleted: boolean): OnboardingStep => {
    if (hasCompleted) {
      return OnboardingStep.COMPLETE;
    }

    // Check what steps are missing
    if (!user.selfie_url) {
      return OnboardingStep.SELFIE;
    }

    // Check if basic profile info is missing
    if (!user.email && !user.instagram_url && !user.description) {
      return OnboardingStep.DETAILS;
    }

    // If we have basic info but onboarding isn't complete, show welcome
    return OnboardingStep.WELCOME;
  };

  // Handle successful login
  const handleLoginSuccess = (user: UserProfile) => {
    const completedOnboarding = isOnboardingComplete(user);
    const nextStep = determinCurrentStep(user, completedOnboarding);

    setOnboardingState({
      isLoggedIn: true,
      user,
      hasCompletedOnboarding: completedOnboarding,
      currentStep: nextStep,
    });

    // If onboarding is complete, redirect to home
    if (completedOnboarding) {
      console.log('🏠 Manual login successful - redirecting to home');
      router.push('/home');
    } else {
      console.log('📝 Manual login successful - staying on onboarding');
    }
  };

  // Handle selfie upload completion
  const handleSelfieCompleted = (updatedUser: UserProfile) => {
    const completedOnboarding = isOnboardingComplete(updatedUser);
    const nextStep = completedOnboarding ? OnboardingStep.WELCOME : OnboardingStep.DETAILS;

    setOnboardingState(prev => ({
      ...prev,
      user: updatedUser,
      hasCompletedOnboarding: completedOnboarding,
      currentStep: nextStep,
    }));
  };

  // Handle selfie skip
  const handleSelfieSkipped = () => {
    setOnboardingState(prev => ({
      ...prev,
      currentStep: OnboardingStep.DETAILS,
    }));
  };

  // Handle details completion
  const handleDetailsCompleted = (updatedUser: UserProfile) => {
    const completedOnboarding = isOnboardingComplete(updatedUser);

    setOnboardingState(prev => ({
      ...prev,
      user: updatedUser,
      hasCompletedOnboarding: completedOnboarding,
      currentStep: OnboardingStep.WELCOME,
    }));

    // Update localStorage with onboarding completion
    const userData = localStorageHelpers.getUserData();
    if (userData) {
      const updatedData: LocalUserData = {
        ...userData,
        user: updatedUser,
        onboardingCompleted: completedOnboarding,
      };
      localStorage.setItem('echooUser', JSON.stringify(updatedData));
    }
  };

  // Handle welcome screen completion
  const handleWelcomeCompleted = () => {
    setOnboardingState(prev => ({
      ...prev,
      currentStep: OnboardingStep.COMPLETE,
      hasCompletedOnboarding: true,
    }));

    // Update localStorage
    const userData = localStorageHelpers.getUserData();
    if (userData) {
      const updatedData: LocalUserData = {
        ...userData,
        onboardingCompleted: true,
      };
      localStorage.setItem('echooUser', JSON.stringify(updatedData));
    }

    // Navigate to home
    router.push('/home');
  };

  // Reset onboarding (for logout)
  const resetOnboarding = () => {
    localStorageHelpers.clearUserData();
    setOnboardingState({
      isLoggedIn: false,
      user: null,
      hasCompletedOnboarding: false,
      currentStep: OnboardingStep.LOGIN,
    });
    router.push('/');
  };

  // Skip current step (if applicable)
  const skipCurrentStep = () => {
    const { currentStep } = onboardingState;

    switch (currentStep) {
      case OnboardingStep.SELFIE:
        handleSelfieSkipped();
        break;
      case OnboardingStep.DETAILS:
        // Skip to welcome if we have minimum info
        if (onboardingState.user) {
          setOnboardingState(prev => ({
            ...prev,
            currentStep: OnboardingStep.WELCOME,
          }));
        }
        break;
      case OnboardingStep.WELCOME:
        handleWelcomeCompleted();
        break;
    }
  };

  // Go to next step manually
  const goToNextStep = () => {
    const { currentStep, user } = onboardingState;

    if (!user) return;

    switch (currentStep) {
      case OnboardingStep.LOGIN:
        setOnboardingState(prev => ({
          ...prev,
          currentStep: OnboardingStep.SELFIE,
        }));
        break;
      case OnboardingStep.SELFIE:
        setOnboardingState(prev => ({
          ...prev,
          currentStep: OnboardingStep.DETAILS,
        }));
        break;
      case OnboardingStep.DETAILS:
        setOnboardingState(prev => ({
          ...prev,
          currentStep: OnboardingStep.WELCOME,
        }));
        break;
      case OnboardingStep.WELCOME:
        handleWelcomeCompleted();
        break;
    }
  };

  return {
    ...onboardingState,
    isLoading,
    handleLoginSuccess,
    handleSelfieCompleted,
    handleSelfieSkipped,
    handleDetailsCompleted,
    handleWelcomeCompleted,
    resetOnboarding,
    skipCurrentStep,
    goToNextStep,
  };
}