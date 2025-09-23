"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  User,
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
import { UserProfile } from "@/lib/api";

export default function SettingsPage() {
  const [userInfo, setUserInfo] = useState<UserProfile>();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoBackup: true,
    personalization: true,
    contentSuggestions: true,
  });

  useEffect(() => {
    const userData = localStorage.getItem("echooUser");
    if (userData) {
      const user = JSON.parse(userData);
      setUserInfo(user.user);
    }
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingSections = [
    {
      title: "Account Settings",
      items: [
        { icon: User, label: "Personal Information", hasChevron: true },
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
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

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
              <h3 className="font-semibold text-foreground">
                {userInfo?.username}
              </h3>
              <p className="text-muted-foreground">{userInfo?.instagram_url}</p>
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
              <h2 className="text-lg font-semibold text-foreground">
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
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.value && (
                          <span className="text-sm text-muted-foreground">
                            {item.value}
                          </span>
                        )}
                        {item.toggle ? (
                          <Switch
                            checked={item.value as boolean}
                            onCheckedChange={item.onToggle}
                          />
                        ) : item.hasChevron ? (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
            <h2 className="text-lg font-semibold text-foreground">
              Account Actions
            </h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-accent/50 bg-transparent"
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
