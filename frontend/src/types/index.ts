// Types for College Buddy platform
export interface User {
  id: string;
  name: string;
  email: string;
  collegeId: number;
  year?: number;
  role: 'student' | 'admin' | 'moderator';
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface College {
  id: number;
  name: string;
  domain: string;
  verified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  collegeCode?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Message {
  id: string;
  senderId: string;
  collegeId: number;
  channel: string;
  body: string;
  attachments?: any[];
  edited: boolean;
  deleted: boolean;
  createdAt: string;
  sender?: User;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  status: 'active' | 'reserved' | 'sold';
  createdAt: string;
  seller?: User;
}

export interface Job {
  id: string;
  posterId: string;
  title: string;
  company: string;
  link: string;
  tags: string[];
  createdAt: string;
  poster?: User;
}

export interface TutorProfile {
  id: string;
  userId: string;
  subjects: string[];
  rate: number;
  availability: any; // JSON object for availability
  rating: number;
  createdAt: string;
  user?: User;
}

export interface ApiError {
  message: string;
  status: number;
}

export type LoadingState = 'idle' | 'loading' | 'error' | 'success';
