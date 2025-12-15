import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MoreVertical } from 'lucide-react';
import { conversationApi } from '../../services/api';
import MessageList from './MessageList';
import { MessageComposer } from './MessageComposer';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import type { Message } from '../../types';

interface ChatWindowProps {
  conversationId: string;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messagesData } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => conversationApi.getMessages(conversationId),
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: FormData) => conversationApi.sendMessage(conversationId, data),
    onMutate: async (formData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] });

      // Create optimistic message
      const messageText = formData.get('messageText') as string;
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        messageText,
        sender: {
          id: user.id, // Ensure this matches exactly with the server response
          name: user.name || 'You',
          avatarUrl: user.avatarUrl // Include avatar if available
        },
        createdAt: new Date().toISOString(),
      };

      setOptimisticMessages(prev => [...prev, optimisticMessage]);
      scrollToBottom();

      return { optimisticMessage };
    },
    onSuccess: () => {
      setOptimisticMessages([]);
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
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

  const handleSendMessage = (messageText: string, image?: File) => {
    const formData = new FormData();
    formData.append('messageText', messageText);
    if (image) {
      formData.append('image', image);
    }
    sendMessageMutation.mutate(formData);
  };

  const messages = messagesData?.data.content || [];
  const allMessages = [...messages, ...optimisticMessages];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {/* Will be replaced with actual user info */}
              U
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Conversation</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active now</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <MessageList messages={allMessages} />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="border-t border-gray-200 dark:border-slate-700 p-4 flex-shrink-0">
        <MessageComposer
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
}
