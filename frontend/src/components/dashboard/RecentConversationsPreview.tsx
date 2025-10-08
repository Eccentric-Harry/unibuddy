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
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Conversations</h2>
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
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
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Conversations</h2>
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-4">No conversations yet</p>
          <Button
            onClick={() => navigate('/marketplace')}
            className="bg-indigo-600 hover:bg-indigo-700"
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
        <h2 className="text-3xl font-bold text-gray-900">Recent Conversations</h2>
        <Button
          variant="ghost"
          onClick={() => navigate('/chat')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          View all →
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {conversations.map((conversation, index) => {
            const otherUser = conversation.otherUser;
            const lastMessage = conversation.lastMessage;

            return (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                whileHover={{ backgroundColor: '#F9FAFB' }}
                onClick={() => navigate('/chat')}
                className="p-4 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={otherUser?.avatarUrl || generateAvatar(otherUser?.name || 'User')}
                      alt={otherUser?.name || 'User'}
                      className="w-12 h-12 rounded-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {otherUser?.name || 'Unknown User'}
                      </h3>
                      {lastMessage && (
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(lastMessage.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {conversation.listing && (
                      <p className="text-sm text-indigo-600 mb-1 truncate">
                        Re: {conversation.listing.title}
                      </p>
                    )}
                    {lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage.messageText}
                      </p>
                    )}
                  </div>

                  <MessageCircle size={20} className="text-gray-400" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
