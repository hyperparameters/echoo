"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Image as ImageIcon, Hash } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface PostSuggestion {
  image_link: string;
  image_id: string | number;
  generated_caption: string;
  generated_hashtags: string;
}

interface PostSuggestionsData {
  post_suggestions: PostSuggestion[];
}

interface PostSuggestionsComponentProps {
  data: PostSuggestionsData;
}

export function PostSuggestionsComponent({ data }: PostSuggestionsComponentProps) {
  const suggestions = data.post_suggestions || [];

  const copyToClipboard = (text: string, type: "Caption" | "Hashtags") => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  if (suggestions.length === 0) {
    return (
      <Card className="glass-card border-border/50">
        <CardContent className="p-4 text-center text-muted-foreground">
          <p>No post suggestions available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ImageIcon className="w-5 h-5 text-brand-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Suggested Posts
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {suggestions.map((post, index) => (
          <Card key={index} className="glass-card border-border/50 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative w-full md:w-1/3 aspect-square md:aspect-auto bg-muted">
                {post.image_link ? (
                  <Image
                    src={post.image_link}
                    alt="Suggested post image"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <CardContent className="flex-1 p-4 space-y-4">
                {/* Caption */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">Caption</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(post.generated_caption, "Caption")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-black/20 p-3 rounded-md">
                    {post.generated_caption}
                  </p>
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-brand-accent" />
                      <h4 className="text-sm font-medium text-foreground">Hashtags</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(post.generated_hashtags, "Hashtags")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-brand-primary/80 bg-brand-primary/10 p-2 rounded-md">
                    {post.generated_hashtags}
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
