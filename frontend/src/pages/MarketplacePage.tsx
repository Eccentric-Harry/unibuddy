import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { marketplaceApi } from '../services/api';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { ListingFilters } from '../components/marketplace/ListingFilters';
import { CreateListingModal } from '../components/marketplace/CreateListingModal';
import { Button } from '../components/ui/button';
import type { ListingFilters as ListingFiltersType } from '../types';

export function MarketplacePage() {
  const [filters, setFilters] = useState<ListingFiltersType>({
    page: 0,
    size: 20,
    sort: 'createdAt',
    direction: 'DESC'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: listingsData, isLoading, refetch } = useQuery({
    queryKey: ['listings', filters],
    queryFn: () => marketplaceApi.getListings(filters),
  });

  const handleFiltersChange = (newFilters: ListingFiltersType) => {
    setFilters({ ...newFilters, page: 0 });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Listing
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.q || ''}
              onChange={(e) => handleFiltersChange({ ...filters, q: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ListingFilters filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ListingGrid
          listings={listingsData?.data.content || []}
          loading={isLoading}
          viewMode={viewMode}
          totalPages={listingsData?.data.totalPages || 0}
          currentPage={filters.page || 0}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Create Listing Modal */}
      <CreateListingModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
