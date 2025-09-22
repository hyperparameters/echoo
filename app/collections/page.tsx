"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"

interface Collection {
  id: number
  title: string
  coverImage: string
  itemCount: number
  lastUpdated: string
  category: string
}

export default function CollectionsPage() {
  const [activeFilter, setActiveFilter] = useState("All")

  const mockCollections: Collection[] = [
    {
      id: 1,
      title: "Fashion Week 2024",
      coverImage: "/stylish-streetwear-outfit.png",
      itemCount: 12,
      lastUpdated: "2 days ago",
      category: "Fashion",
    },
    {
      id: 2,
      title: "Food Adventures",
      coverImage: "/food-styling.jpg",
      itemCount: 8,
      lastUpdated: "1 week ago",
      category: "Food",
    },
    {
      id: 3,
      title: "Travel Diary",
      coverImage: "/sunset-marina-bay.jpg",
      itemCount: 15,
      lastUpdated: "3 days ago",
      category: "Travel",
    },
    {
      id: 4,
      title: "Behind the Scenes",
      coverImage: "/behind-the-scenes.png",
      itemCount: 6,
      lastUpdated: "5 days ago",
      category: "Lifestyle",
    },
  ]

  const filters = ["All", "Fashion", "Food", "Travel", "Lifestyle"]

  const filteredCollections =
    activeFilter === "All"
      ? mockCollections
      : mockCollections.filter((collection) => collection.category === activeFilter)

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Collections</h1>
            <p className="text-muted-foreground">Organize your content by themes</p>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <Badge
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>

        {/* Collections Grid */}
        {filteredCollections.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredCollections.map((collection) => (
              <Card key={collection.id} className="glass-card border-border/50 overflow-hidden">
                <div className="relative">
                  <img
                    src={collection.coverImage || "/placeholder.svg"}
                    alt={collection.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white font-semibold text-sm line-clamp-1">{collection.title}</h3>
                  </div>
                </div>
                <CardContent className="p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{collection.itemCount} items</span>
                    <span>{collection.lastUpdated}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Start organizing your content</h3>
              <p className="text-muted-foreground">Create collections to group your photos and videos by theme</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Create First Collection</Button>
          </div>
        )}
      </div>

      <BottomNavigation currentTab="collections" />
    </div>
  )
}
