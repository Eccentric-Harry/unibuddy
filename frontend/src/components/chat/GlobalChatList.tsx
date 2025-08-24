import { MessageCircle, Users, Calendar, Hash } from 'lucide-react';
import type { GlobalChat } from '../../types';

interface GlobalChatListProps {
  globalChats: GlobalChat[];
  selectedGlobalChat: string | null;
  onSelectGlobalChat: (id: string) => void;
  loading: boolean;
}

export function GlobalChatList({
  globalChats,
  selectedGlobalChat,
  onSelectGlobalChat,
  loading,
}: GlobalChatListProps) {
  if (loading) {
    return (
      <div className="p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 mb-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (globalChats.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageCircle className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No chat rooms available</p>
      </div>
    );
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        return `${Math.floor(diffInHours / 24)}d ago`;
      }
    } catch {
      return 'Unknown';
    }
  };

  const getChannelIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('general')) {
      return <Hash className="w-4 h-4 text-indigo-500" />;
    } else if (lowercaseName.includes('study')) {
      return <MessageCircle className="w-4 h-4 text-green-500" />;
    } else if (lowercaseName.includes('event')) {
      return <Calendar className="w-4 h-4 text-purple-500" />;
    } else {
      return <Users className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="divide-y divide-gray-100">
      {globalChats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectGlobalChat(chat.id)}
          className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedGlobalChat === chat.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''
          }`}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              {getChannelIcon(chat.name)}
            </div>
            {chat.isActive && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                #{chat.name}
              </h3>
              {chat.lastMessage && (
                <span className="text-xs text-gray-500">
                  {formatTime(chat.lastMessage.createdAt)}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 truncate mb-1">
              {chat.description}
            </p>

            {chat.lastMessage && (
              <p className="text-sm text-gray-600 truncate">
                <span className="font-medium">{chat.lastMessage.senderName}:</span>{' '}
                {chat.lastMessage.messageText}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
