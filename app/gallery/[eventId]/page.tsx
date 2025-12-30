"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Upload,
  Loader2,
} from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { PhotoGallery, Photo } from "@/components/photo-gallery";
import { useEventMatchedImages, useEvent } from "@/lib/api/events";
import { EventMatchedImageResponse } from "@/lib/api/types";
import { usePrivy } from "@privy-io/react-auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadService } from "@/services/upload";

export default function EventGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = parseInt(params.eventId as string);
  const { user, getAccessToken } = usePrivy();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);
  const {
    data: eventImages,
    isLoading: isLoadingImages,
    error,
  } = useEventMatchedImages(eventId);

  /**
   * Convert event matched images to Photo objects for react-photo-album
   * Uses actual image dimensions from API
   * @see https://github.com/igordanchenko/react-photo-album#photo-object
   */
  const photos: Photo[] =
    eventImages?.map((image) => ({
      src: image.image_url,
      width: image.width,
      height: image.height,
      alt: image.name,
      key: image?.id?.toString() || image.name,
    })) || [];

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Event Gallery",
        text: `Check out this event gallery`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!user?.id) {
      toast.error("Please log in to upload photos");
      return;
    }

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        // Step 1: Upload directly to Filecoin from client (like old version)
        // This works because we're in the browser where XMLHttpRequest exists
        const filecoinResponse = await UploadService.uploadFile(
          file,
          user.id,
          undefined, // No progress callback for now
          'event-image'
        );

        // Step 2: Send Filecoin response to Next.js API route to save to database
        // The API route handles the secure backend call
      const formData = new FormData();
        formData.append("filecoin_response", JSON.stringify(filecoinResponse));
        formData.append("file_name", file.name);
        formData.append("file_type", file.type);
      formData.append("event_id", eventId.toString());
      formData.append("user_id", user.id);

        // Get Privy access token for authentication
        const accessToken = await getAccessToken();
        
        const response = await fetch("/api/v1/upload-event-image", {
          method: "POST",
          headers: {
            'Authorization': accessToken ? `Bearer ${accessToken}` : '',
          },
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error || error.details || "Failed to save image to database");
        }

        return await response.json();
      } catch (error: any) {
        console.error(`Failed to upload ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast.success(`Successfully uploaded ${files.length} photo(s)`);
      
      // Refresh gallery images
      queryClient.invalidateQueries({
        queryKey: ["events", eventId, "matched-images"],
      });
      queryClient.refetchQueries({
        queryKey: ["events", eventId, "matched-images"],
      });
      
      // Trigger a custom event to refresh homepage images
      // (Homepage uses manual fetch, not React Query)
      window.dispatchEvent(new CustomEvent('images-uploaded'));
    } catch (error) {
      // Errors already handled in individual uploads
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoadingEvent || isLoadingImages) {
    return (
      <AppLayout>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="space-y-2">
                <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-white/70">Loading gallery...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-white">
                Event Gallery
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="text-white/70">
                Failed to load gallery images
              </div>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {event?.name || "Event Gallery"}
              </h1>
              <p className="text-white/70">
                {event?.description || "Event photos and memories"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleShare}
              className="text-white/70 hover:text-white"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Event Info */}
        {event && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {event.event_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-white/70" />
                    <span className="text-sm text-white/70">
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-white/70" />
                    <span className="text-sm text-white/70">
                      {event.location}
                    </span>
                  </div>
                )}
                {event.category && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-white/70" />
                    <span className="text-sm text-white/70">
                      {event.category}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gallery Stats */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Gallery ({photos.length} photos)
          </h2>
          <Button
            onClick={handleUploadClick}
            disabled={isUploading}
            variant="gradient"
            size="sm"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Photo Gallery */}
        <PhotoGallery
          photos={photos}
          imageData={eventImages || []}
          isLoading={isLoadingImages}
          emptyMessage="No photos found for this event"
          emptySubMessage="Photos will appear here once they are uploaded and matched to this event."
          showStats={false}
          showLocation={false}
          showTimestamp={true}
        />
      </div>
    </AppLayout>
  );
}
