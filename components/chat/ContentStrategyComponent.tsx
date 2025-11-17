"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Lightbulb, TrendingUp } from "lucide-react";

interface ContentIdea {
  type: string;
  description: string;
  platforms: string[];
  timing: string;
}

interface Strategy {
  overview: string;
  posting_schedule: {
    frequency: string;
    best_times: string[];
    recommendation: string;
  };
  content_ideas: ContentIdea[];
  engagement_tips: string[];
}

interface ContentStrategyData {
  strategy: Strategy;
}

interface ContentStrategyComponentProps {
  data: ContentStrategyData;
}

export function ContentStrategyComponent({
  data,
}: ContentStrategyComponentProps) {
  const { strategy } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Target className="w-5 h-5 text-brand-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Your Content Strategy
        </h3>
      </div>

      {/* Overview */}
      <Card className="glass-card border-brand-primary/30 bg-brand-primary/5">
        <CardContent className="p-4">
          <p className="text-foreground font-medium">{strategy.overview}</p>
        </CardContent>
      </Card>

      {/* Posting Schedule */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Posting Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Frequency
            </p>
            <p className="text-sm text-muted-foreground">
              {strategy.posting_schedule.frequency}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Best Times to Post
            </p>
            <div className="flex flex-wrap gap-2">
              {strategy.posting_schedule.best_times.map((time, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {time}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-lg p-3">
            <p className="text-sm text-foreground">
              {strategy.posting_schedule.recommendation}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content Ideas */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Content Ideas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {strategy.content_ideas.map((idea, index) => (
            <div
              key={index}
              className="border-l-2 border-brand-primary/30 pl-3 space-y-2"
            >
              <div>
                <h4 className="font-medium text-foreground text-sm">
                  {idea.type}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {idea.description}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Platforms:</span>
                <div className="flex flex-wrap gap-1">
                  {idea.platforms.map((platform, pIndex) => (
                    <Badge
                      key={pIndex}
                      variant="outline"
                      className="text-xs capitalize"
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                ⏰ {idea.timing}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Engagement Tips */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Engagement Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {strategy.engagement_tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2" />
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

