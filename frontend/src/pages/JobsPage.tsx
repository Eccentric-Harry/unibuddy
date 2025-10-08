import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { JobGrid } from '../components/jobs/JobGrid';
import { JobFilters } from '../components/jobs/JobFilters';
import type { JobFilters as JobFiltersType, JobPosting } from '../types/jobs';
import { dummyJobs } from '../data/dummyJobs';

export default function JobsPage() {
  const { toast } = useToast();

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<JobFiltersType>({
    page: 0,
    size: 12,
  });

  const fetchJobs = (currentFilters: JobFiltersType) => {
    setIsLoading(true);

    // Simulate API call with dummy data
    setTimeout(() => {
      let filteredJobs = [...dummyJobs];

      // Apply filters
      if (currentFilters.query) {
        const query = currentFilters.query.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(query) ||
          job.company.name.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.skills.some(skill => skill.toLowerCase().includes(query))
        );
      }

      if (currentFilters.jobType) {
        filteredJobs = filteredJobs.filter(job => job.jobType === currentFilters.jobType);
      }

      if (currentFilters.locationType) {
        filteredJobs = filteredJobs.filter(job => job.locationType === currentFilters.locationType);
      }

      // Pagination
      const pageSize = currentFilters.size || 12;
      const page = currentFilters.page || 0;
      const startIdx = page * pageSize;
      const endIdx = startIdx + pageSize;
      const paginatedJobs = filteredJobs.slice(startIdx, endIdx);

      setJobs(paginatedJobs);
      setTotalPages(Math.ceil(filteredJobs.length / pageSize));
      setCurrentPage(page);
      setIsLoading(false);
    }, 300);
  };

  const handleFilterChange = (newFilters: JobFiltersType) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      page: 0,
    };
    setFilters(updatedFilters);
    fetchJobs(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchJobs(updatedFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApply = (jobId: string) => {
    const job = dummyJobs.find(j => j.id === jobId);
    if (job && job.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
      toast({
        title: 'Application Started',
        description: `Opening application page for ${job.title} at ${job.company.name}`,
      });
    } else {
      toast({
        title: 'Application Info',
        description: 'This is a demo job posting. In production, this would redirect to the application page.',
      });
    }
  };

  useEffect(() => {
    fetchJobs(filters);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Job Board</h1>
          </div>
          <p className="text-gray-600">
            Discover internships, part-time, and full-time opportunities in Computer Science
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-primary">{dummyJobs.length}</div>
          <div className="text-sm text-gray-600">Total Jobs</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-green-600">
            {dummyJobs.filter(j => j.jobType === 'Internship').length}
          </div>
          <div className="text-sm text-gray-600">Internships</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-blue-600">
            {dummyJobs.filter(j => j.locationType === 'Remote').length}
          </div>
          <div className="text-sm text-gray-600">Remote Jobs</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-purple-600">
            {dummyJobs.filter(j => j.jobType === 'Part-time').length}
          </div>
          <div className="text-sm text-gray-600">Part-time</div>
        </div>
      </div>

      {/* Filters */}
      <JobFilters
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {/* Job Grid */}
      <JobGrid
        jobs={jobs}
        isLoading={isLoading}
        onApply={handleApply}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
