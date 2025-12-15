import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Hash, Users, Settings, X, AlertCircle } from 'lucide-react';
import { globalChatApi, collegeApi } from '../../services/api';
import type { AxiosResponse } from 'axios';
import MessageList from './MessageList';
import { MessageComposer } from './MessageComposer';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';
import { websocketService } from '../../services/websocket';
import type { GlobalMessage, GlobalChat, User } from '../../types';

interface GlobalChatWindowProps {
  globalChatId: string;
  globalChat?: GlobalChat;
}

export function GlobalChatWindow({ globalChatId, globalChat }: GlobalChatWindowProps) {
  const [optimisticMessages, setOptimisticMessages] = useState<GlobalMessage[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: membersData, isError, isLoading } = useQuery<AxiosResponse<User[]>>({
    queryKey: ['college-members', user?.collegeId],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      if (!user.collegeId) {
        throw new Error('User is not associated with any college');
      }

      console.log('Current user:', user);
      console.log('Attempting to fetch members for college ID:', user.collegeId);
      
      try {
        const response = await collegeApi.getCollegeMembers(user.collegeId);
        return response;
      } catch (error: any) {
        console.error('Failed to fetch members:', {
          error,
          status: error?.response?.status,
          message: error?.response?.data?.message,
          collegeId: user.collegeId
        });
        throw error;
      }
    },
    enabled: !!user?.collegeId && showMembers,
    retry: false, // Don't retry on failure to avoid multiple 500 errors
    staleTime: 1000 * 60 * 5, // Cache the results for 5 minutes
  });

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

  return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {globalChat?.name || 'Loading...'}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowMembers(true)}
          >
            <Users className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Members Popup */}
      {showMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={membersRef} className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">College Members</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMembers(false)}
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400">
                  Loading members...
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-500 dark:text-slate-400">
                  <AlertCircle className="w-6 h-6 mb-2" />
                  <p>Failed to load members.</p>
                  <button 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['college-members', user?.collegeId] })}
                    className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : membersData?.data ? (
                <div className="space-y-3">
                  {membersData.data.map((member: User) => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{member.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Year {member.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400">
                  No members found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
