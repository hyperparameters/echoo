"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Plus, TrendingUp, MapPin, Sparkles, Heart, MessageCircle } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import PhotoAlbum from "react-photo-album"
import { FileUploadDialog } from "@/components/file-upload-dialog"
import { FilecoinUploadResponse, UploadService, GalleryItem } from "@/services/upload"

interface ContentPost {
  id: number
  image: string
  caption: string
  likes: number
  comments: number
  location: string
  timestamp: string
}

interface Photo {
  src: string
  width: number
  height: number
  alt?: string
  key?: string
}

export default function HomePage() {
  const [userName, setUserName] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem("echooUser")
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.fullName)
    }
  }, [])

  useEffect(() => {
    // Load gallery items from localStorage
    const uploadedItems = UploadService.getGalleryItems()
    setGalleryItems(uploadedItems)
  }, [refreshKey])

  const handleUploadComplete = (responses: FilecoinUploadResponse[]) => {
    console.log('Upload completed:', responses)
    // Refresh the gallery to show newly uploaded items
    setRefreshKey(prev => prev + 1)
  }

  const mockPosts: ContentPost[] = [
    {
      id: 1,
      image: "/sunset-marina-bay.jpg",
      caption: "Perfect sunset vibes at Marina Bay ✨",
      likes: 1247,
      comments: 23,
      location: "Marina Bay, Singapore",
      timestamp: "2h ago",
    },
    {
      id: 2,
      image: "/cozy-coffee-shop.png",
      caption: "New coffee spot discovery! ☕️",
      likes: 892,
      comments: 15,
      location: "Bangalore, India",
      timestamp: "4h ago",
    },
    {
      id: 3,
      image: "/stylish-streetwear-outfit.png",
      caption: "Weekend outfit inspo 👗",
      likes: 2103,
      comments: 47,
      location: "Mumbai, India",
      timestamp: "1d ago",
    },
    {
      id: 4,
      image: "/workout-fitness.png",
      caption: "Morning workout done! 💪",
      likes: 654,
      comments: 12,
      location: "Pune, India",
      timestamp: "2d ago",
    },
    {
      id: 5,
      image: "/food-styling.jpg",
      caption: "Food styling experiment 🍜",
      likes: 1456,
      comments: 34,
      location: "Delhi, India",
      timestamp: "3d ago",
    },
    {
      id: 6,
      image: "/behind-the-scenes.png",
      caption: "Behind the scenes magic ✨",
      likes: 978,
      comments: 19,
      location: "Chennai, India",
      timestamp: "4d ago",
    },
  ]

  // Combine uploaded gallery items with mock posts
  const allContent = [
    ...galleryItems.map((item, index) => ({
      id: `uploaded-${index}`,
      image: item.image_url,
      caption: item.description,
      likes: item.likes,
      comments: item.comments,
      location: item.location,
      timestamp: new Date(item.created_at).toLocaleDateString() === new Date().toLocaleDateString()
        ? 'Just uploaded'
        : new Date(item.created_at).toLocaleDateString(),
      isUploaded: true
    })),
    ...mockPosts.map(post => ({ ...post, isUploaded: false }))
  ]

  const photos: Photo[] = allContent.map((post, index) => ({
    src: post.image,
    width: 400,
    height: [300, 450, 350, 400, 320, 380, 420, 280, 360, 340][index % 10] || 350, // Varied heights for masonry effect
    alt: post.caption,
    key: post.id.toString(),
  }))

  const quickActions = [
    {
      icon: Plus,
      label: "Add Content",
      category: "Programming",
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
      action: () => setIsUploadDialogOpen(true)
    },
    {
      icon: TrendingUp,
      label: "View Analytics",
      category: "Design",
      gradient: "from-yellow-400 via-orange-400 to-red-500",
      bgColor: "bg-gradient-to-br from-yellow-400/20 to-orange-500/20",
      action: () => console.log('Analytics clicked')
    },
    {
      icon: MapPin,
      label: "Find Events",
      category: "Digital Art",
      gradient: "from-teal-400 via-cyan-400 to-blue-500",
      bgColor: "bg-gradient-to-br from-teal-400/20 to-cyan-500/20",
      action: () => console.log('Events clicked')
    },
    {
      icon: Sparkles,
      label: "AI Insights",
      category: "Copywriting",
      gradient: "from-pink-400 via-purple-400 to-indigo-500",
      bgColor: "bg-gradient-to-br from-pink-400/20 to-purple-500/20",
      action: () => console.log('AI Insights clicked')
    },
  ]

  const renderPhoto = ({ photo, wrapperStyle, renderDefaultPhoto }: any) => {
    const postData = allContent.find((post) => post.image === photo.src)

    return (
      <div style={wrapperStyle} className="group cursor-pointer">
        <Card className={`glass-card border-border/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${postData?.isUploaded ? 'ring-2 ring-primary/20' : ''}`}>
          <div className="relative overflow-hidden">
            {renderDefaultPhoto({ wrapped: true })}

            {/* New Upload Badge */}
            {postData?.isUploaded && (
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs px-2 py-1 rounded-full font-medium">
                  New
                </div>
              </div>
            )}

            {/* Overlay with post info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-sm font-medium line-clamp-2 mb-2">{postData?.caption}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{postData?.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{postData?.comments}</span>
                    </div>
                  </div>
                  <span className="text-white/80">{postData?.timestamp}</span>
                </div>
                <div className="text-xs text-white/70 mt-1">{postData?.location}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hi, {userName}!</h1>
            <p className="text-muted-foreground">Ready to grow your influence?</p>
          </div>
          <div className="flex space-x-2">
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>


        {/* Quick Actions - Gradient Card Style */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Let's explore new fields</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className={`relative overflow-hidden rounded-3xl ${action.bgColor} backdrop-blur-sm border border-white/10 cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative p-6 flex flex-col justify-between h-32">
                  {/* Arrow Icon */}
                  <div className="flex justify-end">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>

                  {/* Category and Title */}
                  <div className="space-y-1">
                    <span className="text-xs text-white/70 font-medium">{action.category}</span>
                    <h3 className="text-sm font-semibold text-white">{action.label}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Your Content</h2>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View All
            </Button>
          </div>

          <div className="w-full">
            <PhotoAlbum
              photos={photos}
              layout="masonry"
              targetRowHeight={200}
              spacing={12}
              columns={(containerWidth) => {
                if (containerWidth < 400) return 2
                if (containerWidth < 800) return 3
                return 4
              }}
              renderPhoto={renderPhoto}
            />
          </div>
        </div>
      </div>

      <BottomNavigation currentTab="home" />

      {/* File Upload Dialog */}
      <FileUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUploadComplete={handleUploadComplete}
        maxFiles={10}
        maxFileSize={50 * 1024 * 1024} // 50MB
        acceptedFileTypes={['image/*']}
      />
    </div>
  )
}
