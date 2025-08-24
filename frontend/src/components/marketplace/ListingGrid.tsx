import { useState } from 'react';
import { Grid, MessageCircle, Eye, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { Listing } from '../../types';

interface ListingGridProps {
  listings: Listing[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function ListingGrid({
  listings,
  loading,
  viewMode,
  totalPages,
  currentPage,
  onPageChange,
}: ListingGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Grid className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
        <p className="text-gray-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div>
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "space-y-4"
      }>
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} viewMode={viewMode} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = currentPage < 3 ? i : currentPage - 2 + i;
            if (page >= totalPages) return null;
            
            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page + 1}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

interface ListingCardProps {
  listing: Listing;
  viewMode: 'grid' | 'list';
}

function ListingCard({ listing, viewMode }: ListingCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (viewMode === 'list') {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {listing.images && listing.images.length > 0 && !imageError ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Eye className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{listing.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{listing.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xl font-bold text-green-600">
                {formatPrice(listing.price)}
              </span>
              <span className="text-sm text-gray-500">{listing.category}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button size="sm">
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {listing.images && listing.images.length > 0 && !imageError ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="absolute bottom-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
            {listing.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">{listing.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{listing.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-green-600">
            {formatPrice(listing.price)}
          </span>
          <span className="text-xs text-gray-500">{formatDate(listing.createdAt)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
              {listing.seller.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600 truncate">{listing.seller.name}</span>
          </div>
          
          <Button size="sm" variant="outline">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
