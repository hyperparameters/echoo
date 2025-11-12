"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePrivy } from "@privy-io/react-auth";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  User as UserIcon,
  Shield,
  Bell,
  Moon,
  Globe,
  Upload,
  HardDrive,
  Download,
  Brain,
  BarChart3,
  Lightbulb,
  HelpCircle,
  MessageSquare,
  Star,
  Info,
  LogOut,
  Trash2,
} from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { useRouter } from 'next/navigation';

// OAuth provider user data types
type OAuthUser = {
  id: string;
  name?: string;
  email?: string;
  imageUrl?: string;
  username?: string;
};

type UserWithSocials = {
  // Base user properties
  id?: string;
  username?: string;
  selfie_url?: string;
  email?: {
    address?: string;
    verified?: boolean;
  };
  
  // OAuth provider data
  twitter?: OAuthUser & {
    // Twitter-specific fields
    screenName?: string;
    profileImageUrlHttps?: string;
  };
  
  discord?: OAuthUser & {
    // Discord-specific fields
    discriminator?: string;
    avatar?: string;
    global_name?: string;
  };
  
  google?: OAuthUser & {
    // Google-specific fields
    picture?: string;
    given_name?: string;
    family_name?: string;
  };
  
  // Common OAuth fields that might be present
  oauth?: {
    provider: 'google' | 'twitter' | 'discord';
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  };
};

export default function SettingsPage() {
  const { user, logout: privyLogout } = usePrivy();
  const router = useRouter();
  
  const handleLogout = async () => {
    await privyLogout();
    router.push('/');
  };
  
  // Type assertion for the user object
  const typedUser = user as UserWithSocials;

  // Get display name based on the authentication method
  const getDisplayName = () => {
    // Try to get the most appropriate display name in order of priority
    if (typedUser?.username) return typedUser.username;
    if (typedUser?.twitter?.name) return typedUser.twitter.name;
    if (typedUser?.discord?.global_name) return typedUser.discord.global_name;
    if (typedUser?.google?.name) return typedUser.google.name;
    if (typedUser?.email?.address) return typedUser.email.address.split('@')[0];
    return 'User';
  };

  // Get social handle based on the authentication method (only one source)
  const getSocialHandle = () => {
    // Return the most specific handle in order of priority
    if (typedUser?.twitter?.screenName) return `@${typedUser.twitter.screenName}`;
    if (typedUser?.twitter?.username) return `@${typedUser.twitter.username}`;
    if (typedUser?.discord?.username) return `${typedUser.discord.username}${typedUser.discord.discriminator ? `#${typedUser.discord.discriminator}` : ''}`;
    if (typedUser?.google?.email) return typedUser.google.email;
    if (typedUser?.email?.address) return typedUser.email.address;
    return '';
  };

  // Get the best available profile picture URL
  const getProfilePictureUrl = () => {
    // First check for selfie URL from the user object
    if (typedUser?.selfie_url) {
      return typedUser.selfie_url;
    }
    
    // Fallback to OAuth provider profile pictures if no selfie is available
    if (typedUser?.google?.picture) {
      // Google profile pictures can have size parameters
      return typedUser.google.picture.replace(/=s\d+(-c)?$/, '=s400-c');
    }
    
    if (typedUser?.twitter?.profileImageUrlHttps) {
      // Twitter profile pictures can be modified to get larger sizes
      return typedUser.twitter.profileImageUrlHttps.replace('_normal', '_400x400');
    }
    
    if (typedUser?.discord?.avatar) {
      // Discord avatar URL construction if needed
      const userId = typedUser.discord.id;
      const avatarHash = typedUser.discord.avatar;
      return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=256`;
    }
    
    // Default fallback
    return '/default-avatar.png';
  };

  const userInfo = {
    username: getDisplayName(),
    selfie_url: getProfilePictureUrl(),
    social_handle: getSocialHandle()
  };
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoBackup: true,
    personalization: true,
    contentSuggestions: true,
  });


  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingSections = [
    {
      title: "Account Settings",
      items: [
        { icon: UserIcon, label: "Personal Information", hasChevron: true },
        { icon: Shield, label: "Connected Accounts", hasChevron: true },
        { icon: Shield, label: "Privacy & Security", hasChevron: true },
      ],
    },
    {
      title: "App Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          toggle: true,
          value: settings.notifications,
          onToggle: () => toggleSetting("notifications"),
        },
        {
          icon: Moon,
          label: "Dark Mode",
          toggle: true,
          value: settings.darkMode,
          onToggle: () => toggleSetting("darkMode"),
        },
        { icon: Globe, label: "Language", hasChevron: true, value: "English" },
      ],
    },
    {
      title: "Content Settings",
      items: [
        {
          icon: Upload,
          label: "Auto-backup",
          toggle: true,
          value: settings.autoBackup,
          onToggle: () => toggleSetting("autoBackup"),
        },
        { icon: HardDrive, label: "Storage Management", hasChevron: true },
        {
          icon: Download,
          label: "Download Quality",
          hasChevron: true,
          value: "High",
        },
      ],
    },
    {
      title: "AI Assistant Settings",
      items: [
        {
          icon: Brain,
          label: "Personalization",
          toggle: true,
          value: settings.personalization,
          onToggle: () => toggleSetting("personalization"),
        },
        {
          icon: BarChart3,
          label: "Growth Insights Frequency",
          hasChevron: true,
          value: "Daily",
        },
        {
          icon: Lightbulb,
          label: "Content Suggestions",
          toggle: true,
          value: settings.contentSuggestions,
          onToggle: () => toggleSetting("contentSuggestions"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", hasChevron: true },
        { icon: MessageSquare, label: "Contact Support", hasChevron: true },
        { icon: Star, label: "Rate App", hasChevron: true },
        { icon: Info, label: "Version", hasChevron: true, value: "1.0.0" },
      ],
    },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* User Info Card */}
        <Card className="glass-card border-border/50 mb-6">
          <CardContent className="p-4 flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={userInfo?.selfie_url || ""} alt="Profile" />
              <AvatarFallback className="bg-primary/20 text-primary text-lg">
                {userInfo?.username
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-white">
                {userInfo?.username}
              </h3>
              <p className="text-white/70">{userInfo?.social_handle}</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 p-0 h-auto mt-1"
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              <h2 className="text-lg font-semibold">
                {section.title}
              </h2>
              <Card className="glass-card border-border/50">
                <CardContent className="p-0">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`flex items-center justify-between p-4 ${
                        itemIndex < section.items.length - 1
                          ? "border-b border-border/50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5 text-white/80" />
                        <span className="text-white">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.value && (
                          <span className="text-sm text-white/80">
                            {item.value}
                          </span>
                        )}
                        {'toggle' in item ? (
                          <Switch
                            checked={item.value as boolean}
                            onCheckedChange={item.onToggle}
                          />
                        ) : item.hasChevron ? (
                          <ChevronRight className="w-4 h-4 text-white/80" />
                        ) : null}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Account Actions */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">
              Account Actions
            </h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-accent/50 bg-transparent"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-3" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
