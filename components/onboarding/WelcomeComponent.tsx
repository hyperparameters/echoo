"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Upload,
  Brain,
  MapPin,
  ArrowRight,
  Sparkles,
  Camera,
  Users,
  Heart,
  Star
} from 'lucide-react';
import Image from 'next/image';
import type { UserProfile } from '@/lib/api';

interface WelcomeComponentProps {
  user: UserProfile;
  onGetStarted: () => void;
}

const onboardingFeatures = [
  {
    id: 1,
    title: 'Share Your Moments',
    description: 'Upload and organize your photos with our intelligent platform',
    icon: Upload,
    illustration: '/upload-images.png',
    details: 'Easily manage and showcase your best content',
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 2,
    title: 'AI-Powered Insights',
    description: 'Get smart recommendations and content analysis',
    icon: Brain,
    illustration: '/analyse-images.png',
    details: 'Discover what makes your content engaging',
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 3,
    title: 'Find Your Community',
    description: 'Connect with like-minded creators and events',
    icon: MapPin,
    illustration: '/cozy-coffee-shop.png',
    details: 'Discover events and opportunities near you',
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    id: 4,
    title: 'Grow Your Influence',
    description: 'Build your personal brand and expand your reach',
    icon: Star,
    illustration: '/stylish-streetwear-outfit.png',
    details: 'Turn your passion into influence',
    color: 'from-orange-500/20 to-yellow-500/20',
  },
];

const quickStats = [
  { icon: Camera, label: 'Smart Photo Management', value: 'AI-Powered' },
  { icon: Users, label: 'Creator Community', value: '10K+ Members' },
  { icon: Heart, label: 'Engagement Boost', value: 'Up to 300%' },
];

export function WelcomeComponent({ user, onGetStarted }: WelcomeComponentProps) {
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
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user.username?.split(' ')[0] || 'Creator';

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        {/* Logo with Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-4">
              <Logo variant="default" width={80} height={80} />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {firstName}! 🎉
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Welcome to Echoo! You're all set to start your influence journey.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-3">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Carousel */}
      <Card className="glass-card border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <Carousel className="w-full">
            <CarouselContent>
              {onboardingFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <CarouselItem key={feature.id}>
                    <div className="p-6 text-center space-y-4">
                      {/* Feature Illustration */}
                      <div className="relative w-full h-48 flex items-center justify-center">
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-lg opacity-50`} />
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-background/5 border border-border/20 shadow-lg">
                          <Image
                            src={feature.illustration}
                            alt={feature.title}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                            priority={index === 0}
                          />
                        </div>
                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Feature Content */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                        <p className="text-xs text-muted-foreground/80">
                          {feature.details}
                        </p>
                      </div>

                      {/* Step Indicator */}
                      <div className="flex justify-center space-x-2 pt-2">
                        {onboardingFeatures.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              idx === index
                                ? 'w-8 bg-primary'
                                : 'w-2 bg-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            {user.selfie_url ? (
              <img
                src={user.selfie_url}
                alt="Your profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Camera className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {user.username}
              </p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {user.email && <span>📧</span>}
                {user.instagram_url && <span>📱</span>}
                {user.selfie_url && <span>📸</span>}
                <span>Profile {
                  [user.email, user.instagram_url, user.selfie_url].filter(Boolean).length > 0
                    ? 'Complete'
                    : 'Started'
                }</span>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Get Started Button */}
      <Button
        onClick={onGetStarted}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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