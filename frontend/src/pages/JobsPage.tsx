import { useState, useEffect } from 'react';
import { Briefcase, RefreshCw } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { JobGrid } from '../components/jobs/JobGrid';
import { JobFilters } from '../components/jobs/JobFilters';
import type { JobFilters as JobFiltersType, JobPosting } from '../types/jobs';
import { jobApi } from '../services/jobApi';

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
  const [stats, setStats] = useState({
    total: 0,
    internships: 0,
    fullTime: 0,
    partTime: 0,
    remote: 0,
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchJobs = async (currentFilters: JobFiltersType) => {
    setIsLoading(true);
    try {
      const response = await jobApi.getJobs(currentFilters);
      setJobs(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job postings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await jobApi.getJobStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching job stats:', error);
    }
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
    const job = jobs.find(j => j.id === jobId);
    if (job && job.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
      toast({
        title: 'Application Started',
        description: `Opening application page for ${job.title} at ${job.company.name}`,
      });
    } else {
      toast({
        title: 'Application Info',
        description: 'Application URL not available for this job.',
      });
    }
  };

  const handleSyncJobs = async () => {
    setIsSyncing(true);
    try {
      await jobApi.syncJobs();
      toast({
        title: 'Job Sync Started',
        description: 'Jobs are being synced from external sources. This may take a few moments.',
      });
      // Refresh jobs after a short delay
      setTimeout(() => {
        fetchJobs(filters);
        fetchStats();
      }, 3000);
    } catch (error) {
      console.error('Error syncing jobs:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync jobs. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchJobs(filters);
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-primary dark:text-indigo-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Job Board</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Discover internships, part-time, and full-time opportunities in Computer Science
          </p>
        </div>
        <button
          onClick={handleSyncJobs}
          disabled={isSyncing}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-primary dark:bg-indigo-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Jobs'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none p-4 theme-transition">
          <div className="text-2xl font-bold text-primary dark:text-indigo-400">{stats.total}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Total Jobs</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none p-4 theme-transition">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.internships}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Internships</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none p-4 theme-transition">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.fullTime}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Full-time</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none p-4 theme-transition">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.partTime}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Part-time</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none p-4 theme-transition">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.remote}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Remote</div>
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
