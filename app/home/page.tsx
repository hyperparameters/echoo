"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Plus, TrendingUp, MapPin, Sparkles, Heart, MessageCircle } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import PhotoAlbum from "react-photo-album"

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

  useEffect(() => {
    const userData = localStorage.getItem("echooUser")
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.fullName)
    }
  }, [])

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

  const photos: Photo[] = mockPosts.map((post, index) => ({
    src: post.image,
    width: 400,
    height: [300, 450, 350, 400, 320, 380][index] || 350, // Varied heights for masonry effect
    alt: post.caption,
    key: post.id.toString(),
  }))

  const quickActions = [
    { icon: Plus, label: "Add Content", color: "text-primary" },
    { icon: TrendingUp, label: "View Analytics", color: "text-green-400" },
    { icon: MapPin, label: "Find Events", color: "text-blue-400" },
    { icon: Sparkles, label: "AI Insights", color: "text-purple-400" },
  ]

  const renderPhoto = ({ photo, wrapperStyle, renderDefaultPhoto }: any) => {
    const postData = mockPosts.find((post) => post.image === photo.src)

    return (
      <div style={wrapperStyle} className="group cursor-pointer">
        <Card className="glass-card border-border/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="relative overflow-hidden">
            {renderDefaultPhoto({ wrapped: true })}
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

        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">2.5K</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">+4.2%</div>
              <div className="text-sm text-muted-foreground">Growth</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">89</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent/50"
                >
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                  <span className="text-sm text-muted-foreground">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

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
    </div>
  )
}
