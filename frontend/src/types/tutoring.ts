// Tutoring related types
export interface TutorInfo {
  id: string;
  name: string;
  avatarUrl?: string;
  year?: number;
  collegeName?: string;
  major?: string;
  rating?: number;
  totalReviews?: number;
}

export interface Subject {
  id: string;
  name: string;
  iconUrl: string;
}

export interface TutoringListing {
  id: string;
  title: string;
  description: string;
  hourlyRate: number;
  subjects: Subject[];
  syllabus: string[];
  availability: string[];
  status: 'ACTIVE' | 'BOOKED' | 'INACTIVE';
  tutor: TutorInfo;
  createdAt: string;
  updatedAt: string;
}

export interface TutoringFilters {
  page?: number;
  size?: number;
  subject?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface PaginatedTutoringResponse {
  content: TutoringListing[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
