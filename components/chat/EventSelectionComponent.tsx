"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin } from "lucide-react";
import { useState } from "react";

interface Event {
  id: number;
  name: string;
  description?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
}

interface EventSelectionData {
  events_for_selection: Event[];
  message?: string;
}

interface EventSelectionComponentProps {
  data: EventSelectionData;
  onEventSelect: (eventId: string) => void;
  isLoading?: boolean;
}

export function EventSelectionComponent({ 
  data, 
  onEventSelect, 
  isLoading = false 
}: EventSelectionComponentProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const events = data.events_for_selection || [];

  const handleGenerate = () => {
    if (selectedEventId) {
      onEventSelect(selectedEventId);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (events.length === 0) {
    return (
      <Card className="glass-card border-border/50">
        <CardContent className="p-4 text-center text-muted-foreground">
          <p>No events available for selection.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/50">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Select an Event
          </h3>
          {data.message && (
            <p className="text-sm text-muted-foreground">{data.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Select
            value={selectedEventId}
            onValueChange={setSelectedEventId}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full bg-background/50 border-border/50">
              <SelectValue placeholder="Choose an event..." />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{event.name}</span>
                    {event.location && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    )}
                    {event.start_date && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.start_date)}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedEventId && (
            <div className="p-3 bg-background/30 rounded-md border border-border/30">
              {(() => {
                const selectedEvent = events.find(
                  (e) => e.id.toString() === selectedEventId
                );
                if (!selectedEvent) return null;
                return (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">
                      {selectedEvent.name}
                    </p>
                    {selectedEvent.description && (
                      <p className="text-muted-foreground text-xs">
                        {selectedEvent.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedEvent.location && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {selectedEvent.location}
                        </span>
                      )}
                      {selectedEvent.start_date && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(selectedEvent.start_date)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={!selectedEventId || isLoading}
            className="w-full bg-brand-primary hover:bg-orange-600 text-white"
          >
            {isLoading ? "Generating..." : "Generate Post Suggestion"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

