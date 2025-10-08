import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { getListingById, expressInterest, updateListingStatus, reportListing } from '../services/api';
import type { ListingResponse, ExpressInterestRequest } from '../types/marketplace';
import { useAuthStore } from '../store/authStore';
import { ImageModal } from '../components/ui/ImageModal';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();

  const [listing, setListing] = useState<ListingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const fetchListing = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await getListingById(id);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to load listing details. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleImageClick = (index: number) => {
    if (!listing || !listing.images[index]) return;

    setSelectedImageIndex(index);
    setSelectedImageUrl(listing.images[index].url);
    setImageModalOpen(true);
  };

  const handleNextImage = () => {
    if (!listing) return;
    const nextIndex = (selectedImageIndex + 1) % listing.images.length;
    setSelectedImageIndex(nextIndex);
    setSelectedImageUrl(listing.images[nextIndex].url);
  };

  const handlePrevImage = () => {
    if (!listing) return;
    const prevIndex = (selectedImageIndex - 1 + listing.images.length) % listing.images.length;
    setSelectedImageIndex(prevIndex);
    setSelectedImageUrl(listing.images[prevIndex].url);
  };

  const handleExpressInterest = async () => {
    if (!id || !isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to express interest.',
        variant: 'destructive'
      });
      navigate('/login', { state: { from: `/marketplace/${id}` } });
      return;
    }

    try {
      const request: ExpressInterestRequest = {};
      const response = await expressInterest(id, request);

      toast({
        title: 'Success!',
        description: 'You have expressed interest in this listing. Redirecting to the conversation.',
      });

      navigate(`/conversations/${response.data.conversationId}`);
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast({
        title: 'Error',
        description: 'Failed to express interest. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleMessageSeller = async () => {
    if (!id || !isAuthenticated || !listing) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to message the seller.',
        variant: 'destructive'
      });
      navigate('/login', { state: { from: `/marketplace/${id}` } });
      return;
    }

    try {
      // Use the expressInterest endpoint but don't reserve the item
      const request: ExpressInterestRequest = {
        message: `Hi, I'm interested in your listing "${listing.title}". Is it still available?`
      };
      const response = await expressInterest(id, request);

      navigate(`/conversations/${response.data.conversationId}`);
    } catch (error) {
      console.error('Error messaging seller:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateStatus = async (status: 'ACTIVE' | 'SOLD') => {
    if (!id || !isAuthenticated) return;

    try {
      const response = await updateListingStatus(id, { status });
      setListing(response.data);

      toast({
        title: 'Status Updated',
        description: `Listing marked as ${status.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update listing status. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleReport = async () => {
    if (!id || !isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to report a listing.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await reportListing(id, reportReason);
      setReportModalOpen(false);
      setReportReason('');

      toast({
        title: 'Report Submitted',
        description: 'Thank you for reporting this listing. We will review it shortly.',
      });
    } catch (error) {
      console.error('Error reporting listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to report listing. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const isOwner = user && listing && user.id === listing.seller.id;
  const isActive = listing && listing.status === 'ACTIVE';
  const isReserved = listing && listing.status === 'RESERVED';
  const isSold = listing && listing.status === 'SOLD';

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-700">Listing Not Found</h2>
          <p className="text-gray-500 mt-2">
            The listing you are looking for does not exist or has been removed.
          </p>
          <Button
            onClick={() => navigate('/marketplace')}
            className="mt-4"
          >
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/marketplace')}
      >
        &larr; Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Images */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video relative">
            {listing.images && listing.images.length > 0 ? (
              <>
                <img
                  src={listing.images[selectedImageIndex].url}
                  alt={listing.images[selectedImageIndex].alt || listing.title}
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => handleImageClick(selectedImageIndex)}
                />

                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                    >
                      &rarr;
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Images Available
              </div>
            )}
          </div>

          {listing.images && listing.images.length > 1 && (
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {listing.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt || `${listing.title} - Image ${index + 1}`}
                  className={`h-20 w-20 object-cover rounded cursor-pointer ${
                    selectedImageIndex === index ? 'border-2 border-primary' : ''
                  }`}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="whitespace-pre-line">{listing.description}</p>
          </div>
        </div>

        {/* Right column - Details and Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            isActive ? 'bg-green-100 text-green-800' :
            isReserved ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Available' : isReserved ? 'Reserved' : 'Sold'}
          </div>

          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <p className="text-3xl font-bold text-primary mt-2">{formatPrice(listing.price)}</p>

          <div className="flex items-center mt-4">
            <span className="bg-gray-100 text-gray-700 text-sm rounded-full px-3 py-1">
              {listing.category}
            </span>
            <span className="text-gray-500 text-sm ml-2">
              Posted: {new Date(listing.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="border-t border-gray-200 my-6 pt-6">
            <h3 className="font-medium mb-2">Seller</h3>
            <div className="flex items-center">
              {listing.seller.avatarUrl ? (
                <img
                  src={listing.seller.avatarUrl}
                  alt={listing.seller.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {listing.seller.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-3">
                <div className="font-medium">{listing.seller.name}</div>
                {listing.seller.collegeName && (
                  <div className="text-sm text-gray-500">{listing.seller.collegeName}</div>
                )}
              </div>
            </div>
          </div>

          {isReserved && listing.reservedBy && (
            <div className="border-t border-gray-200 my-6 pt-6">
              <h3 className="font-medium mb-2">Reserved By</h3>
              <div className="flex items-center">
                {listing.reservedBy.avatarUrl ? (
                  <img
                    src={listing.reservedBy.avatarUrl}
                    alt={listing.reservedBy.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {listing.reservedBy.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="ml-3">
                  <div className="font-medium">{listing.reservedBy.name}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 mt-6">
            {/* Actions for non-owners */}
            {!isOwner && (
              <>
                <Button
                  onClick={handleMessageSeller}
                  variant="outline"
                  className="w-full"
                >
                  Message Seller
                </Button>
                <Button
                  onClick={handleExpressInterest}
                  className="w-full"
                  disabled={!isActive}
                >
                  {isActive ? "I'm Interested" : "Not Available"}
                </Button>
              </>
            )}

            {/* Actions for owners */}
            {isOwner && (
              <>
                {isActive && (
                  <Button
                    onClick={() => handleUpdateStatus('SOLD')}
                    className="w-full"
                  >
                    Mark as Sold
                  </Button>
                )}

                {isReserved && (
                  <Button
                    onClick={() => handleUpdateStatus('ACTIVE')}
                    variant="outline"
                    className="w-full"
                  >
                    Mark as Available
                  </Button>
                )}

                {isReserved && (
                  <Button
                    onClick={() => handleUpdateStatus('SOLD')}
                    className="w-full"
                  >
                    Complete Sale
                  </Button>
                )}

                {isSold && (
                  <Button
                    onClick={() => handleUpdateStatus('ACTIVE')}
                    variant="outline"
                    className="w-full"
                  >
                    Re-list Item
                  </Button>
                )}
              </>
            )}

            {/* Report button for non-owners */}
            {!isOwner && (
              <Button
                onClick={() => setReportModalOpen(true)}
                variant="ghost"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full"
              >
                Report Listing
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={selectedImageUrl}
        alt={listing.title}
        onNext={listing.images?.length > 1 ? handleNextImage : undefined}
        onPrevious={listing.images?.length > 1 ? handlePrevImage : undefined}
      />

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Report Listing</h3>
            <p className="text-gray-600 mb-4">
              Please tell us why you're reporting this listing:
            </p>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-4"
            >
              <option value="">Select a reason</option>
              <option value="Prohibited item">Prohibited item</option>
              <option value="Fraudulent">Fraudulent</option>
              <option value="Offensive content">Offensive content</option>
              <option value="Duplicate listing">Duplicate listing</option>
              <option value="Other">Other</option>
            </select>

            {reportReason === 'Other' && (
              <textarea
                placeholder="Please provide details..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-4"
                rows={3}
              />
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setReportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReport}
                disabled={!reportReason}
              >
                Submit Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
