// Events API functions

import { apiClient } from './client';
import type { EventResponse, EventRegistrationRequest, EventRegistrationResponse, RegisteredEventResponse } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API Functions
export const eventsApi = {
    getEventList: async (): Promise<EventResponse[]> => {
        return apiClient.get<EventResponse[]>('/api/v1/getEventList');
    },

    getEvent: async (eventId: number): Promise<EventResponse> => {
        return apiClient.get<EventResponse>(`/api/v1/events/${eventId}`);
    },

    registerEvent: async (eventId: number): Promise<EventRegistrationResponse> => {
        return apiClient.post<EventRegistrationResponse>('/api/v1/register-event', {
            event_id: eventId
        });
    },

    getRegisteredEvents: async (): Promise<RegisteredEventResponse[]> => {
        return apiClient.get<RegisteredEventResponse[]>('/api/v1/my-registered-events');
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
