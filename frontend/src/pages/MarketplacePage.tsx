import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useToast } from '../components/ui/use-toast';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { ListingFilters as FiltersComponent } from '../components/marketplace/ListingFilters';
import { CreateListingModal } from '../components/marketplace/CreateListingModal';
import { getListings } from '../services/api';
import type { ListingFilters, ListingResponse } from '../types/marketplace';
import { useAuthStore } from '../store/authStore';
import { dummyListings } from '../data/dummyListings';

export default function MarketplacePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [useDummyData, setUseDummyData] = useState(false);
  const [filters, setFilters] = useState<ListingFilters>({
    page: 0,
    size: 12,
    sort: 'createdAt,desc'
  });

  const fetchListings = async (currentFilters: ListingFilters) => {
    setIsLoading(true);
    try {
      const response = await getListings(currentFilters);

      // If API returns empty results, use dummy data
      if (!response.data.content || response.data.content.length === 0) {
        console.log('No listings from API, using dummy data');
        setUseDummyData(true);
        const pageSize = currentFilters.size || 12;
        const page = currentFilters.page || 0;
        const startIdx = page * pageSize;
        const endIdx = startIdx + pageSize;
        const paginatedDummyData = dummyListings.slice(startIdx, endIdx);

        setListings(paginatedDummyData);
        setTotalPages(Math.ceil(dummyListings.length / pageSize));
        setCurrentPage(page);
      } else {
        setUseDummyData(false);
        setListings(response.data.content);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.number);
      }
    } catch (error) {
      console.error('Error fetching listings, falling back to dummy data:', error);
      // On error, fall back to dummy data instead of showing error
      setUseDummyData(true);
      const pageSize = currentFilters.size || 12;
      const page = currentFilters.page || 0;
      const startIdx = page * pageSize;
      const endIdx = startIdx + pageSize;
      const paginatedDummyData = dummyListings.slice(startIdx, endIdx);

      setListings(paginatedDummyData);
      setTotalPages(Math.ceil(dummyListings.length / pageSize));
      setCurrentPage(page);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: ListingFilters) => {
    // Reset to first page when filters change
    const updatedFilters = {
      ...filters,
      ...newFilters,
      page: 0
    };
    setFilters(updatedFilters);
    fetchListings(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);

    // If using dummy data, handle pagination locally
    if (useDummyData) {
      setIsLoading(true);
      setTimeout(() => {
        const pageSize = updatedFilters.size || 12;
        const startIdx = page * pageSize;
        const endIdx = startIdx + pageSize;
        const paginatedDummyData = dummyListings.slice(startIdx, endIdx);

        setListings(paginatedDummyData);
        setCurrentPage(page);
        setIsLoading(false);
      }, 300); // Small delay to show loading state
    } else {
      fetchListings(updatedFilters);
    }
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to create a listing.',
        variant: 'destructive'
      });
      navigate('/login', { state: { from: '/marketplace' } });
      return;
    }

    // Using optional chaining and providing a fallback to avoid TypeScript errors
    const isEmailVerified = user?.emailVerified !== undefined ? user.emailVerified : false;
    if (!isEmailVerified) {
      toast({
        title: 'Verification Required',
        description: 'You must verify your college email before creating listings.',
        variant: 'destructive'
      });
      return;
    }

    setCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    fetchListings(filters);
  };

  useEffect(() => {
    fetchListings(filters);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campus Marketplace</h1>
          <p className="text-gray-600">
            Buy and sell items within your college community
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleCreateClick}
          className="mt-4 md:mt-0"
        >
          Create Listing
        </Button>
      </div>

      <FiltersComponent
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      <ListingGrid
        listings={listings}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      <CreateListingModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
