import { api } from './api';
import type { JobPosting, JobFilters, PaginatedJobResponse } from '../types/jobs';

export const jobApi = {
  // Get all jobs with filters and pagination
  getJobs: async (filters?: JobFilters): Promise<PaginatedJobResponse<JobPosting>> => {
    const params = new URLSearchParams();

    if (filters?.jobType) params.append('jobType', filters.jobType);
    if (filters?.locationType) params.append('locationType', filters.locationType);
    if (filters?.query) params.append('query', filters.query);
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    if (filters?.sort) params.append('sort', filters.sort);

    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  // Get a specific job by ID
  getJobById: async (id: string): Promise<JobPosting> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Get job statistics
  getJobStats: async (): Promise<{
    total: number;
    internships: number;
    fullTime: number;
    partTime: number;
    remote: number;
  }> => {
    const response = await api.get('/jobs/stats');
    return response.data;
  },

  // Manually trigger job sync (admin feature)
  syncJobs: async (): Promise<{ status: string; message: string }> => {
    const response = await api.post('/jobs/sync');
    return response.data;
  },
};

