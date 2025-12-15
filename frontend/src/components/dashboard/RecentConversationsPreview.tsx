import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { conversationApi } from '../../services/api';
import type { Conversation } from '../../types';
import { generateAvatar } from '../../utils';
import { Button } from '../ui/button';

export function RecentConversationsPreview() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await conversationApi.getConversations(0, 5);
        setConversations(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Recent Conversations</h2>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none p-6 space-y-4 theme-transition">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    );
  }

  if (conversations.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Recent Conversations</h2>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none p-12 text-center theme-transition">
          <MessageCircle className="mx-auto mb-4 text-slate-400 dark:text-slate-500" size={48} />
          <p className="text-slate-600 dark:text-slate-400 mb-4">No conversations yet</p>
          <Button
            onClick={() => navigate('/marketplace')}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            Browse Marketplace
          </Button>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Recent Conversations</h2>
        <Button
          variant="ghost"
          onClick={() => navigate('/chat')}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          View all →
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none overflow-hidden theme-transition">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {conversations.map((conversation, index) => {
            const otherUser = conversation.otherUser;
            const lastMessage = conversation.lastMessage;

            return (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                onClick={() => navigate(`/chat/${conversation.id}`)}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={otherUser.avatarUrl || generateAvatar(otherUser.name)}
                    alt={otherUser.name}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{otherUser.name}</h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">
                        {new Date(lastMessage?.createdAt || conversation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                      {lastMessage?.messageText || 'Start a conversation'}
                    </p>
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
