"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, CheckCircle } from "lucide-react";

interface Event {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  is_active: boolean;
  registration_date?: string;
}

interface RegisteredEventsData {
  success: boolean;
  events: Event[];
  total_events: number;
}

interface RegisteredEventsComponentProps {
  data: RegisteredEventsData;
}

export function RegisteredEventsComponent({
  data,
}: RegisteredEventsComponentProps) {
  const { events, total_events } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Your Registered Events
          </h3>
        </div>
        <Badge variant="secondary">{total_events} Events</Badge>
      </div>

      {events.length === 0 ? (
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>You haven't registered for any events yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{event.name}</span>
                  {event.is_active && (
                    <Badge
                      variant="outline"
                      className="text-xs text-green-500 border-green-500/30"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 pt-0">
                {event.description && (
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                )}

                {event.location && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.start_date && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(event.start_date).toLocaleDateString()}
                      {event.end_date &&
                        ` - ${new Date(event.end_date).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

