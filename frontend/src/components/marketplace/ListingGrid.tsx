import { useNavigate } from 'react-router-dom';
import { ListingCard } from './ListingCard';
import type { ListingResponse } from '../../types/marketplace';
import { expressInterest } from '../../services/api';
import { useToast } from '../ui/use-toast';

interface ListingGridProps {
  listings: ListingResponse[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  currentPage?: number;
}

export function ListingGrid({
  listings,
  isLoading = false,
  onPageChange,
  totalPages = 1,
  currentPage = 0
}: ListingGridProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExpressInterest = async (listingId: string) => {
    try {
      const response = await expressInterest(listingId);
      toast({
        title: "Success!",
        description: "You've expressed interest in this listing. Redirecting to conversation.",
      });

      // Navigate to the conversation
      navigate(`/conversations/${response.data.conversationId}`);
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast({
        title: "Error",
        description: "Failed to express interest. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMessageSeller = (listingId: string) => {
    // Navigate to the listing detail page first
    navigate(`/marketplace/${listingId}`);
  };

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg bg-gray-200 animate-pulse"
            style={{ height: '350px' }}
          ></div>
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700">No listings found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {listings.map(listing => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onExpressInterest={handleExpressInterest}
            onMessageSeller={handleMessageSeller}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded border disabled:opacity-50"
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
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
