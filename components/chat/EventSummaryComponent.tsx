"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PartyPopper, Camera, MapPin, Calendar } from "lucide-react";

interface EventSummaryData {
  summary: string;
  event_name: string;
  total_photos: number;
  suggestions?: string[];
}

interface EventSummaryComponentProps {
  data: EventSummaryData;
}

export function EventSummaryComponent({ data }: EventSummaryComponentProps) {
  const { summary, event_name, total_photos, suggestions } = data;

  return (
    <Card className="glass-card border-brand-primary/30 bg-brand-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-3 text-base">
          <PartyPopper className="w-5 h-5 text-brand-primary" />
          <span>Event Summary</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Name */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground">{event_name}</h3>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Camera className="w-4 h-4 text-brand-primary" />
            <span className="text-sm text-muted-foreground">
              {total_photos} {total_photos === 1 ? "photo" : "photos"} found
            </span>
          </div>
        </div>

        {/* Summary Text */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Suggestions
            </h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 text-sm"
                >
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2" />
                  <p className="text-muted-foreground">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

