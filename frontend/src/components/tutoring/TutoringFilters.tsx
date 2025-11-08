import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import type { TutoringFilters } from '../../types/tutoring';

interface FiltersProps {
  onFilterChange: (filters: TutoringFilters) => void;
  initialFilters?: TutoringFilters;
}

export function TutoringFilters({ onFilterChange, initialFilters }: FiltersProps) {
  const [filters, setFilters] = useState<TutoringFilters>(
    initialFilters || {
      page: 0,
      size: 12,
      sort: 'createdAt,desc',
    }
  );

  const [localFilters, setLocalFilters] = useState({
    searchQuery: '',
    minPrice: '',
    maxPrice: '',
    subject: '',
  });

  const subjectOptions = [
    { id: 'python', name: 'Python' },
    { id: 'calculus', name: 'Calculus' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'physics', name: 'Physics' },
    { id: 'react', name: 'React' },
    { id: 'nodejs', name: 'Node.js' },
    { id: 'linear-algebra', name: 'Linear Algebra' },
    { id: 'organic-chemistry', name: 'Organic Chemistry' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFilters = { ...filters };
    if (localFilters.searchQuery) {
      updatedFilters.subject = localFilters.searchQuery;
    } else {
      delete updatedFilters.subject;
    }
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = () => {
    const updatedFilters = { ...filters };
    if (localFilters.minPrice) {
      updatedFilters.minPrice = parseFloat(localFilters.minPrice);
    } else {
      delete updatedFilters.minPrice;
    }
    if (localFilters.maxPrice) {
      updatedFilters.maxPrice = parseFloat(localFilters.maxPrice);
    } else {
      delete updatedFilters.maxPrice;
    }
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSubjectSelect = (subjectId: string) => {
    const updatedFilters = { ...filters };
    updatedFilters.subject = subjectId;
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
      setLocalFilters({
        searchQuery: initialFilters.subject || '',
        minPrice: initialFilters.minPrice?.toString() || '',
        maxPrice: initialFilters.maxPrice?.toString() || '',
        subject: initialFilters.subject || '',
      });
    }
  }, [initialFilters]);

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4">

         
        <form
          onSubmit={handleSearch}
          className="flex-1 flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search by subject or skill..."
              value={localFilters.searchQuery}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, searchQuery: e.target.value })
              }
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <Label>Price Range (per hour)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        minPrice: e.target.value,
                      })
                    }
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        maxPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={handlePriceChange} className="w-full">
                  Apply Price Filter
                </Button>
              </div>

              <div className="space-y-4">
                <Label>Subjects</Label>
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map((subject) => (
                    <Badge
                      key={subject.id}
                      variant={
                        filters.subject === subject.id
                          ? 'default'
                          : 'secondary'
                      }
                      className="cursor-pointer"
                      onClick={() => handleSubjectSelect(subject.id)}
                    >
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
