// Types for College Buddy platform
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
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

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  status: 'ACTIVE' | 'SOLD' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    name: string;
    avatarUrl?: string;
    year?: number;
    collegeName?: string;
  };
}

export interface CreateListingRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  images?: FileList;
}

export interface Conversation {
  id: string;
  listing: {
    id: string;
    title: string;
    firstImage?: string;
  };
  otherUser: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  lastMessage?: {
    messageText: string;
    createdAt: string;
    fromCurrentUser: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  messageText: string;
  imageUrl?: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

export interface SendMessageRequest {
  messageText: string;
  image?: File;
}

export interface GlobalChat {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  collegeId: number;
  collegeName: string;
  lastMessage?: {
    messageText: string;
    createdAt: string;
    senderName: string;
    senderId: string;
  };
  messageCount: number;
}

export interface GlobalMessage {
  id: string;
  messageText: string;
  imageUrl?: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
    year?: number;
  };
  globalChatId: string;
}

export interface SendGlobalMessageRequest {
  messageText: string;
  image?: File;
}

export interface ChatTab {
  id: 'marketplace' | 'global';
  name: string;
  count?: number;
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

// Re-export marketplace types
export * from './marketplace';
