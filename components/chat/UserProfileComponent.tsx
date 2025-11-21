"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Instagram, Twitter, Linkedin, Mail, Wallet, Calendar, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id?: number;
  username?: string;
  email?: string;
  full_name?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  description?: string;
  interests?: string | string[];
  selfie_url?: string;
  selfie_cid?: string;
  privy_id?: string;
  wallet_address?: string;
  linked_wallets?: string | object;
  linked_emails?: string | object;
  linked_google?: string;
  linked_twitter?: string;
  linked_discord?: string;
  privy_created_at?: string;
  privy_last_login?: string;
  created_at?: string;
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

  // Parse interests if it's a JSON string
  const parseInterests = (interests: string | string[] | undefined): string[] => {
    if (!interests) return [];
    if (Array.isArray(interests)) return interests;
    if (typeof interests !== 'string') return [];
    
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(interests);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'string') return [parsed];
      return [];
    } catch {
      // If it's not valid JSON, try splitting by comma
      if (interests.includes(',')) {
        return interests.split(',').map(i => i.trim());
      }
      // Otherwise treat as single interest
      return interests.trim() ? [interests.trim()] : [];
    }
  };

  const interests = parseInterests(profile.interests);

  return (
    <div className="space-y-3">
      {/* Main Profile Card */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-3 text-base">
            <User className="w-5 h-5 text-brand-primary" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Profile Picture */}
          {profile.selfie_url && (
            <div className="flex justify-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-brand-primary/30">
                <Image
                  src={profile.selfie_url}
                  alt={profile.username || "Profile"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Name and Username */}
          <div className="text-center">
            {profile.full_name && (
              <h3 className="text-xl font-semibold text-foreground">
                {profile.full_name}
              </h3>
            )}
            {profile.username && (
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            )}
          </div>

          {/* Description */}
          {profile.description && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-foreground">{profile.description}</p>
            </div>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Primary Email */}
          {profile.email && (
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-brand-primary" />
              <span className="text-muted-foreground">{profile.email}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Accounts Card */}
      {(profile.instagram_url || profile.twitter_url || profile.linkedin_url || 
        profile.linked_google || profile.linked_twitter || profile.linked_discord) && (
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              <LinkIcon className="w-4 h-4 inline mr-2 text-brand-primary" />
              Connected Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.instagram_url && (
              <a
                href={profile.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:text-brand-primary transition-colors"
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
                className="flex items-center space-x-2 text-sm hover:text-brand-primary transition-colors"
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
                className="flex items-center space-x-2 text-sm hover:text-brand-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {profile.linked_google && (
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-muted-foreground">Google: {profile.linked_google}</span>
              </div>
            )}
            {profile.linked_twitter && (
              <div className="flex items-center space-x-2 text-sm">
                <Twitter className="w-4 h-4 text-blue-400" />
                <span className="text-muted-foreground">Twitter: {profile.linked_twitter}</span>
              </div>
            )}
            {profile.linked_discord && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">🎮 Discord: {profile.linked_discord}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Wallet & Blockchain Card */}
      {(profile.wallet_address || profile.privy_id) && (
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              <Wallet className="w-4 h-4 inline mr-2 text-brand-primary" />
              Blockchain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.wallet_address && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Wallet Address</p>
                <p className="text-sm font-mono text-foreground break-all">
                  {profile.wallet_address}
                </p>
              </div>
            )}
            {profile.privy_id && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Privy ID</p>
                <p className="text-sm font-mono text-foreground break-all">
                  {profile.privy_id}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Account Metadata Card */}
      {(profile.created_at || profile.privy_created_at || profile.privy_last_login) && (
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              <Calendar className="w-4 h-4 inline mr-2 text-brand-primary" />
              Account Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {profile.created_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            )}
            {profile.privy_created_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Privy Created:</span>
                <span>{new Date(profile.privy_created_at).toLocaleDateString()}</span>
              </div>
            )}
            {profile.privy_last_login && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login:</span>
                <span>{new Date(profile.privy_last_login).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

