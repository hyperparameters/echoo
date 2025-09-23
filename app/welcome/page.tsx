"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Upload, Brain, MapPin, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

const onboardingSteps = [
  {
    id: 1,
    title: "Upload Images",
    description: "Share your photos and content with our intelligent platform",
    icon: Upload,
    illustration: "/upload-images.png",
    details: "Simply drag and drop or select your images to get started",
  },
  {
    id: 2,
    title: "Analyze Images",
    description: "Get AI-powered insights and recommendations for your content",
    icon: Brain,
    illustration: "/analyse-images.png",
    details: "Our AI analyzes your images to provide valuable insights",
  },
  {
    id: 3,
    title: "Discover Events",
    description: "Find relevant events and opportunities near you",
    icon: MapPin,
    illustration: "/cozy-coffee-shop.png",
    details: "Connect with events that match your interests and location",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("echooUser");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.fullName);
    }
  }, []);

  const handleStartExploring = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-32 right-20 w-16 h-16 bg-accent/10 rounded-full blur-lg animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse delay-2000" />
        </div>

        <div className="relative px-6 pt-8 pb-4">
          <div className="max-w-md mx-auto text-center space-y-4">
            {/* Logo with Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <Logo
                  variant="default"
                  width={100}
                  height={100}
                  className="relative z-10"
                />
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">
                Hello, {userName}!
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Let's get you started on your influence journey
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Carousel */}
      <div className="px-6 pb-8">
        <div className="max-w-md mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {onboardingSteps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <CarouselItem key={step.id}>
                    <div className="flex flex-col items-center text-center space-y-4 px-4">
                      {/* Illustration */}
                      <div className="relative w-full h-96 flex items-center justify-center">
                        <div className="relative w-80 h-80 rounded-2xl overflow-hidden bg-background/5 border border-border/20 shadow-lg">
                          <Image
                            src={step.illustration}
                            alt={step.title}
                            width={320}
                            height={320}
                            className="w-full h-full object-cover"
                            priority
                          />
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="space-y-1 max-w-sm">
                        <h2 className="text-lg font-bold text-foreground">
                          {step.title}
                        </h2>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Step Indicator */}
                      <div className="flex justify-center space-x-2 pt-4">
                        {onboardingSteps.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === step.id - 1
                                ? "bg-primary w-8"
                                : "bg-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Custom Navigation */}
            {/* <div className="flex justify-center mt-6 space-x-4">
              <CarouselPrevious className="static translate-x-0 translate-y-0 bg-background/80 border-border/50 hover:bg-background" />
              <CarouselNext className="static translate-x-0 translate-y-0 bg-background/80 border-border/50 hover:bg-background" />
            </div> */}
          </Carousel>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-8">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleStartExploring}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
