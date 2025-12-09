// Events API functions

import { apiClient } from './client';
import type { EventResponse, EventRegistrationRequest, EventRegistrationResponse, RegisteredEventResponse, EventMatchedImageResponse } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API Functions
// API Functions
export const eventsApi = {
    getEventList: async (): Promise<EventResponse[]> => {
        const response = await fetch('/api/v1/getEventList');
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    getEvent: async (eventId: number): Promise<EventResponse> => {
        const response = await fetch(`/api/v1/events/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        return response.json();
    },

    registerEvent: async (eventId: number): Promise<EventRegistrationResponse> => {
        const response = await fetch('/api/v1/register-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_id: eventId })
        });
        if (!response.ok) throw new Error('Failed to register event');
        return response.json();
    },

    getRegisteredEvents: async (): Promise<RegisteredEventResponse[]> => {
        const response = await fetch('/api/v1/my-registered-events');
        if (!response.ok) throw new Error('Failed to fetch registered events');
        return response.json();
    },

    getEventMatchedImages: async (eventId: number): Promise<EventMatchedImageResponse[]> => {
        const response = await fetch(`/api/v1/get-event-matched-image-list?event_id=${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch matched images');
        return response.json();
    },
};

// React Query hook for getting event list
export const useEventList = () => {
    return useQuery({
        queryKey: ['events', 'list'],
        queryFn: () => eventsApi.getEventList(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// React Query hook for getting a single event
export const useEvent = (eventId: number) => {
    return useQuery({
        queryKey: ['events', eventId],
        queryFn: () => eventsApi.getEvent(eventId),
        enabled: !!eventId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// React Query hook for getting registered events
export const useRegisteredEvents = () => {
    return useQuery({
        queryKey: ['events', 'registered'],
        queryFn: () => eventsApi.getRegisteredEvents(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// React Query mutation for registering to an event
export const useRegisterEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: number) => eventsApi.registerEvent(eventId),
        onSuccess: () => {
            // Invalidate and refetch events list to update UI
            queryClient.invalidateQueries({ queryKey: ['events', 'list'] });
            // Also invalidate registered events to update the count
            queryClient.invalidateQueries({ queryKey: ['events', 'registered'] });
        },
    });
};

// React Query hook for getting event matched images
export const useEventMatchedImages = (eventId: number) => {
    return useQuery({
        queryKey: ['events', eventId, 'matched-images'],
        queryFn: () => eventsApi.getEventMatchedImages(eventId),
        enabled: !!eventId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
