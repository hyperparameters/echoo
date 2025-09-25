"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Hash } from "lucide-react";

interface Trend {
  title: string;
  description: string;
}

interface PlatformTrend {
  platform: string;
  trends: Trend[];
}

interface PersonalizedTrend {
  title: string;
  description: string;
}

interface PlatformTrendsData {
  platform_trends: PlatformTrend[];
  personalized_trends: PersonalizedTrend[];
}

interface PlatformTrendsComponentProps {
  data: PlatformTrendsData;
}

const platformIcons: Record<string, React.ReactNode> = {
  Instagram: (
    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-xs font-bold">
      IG
    </div>
  ),
  TikTok: (
    <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-xs font-bold">
      TT
    </div>
  ),
  X: (
    <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-xs font-bold">
      X
    </div>
  ),
  YouTube: (
    <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
      YT
    </div>
  ),
  LinkedIn: (
    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
      LI
    </div>
  ),
};

export function PlatformTrendsComponent({
  data,
}: PlatformTrendsComponentProps) {
  return (
    <div className="space-y-6">
      {/* Platform Trends Section */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Platform Trends
          </h3>
        </div>

        <div className="grid gap-4">
          {data.platform_trends.map((platformTrend, index) => (
            <Card key={index} className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3 text-base">
                  {platformIcons[platformTrend.platform] || (
                    <Users className="w-5 h-5" />
                  )}
                  <span>{platformTrend.platform}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {platformTrend.trends.map((trend, trendIndex) => (
                    <div
                      key={trendIndex}
                      className="border-l-2 border-brand-primary/30 pl-3"
                    >
                      <h4 className="font-medium text-foreground text-sm mb-1">
                        {trend.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {trend.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Personalized Trends Section */}
      {data.personalized_trends && data.personalized_trends.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Hash className="w-5 h-5 text-brand-accent" />
            <h3 className="text-lg font-semibold text-foreground">
              Personalized Recommendations
            </h3>
          </div>

          <div className="grid gap-3">
            {data.personalized_trends.map((trend, index) => (
              <Card
                key={index}
                className="glass-card border-brand-accent/30 bg-brand-accent/5"
              >
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground text-sm mb-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                    <span>{trend.title}</span>
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {trend.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
