import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { TutoringCard } from '../components/tutoring/TutoringCard';
import { TutoringFilters } from '../components/tutoring/TutoringFilters';
import { useAuthStore } from '../store/authStore';
import type { TutoringFilters as FiltersType, TutoringListing } from '../types/tutoring';
import { dummyTutoringListings } from '../data/dummyTutoring';
import { TutoringModal, type TutoringFormData } from '../components/tutoring/TutoringModal';

export default function TutoringPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();

  const [listings, setListings] = useState<TutoringListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersType>({
    page: 0,
    size: 12,
    sort: 'createdAt,desc'
  });

  const fetchListings = (currentFilters: FiltersType) => {
    setIsLoading(true);
    // Simulate API call with dummy data
    setTimeout(() => {
      let filteredListings = [...dummyTutoringListings];

      // Apply filters
      if (currentFilters.subject) {
        filteredListings = filteredListings.filter(listing =>
          listing.subjects.some(subject => subject.id === currentFilters.subject)
        );
      }

      if (currentFilters.minPrice !== undefined) {
        filteredListings = filteredListings.filter(
          listing => listing.hourlyRate >= currentFilters.minPrice!
        );
      }

      if (currentFilters.maxPrice !== undefined) {
        filteredListings = filteredListings.filter(
          listing => listing.hourlyRate <= currentFilters.maxPrice!
        );
      }

      setListings(filteredListings);
      setIsLoading(false);
    }, 500);
  };

  const handleFilterChange = (newFilters: FiltersType) => {
    const updatedFilters = { ...filters, ...newFilters, page: 0 };
    setFilters(updatedFilters);
    fetchListings(updatedFilters);
  };

  const handleContactClick = (listing: TutoringListing) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to contact tutors.',
        variant: 'destructive'
      });
      navigate('/login', { state: { from: '/tutoring' } });
      return;
    }

    // Handle contacting the tutor (e.g., open chat or contact form)
    console.log('Contact tutor:', listing.tutor.id);
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateListing = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to offer tutoring.',
        variant: 'destructive'
      });
      navigate('/login', { state: { from: '/tutoring' } });
      return;
    }

    // Using optional chaining and providing a fallback to avoid TypeScript errors
    const isEmailVerified = user?.emailVerified !== undefined ? user.emailVerified : false;
    if (!isEmailVerified) {
      toast({
        title: 'Verification Required',
        description: 'You must verify your college email before offering tutoring.',
        variant: 'destructive'
      });
      return;
    }

    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = (data: TutoringFormData) => {
    // Here you would normally send this data to your backend
    console.log('New tutoring listing:', data);
    toast({
      title: 'Success',
      description: 'Your tutoring listing has been created.',
    });
    // Refresh listings
    fetchListings(filters);
  };

  useEffect(() => {
    fetchListings(filters);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campus Tutoring</h1>
          <p className="text-gray-600">
            Find help with your studies or offer your expertise
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleCreateListing}
          className="mt-4 md:mt-0"
        >
          Offer Tutoring
        </Button>
      </div>

      <TutoringFilters
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[400px] bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900">
            No tutoring listings found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or be the first to offer tutoring!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {listings.map((listing) => (
            <TutoringCard
              key={listing.id}
              listing={listing}
              onContactClick={handleContactClick}
            />
          ))}
        </div>
      )}

      <TutoringModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSuccess}
      />
    </div>
  );
}
