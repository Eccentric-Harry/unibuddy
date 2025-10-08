import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store/authStore';
import { generateAvatar } from '../utils';
import { CreateListingModal } from '../components/marketplace/CreateListingModal';
import {
  Hero,
  StatsBar,
  FeaturedListingsCarousel,
  CreateListingCTA,
  RecentConversationsPreview,
  ActivityFeed,
  QuickActions,
} from '../components/dashboard';

export default function Dashboard() {
  const { user, logout, getCurrentUser } = useAuthStore();
  const navigate = useNavigate();
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  const handleLogout = () => {
    logout();
  };

  const handleCreateListingSuccess = () => {
    setIsCreateListingOpen(false);
    navigate('/marketplace');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <img
              src={generateAvatar(user.email)}
              alt="Profile"
              className="w-10 h-10 rounded-full ring-2 ring-indigo-100"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h1>
              <p className="text-xs text-gray-500">College ID: {user.collegeId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Hero Section */}
        <Hero
          userName={user.name}
          onCreateListing={() => setIsCreateListingOpen(true)}
        />

        {/* Stats Bar */}
        <StatsBar />

        {/* Featured Listings */}
        <FeaturedListingsCarousel />

        {/* Two Column Layout for Desktop */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <CreateListingCTA onCreateListing={() => setIsCreateListingOpen(true)} />
            <RecentConversationsPreview />
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <p>© 2025 UniBuddy. Built for students, by students.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Report Issue</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={isCreateListingOpen}
        onClose={() => setIsCreateListingOpen(false)}
        onSuccess={handleCreateListingSuccess}
      />
    </div>
  );
}

export { Dashboard };
