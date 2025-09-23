// Images API functions

import { apiClient } from './client';
import type {
  ImageCreate,
  ImageResponse,
  ImageListResponse,
} from './types';
import { FilecoinUploadResponse, UploadService } from '../../services/upload';
import { useMutation, useQuery } from '@tanstack/react-query';

// API Functions
export const imagesApi = {
  createImage: async (imageData: ImageCreate): Promise<ImageResponse> => {
    return apiClient.post<ImageResponse>('/api/v1/internal/images', imageData);
  },

  getImage: async (imageId: number): Promise<ImageResponse> => {
    return apiClient.get<ImageResponse>(`/api/v1/internal/images/${imageId}`);
  },

  updateImage: async (imageId: number, imageData: Partial<ImageCreate>): Promise<ImageResponse> => {
    return apiClient.put<ImageResponse>(`/api/v1/internal/images/${imageId}`, imageData);
  },

  getUserImages: async (): Promise<ImageListResponse[]> => {
    return apiClient.get<ImageListResponse[]>('/api/v1/images');
  },

  getUserImage: async (imageId: number): Promise<ImageResponse> => {
    return apiClient.get<ImageResponse>(`/api/v1/images/${imageId}`);
  },

  getImageList: async (params?: {
    limit?: number;
    offset?: number;
    event_id?: number;
  }): Promise<ImageListResponse[]> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.event_id) searchParams.append('event_id', params.event_id.toString());

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get<ImageListResponse[]>(`/api/v1/getImageList${query}`);
  },
};

// Helper function to upload image file to a service (placeholder)
export const uploadImageFile = async (file: File): Promise<{
  url: string;
  cid?: string;
}> => {
  // This is a placeholder - in a real app, you'd upload to your storage service
  // For now, we'll create a local URL and simulate the upload
  return new Promise((resolve) => {
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      resolve({ url, cid: `mock-cid-${Date.now()}` });
    }, 1000);
  });
};

// Helper function to create selfie image record
export const createSelfieImage = async (file: File, userId: number): Promise<FilecoinUploadResponse> => {
  // First upload the file using UploadService with selfie type
  const uploadResult = await UploadService.uploadFile(file, userId.toString(), undefined, 'selfie');
  return uploadResult;
};

// React Query hook for uploading selfie
export const useUploadSelfie = () => {
  return useMutation({
    mutationFn: async ({ file, userId }: { file: File; userId: number }) => {
      return createSelfieImage(file, userId);
    },
  });
};

// React Query hook for getting image list
export const useImageList = (params?: {
  limit?: number;
  offset?: number;
  event_id?: number;
}) => {
  return useQuery({
    queryKey: ['images', 'list', params],
    queryFn: () => imagesApi.getImageList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

