"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface EventImage {
  id: number;
  name?: string;
  image_url?: string;
  fotoowl_url?: string;
  filecoin_url?: string;
  description?: string;
  width?: number;
  height?: number;
}

interface EventImagesData {
  success: boolean;
  images: EventImage[];
  total_images: number;
  page?: number;
  page_size?: number;
}

interface EventImagesComponentProps {
  data: EventImagesData;
}

export function EventImagesComponent({ data }: EventImagesComponentProps) {
  const { images, total_images } = data;

  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = imageName || "echoo-photo.jpg";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Your Event Photos
          </h3>
        </div>
        <Badge variant="secondary">{total_images} Photos</Badge>
      </div>

      {images.length === 0 ? (
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 text-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No photos found for this event yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => {
            const imageUrl =
              image.image_url ||
              image.filecoin_url ||
              image.fotoowl_url ||
              "";
            return (
              <Card key={image.id || index} className="glass-card border-border/50 overflow-hidden">
                <div className="relative aspect-square w-full bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={image.name || `Event photo ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <CardContent className="p-3 space-y-2">
                  {image.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {image.description}
                    </p>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      handleDownload(imageUrl, image.name || `photo-${index}`)
                    }
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

