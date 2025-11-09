import { api } from './api';
import type { TutoringListing, PaginatedTutoringResponse, TutoringFilters } from '../types/tutoring';

export interface CreateTutoringListingData {
  title: string;
  description: string;
  hourlyRate: number;
  subjects: string[];
  syllabus: string[];
  availability: string[];
}

export const tutoringApi = {
  // Get all tutoring listings with filters
  getListings: async (filters?: TutoringFilters): Promise<PaginatedTutoringResponse> => {
    const params = new URLSearchParams();

    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sort) params.append('sort', filters.sort);

    const response = await api.get(`/tutoring?${params.toString()}`);
    return response.data;
  },

  // Get a single tutoring listing by ID
  getListingById: async (id: string): Promise<TutoringListing> => {
    const response = await api.get(`/tutoring/${id}`);
    return response.data;
  },

  // Get current user's tutoring listings
  getMyListings: async (): Promise<TutoringListing[]> => {
    const response = await api.get('/tutoring/my-listings');
    return response.data;
  },

  // Create a new tutoring listing
  createListing: async (data: CreateTutoringListingData): Promise<TutoringListing> => {
    const response = await api.post('/tutoring', data);
    return response.data;
  },

  // Update a tutoring listing
  updateListing: async (id: string, data: CreateTutoringListingData): Promise<TutoringListing> => {
    const response = await api.put(`/tutoring/${id}`, data);
    return response.data;
  },

  // Update listing status
  updateStatus: async (id: string, status: 'ACTIVE' | 'BOOKED' | 'INACTIVE'): Promise<TutoringListing> => {
    const response = await api.patch(`/tutoring/${id}/status?status=${status}`);
    return response.data;
  },

  // Delete a tutoring listing
  deleteListing: async (id: string): Promise<void> => {
    await api.delete(`/tutoring/${id}`);
  },
};

