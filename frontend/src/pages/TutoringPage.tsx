import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { TutoringCard } from '../components/tutoring/TutoringCard';
import { TutoringFilters } from '../components/tutoring/TutoringFilters';
import { useAuthStore } from '../store/authStore';
import type { TutoringFilters as FiltersType, TutoringListing } from '../types/tutoring';
import { TutoringModal, type TutoringFormData } from '../components/tutoring/TutoringModal';
import { tutoringApi } from '../services/tutoringApi';
import { conversationApi } from '../services/api';

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

  const fetchListings = async (currentFilters: FiltersType) => {
    setIsLoading(true);
    try {
      const response = await tutoringApi.getListings(currentFilters);
      setListings(response.content);
    } catch (error) {
      console.error('Error fetching tutoring listings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tutoring listings. Please try again.',
        variant: 'destructive'
      });
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FiltersType) => {
    const updatedFilters = { ...filters, ...newFilters, page: 0 };
    setFilters(updatedFilters);
    fetchListings(updatedFilters);
  };

  const handleContactClick = async (listing: TutoringListing) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to contact tutors.',
        variant: 'destructive'
      });
      navigate('/login', { state: { from: '/tutoring' } });
      return;
    }

    // Check email verification
    const isEmailVerified = user?.emailVerified !== undefined ? user.emailVerified : false;
    if (!isEmailVerified) {
      toast({
        title: 'Verification Required',
        description: 'You must verify your college email before contacting tutors.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Start or get existing conversation with the tutor
      const response = await conversationApi.startTutoringConversation(listing.id);
      const conversationId = response.data.id;

      // Navigate to chat page with tutoring tab and conversation pre-selected
      navigate(`/chat?tab=tutoring&conversation=${conversationId}`);
    } catch (error: any) {
      console.error('Error starting conversation:', error);

      // Handle specific error cases
      if (error.response?.status === 403 || error.response?.data?.message?.includes('verified')) {
        toast({
          title: 'Verification Required',
          description: 'You must verify your college email before contacting tutors.',
          variant: 'destructive'
        });
      } else if (error.response?.data?.message?.includes('yourself')) {
        toast({
          title: 'Invalid Action',
          description: 'You cannot contact yourself.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to start conversation. Please try again.',
          variant: 'destructive'
        });
      }
    }
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

  const handleCreateSuccess = async (data: TutoringFormData) => {
    try {
      await tutoringApi.createListing(data);
      toast({
        title: 'Success',
        description: 'Your tutoring listing has been created.',
      });
      // Refresh listings
      fetchListings(filters);
    } catch (error) {
      console.error('Error creating tutoring listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to create tutoring listing. Please try again.',
        variant: 'destructive'
      });
    }
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
