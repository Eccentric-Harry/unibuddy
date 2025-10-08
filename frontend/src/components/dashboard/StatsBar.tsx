import { motion } from 'framer-motion';
import { Users, ShoppingBag, MessageCircle, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { marketplaceApi, conversationApi } from '../../services/api';

interface Stat {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  bgColor: string;
  loading: boolean;
}

export function StatsBar() {
  const [stats, setStats] = useState<Stat[]>([
    {
      label: 'Active Listings',
      value: 0,
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      loading: true,
    },
    {
      label: 'Messages Today',
      value: 0,
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      loading: true,
    },
    {
      label: 'Active Users',
      value: '2.4k',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      loading: false,
    },
    {
      label: 'Tutors Available',
      value: '94',
      icon: GraduationCap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      loading: false,
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch listings count
        const listingsResponse = await marketplaceApi.getListings({ page: 0, size: 1 });
        const totalListings = listingsResponse.data.totalElements || 0;

        // Fetch conversations count
        const conversationsResponse = await conversationApi.getConversations(0, 1);
        const totalConversations = conversationsResponse.data.totalElements || 0;

        setStats((prev) =>
          prev.map((stat) => {
            if (stat.label === 'Active Listings') {
              return { ...stat, value: totalListings, loading: false };
            }
            if (stat.label === 'Messages Today') {
              return { ...stat, value: totalConversations, loading: false };
            }
            return stat;
          })
        );
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Keep placeholder values on error
        setStats((prev) => prev.map((stat) => ({ ...stat, loading: false })));
      }
    };

    fetchStats();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="mb-8"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`${stat.color}`} size={24} />
                </div>
              </div>
              <div>
                {stat.loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                ) : (
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </h3>
                )}
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
