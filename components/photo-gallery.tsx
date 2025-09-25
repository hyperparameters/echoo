"use client";

import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import { Heart, MessageCircle, Download } from "lucide-react";

/**
 * Photo interface for react-photo-album
 * @see https://github.com/igordanchenko/react-photo-album#photo-object
 */
export interface Photo {
  src: string;
  width: number;
  height: number;
  alt?: string;
  key?: string;
}

/**
 * Base interface for image metadata
 */
export interface BaseImageData {
  id: number | string;
  image_url?: string;
  image?: string; // Alternative property name for image URL
  name?: string;
  description?: string | null;
  created_at?: string;
  likes?: number;
  comments?: number;
  location?: string;
  timestamp?: string;
}

/**
 * Props for the PhotoGallery component
 */
export interface PhotoGalleryProps {
  photos: Photo[];
  imageData?: BaseImageData[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  columns?: number;
  spacing?: number;
  padding?: number;
  onPhotoClick?: (photo: Photo, imageData?: BaseImageData) => void;
  showStats?: boolean;
  showLocation?: boolean;
  showTimestamp?: boolean;
  className?: string;
}

/**
 * Reusable PhotoGallery component using react-photo-album
 * Supports both home page content posts and event gallery images
 */
export function PhotoGallery({
  photos,
  imageData = [],
  isLoading = false,
  emptyMessage = "No photos found",
  emptySubMessage = "Photos will appear here once they are uploaded.",
  columns = 2,
  spacing = 12,
  padding = 4,
  onPhotoClick,
  showStats = true,
  showLocation = true,
  showTimestamp = true,
  className = "",
}: PhotoGalleryProps) {
  const handleDownload = async (imageUrl: string, imageName?: string) => {
    try {
      // Try the modern download approach first
      const response = await fetch(imageUrl, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageName || `image-${Date.now()}.jpg`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback 1: Try direct link download
      try {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = imageName || `image-${Date.now()}.jpg`;
        link.target = '_blank';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        // Final fallback: open in new tab
        window.open(imageUrl, '_blank');
      }
    }
  };
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-muted-foreground">Loading images...</div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center space-y-4">
          <div className="text-muted-foreground">{emptyMessage}</div>
          {emptySubMessage && (
            <p className="text-sm text-muted-foreground">{emptySubMessage}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <MasonryPhotoAlbum
        photos={photos}
        columns={columns}
        spacing={spacing}
        padding={padding}
        breakpoints={[300, 600, 900, 1200]}
        sizes={{
          size: "calc(100vw - 32px)",
          sizes: [
            {
              viewport: "(max-width: 767px)",
              size: "calc(100vw - 32px)",
            },
            {
              viewport: "(max-width: 1279px)",
              size: "calc(100vw - 288px)",
            },
            { viewport: "(min-width: 1280px)", size: "1200px" },
          ],
        }}
        componentsProps={{
          image: {
            loading: "lazy",
            decoding: "async",
            style: { borderRadius: "8px" },
          },
        }}
        render={{
          photo: ({ onClick }: any, { photo, width, height }: any) => {
            // Find the corresponding image data
            const currentImageData = imageData.find(
              (data) => (data.image_url || data.image) === photo.src
            );

            const handleClick = () => {
              if (onPhotoClick) {
                onPhotoClick(photo, currentImageData);
              } else {
                onClick?.();
              }
            };

            return (
              <div className="group cursor-pointer" onClick={handleClick}>
                <div className="relative overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt || ""}
                    width={width}
                    height={height}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />

                  {/* Download button - always visible on mobile, hover on desktop */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDownload(photo.src, currentImageData?.name || photo.alt);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200 md:opacity-0 md:group-hover:opacity-100 md:top-3 md:right-3 md:p-2 z-10"
                    title="Download image"
                    type="button"
                  >
                    <Download className="w-3 h-3 md:w-4 md:h-4" />
                  </button>

                  {/* Overlay with image info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="text-sm font-medium line-clamp-2 mb-2">
                        {currentImageData?.name ||
                          currentImageData?.description ||
                          photo.alt ||
                          "Untitled"}
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        {showStats && (
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span>
                                {currentImageData?.likes?.toLocaleString() ||
                                  "0"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>{currentImageData?.comments || "0"}</span>
                            </div>
                          </div>
                        )}

                        {showTimestamp && (
                          <span className="text-white/80">
                            {currentImageData?.timestamp ||
                              (currentImageData?.created_at
                                ? new Date(
                                    currentImageData.created_at
                                  ).toLocaleDateString()
                                : "Unknown date")}
                          </span>
                        )}
                      </div>

                      {showLocation && currentImageData?.location && (
                        <div className="text-xs text-white/70 mt-1 line-clamp-1">
                          {currentImageData.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
}
