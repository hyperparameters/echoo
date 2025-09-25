"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Upload, Loader2, Check, RotateCcw } from "lucide-react";
import { useUploadSelfie } from "@/lib/api/images";
import type { UserProfile } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SelfieComponentProps {
  user: UserProfile;
  onSelfieUploaded: (user: UserProfile) => void;
  onSkip: () => void;
  onNext?: () => void;
}

export function SelfieComponent({
  user,
  onSelfieUploaded,
  onSkip,
  onNext,
}: SelfieComponentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const uploadSelfieMutation = useUploadSelfie();

  // Detect if user is on desktop
  useEffect(() => {
    const checkDevice = () => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileViewport = window.innerWidth <= 768; // Mobile breakpoint

      // In mobile emulation, use viewport width to determine behavior
      setIsDesktop(!isMobile && !isTouchDevice && !isMobileViewport);
    };

    checkDevice();

    // Re-check on resize (for mobile emulation)
    const handleResize = () => checkDevice();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCaptureClick = () => {
    // Always use camera modal for consistent experience across all devices
    setShowCameraModal(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadSelfieMutation.mutateAsync({
        file: selectedFile,
        userId: user.id,
      });

      // Update user object with new selfie data
      const updatedUser: UserProfile = {
        ...user,
        selfie_url: result.filecoin_url,
        selfie_cid: result.cid,
      };

      // Set the uploaded image URL for display
      setUploadedImageUrl(result.filecoin_url || null);

      onSelfieUploaded(updatedUser);
    } catch (error) {
      console.error("Selfie upload failed:", error);
    }
  };

  const handleSkip = () => {
    // Clean up preview URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onSkip();
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  // Camera functions for desktop
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Front camera
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

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
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          500,
          500
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "selfie.jpg", {
                type: "image/jpeg",
              });
              setSelectedFile(file);
              const url = URL.createObjectURL(blob);
              setPreviewUrl(url);
              setShowCameraModal(false);
              stopCamera();
            }
          },
          "image/jpeg",
          0.8
        );
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

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Add Your Selfie</h1>
        <p className="text-muted-foreground">
          Upload a clear photo of yourself to personalize your profile
        </p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Selfie Preview/Upload Area */}
        <div className="relative">
          <div
            className={`w-64 h-64 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-all hover:border-primary/50 ${
              previewUrl || uploadedImageUrl
                ? "border-solid border-primary"
                : ""
            }`}
            onClick={uploadedImageUrl ? undefined : handleCaptureClick}
          >
            {uploadedImageUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded selfie"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            ) : previewUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={previewUrl}
                  alt="Selfie preview"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Take or upload a selfie
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap to select from camera or gallery
                  </p>
                </div>
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
            style={{ display: "none" }}
          />
        </div>

        {/* Upload Instructions */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Upload className="w-3 h-3" />
            <span>Max file size: 5MB • JPG, PNG supported</span>
          </div>
        </div>

        {/* Error Display */}
        {uploadSelfieMutation.error && (
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertDescription className="text-destructive">
              {uploadSelfieMutation.error.message ||
                "Failed to upload selfie. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Success */}
        {uploadSelfieMutation.isSuccess && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <Check className="w-4 h-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              Selfie uploaded successfully!
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {uploadedImageUrl ? (
          // Show next button when upload is successful
          <Button
            onClick={handleNext}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Continue
          </Button>
        ) : (
          // Show upload/skip buttons when no upload yet
          <>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadSelfieMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {uploadSelfieMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : selectedFile ? (
                "Upload Selfie"
              ) : (
                "Select a Photo First"
              )}
            </Button>

            {/* <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              disabled={uploadSelfieMutation.isPending}
            >
              Skip for now
            </Button> */}
          </>
        )}
      </div>

      {/* Tips */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <p className="text-xs font-medium text-foreground">
          Tips for a great selfie:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use good lighting, preferably natural light</li>
          <li>• Keep the camera at eye level</li>
          <li>• Make sure your face is clearly visible</li>
          <li>• Smile naturally!</li>
        </ul>
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
              <Button onClick={capturePhoto} disabled={!stream}>
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button onClick={closeCameraModal} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
