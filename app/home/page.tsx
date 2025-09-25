"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Camera,
  Calendar,
} from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { PhotoGallery, Photo } from "@/components/photo-gallery";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import { FilecoinUploadResponse, UploadService } from "@/services/upload";
import { imagesApi } from "@/lib/api/images";
import { ImageListResponse } from "@/lib/api/types";

interface ContentPost {
  id: number;
  image: string;
  name: string;
  caption: string;
  likes: number;
  comments: number;
  location: string;
  timestamp: string;
  isUploaded?: boolean;
  isApiImage?: boolean;
}

export default function HomePage() {
  const router = useRouter();
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
    name: image.name,
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
      name: post.name,
    };
  });

  const quickActions = [
    {
      icon: Camera,
      label: "Add Content",
      category: "Content Creation",
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
      action: () => setIsUploadDialogOpen(true),
    },
    {
      icon: Calendar,
      label: "Find Events",
      category: "Events",
      gradient: "from-teal-400 via-cyan-400 to-blue-500",
      bgColor: "bg-gradient-to-br from-teal-400/20 to-cyan-500/20",
      action: () => router.push("/events"),
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

        {/* Quick Actions - Simplified Layout */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className={`relative overflow-hidden rounded-2xl ${action.bgColor} backdrop-blur-sm border border-white/10 cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative p-6 flex items-center justify-between h-24">
                  {/* Category and Title */}
                  <div className="space-y-1 flex-1">
                    <div className="text-xs text-white/70 font-medium leading-tight">
                      {action.category}
                    </div>
                    <div className="text-base font-semibold text-white leading-tight">
                      {action.label}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 flex-shrink-0">
                    <action.icon className="w-5 h-5 text-white" />
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
            {photos.length === 0 && !isLoadingImages && (
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                className="bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary/80 hover:to-brand-accent/80 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Photos to Gallery
              </Button>
            )}
          </div>

          {photos.length === 0 && !isLoadingImages ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No photos yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start building your gallery by uploading your first photos
              </p>
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary/80 hover:to-brand-accent/80 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Photos to Gallery
              </Button>
            </div>
          ) : (
            <PhotoGallery
              photos={photos}
              imageData={allContent}
              isLoading={isLoadingImages}
              emptyMessage="No images found. Upload some content to get started!"
              showStats={true}
              showLocation={true}
              showTimestamp={true}
            />
          )}
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
