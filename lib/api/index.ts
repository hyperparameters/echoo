// API module exports

export * from './types';
export * from './client';
export * from './auth';
export * from './images';

// Re-export commonly used functions
export {
  useLogin,
  useRegister,
  useProfile,
  useUpdateProfile,
  useLogout,
  localStorageHelpers,
  isOnboardingComplete,
} from './auth';

export {
  useCreateImage,
  useUpdateImage,
  useUploadSelfie,
  useUserImages,
  useImage,
  uploadImageFile,
  createSelfieImage,
} from './images';