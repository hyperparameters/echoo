"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Instagram } from "lucide-react"

export default function DetailsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    instagramHandle: "",
    bio: "",
    interests: [] as string[],
  })

  const availableInterests = [
    "Fashion",
    "Food",
    "Travel",
    "Fitness",
    "Beauty",
    "Tech",
    "Lifestyle",
    "Photography",
    "Music",
    "Art",
    "Gaming",
    "Sports",
  ]

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = () => {
    if (formData.fullName && formData.interests.length > 0) {
      // Store user data in localStorage for demo
      localStorage.setItem("echooUser", JSON.stringify(formData))
      router.push("/welcome")
    }
  }

  const isValid = formData.fullName.trim() && formData.interests.length > 0

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Tell us about yourself</h1>
        <p className="text-muted-foreground">Help us personalize your experience</p>
      </div>

      {/* Form */}
      <div className="flex-1 space-y-6">
        {/* Personal Information */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  placeholder="@yourusername"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, instagramHandle: e.target.value }))}
                  className="bg-input border-border pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <Label>Select your interests *</Label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      formData.interests.includes(interest)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a bit about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                className="bg-input border-border resize-none"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/200</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  )
}
