"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id: number;
  username: string;
  email?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  description?: string;
  interests?: string[];
  selfie_url?: string;
}

interface UserProfileData {
  success: boolean;
  profile: UserProfile;
}

interface UserProfileComponentProps {
  data: UserProfileData;
}

export function UserProfileComponent({ data }: UserProfileComponentProps) {
  const { profile } = data;

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-3 text-base">
          <User className="w-5 h-5 text-brand-primary" />
          <span>Your Profile</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Profile Picture */}
        {profile.selfie_url && (
          <div className="flex justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-brand-primary/30">
              <Image
                src={profile.selfie_url}
                alt={profile.username}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Username */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">
            {profile.username}
          </h3>
          {profile.email && (
            <p className="text-sm text-muted-foreground flex items-center justify-center space-x-1 mt-1">
              <Mail className="w-3 h-3" />
              <span>{profile.email}</span>
            </p>
          )}
        </div>

        {/* Description */}
        {profile.description && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-foreground">{profile.description}</p>
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="space-y-2">
          {profile.instagram_url && (
            <a
              href={profile.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-brand-primary transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </a>
          )}
          {profile.twitter_url && (
            <a
              href={profile.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-brand-primary transition-colors"
            >
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-brand-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

