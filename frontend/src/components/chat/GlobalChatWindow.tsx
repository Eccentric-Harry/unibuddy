import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Hash, Users, Settings } from 'lucide-react';
import { globalChatApi } from '../../services/api';
import MessageList from './MessageList';
import { MessageComposer } from './MessageComposer';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';
import { websocketService } from '../../services/websocket';
import type { GlobalMessage, GlobalChat } from '../../types';

interface GlobalChatWindowProps {
  globalChatId: string;
  globalChat?: GlobalChat;
}

export function GlobalChatWindow({ globalChatId, globalChat }: GlobalChatWindowProps) {
  const [optimisticMessages, setOptimisticMessages] = useState<GlobalMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: messagesData } = useQuery({
    queryKey: ['global-messages', globalChatId],
    queryFn: () => globalChatApi.getGlobalChatMessages(globalChatId),
    enabled: !!globalChatId,
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: FormData) => globalChatApi.sendGlobalMessage(globalChatId, data),
    onMutate: async (formData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['global-messages', globalChatId] });

      // Create optimistic message
      const messageText = formData.get('messageText') as string;
      const optimisticMessage: GlobalMessage = {
        id: `temp-${Date.now()}`,
        messageText,
        sender: {
          id: user?.id || 'unknown',
          name: user?.name || 'You',
          avatarUrl: user?.avatarUrl,
          year: user?.year,
        },
        createdAt: new Date().toISOString(),
        globalChatId,
      };

      setOptimisticMessages(prev => [...prev, optimisticMessage]);
      scrollToBottom();

      return { optimisticMessage };
    },
    onSuccess: () => {
      setOptimisticMessages([]);
      queryClient.invalidateQueries({ queryKey: ['global-messages', globalChatId] });
      queryClient.invalidateQueries({ queryKey: ['global-chats'] });
    },
    onError: () => {
      setOptimisticMessages([]);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesData, optimisticMessages]);

  // Subscribe to WebSocket updates for this global chat
  useEffect(() => {
    if (!globalChatId || !websocketService.isConnected()) return;

    const handleGlobalMessage = (message: GlobalMessage) => {
      // Only update if it's for this chat and not from current user
      if (message.globalChatId === globalChatId && message.sender.id !== user?.id) {
        queryClient.invalidateQueries({ queryKey: ['global-messages', globalChatId] });
        queryClient.invalidateQueries({ queryKey: ['global-chats'] });
      }
    };

    websocketService.subscribeToGlobalChat(globalChatId, handleGlobalMessage);

    // No need to return a cleanup function as the service handles subscriptions
  }, [globalChatId, user?.id, queryClient]);

  const handleSendMessage = (messageText: string, image?: File) => {
    const formData = new FormData();
    formData.append('messageText', messageText);
    if (image) {
      formData.append('image', image);
    }
    sendMessageMutation.mutate(formData);
  };

  const messages = messagesData?.data.content || [];
  const allMessages = [...messages, ...optimisticMessages]; // Messages now come in correct order from API

  // Convert GlobalMessage to Message format for MessageList component
  const convertedMessages = allMessages.map(msg => {
    console.log('Converting message:', msg.id, 'imageUrl:', msg.imageUrl);
    return {
      id: msg.id,
      messageText: msg.messageText,
      imageUrl: msg.imageUrl,
      sender: {
        id: msg.sender.id,
        name: msg.sender.name,
        avatarUrl: msg.sender.avatarUrl,
      },
      createdAt: msg.createdAt,
    };
  });

  const getChannelIcon = (name?: string) => {
    if (!name) return <Hash className="w-5 h-5 text-indigo-500" />;
    
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('general')) {
      return <Hash className="w-5 h-5 text-indigo-500" />;
    } else if (lowercaseName.includes('study')) {
      return <Users className="w-5 h-5 text-green-500" />;
    } else {
      return <Hash className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {getChannelIcon(globalChat?.name)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              #{globalChat?.name || 'Channel'}
            </h2>
            <p className="text-sm text-gray-500">
              {globalChat?.description || 'Global chat channel'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4" />
            <span className="ml-1 text-xs hidden sm:inline">Members</span>
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
        <MessageList 
          messages={convertedMessages} 
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
        <MessageComposer
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending}
          placeholder={`Message #${globalChat?.name || 'channel'}...`}
        />
      </div>
    </div>
  );
}
