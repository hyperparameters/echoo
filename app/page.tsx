"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Ripple } from "@/components/magicui/ripple";

export default function LandingPage() {
  const router = useRouter();

  const handleStartToday = () => {
    router.push("/selfie");
  };

  const profilePhotos = [
    "/sunset-marina-bay.jpg",
    "/cozy-coffee-shop.png",
    "/stylish-streetwear-outfit.png",
    "/workout-fitness.png",
    "/food-styling.jpg",
    "/behind-the-scenes.png",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <Ripple />
      </div>

      <div className="w-full max-w-sm mx-auto space-y-8 relative z-10">
        <div className="grid grid-cols-3 gap-3 mb-2">
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

        <div className="text-center space-y-4">
          <div className="flex justify-center items-center">
            <div className="w-48 h-48 flex items-center justify-center relative">
              <Image
                src="/echoo-logo-sm.png"
                alt="echoo logo"
                width={192}
                height={192}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Create your account and meet with your favourite creators
            </p>
          </div>
        </div>

        <Button
          onClick={handleStartToday}
          className="w-full font-medium py-3 h-auto rounded-xl"
          style={{
            backgroundColor: "#FF6B47",
            color: "white",
          }}
        >
          Start Today
        </Button>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          By signing up, you are creating a Dreamcast account and agree to
          Dreamcast's <span className="underline">Terms of Service</span> and{" "}
          <span className="underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
