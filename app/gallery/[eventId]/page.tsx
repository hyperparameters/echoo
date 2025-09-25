"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { PhotoGallery, Photo } from "@/components/photo-gallery";
import { useEventMatchedImages, useEvent } from "@/lib/api/events";
import { EventMatchedImageResponse } from "@/lib/api/types";

export default function EventGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = parseInt(params.eventId as string);

  // const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);
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
      key: image.id.toString(),
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

  if (isLoadingImages) {
    return (
      <AppLayout>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground"
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
            <div className="text-muted-foreground">Loading gallery...</div>
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
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">
                Event Gallery
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="text-muted-foreground">
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
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {/* <div>
              <h1 className="text-2xl font-bold text-foreground">
                {event?.name || "Event Gallery"}
              </h1>
              <p className="text-muted-foreground">
                {event?.description || "Event photos and memories"}
              </p>
            </div> */}
          </div>
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleShare}
              className="text-muted-foreground hover:text-foreground"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Event Info */}
        {/* {event && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {event.event_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {event.location}
                    </span>
                  </div>
                )}
                {event.category && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {event.category}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Gallery Stats */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Gallery ({photos.length} photos)
          </h2>
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
