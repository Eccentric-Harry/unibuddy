// Job posting related types

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: Company;
  location: string;
  locationType: 'On-site' | 'Remote' | 'Hybrid';
  jobType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  applicationDeadline?: string;
  postedBy: {
    id: string;
    name: string;
    role: string;
  };
  applicationUrl?: string;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  jobType?: string;
  locationType?: string;
  query?: string;
  skills?: string[];
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedJobResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

