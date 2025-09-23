"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Upload,
  Brain,
  MapPin,
  ArrowRight,
  Sparkles,
  Camera,
  Users,
  Heart,
  Star,
} from "lucide-react";
import Image from "next/image";
import type { UserProfile } from "@/lib/api";

interface WelcomeComponentProps {
  user: UserProfile;
  onGetStarted: () => void;
}

const onboardingFeatures = [
  {
    id: 1,
    title: "Share Your Moments",
    description:
      "Upload and organize your photos with our intelligent platform",
    icon: Upload,
    illustration: "/upload-images.png",
    details: "Easily manage and showcase your best content",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 2,
    title: "AI-Powered Insights",
    description: "Get smart recommendations and content analysis",
    icon: Brain,
    illustration: "/analyse-images.png",
    details: "Discover what makes your content engaging",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: 3,
    title: "Find Your Community",
    description: "Connect with like-minded creators and events",
    icon: MapPin,
    illustration: "/cozy-coffee-shop.png",
    details: "Discover events and opportunities near you",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: 4,
    title: "Grow Your Influence",
    description: "Build your personal brand and expand your reach",
    icon: Star,
    illustration: "/stylish-streetwear-outfit.png",
    details: "Turn your passion into influence",
    color: "from-orange-500/20 to-yellow-500/20",
  },
];

export function WelcomeComponent({
  user,
  onGetStarted,
}: WelcomeComponentProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % onboardingFeatures.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user.username?.split(" ")[0] || "Creator";

  return (
    <div className="w-full max-w-md mx-auto space-y-3 flex flex-col items-center px-4 py-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        {/* Logo with Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-2">
              <Logo variant="default" width={80} height={80} />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground">
            {getGreeting()}, {firstName}! 🎉
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Welcome to Echoo! You're all set to start your influence journey.
          </p>
        </div>
      </div>

      {/* Features Carousel */}

      <Carousel className="w-full">
        <CarouselContent>
          {onboardingFeatures.map((feature, index) => {
            return (
              <CarouselItem key={feature.id}>
                <div className="p-3 text-center space-y-2">
                  {/* Feature Illustration */}
                  <div className="relative w-full h-68 flex items-center justify-center">
                    <div className="relative w-68 h-68 rounded-lg overflow-hidden bg-background/5 border border-border/20 shadow-lg">
                      <Image
                        src={feature.illustration}
                        alt={feature.title}
                        width={144}
                        height={144}
                        className="w-full h-full object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>

                  {/* Feature Content */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                      {feature.details}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Get Started Button */}
      <Button
        onClick={onGetStarted}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <span>Start Exploring</span>
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Ready to transform your content into influence? Let's begin! ✨
      </p>
    </div>
  );
}
