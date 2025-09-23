// Images API functions and React Query hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  ImageCreate,
  ImageResponse,
  ImageListResponse,
  LocalUserData,
} from './types';
import { localStorageHelpers } from './auth';

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
export const createSelfieImage = async (file: File, userId: number): Promise<ImageResponse> => {
  // First upload the file
  const uploadResult = await uploadImageFile(file);

  // Then create the image record
  const imageData: ImageCreate = {
    name: `selfie-${Date.now()}`,
    user_id: userId,
    is_selfie: true,
    fotoowl_url: uploadResult.url,
    filecoin_cid: uploadResult.cid,
    size: file.size,
    description: 'User selfie',
    image_encoding: file.type,
  };

  return imagesApi.createImage(imageData);
};

// React Query Hooks
export const useCreateImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: imagesApi.createImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};

export const useUpdateImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, data }: { imageId: number; data: Partial<ImageCreate> }) =>
      imagesApi.updateImage(imageId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['image', variables.imageId] });
    },
  });
};

export const useUploadSelfie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, userId }: { file: File; userId: number }) => {
      const imageResponse = await createSelfieImage(file, userId);

      // Update the user's selfie_url in profile if successful
      const userData = localStorageHelpers.getUserData();
      if (userData && imageResponse.fotoowl_url) {
        const updatedUser = {
          ...userData.user,
          selfie_url: imageResponse.fotoowl_url,
          selfie_cid: imageResponse.filecoin_cid,
        };

        localStorageHelpers.updateUserData(updatedUser);
        queryClient.setQueryData(['user', 'profile'], updatedUser);
      }

      return imageResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useUserImages = (params?: {
  limit?: number;
  offset?: number;
  event_id?: number;
}) => {
  return useQuery({
    queryKey: ['images', 'user', params],
    queryFn: () => imagesApi.getImageList(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useImage = (imageId: number) => {
  return useQuery({
    queryKey: ['image', imageId],
    queryFn: () => imagesApi.getImage(imageId),
    enabled: !!imageId,
  });
};