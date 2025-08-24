import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { ListingFilters as ListingFiltersType } from '../../types';

interface ListingFiltersProps {
  filters: ListingFiltersType;
  onFiltersChange: (filters: ListingFiltersType) => void;
}

const CATEGORIES = [
  'Electronics',
  'Books',
  'Furniture',
  'Clothing',
  'Sports',
  'Kitchen',
  'Other'
];

export function ListingFilters({ filters, onFiltersChange }: ListingFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: ListingFiltersType = {
      page: 0,
      size: 20,
      sort: 'createdAt',
      direction: 'DESC'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Category Filter */}
        <div>
          <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
            Category
          </Label>
          <select
            id="category"
            value={localFilters.category || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <Label htmlFor="minPrice" className="text-sm font-medium text-gray-700 mb-2 block">
            Min Price
          </Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            value={localFilters.minPrice || ''}
            onChange={(e) => setLocalFilters({ 
              ...localFilters, 
              minPrice: e.target.value ? Number(e.target.value) : undefined 
            })}
          />
        </div>

        <div>
          <Label htmlFor="maxPrice" className="text-sm font-medium text-gray-700 mb-2 block">
            Max Price
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="1000"
            value={localFilters.maxPrice || ''}
            onChange={(e) => setLocalFilters({ 
              ...localFilters, 
              maxPrice: e.target.value ? Number(e.target.value) : undefined 
            })}
          />
        </div>

        {/* Sort */}
        <div>
          <Label htmlFor="sort" className="text-sm font-medium text-gray-700 mb-2 block">
            Sort By
          </Label>
          <select
            id="sort"
            value={`${localFilters.sort}_${localFilters.direction}`}
            onChange={(e) => {
              const [sort, direction] = e.target.value.split('_');
              setLocalFilters({ 
                ...localFilters, 
                sort, 
                direction: direction as 'ASC' | 'DESC' 
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="createdAt_DESC">Newest First</option>
            <option value="createdAt_ASC">Oldest First</option>
            <option value="price_ASC">Price: Low to High</option>
            <option value="price_DESC">Price: High to Low</option>
            <option value="title_ASC">Title: A to Z</option>
            <option value="title_DESC">Title: Z to A</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <Button onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleResetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
}
