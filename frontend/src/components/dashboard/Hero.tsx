import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

interface HeroProps {
  userName: string;
  onCreateListing?: () => void;
}

export function Hero({ userName, onCreateListing }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 mb-8"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
        {/* Left: Content */}
        <div className="text-white space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Welcome back,
              <br />
              <span className="text-fuchsia-200">{userName}!</span>
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-lg">
              Your campus marketplace for books, jobs, tutoring, and connections. Everything you need, right here.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onSubmit={handleSearch}
            className="flex items-center bg-white rounded-full shadow-lg overflow-hidden max-w-md"
          >
            <Search className="ml-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 text-gray-900 outline-none text-sm md:text-base"
            />
            <Button
              type="submit"
              className="rounded-full m-1 bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              Search
            </Button>
          </motion.form>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              onClick={onCreateListing}
              className="bg-fuchsia-400 hover:bg-fuchsia-500 text-white font-semibold px-8 py-6 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="mr-2" size={24} />
              Post a Listing
            </Button>
          </motion.div>
        </div>

        {/* Right: Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="hidden md:block"
        >
          <img
            src="https://www.collegedata.com/hs-fs/collegedata/images/article/what_will_college_life_be_like.jpg?w=800&h=600&fit=crop"
            alt="Campus life"
            className="rounded-2xl shadow-2xl object-cover w-full h-[400px]"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/800x600/6366f1/ffffff?text=Campus+Life";
            }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
