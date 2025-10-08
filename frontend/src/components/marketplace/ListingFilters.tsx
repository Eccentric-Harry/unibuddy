import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import type { ListingFilters as ListingFiltersType } from '../../types/marketplace';

interface ListingFiltersProps {
  onFilterChange: (filters: ListingFiltersType) => void;
  initialFilters?: ListingFiltersType;
}

const CATEGORIES = [
  'All Categories',
  'Books',
  'Electronics',
  'Clothing',
  'Furniture',
  'Tickets',
  'Services',
  'Miscellaneous'
];

const ListingFilters = ({ onFilterChange, initialFilters }: ListingFiltersProps) => {
  const [query, setQuery] = useState(initialFilters?.query || '');
  const [category, setCategory] = useState(initialFilters?.category || '');
  const [minPrice, setMinPrice] = useState<string>(
    initialFilters?.minPrice ? initialFilters.minPrice.toString() : ''
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    initialFilters?.maxPrice ? initialFilters.maxPrice.toString() : ''
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: ListingFiltersType = {
      query: query || undefined,
      category: category === 'All Categories' ? undefined : category.toLowerCase() || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };

    onFilterChange(filters);
  };

  const handleReset = () => {
    setQuery('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');

    onFilterChange({});
  };

  useEffect(() => {
    // Apply filters on initial render if provided
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      onFilterChange(initialFilters);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search listings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="w-full md:w-1/4">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat === 'All Categories' ? '' : cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              Apply Filters
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                step="0.01"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                step="0.01"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="text-gray-500"
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export { ListingFilters };
