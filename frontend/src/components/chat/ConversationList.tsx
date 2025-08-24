import { MessageCircle, ShoppingBag } from 'lucide-react';
import type { Conversation } from '../../types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  loading: boolean;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  loading,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="p-4">
        {Array.from({ length: 5 }).map((_, index) => (
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

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageCircle className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No conversations yet</p>
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

  return (
    <div>
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={`flex items-center space-x-3 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
          }`}
        >
          <div className="relative">
            {conversation.otherUser.avatarUrl ? (
              <img
                src={conversation.otherUser.avatarUrl}
                alt={conversation.otherUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {conversation.otherUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center">
              <ShoppingBag className="w-3 h-3 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {conversation.otherUser.name}
              </h3>
              {conversation.lastMessage && (
                <span className="text-xs text-gray-500">
                  {formatTime(conversation.lastMessage.createdAt)}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 truncate mb-1">
              Re: {conversation.listing.title}
            </p>

            {conversation.lastMessage && (
              <p className="text-sm text-gray-600 truncate">
                {conversation.lastMessage.fromCurrentUser ? 'You: ' : ''}
                {conversation.lastMessage.messageText}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
