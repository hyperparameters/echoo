"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Instagram, Mail, Loader2, User } from 'lucide-react';
import { useUpdateProfile } from '@/lib/api';
import type { UserProfile, UserDetailsForm } from '@/lib/api';

interface DetailsComponentProps {
  user: UserProfile;
  onDetailsCompleted: (user: UserProfile) => void;
}

export function DetailsComponent({ user, onDetailsCompleted }: DetailsComponentProps) {
  const [formData, setFormData] = useState<UserDetailsForm>({
    username: user.username || '',
    email: user.email || '',
    instagram_url: user.instagram_url || '',
    description: user.description || '',
    interests: [], // This will be added to API later
  });

  const updateProfileMutation = useUpdateProfile();

  // Available interests (will be moved to API/config later)
  const availableInterests = [
    'Fashion',
    'Food',
    'Travel',
    'Fitness',
    'Beauty',
    'Tech',
    'Lifestyle',
    'Photography',
    'Music',
    'Art',
    'Gaming',
    'Sports',
    'Business',
    'Health',
    'Nature',
    'Design',
  ];

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.username.trim()) {
      return;
    }

    try {
      // Prepare update data (only include fields that exist in API)
      const updateData = {
        email: formData.email || null,
        instagram_url: formData.instagram_url || null,
        description: formData.description || null,
      };

      const updatedUser = await updateProfileMutation.mutateAsync(updateData);

      // Note: interests will need to be handled separately when added to API
      // For now, we'll store them in localStorage
      if (formData.interests.length > 0) {
        const userData = JSON.parse(localStorage.getItem('echooUser') || '{}');
        userData.interests = formData.interests;
        localStorage.setItem('echooUser', JSON.stringify(userData));
      }

      onDetailsCompleted(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  // Check if minimum required fields are filled
  const isValid = formData.username.trim() &&
    (formData.email || formData.instagram_url || formData.description);

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
        <p className="text-muted-foreground">
          Tell us about yourself to personalize your experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Enter your full name"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, username: e.target.value }))
                  }
                  className="bg-input border-border pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="bg-input border-border pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  placeholder="@yourusername"
                  value={formData.instagram_url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, instagram_url: e.target.value }))
                  }
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
              <Label>Select your interests</Label>
              <p className="text-xs text-muted-foreground">
                Choose topics you're passionate about (optional)
              </p>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border-border hover:border-primary/50 hover:bg-primary/10'
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              {formData.interests.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formData.interests.length} interests selected
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a bit about yourself..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="bg-input border-border resize-none min-h-[80px]"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.description.length}/200
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Validation Message */}
        {!isValid && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertDescription className="text-yellow-700 dark:text-yellow-400">
              Please fill in your name and at least one contact method (email or Instagram).
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {updateProfileMutation.error && (
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertDescription className="text-destructive">
              {updateProfileMutation.error.message || 'Failed to update profile. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || updateProfileMutation.isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating Profile...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        * Required fields. You can update this information later in settings.
      </p>
    </div>
  );
}