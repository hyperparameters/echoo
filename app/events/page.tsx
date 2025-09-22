"use client"

import { Calendar, MapPin, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function EventsPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Fashion Week Mumbai",
      date: "Dec 15, 2024",
      time: "6:00 PM",
      location: "Mumbai, India",
      attendees: 250,
      category: "Fashion",
      description: "Showcase your style at Mumbai's biggest fashion event",
    },
    {
      id: 2,
      title: "Food Blogger Meetup",
      date: "Dec 18, 2024",
      time: "2:00 PM",
      location: "Bangalore, India",
      attendees: 85,
      category: "Food",
      description: "Connect with fellow food enthusiasts and creators",
    },
    {
      id: 3,
      title: "Travel Photography Workshop",
      date: "Dec 22, 2024",
      time: "10:00 AM",
      location: "Goa, India",
      attendees: 45,
      category: "Travel",
      description: "Learn advanced photography techniques for travel content",
    },
  ]

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Events</h1>
            <p className="text-muted-foreground">Discover opportunities near you</p>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-[#FF6B47] to-[#008B8B] hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#FF6B47]">12</div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#008B8B]">5</div>
              <div className="text-xs text-muted-foreground">Attending</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-xs text-muted-foreground">Hosting</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Events List */}
      <div className="px-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recommended for You</h2>

        {upcomingEvents.map((event) => (
          <Card key={event.id} className="glass-card hover:bg-card/60 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-foreground">{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {event.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date} at {event.time}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees} attending
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-[#FF6B47] to-[#008B8B] hover:opacity-90">
                  Join Event
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#FF6B47] text-[#FF6B47] hover:bg-[#FF6B47] hover:text-white bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BottomNavigation currentTab="events" />
    </div>
  )
}
