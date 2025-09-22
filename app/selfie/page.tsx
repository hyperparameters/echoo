"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

export default function SelfiePage() {
  const router = useRouter()
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setSelfieUrl(url)
    }
  }

  const handleCaptureClick = () => {
    fileInputRef.current?.click()
  }

  const handleContinue = () => {
    router.push("/details")
  }

  const handleSkip = () => {
    router.push("/details")
  }

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold text-foreground">Let's get to know you</h1>
        <p className="text-muted-foreground">Take a quick selfie to personalize your experience</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div
            className={`w-64 h-64 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-all hover:border-primary/50 ${
              selfieUrl ? "border-solid border-primary" : ""
            }`}
            onClick={handleCaptureClick}
          >
            {selfieUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={selfieUrl || "/placeholder.svg"}
                  alt="Selfie preview"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Tap to take or upload a selfie</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleContinue}
          disabled={!selfieUrl}
          variant="gradient"
          className="w-full"
        >
          Continue
        </Button>
        <Button onClick={handleSkip} variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
          Skip for now
        </Button>
      </div>
    </div>
  )
}
