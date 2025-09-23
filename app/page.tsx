"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Ripple } from "@/components/magicui/ripple";
import { Loader2 } from "lucide-react";
import { useOnboarding } from "@/stores/authStore";
import { OnboardingStep } from "@/lib/api";
import {
  LoginComponent,
  SelfieComponent,
  DetailsComponent,
  WelcomeComponent,
} from "@/components/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const {
    isLoading,
    isLoggedIn,
    user,
    currentStep,
    hasCompletedOnboarding,
    completeOnboardingStep,
    skipCurrentStep,
    updateProfile,
  } = useOnboarding();

  // Redirect to home if onboarding is complete
  useEffect(() => {
    if (hasCompletedOnboarding && currentStep === OnboardingStep.COMPLETE) {
      router.push('/home');
    }
  }, [hasCompletedOnboarding, currentStep, router]);

  const profilePhotos = [
    "/sunset-marina-bay.jpg",
    "/cozy-coffee-shop.png",
    "/stylish-streetwear-outfit.png",
    "/workout-fitness.png",
    "/food-styling.jpg",
    "/behind-the-scenes.png",
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0">
          <Ripple />
        </div>
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Simplified onboarding handlers
  const handleLoginSuccess = (user: any) => {
    completeOnboardingStep(OnboardingStep.LOGIN, user);
  };

  const handleSelfieCompleted = (updatedUser: any) => {
    completeOnboardingStep(OnboardingStep.SELFIE, updatedUser);
  };

  const handleSelfieSkipped = () => {
    skipCurrentStep();
  };

  const handleDetailsCompleted = async (profileData: any) => {
    try {
      const updatedUser = await updateProfile(profileData);
      completeOnboardingStep(OnboardingStep.DETAILS, updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleWelcomeCompleted = () => {
    completeOnboardingStep(OnboardingStep.WELCOME);
  };

  // Render appropriate component based on onboarding state
  const renderOnboardingStep = () => {
    switch (currentStep) {
      case OnboardingStep.LOGIN:
        return <LoginComponent onLoginSuccess={handleLoginSuccess} />;

      case OnboardingStep.SELFIE:
        return user ? (
          <SelfieComponent
            user={user}
            onSelfieUploaded={handleSelfieCompleted}
            onSkip={handleSelfieSkipped}
          />
        ) : null;

      case OnboardingStep.DETAILS:
        return user ? (
          <DetailsComponent
            user={user}
            onDetailsCompleted={handleDetailsCompleted}
          />
        ) : null;

      case OnboardingStep.WELCOME:
        return user ? (
          <WelcomeComponent user={user} onGetStarted={handleWelcomeCompleted} />
        ) : null;

      default:
        // Fallback - show login
        return <LoginComponent onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <Ripple />
      </div>

      {/* Background Photos Grid (only show for login step) */}
      {currentStep === "login" && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-sm z-0 opacity-20">
          <div className="grid grid-cols-3 gap-3">
            {profilePhotos.map((photo, index) => (
              <div key={index} className="relative">
                <div className="aspect-square rounded-2xl bg-muted overflow-hidden">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Profile ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logo (show for all steps except welcome which has its own) */}
      {currentStep !== OnboardingStep.WELCOME && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-24 h-24 flex items-center justify-center">
            <Image
              src="/echoo-logo-sm.png"
              alt="echoo logo"
              width={96}
              height={96}
              className="w-full h-full object-contain opacity-80"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-sm mx-auto relative z-10 mt-16">
        {renderOnboardingStep()}
      </div>

      {/* Progress Indicator */}
      {isLoggedIn &&
        currentStep !== OnboardingStep.COMPLETE &&
        currentStep !== OnboardingStep.LOGIN && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex space-x-2">
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  currentStep === OnboardingStep.SELFIE
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30"
                }`}
              />
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  currentStep === OnboardingStep.DETAILS
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30"
                }`}
              />
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  currentStep === OnboardingStep.WELCOME
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30"
                }`}
              />
            </div>
          </div>
        )}
    </div>
  );
}
