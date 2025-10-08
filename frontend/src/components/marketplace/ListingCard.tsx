import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import type { ListingResponse } from '../../types/marketplace';
import { ImageModal } from '../ui/ImageModal';

interface ListingCardProps {
  listing: ListingResponse;
  onExpressInterest?: (listingId: string) => void;
  onMessageSeller?: (listingId: string) => void;
}

export function ListingCard({ listing, onExpressInterest, onMessageSeller }: ListingCardProps) {
  const navigate = useNavigate();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const primaryImage = listing.images && listing.images.length > 0
    ? listing.images[0].url
    : 'https://placehold.co/300x200/e2e8f0/1e293b?text=No+Image';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { text: 'Available', color: 'bg-green-100 text-green-800' };
      case 'RESERVED':
        return { text: 'Reserved', color: 'bg-yellow-100 text-yellow-800' };
      case 'SOLD':
        return { text: 'Sold', color: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleCardClick = () => {
    navigate(`/marketplace/${listing.id}`);
  };

  const handleImageClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    setSelectedImageUrl(url);
    setImageModalOpen(true);
  };

  const handleExpressInterest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExpressInterest) {
      onExpressInterest(listing.id);
    }
  };

  const handleMessageSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMessageSeller) {
      onMessageSeller(listing.id);
    }
  };

  const statusDisplay = formatStatus(listing.status);
  const isAvailable = listing.status === 'ACTIVE';

  return (
    <>
      <Card
        className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative aspect-video">
          <img
            src={primaryImage}
            alt={listing.images[0]?.alt || listing.title}
            className="object-cover w-full h-full"
            onClick={(e) => handleImageClick(e, primaryImage)}
          />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
            {statusDisplay.text}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold truncate">{listing.title}</h3>
          <p className="text-xl font-bold text-primary mt-1">{formatPrice(listing.price)}</p>
          <div className="flex items-center mt-2">
            <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
              {listing.category}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              Posted by {listing.seller.name}
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mt-2">
            {listing.description}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleMessageSeller}
          >
            Message
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={handleExpressInterest}
            disabled={!isAvailable}
          >
            {isAvailable ? "I'm Interested" : "Not Available"}
          </Button>
        </CardFooter>
      </Card>

      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={selectedImageUrl}
        alt={listing.title}
      />
    </>
  );
}
