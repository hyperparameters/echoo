"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRegisterEvent } from "@/lib/api/events";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface JoinEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventName: string;
  onJoinStart?: () => void;
  onJoinSuccess?: () => void;
}

export function JoinEventDialog({
  isOpen,
  onClose,
  eventId,
  eventName,
  onJoinStart,
  onJoinSuccess,
}: JoinEventDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const queryClient = useQueryClient();
  const registerEventMutation = useRegisterEvent();

  const handleJoinEvent = async () => {
    setIsConfirming(true);
    onJoinStart?.(); // Notify parent component that join process has started
    try {
      await registerEventMutation.mutateAsync(eventId);
      
      toast.success("Successfully joined the event!", {
        description:
          "You can now view the gallery and your photos will be matched automatically.",
      });
      
      onJoinSuccess?.(); // Notify parent of successful join
      onClose();
    } catch (error: any) {
      console.error("Failed to join event:", error);
      const errorMessage = error?.message || "Please try again later.";
      toast.error("Failed to join event", {
        description: errorMessage,
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Join Event</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to join <strong>{eventName}</strong>?
            </p>
            <p className="text-sm text-white/70">
              Your selfie will be used to automatically find and retrieve your
              photos from this event.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleJoinEvent}
            disabled={isConfirming}
            className="bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary/90 hover:to-brand-accent/90"
          >
            {isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Yes, Join Event"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
