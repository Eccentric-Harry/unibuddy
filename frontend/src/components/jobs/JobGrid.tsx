import { JobCard } from './JobCard';
import type { JobPosting } from '../../types/jobs';

interface JobGridProps {
  jobs: JobPosting[];
  isLoading?: boolean;
  onApply?: (jobId: string) => void;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  currentPage?: number;
}

export function JobGrid({
  jobs,
  isLoading = false,
  onApply,
  onPageChange,
  totalPages = 1,
  currentPage = 0
}: JobGridProps) {
  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg bg-gray-200 animate-pulse"
            style={{ height: '320px' }}
          ></div>
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700">No jobs found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onApply={onApply}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => onPageChange && onPageChange(index)}
                className={`px-3 py-1 rounded ${
                  currentPage === index
                    ? 'bg-primary text-white'
                    : 'border hover:bg-gray-100'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

