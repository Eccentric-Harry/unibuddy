import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  gradient: string;
  href: string;
}

export function QuickActions() {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      title: 'Messages',
      description: 'Chat with buyers & sellers',
      icon: MessageCircle,
      gradient: 'from-violet-500 to-purple-500',
      href: '/chat',
    },
    {
      title: 'Marketplace',
      description: 'Buy and sell items',
      icon: ShoppingBag,
      gradient: 'from-emerald-500 to-teal-500',
      href: '/marketplace',
    },
    {
      title: 'Job Board',
      description: 'Find opportunities',
      icon: Briefcase,
      gradient: 'from-orange-500 to-amber-500',
      href: '/jobs',
    },
    {
      title: 'Tutoring',
      description: 'Get or offer help',
      icon: GraduationCap,
      gradient: 'from-pink-500 to-rose-500',
      href: '/tutoring',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-indigo-600" size={24} />
        <h2 className="text-3xl font-bold text-gray-900">Quick Access</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -8 }}
              onClick={() => navigate(action.href)}
              className={`relative overflow-hidden bg-gradient-to-br ${action.gradient} rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300`}
            >
              <div className="relative z-10">
                <Icon className="text-white mb-3" size={32} />
                <h3 className="text-lg font-bold text-white mb-1">{action.title}</h3>
                <p className="text-sm text-white/90">{action.description}</p>
              </div>

              {/* Decorative circle */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
