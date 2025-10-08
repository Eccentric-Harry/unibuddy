import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MessageCircle, Tag } from 'lucide-react';
import { marketplaceApi } from '../../services/api';
import type { ListingResponse } from '../../types/marketplace';
import { Button } from '../ui/button';
import { generateAvatar } from '../../utils';

export function FeaturedListingsCarousel() {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const response = await marketplaceApi.getListings({ page: 0, size: 6, sort: 'createdAt', direction: 'DESC' });
        setListings(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, listings.length));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + listings.length) % Math.max(1, listings.length));
  };

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    );
  }

  if (listings.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Listings</h2>
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-600 mb-4">No listings yet. Be the first to post!</p>
          <Button onClick={() => navigate('/marketplace')} className="bg-indigo-600 hover:bg-indigo-700">
            Go to Marketplace
          </Button>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
        <Button
          variant="ghost"
          onClick={() => navigate('/marketplace')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          View all →
        </Button>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.slice(0, 6).map((listing, index) => (
          <ListingCard key={listing.id} listing={listing} index={index} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative">
        <div className="overflow-hidden rounded-2xl">
          <motion.div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {listings.map((listing, index) => (
              <div key={listing.id} className="w-full flex-shrink-0">
                <ListingCard listing={listing} index={index} />
              </div>
            ))}
          </motion.div>
        </div>

        {listings.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {listings.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ListingCard({ listing, index }: { listing: ListingResponse; index: number }) {
  const navigate = useNavigate();

  // Use actual uploaded image or fallback to a working placeholder
  const imageUrl = listing.images?.[0]?.url ||
    `https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(`/marketplace/${listing.id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/400x300/8b5cf6/ffffff?text=${encodeURIComponent(listing.category)}`;
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-violet-700">
            <Tag size={12} className="mr-1" />
            {listing.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
            ${listing.price}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{listing.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{listing.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={listing.seller.avatarUrl || generateAvatar(listing.seller.name)}
              alt={listing.seller.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-xs">
              <p className="font-medium text-gray-900">{listing.seller.name}</p>
              {listing.seller.year && (
                <p className="text-gray-500">Year {listing.seller.year}</p>
              )}
            </div>
          </div>

          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/marketplace/${listing.id}`);
            }}
          >
            <MessageCircle size={14} className="mr-1" />
            Message
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
