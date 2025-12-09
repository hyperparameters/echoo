"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sparkles } from "lucide-react";

interface Trend {
    title: string;
    description: string;
    link?: string;
}

interface PlatformTrend {
    platform: string;
    trends: Trend[];
}

interface TrendsData {
    platform_trends: PlatformTrend[];
    personalized_trends: Trend[];
}

interface TrendsComponentProps {
    data: TrendsData;
}

export function TrendsComponent({ data }: TrendsComponentProps) {
    const { platform_trends, personalized_trends } = data;
    const platforms = platform_trends?.map((pt) => pt.platform) || [];

    if (!platform_trends && !personalized_trends) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-brand-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                    Social Media Trends
                </h3>
            </div>

            {/* Personalized Trends */}
            {personalized_trends && personalized_trends.length > 0 && (
                <Card className="glass-card border-brand-accent/30 bg-brand-accent/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center space-x-2 text-brand-accent">
                            <Sparkles className="w-4 h-4" />
                            <span>For You</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {personalized_trends.map((trend, index) => (
                            <div key={index} className="space-y-1">
                                <h4 className="text-sm font-medium text-foreground">{trend.title}</h4>
                                <p className="text-xs text-muted-foreground">{trend.description}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Platform Trends */}
            {platforms.length > 0 && (
                <Tabs defaultValue={platforms[0]} className="w-full">
                    <TabsList className="w-full bg-black/40 border border-white/10">
                        {platforms.map((platform) => (
                            <TabsTrigger key={platform} value={platform} className="flex-1">
                                {platform}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {platform_trends.map((pt) => (
                        <TabsContent key={pt.platform} value={pt.platform} className="mt-4 space-y-3">
                            {pt.trends.map((trend, index) => (
                                <Card key={index} className="glass-card border-border/50 hover:bg-white/5 transition-colors">
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-medium text-foreground">{trend.title}</h4>
                                                <p className="text-xs text-muted-foreground line-clamp-2">{trend.description}</p>
                                            </div>
                                            {trend.link && (
                                                <a href={trend.link} target="_blank" rel="noopener noreferrer">
                                                    <Badge variant="outline" className="text-[10px] h-5 hover:bg-white/10 cursor-pointer">
                                                        View
                                                    </Badge>
                                                </a>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    );
}
