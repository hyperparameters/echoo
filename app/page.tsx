"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2, Mail, Twitter, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ripple } from "@/components/magicui/ripple";
import Image from "next/image";
import { authApi, hasSelfie, hasDetails, isExistingUser } from "@/lib/api/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const profilePhotos = [
    "/sunset-marina-bay.jpg",
    "/cozy-coffee-shop.png",
    "/stylish-streetwear-outfit.png",
    "/workout-fitness.png",
    "/food-styling.jpg",
    "/behind-the-scenes.png",
  ];

  // Handle authentication state
  useEffect(() => {
    if (!ready) return;
    
    // Prevent multiple redirect attempts
    if (hasRedirected) return;

    if (authenticated) {
      // Mark as redirected to prevent loop
      setHasRedirected(true);
      setIsCheckingStatus(true);
      console.log('🔐 User authenticated, checking onboarding status...');
      
      // Small delay to ensure backend auth is ready
      setTimeout(() => {
        checkOnboardingStatus();
      }, 1500);
    }
  }, [ready, authenticated, hasRedirected, router]);

  const handleOAuthLogin = async (provider: 'google' | 'twitter' | 'discord') => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await handleOAuthLogin('google');
    } catch (error) {
      console.error('Email login failed:', error);
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      console.log('📋 Checking if user has completed onboarding...');
      
      // Fetch user profile with retry
      let profile = null;
      let attempts = 0;
      
      while (attempts < 3) {
        try {
          profile = await authApi.getProfile();
          console.log('✅ Profile fetched:', {
            full_name: profile?.full_name,
            instagram_url: profile?.instagram_url,
            selfie_cid: profile?.selfie_cid
          });
          break;
        } catch (err: any) {
          attempts++;
          if (attempts < 3) {
            console.log(`⏳ Retry ${attempts}/3...`);
            await new Promise(r => setTimeout(r, 500));
          } else {
            throw err;
          }
        }
      }

      if (!profile) {
        throw new Error('Could not fetch profile');
      }

      // Check if user is new or existing using helper functions
      const hasSelfieStep = hasSelfie(profile);
      const hasDetailsStep = hasDetails(profile);
      const userIsExisting = isExistingUser(profile);

      console.log('👤 User status check:', {
        hasSelfieStep,
        hasDetailsStep,
        userIsExisting,
        selfie_cid: profile.selfie_cid,
        selfie_url: profile.selfie_url,
        full_name: profile.full_name,
        instagram_url: profile.instagram_url,
        description: profile.description,
        interests: profile.interests
      });

      if (userIsExisting) {
        console.log('👤 Existing user detected - redirecting to /home');
        router.push('/home');
      } else {
        console.log('🆕 New user detected - starting onboarding');
        // Determine where to start in the onboarding flow
        if (!hasSelfieStep) {
          console.log('📷 No selfie found - redirecting to /selfie');
          router.push('/selfie');
        } else if (!hasDetailsStep) {
          console.log('📝 No details found - redirecting to /details');
          router.push('/details');
        } else {
          console.log('🎉 Onboarding complete - redirecting to /welcome then /home');
          router.push('/welcome');
        }
      }
    } catch (error: any) {
      console.error('❌ Error checking onboarding status:', error);
      // Default to new user flow if check fails
      console.log('⚠️ Defaulting to new user flow (/selfie)');
      router.push('/selfie');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Show loading state only while Privy is initializing
  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0">
          <Ripple />
        </div>
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-white">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show checking status while verifying user
  if (isCheckingStatus) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0">
          <Ripple />
        </div>
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-white">Checking your account...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Ripple Layer */}
      <div className="absolute inset-0">
        <Ripple />
      </div>

      {/* Background Photos Grid */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-sm z-0 opacity-20">
        <div className="grid grid-cols-3 gap-3">
          {profilePhotos.map((photo, index) => (
            <div key={index} className="relative">
              <div className="aspect-square rounded-2xl bg-muted overflow-hidden">
                <img
                  src={photo}
                  alt={`Profile ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-24 h-24 flex items-center justify-center">
          <Image
            src="/echoo-logo-sm.png"
            alt="echoo logo"
            width={96}
            height={96}
            className="w-full h-full object-contain opacity-80"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-sm mx-auto relative z-10">
        <div className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-border/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">
              Welcome to Echo
            </h1>
            <p className="text-white/80">Sign in to continue to your account</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => handleOAuthLogin('google')}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 font-medium transition-all duration-200 transform hover:-translate-y-0.5"
              variant="outline"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>

            <Button
              onClick={() => handleOAuthLogin('twitter')}
              className="w-full bg-brand-primary hover:bg-orange-600 text-white font-medium transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Continue with Twitter
            </Button>

            <Button
              onClick={handleEmailLogin}
              className="w-full bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white/50 font-medium transition-all duration-200 transform hover:-translate-y-0.5"
              variant="outline"
            >
              <Mail className="w-4 h-4 mr-2" />
              Continue with Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
