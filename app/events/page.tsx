"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/app-layout";
import { useEventList, useRegisteredEvents } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { JoinEventDialog } from "@/components/join-event-dialog";

export default function EventsPage() {
  const { data: events, isLoading, error } = useEventList();
  const {
    data: registeredEvents,
    isLoading: isLoadingRegistered,
    error: registeredError,
  } = useRegisteredEvents();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle join event click
  const handleJoinEvent = (eventId: number, eventName: string) => {
    setSelectedEvent({ id: eventId, name: eventName });
    setJoinDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setJoinDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Events</h1>
            <p className="text-muted-foreground">
              Discover opportunities near you
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-brand-primary">
                {events?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Available</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-brand-accent">
                {registeredEvents?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Attending</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-muted-foreground">Hosting</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Events Tabs */}
      <div className="px-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="registered">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Recommended for You
            </h2>

            {isLoading ? (
              // Loading skeleton
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="glass-card overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-6 w-16 ml-2" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Skeleton className="h-8 flex-1" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              // Error state
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Failed to load events. Please try again later.
                  </p>
                </CardContent>
              </Card>
            ) : events && events.length > 0 ? (
              // Events list
              events.map((event) => (
                <Card
                  key={event.id}
                  className="glass-card hover:bg-card/60 transition-colors overflow-hidden"
                >
                  {event.cover_image_url && (
                    <div className="relative h-48 w-full">
                      <img
                        src={event.cover_image_url}
                        alt={event.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground">
                          {event.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                      {event.category && (
                        <Badge variant="secondary" className="ml-2">
                          {event.category}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {event.event_date && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatEventDate(event.event_date)}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="gradient"
                        className="flex-1"
                        onClick={() => handleJoinEvent(event.id, event.name)}
                      >
                        Join Event
                      </Button>
                      <Button size="sm" variant="brand-outline">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Empty state
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    No events available at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="registered" className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              My Registered Events
            </h2>

            {isLoadingRegistered ? (
              // Loading skeleton for registered events
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="glass-card overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-6 w-16 ml-2" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Skeleton className="h-8 flex-1" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : registeredError ? (
              // Error state for registered events
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Failed to load your registered events. Please try again
                    later.
                  </p>
                </CardContent>
              </Card>
            ) : registeredEvents && registeredEvents.length > 0 ? (
              // Registered events list
              registeredEvents.map((registeredEvent) => (
                <Card
                  key={registeredEvent.registration_id}
                  className="glass-card hover:bg-card/60 transition-colors overflow-hidden"
                >
                  {registeredEvent.event_cover_image_url && (
                    <div className="relative h-48 w-full">
                      <img
                        src={registeredEvent.event_cover_image_url}
                        alt={registeredEvent.event_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground">
                          {registeredEvent.event_name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {registeredEvent.event_description}
                        </p>
                      </div>
                      {registeredEvent.event_category && (
                        <Badge variant="secondary" className="ml-2">
                          {registeredEvent.event_category}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {registeredEvent.event_date && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatEventDate(registeredEvent.event_date)}
                        </div>
                      )}
                      {registeredEvent.event_location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {registeredEvent.event_location}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="gradient"
                        className="flex-1"
                        onClick={() =>
                          window.open(registeredEvent.redirect_url, "_blank")
                        }
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Gallery
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Empty state for registered events
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    You haven't registered for any events yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Join Event Dialog */}
      {selectedEvent && (
        <JoinEventDialog
          isOpen={joinDialogOpen}
          onClose={handleDialogClose}
          eventId={selectedEvent.id}
          eventName={selectedEvent.name}
        />
      )}
    </AppLayout>
  );
}
