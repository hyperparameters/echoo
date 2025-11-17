"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, ExternalLink, Calendar } from "lucide-react";
import Image from "next/image";

interface InstagramPost {
  id: number;
  instagram_post_id: string;
  caption?: string;
  media_url: string;
  media_type: string;
  permalink?: string;
  timestamp?: string;
  is_public: boolean;
}

interface InstagramPostsData {
  success: boolean;
  posts: InstagramPost[];
  total_posts: number;
}

interface InstagramPostsComponentProps {
  data: InstagramPostsData;
}

export function InstagramPostsComponent({
  data,
}: InstagramPostsComponentProps) {
  const { posts, total_posts } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Instagram className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Your Instagram Posts
          </h3>
        </div>
        <Badge variant="secondary">{total_posts} Posts</Badge>
      </div>

      {posts.length === 0 ? (
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 text-center text-muted-foreground">
            <Instagram className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No Instagram posts found.</p>
            <p className="text-xs mt-2">
              Update your profile with your Instagram URL to sync posts.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="glass-card border-border/50 overflow-hidden"
            >
              {/* Post Image */}
              <div className="relative aspect-square w-full bg-muted">
                {post.media_url ? (
                  <Image
                    src={post.media_url}
                    alt={post.caption || "Instagram post"}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Instagram className="w-12 h-12" />
                  </div>
                )}
                {/* Media Type Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {post.media_type}
                  </Badge>
                </div>
              </div>

              {/* Post Details */}
              <CardContent className="p-3 space-y-2">
                {/* Caption */}
                {post.caption && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {post.caption}
                  </p>
                )}

                {/* Timestamp */}
                {post.timestamp && (
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* View on Instagram Link */}
                {post.permalink && (
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-xs text-brand-primary hover:text-brand-accent transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View on Instagram</span>
                  </a>
                )}

                {/* Public/Private Badge */}
                <div className="flex justify-between items-center">
                  <Badge
                    variant={post.is_public ? "default" : "outline"}
                    className="text-xs"
                  >
                    {post.is_public ? "Public" : "Private"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

