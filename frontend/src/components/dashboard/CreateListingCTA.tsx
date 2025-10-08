import { motion } from 'framer-motion';
import { Plus, Image, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';

interface CreateListingCTAProps {
  onCreateListing?: () => void;
}

export function CreateListingCTA({ onCreateListing }: CreateListingCTAProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mb-8"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-600 rounded-3xl p-8 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20v-2H0V4h20v-2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Got something to sell?
            </h2>
            <p className="text-orange-100 text-lg mb-6">
              List your textbooks, electronics, furniture, or services in minutes.
              Reach thousands of students on campus instantly.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Image size={20} />
                </div>
                <span className="text-sm">Upload photos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <DollarSign size={20} />
                </div>
                <span className="text-sm">Set your price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Plus size={20} />
                </div>
                <span className="text-sm">Post instantly</span>
              </div>
            </div>

            <Button
              onClick={onCreateListing}
              className="bg-white text-pink-700 hover:bg-gray-100 font-semibold px-8 py-6 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Plus className="mr-2" size={24} />
              Create Listing Now
            </Button>
          </div>

          {/* Right: Image */}
          <div className="hidden md:block">
            <motion.img
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
              alt="Create listing"
              className="rounded-2xl shadow-2xl object-cover w-full h-64"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400/f97316/ffffff?text=Start+Selling";
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
