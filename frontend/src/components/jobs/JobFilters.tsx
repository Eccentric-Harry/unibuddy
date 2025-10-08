import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { JobFilters as JobFiltersType } from '../../types/jobs';

interface JobFiltersProps {
  onFilterChange: (filters: JobFiltersType) => void;
  initialFilters?: JobFiltersType;
}

export function JobFilters({ onFilterChange, initialFilters = {} }: JobFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
  const [jobType, setJobType] = useState(initialFilters.jobType || 'all');
  const [locationType, setLocationType] = useState(initialFilters.locationType || 'all');

  const handleSearch = () => {
    const filters: JobFiltersType = {
      ...initialFilters,
      query: searchQuery || undefined,
      jobType: jobType !== 'all' ? jobType : undefined,
      locationType: locationType !== 'all' ? locationType : undefined,
    };
    onFilterChange(filters);
  };

  const handleReset = () => {
    setSearchQuery('');
    setJobType('all');
    setLocationType('all');
    onFilterChange({});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={locationType} onValueChange={setLocationType}>
            <SelectTrigger>
              <SelectValue placeholder="Location Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="On-site">On-site</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button onClick={handleSearch} className="flex-1 md:flex-none">
          <Filter className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );
}
