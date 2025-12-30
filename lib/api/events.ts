// Events API functions

import { apiClient } from './client';
import type { EventResponse, EventRegistrationRequest, EventRegistrationResponse, RegisteredEventResponse, EventMatchedImageResponse } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API Functions - Using apiClient which automatically handles Privy auth
export const eventsApi = {
    getEventList: async (): Promise<EventResponse[]> => {
        return apiClient.get<EventResponse[]>('/api/v1/getEventList');
    },

    getEvent: async (eventId: number): Promise<EventResponse> => {
        return apiClient.get<EventResponse>(`/api/v1/public/getEventList/${eventId}`);
    },

    registerEvent: async (eventId: number): Promise<EventRegistrationResponse> => {
        return apiClient.post<EventRegistrationResponse>('/api/v1/register-event', {
            event_id: eventId
        });
    },

    getRegisteredEvents: async (): Promise<RegisteredEventResponse[]> => {
        try {
            return await apiClient.get<RegisteredEventResponse[]>('/api/v1/my-registered-events');
        } catch (error: any) {
            // Don't throw error for 401 - just return empty array (user not logged in)
            if (error?.status === 401) {
                return [];
            }
            throw error;
        }
    },

    getEventMatchedImages: async (eventId: number): Promise<EventMatchedImageResponse[]> => {
        return apiClient.get<EventMatchedImageResponse[]>(`/api/v1/get-event-matched-image-list?event_id=${eventId}`);
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
        retry: false, // Don't retry on 401
    });
};

// React Query mutation for registering to an event
export const useRegisterEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: number) => eventsApi.registerEvent(eventId),
        onSuccess: () => {
            // Invalidate and immediately refetch events list to update registered status
            queryClient.invalidateQueries({ queryKey: ['events', 'list'] });
            queryClient.refetchQueries({ queryKey: ['events', 'list'] });
            
            // Also invalidate and immediately refetch registered events to update the count and My Events tab
            queryClient.invalidateQueries({ queryKey: ['events', 'registered'] });
            queryClient.refetchQueries({ queryKey: ['events', 'registered'] });
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
