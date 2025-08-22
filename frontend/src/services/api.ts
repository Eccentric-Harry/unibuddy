import axios, { type AxiosResponse } from 'axios';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User,
  College,
  Message,
  Listing,
  Job,
  TutorProfile 
} from '../types';

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
  register: (data: RegisterRequest): Promise<AxiosResponse<{ message: string; next: string }>> =>
    api.post('/auth/register', data),
  
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
  getListings: (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<AxiosResponse<{ content: Listing[]; totalPages: number }>> =>
    api.get('/listings', { params }),
  
  getListing: (id: string): Promise<AxiosResponse<Listing>> =>
    api.get(`/listings/${id}`),
  
  createListing: (data: FormData): Promise<AxiosResponse<Listing>> =>
    api.post('/listings', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateListing: (id: string, data: Partial<Listing>): Promise<AxiosResponse<Listing>> =>
    api.patch(`/listings/${id}`, data),
  
  deleteListing: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/listings/${id}`),
  
  reportListing: (id: string, reason: string): Promise<AxiosResponse<void>> =>
    api.post(`/listings/${id}/report`, { reason }),
};

// Jobs API calls
export const jobsApi = {
  getJobs: (params?: {
    search?: string;
    tags?: string[];
    page?: number;
    size?: number;
  }): Promise<AxiosResponse<{ content: Job[]; totalPages: number }>> =>
    api.get('/jobs', { params }),
  
  getJob: (id: string): Promise<AxiosResponse<Job>> =>
    api.get(`/jobs/${id}`),
  
  createJob: (data: Omit<Job, 'id' | 'posterId' | 'createdAt'>): Promise<AxiosResponse<Job>> =>
    api.post('/jobs', data),
  
  updateJob: (id: string, data: Partial<Job>): Promise<AxiosResponse<Job>> =>
    api.patch(`/jobs/${id}`, data),
  
  deleteJob: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/jobs/${id}`),
};

// Tutoring API calls
export const tutoringApi = {
  getTutors: (params?: {
    subject?: string;
    maxRate?: number;
    rating?: number;
    page?: number;
    size?: number;
  }): Promise<AxiosResponse<{ content: TutorProfile[]; totalPages: number }>> =>
    api.get('/tutors', { params }),
  
  getTutor: (id: string): Promise<AxiosResponse<TutorProfile>> =>
    api.get(`/tutors/${id}`),
  
  createTutorProfile: (data: Omit<TutorProfile, 'id' | 'userId' | 'createdAt' | 'rating'>): Promise<AxiosResponse<TutorProfile>> =>
    api.post('/tutors', data),
  
  updateTutorProfile: (id: string, data: Partial<TutorProfile>): Promise<AxiosResponse<TutorProfile>> =>
    api.patch(`/tutors/${id}`, data),
  
  requestSession: (tutorId: string, data: { subject: string; preferredTime: string; message?: string }): Promise<AxiosResponse<void>> =>
    api.post(`/tutors/${tutorId}/requests`, data),
};

export default api;
