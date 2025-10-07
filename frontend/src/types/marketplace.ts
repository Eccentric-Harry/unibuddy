// Marketplace related types
export interface ListingImage {
  url: string;
  path: string;
  alt: string;
}

export interface ListingCreateRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  images: ListingImage[];
}

export interface SellerInfo {
  id: string;
  name: string;
  avatarUrl?: string;
  year?: number;
  collegeName?: string;
}

export interface UserInfo {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface ListingResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: ListingImage[];
  status: 'ACTIVE' | 'RESERVED' | 'SOLD' | 'INACTIVE';
  seller: SellerInfo;
  reservedBy?: UserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  category?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ExpressInterestRequest {
  message?: string;
}

export interface StatusUpdateRequest {
  status: 'ACTIVE' | 'RESERVED' | 'SOLD' | 'INACTIVE';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
