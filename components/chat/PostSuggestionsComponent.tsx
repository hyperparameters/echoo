"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Copy, Heart, Share2, Download } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface PostSuggestion {
  image_link: string;
  image_id: string;
  generated_caption: string;
  generated_hashtags: string;
}

interface PostSuggestionsData {
  post_suggestions: PostSuggestion[];
}

interface PostSuggestionsComponentProps {
  data: PostSuggestionsData;
}

export function PostSuggestionsComponent({
  data,
}: PostSuggestionsComponentProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (
    text: string,
    type: string,
    postId: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [`${postId}_${type}`]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [`${postId}_${type}`]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const parseHashtags = (hashtags: string) => {
    return hashtags.split(" ").filter((tag) => tag.startsWith("#"));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <ImageIcon className="w-5 h-5 text-brand-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Post Suggestions
        </h3>
      </div>

      {data.post_suggestions.map((post, index) => (
        <Card
          key={index}
          className="glass-card border-border/50 overflow-hidden"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Suggested Post #{index + 1}</span>
              <Badge variant="outline" className="text-xs">
                ID: {post.image_id}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Image */}
            <div className="relative aspect-square w-full max-w-sm mx-auto rounded-lg overflow-hidden bg-muted">
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

            {/* Caption */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground text-sm">Caption</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      post.generated_caption,
                      "caption",
                      post.image_id
                    )
                  }
                  className="h-6 px-2 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copiedStates[`${post.image_id}_caption`]
                    ? "Copied!"
                    : "Copy"}
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {post.generated_caption}
                </p>
              </div>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground text-sm">
                  Hashtags
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      post.generated_hashtags,
                      "hashtags",
                      post.image_id
                    )
                  }
                  className="h-6 px-2 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copiedStates[`${post.image_id}_hashtags`]
                    ? "Copied!"
                    : "Copy"}
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {parseHashtags(post.generated_hashtags).map(
                  (hashtag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-brand-primary/20 hover:text-brand-primary"
                      onClick={() =>
                        copyToClipboard(
                          hashtag,
                          "hashtag",
                          `${post.image_id}_${tagIndex}`
                        )
                      }
                    >
                      {hashtag}
                    </Badge>
                  )
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
