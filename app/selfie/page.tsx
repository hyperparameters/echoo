"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function SelfiePage() {
  const router = useRouter()
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null)
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Detect if user is on desktop
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileViewport = window.innerWidth <= 768; // Mobile breakpoint
      
      // In mobile emulation, use viewport width to determine behavior
      setIsDesktop(!isMobile && !isTouchDevice && !isMobileViewport);
    };
    
    checkDevice();
    
    // Re-check on resize (for mobile emulation)
    const handleResize = () => checkDevice();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setSelfieUrl(url)
    }
  }

  const handleCaptureClick = () => {
    // Always use camera modal for consistent experience across all devices
    setShowCameraModal(true)
  }

  const handleContinue = () => {
    router.push("/details")
  }

  const handleSkip = () => {
    router.push("/details")
  }

  // Camera functions for desktop
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }, // Front camera
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas size to 500x500
        canvas.width = 500;
        canvas.height = 500;
        
        // Calculate scaling to maintain aspect ratio and center the image
        const videoAspect = video.videoWidth / video.videoHeight;
        const canvasAspect = 500 / 500; // 1:1 aspect ratio
        
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = video.videoWidth;
        let sourceHeight = video.videoHeight;
        
        if (videoAspect > canvasAspect) {
          // Video is wider, crop sides
          sourceWidth = video.videoHeight;
          sourceX = (video.videoWidth - sourceWidth) / 2;
        } else {
          // Video is taller, crop top/bottom
          sourceHeight = video.videoWidth;
          sourceY = (video.videoHeight - sourceHeight) / 2;
        }
        
        // Draw the cropped and scaled image
        context.drawImage(
          video,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, 500, 500
        );
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setSelfieUrl(url);
            setShowCameraModal(false);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const closeCameraModal = () => {
    setShowCameraModal(false);
    stopCamera();
  };

  // Auto-start camera when modal opens
  useEffect(() => {
    if (showCameraModal) {
      startCamera();
    }
  }, [showCameraModal]);

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
            data-camera="front"
            onChange={handleFileSelect}
            className="hidden"
            style={{ display: 'none' }}
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

      {/* Camera Modal for Desktop */}
      <Dialog open={showCameraModal} onOpenChange={setShowCameraModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Take a Selfie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-black rounded-lg object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={capturePhoto}
                disabled={!stream}
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button
                onClick={closeCameraModal}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
