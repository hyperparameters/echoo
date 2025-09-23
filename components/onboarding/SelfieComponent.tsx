"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, Loader2, Check } from 'lucide-react';
import { useUploadSelfie } from '@/lib/api';
import type { UserProfile } from '@/lib/api';

interface SelfieComponentProps {
  user: UserProfile;
  onSelfieUploaded: (user: UserProfile) => void;
  onSkip: () => void;
}

export function SelfieComponent({ user, onSelfieUploaded, onSkip }: SelfieComponentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadSelfieMutation = useUploadSelfie();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
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
        selfie_url: result.fotoowl_url,
        selfie_cid: result.filecoin_cid,
      };

      onSelfieUploaded(updatedUser);
    } catch (error) {
      console.error('Selfie upload failed:', error);
    }
  };

  const handleSkip = () => {
    // Clean up preview URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onSkip();
  };

  // Clean up preview URL on unmount
  React.useEffect(() => {
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
              previewUrl ? 'border-solid border-primary' : ''
            }`}
            onClick={handleCaptureClick}
          >
            {previewUrl ? (
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
                  <p className="text-sm font-medium text-foreground">Take or upload a selfie</p>
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
            onChange={handleFileSelect}
            className="hidden"
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
              {uploadSelfieMutation.error.message || 'Failed to upload selfie. Please try again.'}
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
            'Upload Selfie'
          ) : (
            'Select a Photo First'
          )}
        </Button>

        <Button
          onClick={handleSkip}
          variant="ghost"
          className="w-full text-muted-foreground hover:text-foreground"
          disabled={uploadSelfieMutation.isPending}
        >
          Skip for now
        </Button>
      </div>

      {/* Tips */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <p className="text-xs font-medium text-foreground">Tips for a great selfie:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use good lighting, preferably natural light</li>
          <li>• Keep the camera at eye level</li>
          <li>• Make sure your face is clearly visible</li>
          <li>• Smile naturally!</li>
        </ul>
      </div>
    </div>
  );
}