// API Types based on OpenAPI specification

export interface UserProfile {
  id: number;
  username: string;
  email?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  linkedin_url?: string | null;
  description?: string | null;
  interests?: string | null; // Comma-separated string
  selfie_cid?: string | null;
  selfie_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  username: string;
  password: string;
}

export interface UserProfileUpdate {
  email?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  linkedin_url?: string | null;
  description?: string | null;
  interests?: string | null; // Comma-separated string
}

export interface UserLoginResponse {
  message: string;
  user: UserProfile;
}

export interface ImageCreate {
  name: string;
  user_id?: number | null;
  is_selfie?: boolean | null;
  fotoowl_id?: number | null;
  fotoowl_url?: string | null;
  filecoin_url?: string | null;
  filecoin_cid?: string | null;
  size?: number | null;
  description?: string | null;
  image_encoding?: string | null;
  event_id?: number | null;
}

export interface ImageResponse {
  id: number;
  name: string;
  user_id?: number | null;
  fotoowl_id?: number | null;
  fotoowl_url?: string | null;
  filecoin_url?: string | null;
  filecoin_cid?: string | null;
  size?: number | null;
  description?: string | null;
  image_encoding?: string | null;
  event_id?: number | null;
  height?: number | null;
  width?: number | null;
  created_at: string;
  updated_at: string;
}

export interface ImageListResponse {
  id: number;
  name: string;
  user_id: number;
  fotoowl_id?: number | null;
  fotoowl_url?: string | null;
  filecoin_url: string;
  filecoin_cid?: string | null;
  size: number;
  description?: string | null;
  image_encoding?: string | null;
  event_id?: number | null;
  image_url: string;
  height?: number | null;
  width?: number | null;
  created_at: string;
  updated_at: string;
}

export interface EventResponse {
  id: number;
  name: string;
  description?: string | null;
  cover_image_url?: string | null;
  cover_image_height?: number | null;
  cover_image_width?: number | null;
  event_date?: string | null;
  fotoowl_event_id?: number | null;
  fotoowl_event_key?: string | null;
  location?: string | null;
  category?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRegistrationRequest {
  event_id: number;
}

export interface EventRegistrationResponse {
  id: number;
  fotoowl_event_id: number;
  request_id: number;
  request_key: string;
  user_id: number;
  redirect_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegisteredEventResponse {
  registration_id: number;
  request_id: number;
  request_key: string;
  redirect_url: string;
  registration_created_at: string;
  event_id: number;
  event_name: string;
  event_description: string;
  event_cover_image_url: string;
  event_cover_image_height?: number | null;
  event_cover_image_width?: number | null;
  event_location?: string | null;
  event_category?: string | null;
  event_date: string;
  fotoowl_event_id: number;
  fotoowl_event_key: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// Custom types for the onboarding flow
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OnboardingState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  hasCompletedOnboarding: boolean;
  currentStep: OnboardingStep;
}

export enum OnboardingStep {
  LOGIN = 'login',
  SELFIE = 'selfie',
  DETAILS = 'details',
  WELCOME = 'welcome',
  COMPLETE = 'complete'
}

// Local storage user data structure
export interface LocalUserData {
  token?: string;
  user: UserProfile;
  onboardingCompleted: boolean;
  lastLogin: string;
}

// Form data types
export interface UserDetailsForm {
  username: string;
  email?: string;
  instagram_url?: string;
  description?: string;
  interests: string[]; // This will be added to API later
}

export interface SelfieData {
  file: File | null;
  preview: string | null;
}

// Event matched images response type
export interface EventMatchedImageResponse {
  id: number;
  name: string;
  user_id: number | null;
  fotoowl_image_id: number;
  fotoowl_url: string | null;
  filecoin_url: string;
  filecoin_cid: string;
  size: number;
  height: number;
  width: number;
  description: string | null;
  image_encoding: string | null;
  event_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}