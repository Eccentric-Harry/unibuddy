import { motion } from 'framer-motion';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';

interface Activity {
  id: string;
  type: 'job' | 'listing' | 'event' | 'tutor';
  title: string;
  description: string;
  time: string;
  icon: any;
  color: string;
  bgColor: string;
}

export function ActivityFeed() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'job',
      title: 'New Part-Time Job',
      description: 'Campus Library is hiring student assistants',
      time: '2 hours ago',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: '2',
      type: 'event',
      title: 'Tech Club Meeting',
      description: 'Join us for the monthly tech meetup this Friday',
      time: '5 hours ago',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: '3',
      type: 'listing',
      title: 'Popular Item',
      description: 'Calculus textbook has 5 new inquiries',
      time: '1 day ago',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: '4',
      type: 'tutor',
      title: 'New Tutor Available',
      description: 'Physics tutor now offering weekend sessions',
      time: '2 days ago',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="mb-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Campus Activity</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                whileHover={{ backgroundColor: '#F9FAFB', x: 4 }}
                className="p-4 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${activity.bgColor} flex-shrink-0`}>
                    <Icon className={activity.color} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

