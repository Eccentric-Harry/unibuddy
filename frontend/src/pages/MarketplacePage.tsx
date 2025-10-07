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

export default function MarketplacePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<ListingFilters>({
    page: 0,
    size: 12,
    sort: 'createdAt,desc'
  });

  const fetchListings = async (currentFilters: ListingFilters) => {
    setIsLoading(true);
    try {
      const response = await getListings(currentFilters);
      setListings(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load listings. Please try again.',
        variant: 'destructive'
      });
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
    fetchListings(updatedFilters);
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
