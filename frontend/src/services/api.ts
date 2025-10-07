import axios, { type AxiosResponse } from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  College,
  Message,
  Conversation,
  GlobalChat,
  GlobalMessage,
} from '../types';

import type {
  ListingCreateRequest,
  ListingResponse,
  ListingFilters,
  ExpressInterestRequest,
  StatusUpdateRequest,
  PaginatedResponse
} from '../types/marketplace';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh', {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  register: (data: RegisterRequest): Promise<AxiosResponse<{ message: string; email: string; name: string; otpSent: boolean; otpExpiryMinutes: number }>> =>
    api.post('/auth/register', data),
  
  verifyOtp: (data: { email: string; otp: string }): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/verify-otp', data),
  
  resendOtp: (data: { email: string }): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/auth/resend-otp', data),
  
  login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', data),
  
  verifyCollege: (code: string): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/auth/verify-college', { code }),
  
  logout: (): Promise<AxiosResponse<void>> =>
    api.post('/auth/logout'),
  
  getCurrentUser: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/me'),
};

// User API calls
export const userApi = {
  getProfile: (id: string): Promise<AxiosResponse<User>> =>
    api.get(`/users/${id}`),
  
  updateProfile: (data: Partial<User>): Promise<AxiosResponse<User>> =>
    api.patch('/users/profile', data),
};

// College API calls
export const collegeApi = {
  getColleges: (): Promise<AxiosResponse<College[]>> =>
    api.get('/colleges'),
  
  getCollege: (id: number): Promise<AxiosResponse<College>> =>
    api.get(`/colleges/${id}`),
};

// Chat API calls
export const chatApi = {
  getHistory: (channel: string, page = 0, size = 50): Promise<AxiosResponse<{ content: Message[]; totalPages: number }>> =>
    api.get(`/chat/history?channel=${channel}&page=${page}&size=${size}`),
  
  sendMessage: (data: { channel: string; body: string; attachments?: any[] }): Promise<AxiosResponse<Message>> =>
    api.post('/chat/messages', data),
};

// Marketplace API calls
export const marketplaceApi = {
  getListings: (filters?: {
    category?: string;
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
  }): Promise<AxiosResponse<{ content: ListingResponse[]; totalPages: number; totalElements: number }>> =>
    api.get('/listings', { params: filters }),
  
  getListing: (id: string): Promise<AxiosResponse<ListingResponse>> =>
    api.get(`/listings/${id}`),
  
  createListing: (data: FormData): Promise<AxiosResponse<ListingResponse>> =>
    api.post('/listings', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  reportListing: (id: string, reason?: string): Promise<AxiosResponse<void>> =>
    api.post(`/listings/${id}/report`, { reason }),
};

// Conversation API calls
export const conversationApi = {
  getConversations: (page = 0, size = 20): Promise<AxiosResponse<{ content: Conversation[]; totalPages: number; totalElements: number }>> =>
    api.get('/conversations', { params: { page, size } }),
  
  getConversationMessages: (conversationId: string, page = 0, size = 50): Promise<AxiosResponse<{ content: Message[]; totalPages: number; totalElements: number }>> =>
    api.get(`/conversations/${conversationId}/messages`, { params: { page, size } }),
  
  sendMessage: (conversationId: string, data: FormData): Promise<AxiosResponse<Message>> =>
    api.post(`/conversations/${conversationId}/messages`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  startConversation: (listingId: string): Promise<AxiosResponse<Conversation>> =>
    api.post(`/conversations/start/${listingId}`),
};

// Global Chat API calls
export const globalChatApi = {
  getGlobalChats: (): Promise<AxiosResponse<GlobalChat[]>> =>
    api.get('/global-chats'),
  
  getGlobalChatMessages: (globalChatId: string, page = 0, size = 50): Promise<AxiosResponse<{ content: GlobalMessage[]; totalPages: number; totalElements: number }>> =>
    api.get(`/global-chats/${globalChatId}/messages`, { params: { page, size } }),
  
  sendGlobalMessage: (globalChatId: string, data: FormData): Promise<AxiosResponse<GlobalMessage>> =>
    api.post(`/global-chats/${globalChatId}/messages`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Individual function exports for backward compatibility
export const createListing = (listing: ListingCreateRequest): Promise<AxiosResponse<ListingResponse>> => {
  return api.post('/listings', listing);
};

export const getListings = (filters?: ListingFilters): Promise<AxiosResponse<PaginatedResponse<ListingResponse>>> => {
  return api.get('/listings', { params: filters });
};

export const getListingById = (id: string): Promise<AxiosResponse<ListingResponse>> => {
  return api.get(`/listings/${id}`);
};

export const expressInterest = (listingId: string, request?: ExpressInterestRequest): Promise<AxiosResponse<{ conversationId: string; message: string }>> => {
  return api.post(`/listings/${listingId}/express-interest`, request || {});
};

export const updateListingStatus = (listingId: string, request: StatusUpdateRequest): Promise<AxiosResponse<ListingResponse>> => {
  return api.patch(`/listings/${listingId}/status`, request);
};

export const reportListing = (listingId: string, reason?: string): Promise<AxiosResponse<{ message: string }>> => {
  return api.post(`/listings/${listingId}/report`, { reason });
};

export default api;
