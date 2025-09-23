"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Plus,
  TrendingUp,
  MapPin,
  Sparkles,
  Heart,
  MessageCircle,
} from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import { FilecoinUploadResponse, UploadService } from "@/services/upload";
import { imagesApi } from "@/lib/api/images";
import { ImageListResponse } from "@/lib/api/types";

interface ContentPost {
  id: number;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  location: string;
  timestamp: string;
  isUploaded?: boolean;
  isApiImage?: boolean;
}

/**
 * Photo interface for react-photo-album
 * @see https://github.com/igordanchenko/react-photo-album#photo-object
 */
interface Photo {
  src: string;
  width: number;
  height: number;
  alt?: string;
  key?: string;
}

export default function HomePage() {
  const [userName, setUserName] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [apiImages, setApiImages] = useState<ImageListResponse[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("echooUser");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.fullName);
    }
  }, []);

  const fetchApiImages = async () => {
    try {
      setIsLoadingImages(true);
      const images = await imagesApi.getUserImages();
      setApiImages(images);
    } catch (error) {
      console.error("Failed to fetch images from API:", error);
      // Keep existing images on error
    } finally {
      setIsLoadingImages(false);
    }
  };

  useEffect(() => {
    // Fetch images from API
    fetchApiImages();
  }, [refreshKey]);

  const handleUploadComplete = (responses: FilecoinUploadResponse[]) => {
    console.log("Upload completed:", responses);
    // Refresh the gallery to show newly uploaded items
    setRefreshKey((prev) => prev + 1);
  };

  // Convert API images to ContentPost format
  const apiContentPosts: ContentPost[] = apiImages.map((image) => ({
    id: image.id,
    image: image.image_url,
    caption: image.description || `Image ${image.id}`,
    likes: Math.floor(Math.random() * 2000) + 100, // Random likes for demo
    comments: Math.floor(Math.random() * 50) + 5, // Random comments for demo
    location: "Uploaded", // Default location
    timestamp:
      new Date(image.created_at).toLocaleDateString() ===
      new Date().toLocaleDateString()
        ? "Today"
        : new Date(image.created_at).toLocaleDateString(),
    isApiImage: true,
  }));

  // Use only API images
  const allContent: ContentPost[] = apiContentPosts;

  /**
   * Convert content posts to Photo objects for react-photo-album
   * Uses actual image dimensions from API when available
   * @see https://github.com/igordanchenko/react-photo-album#photo-object
   */
  const photos: Photo[] = allContent.map((post, index) => {
    // Find the corresponding API image to get actual dimensions
    const apiImage = apiImages.find((img) => img.image_url === post.image);

    // Use actual dimensions from API if available, otherwise use defaults
    const width = apiImage?.width || 400;
    const height = apiImage?.height || 350;

    return {
      src: post.image,
      width: width,
      height: height,
      alt: post.caption,
      key: post.id.toString(),
    };
  });

  const quickActions = [
    {
      icon: Plus,
      label: "Add Content",
      category: "Content Creation",
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
      action: () => setIsUploadDialogOpen(true),
    },
    {
      icon: TrendingUp,
      label: "View Analytics",
      category: "Analytics",
      gradient: "from-yellow-400 via-orange-400 to-red-500",
      bgColor: "bg-gradient-to-br from-yellow-400/20 to-orange-500/20",
      action: () => console.log("Analytics clicked"),
    },
    {
      icon: MapPin,
      label: "Find Events",
      category: "Events",
      gradient: "from-teal-400 via-cyan-400 to-blue-500",
      bgColor: "bg-gradient-to-br from-teal-400/20 to-cyan-500/20",
      action: () => console.log("Events clicked"),
    },
    {
      icon: Sparkles,
      label: "AI Insights",
      category: "AI",
      gradient: "from-pink-400 via-purple-400 to-indigo-500",
      bgColor: "bg-gradient-to-br from-pink-400/20 to-purple-500/20",
      action: () => console.log("AI Insights clicked"),
    },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Hi, {userName}!
            </h1>
            <p className="text-muted-foreground">
              Ready to grow your influence?
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Quick Actions - Gradient Card Style */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Let's explore new fields
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className={`relative overflow-hidden rounded-3xl ${action.bgColor} backdrop-blur-sm border border-white/10 cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative p-6 flex flex-col justify-between h-32">
                  {/* Arrow Icon */}
                  <div className="flex justify-end">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 17L17 7M17 7H7M17 7V17"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Category and Title */}
                  <div className="space-y-1">
                    <span className="text-xs text-white/70 font-medium">
                      {action.category}
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      {action.label}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Your Content
            </h2>
          </div>

          <div className="w-full">
            {isLoadingImages ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading images...</div>
              </div>
            ) : photos.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">
                  No images found. Upload some content to get started!
                </div>
              </div>
            ) : (
              <MasonryPhotoAlbum
                photos={photos}
                columns={2}
                spacing={12}
                padding={4}
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
                    const postData = allContent.find(
                      (post) => post.image === photo.src
                    );

                    return (
                      <div className="group cursor-pointer" onClick={onClick}>
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

                          {/* Overlay with post info */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <p className="text-sm font-medium line-clamp-2 mb-2">
                                {postData?.caption}
                              </p>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-1">
                                    <Heart className="w-3 h-3" />
                                    <span>
                                      {postData?.likes.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>{postData?.comments}</span>
                                  </div>
                                </div>
                                <span className="text-white/80">
                                  {postData?.timestamp}
                                </span>
                              </div>
                              <div className="text-xs text-white/70 mt-1">
                                {postData?.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* File Upload Dialog */}
      <FileUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUploadComplete={handleUploadComplete}
        maxFiles={10}
        maxFileSize={50 * 1024 * 1024} // 50MB
        acceptedFileTypes={["image/*"]}
      />
    </AppLayout>
  );
}
