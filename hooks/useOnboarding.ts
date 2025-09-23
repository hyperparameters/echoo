"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  localStorageHelpers,
  isOnboardingComplete,
  type UserProfile,
  type OnboardingStep,
  type OnboardingState,
  type LocalUserData
} from '@/lib/api';

export function useOnboarding() {
  const router = useRouter();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isLoggedIn: false,
    user: null,
    hasCompletedOnboarding: false,
    currentStep: 'login' as OnboardingStep,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize onboarding state from localStorage
  useEffect(() => {
    const initializeOnboarding = () => {
      try {
        const userData = localStorageHelpers.getUserData();

        if (userData?.user) {
          const user = userData.user;
          const completedOnboarding = isOnboardingComplete(user);

          setOnboardingState({
            isLoggedIn: true,
            user,
            hasCompletedOnboarding: completedOnboarding,
            currentStep: determinCurrentStep(user, completedOnboarding),
          });
        } else {
          // No user data, start with login
          setOnboardingState({
            isLoggedIn: false,
            user: null,
            hasCompletedOnboarding: false,
            currentStep: 'login',
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
          currentStep: 'login',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeOnboarding();
  }, []);

  // Determine the current step based on user data and completion status
  const determinCurrentStep = (user: UserProfile, hasCompleted: boolean): OnboardingStep => {
    if (hasCompleted) {
      return 'complete';
    }

    // Check what steps are missing
    if (!user.selfie_url) {
      return 'selfie';
    }

    // Check if basic profile info is missing
    if (!user.email && !user.instagram_url && !user.description) {
      return 'details';
    }

    // If we have basic info but onboarding isn't complete, show welcome
    return 'welcome';
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
      router.push('/home');
    }
  };

  // Handle selfie upload completion
  const handleSelfieCompleted = (updatedUser: UserProfile) => {
    const completedOnboarding = isOnboardingComplete(updatedUser);
    const nextStep = completedOnboarding ? 'welcome' : 'details';

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
      currentStep: 'details',
    }));
  };

  // Handle details completion
  const handleDetailsCompleted = (updatedUser: UserProfile) => {
    const completedOnboarding = isOnboardingComplete(updatedUser);

    setOnboardingState(prev => ({
      ...prev,
      user: updatedUser,
      hasCompletedOnboarding: completedOnboarding,
      currentStep: 'welcome',
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
      currentStep: 'complete',
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
      currentStep: 'login',
    });
    router.push('/');
  };

  // Skip current step (if applicable)
  const skipCurrentStep = () => {
    const { currentStep } = onboardingState;

    switch (currentStep) {
      case 'selfie':
        handleSelfieSkipped();
        break;
      case 'details':
        // Skip to welcome if we have minimum info
        if (onboardingState.user) {
          setOnboardingState(prev => ({
            ...prev,
            currentStep: 'welcome',
          }));
        }
        break;
      case 'welcome':
        handleWelcomeCompleted();
        break;
    }
  };

  // Go to next step manually
  const goToNextStep = () => {
    const { currentStep, user } = onboardingState;

    if (!user) return;

    switch (currentStep) {
      case 'login':
        setOnboardingState(prev => ({
          ...prev,
          currentStep: 'selfie',
        }));
        break;
      case 'selfie':
        setOnboardingState(prev => ({
          ...prev,
          currentStep: 'details',
        }));
        break;
      case 'details':
        setOnboardingState(prev => ({
          ...prev,
          currentStep: 'welcome',
        }));
        break;
      case 'welcome':
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