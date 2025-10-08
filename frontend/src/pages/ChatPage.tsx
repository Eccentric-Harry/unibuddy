import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Users, ChevronDown, ArrowLeft } from 'lucide-react';
import { ConversationList } from '../components/chat/ConversationList';
import { GlobalChatList } from '../components/chat/GlobalChatList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { GlobalChatWindow } from '../components/chat/GlobalChatWindow';
import { useAuthStore } from '../store/authStore';
import { websocketService } from '../services/websocket';
import { conversationApi, globalChatApi } from '../services/api';
import { Button } from '../components/ui/button';
import type { ChatTab } from '../types';

export default function ChatPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'global'>('global');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedGlobalChatId, setSelectedGlobalChatId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatView, setShowChatView] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch conversations
  const { data: conversationsData, isLoading: conversationsLoading, error: conversationsError } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      console.log('Fetching conversations...');
      try {
        const response = await conversationApi.getConversations();
        console.log('Conversations response:', response.data);
        return response;
      } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }
    },
    retry: 1,
  });

  // Log conversation error if it exists
  if (conversationsError) {
    console.error('Conversations query error:', conversationsError);
  }

  // Fetch global chats
  const { data: globalChatsData, isLoading: globalChatsLoading } = useQuery({
    queryKey: ['global-chats'],
    queryFn: () => globalChatApi.getGlobalChats(),
    enabled: activeTab === 'global',
  });

  useEffect(() => {
    // Connect to WebSocket when component mounts
    const token = localStorage.getItem('accessToken');
    if (token && !websocketService.isConnected()) {
      websocketService.connect(token).catch(console.error);
    }

    // Cleanup when component unmounts
    return () => {
      websocketService.disconnect();
    };
  }, []);

  // Auto-select first global chat when switching to global tab
  useEffect(() => {
    if (activeTab === 'global' && globalChatsData?.data && globalChatsData.data.length > 0 && !selectedGlobalChatId) {
      setSelectedGlobalChatId(globalChatsData.data[0].id);
    }
  }, [activeTab, globalChatsData, selectedGlobalChatId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  const tabs: ChatTab[] = [
    { id: 'global', name: 'College Chat', count: globalChatsData?.data?.length },
    { id: 'marketplace', name: 'Marketplace', count: conversationsData?.data?.content?.length },
  ];

  const conversations = conversationsData?.data?.content || [];
  const globalChats = globalChatsData?.data || [];
  const selectedGlobalChat = globalChats.find(chat => chat.id === selectedGlobalChatId);

  const handleChatSelection = (type: 'marketplace' | 'global', id: string) => {
    if (type === 'marketplace') {
      setSelectedConversationId(id);
      setSelectedGlobalChatId(null);
    } else {
      setSelectedGlobalChatId(id);
      setSelectedConversationId(null);
    }
    
    if (isMobile) {
      setShowChatView(true);
    }
  };

  const handleBackToList = () => {
    setShowChatView(false);
    setSelectedConversationId(null);
    setSelectedGlobalChatId(null);
  };

  const getCurrentChatName = () => {
    if (activeTab === 'global' && selectedGlobalChat) {
      return `#${selectedGlobalChat.name}`;
    }
    if (activeTab === 'marketplace' && selectedConversationId) {
      const conv = conversations.find(c => c.id === selectedConversationId);
      return conv?.otherUser.name || 'Conversation';
    }
    return 'Select a chat';
  };

  // Mobile view
  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {!showChatView ? (
          // Chat List View
          <div className="flex flex-col h-screen bg-white dark:bg-slate-900">
            {/* Mobile Header with Dropdown */}
            <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-between w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 theme-transition"
                >
                  <div className="flex items-center space-x-3">
                    {activeTab === 'global' ? (
                      <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    )}
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {tabs.find(t => t.id === activeTab)?.name}
                    </span>
                    {tabs.find(t => t.id === activeTab)?.count !== undefined && (
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {tabs.find(t => t.id === activeTab)?.count}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowDropdown(false);
                          setSelectedConversationId(null);
                          setSelectedGlobalChatId(null);
                        }}
                        className={`flex items-center justify-between w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg theme-transition ${
                          activeTab === tab.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {tab.id === 'global' ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            <MessageSquare className="w-5 h-5" />
                          )}
                          <span className="font-medium">{tab.name}</span>
                        </div>
                        {tab.count !== undefined && (
                          <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Lists */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'marketplace' ? (
                <ConversationList
                  conversations={conversations}
                  selectedConversation={selectedConversationId}
                  onSelectConversation={(id) => handleChatSelection('marketplace', id)}
                  loading={conversationsLoading}
                />
              ) : (
                <GlobalChatList
                  globalChats={globalChats}
                  selectedGlobalChat={selectedGlobalChatId}
                  onSelectGlobalChat={(id) => handleChatSelection('global', id)}
                  loading={globalChatsLoading}
                />
              )}
            </div>
          </div>
        ) : (
          // Chat Window View
          <div className="flex flex-col h-screen bg-white dark:bg-slate-900">
            <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-900 dark:text-slate-100" />
                </button>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{getCurrentChatName()}</h1>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1">
              {activeTab === 'marketplace' && selectedConversationId ? (
                <ChatWindow conversationId={selectedConversationId} />
              ) : activeTab === 'global' && selectedGlobalChatId ? (
                <GlobalChatWindow 
                  globalChatId={selectedGlobalChatId} 
                  globalChat={selectedGlobalChat}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Messages</h1>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
          {/* Left Sidebar - Tabs & List */}
          <div className="col-span-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 flex flex-col theme-transition">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedConversationId(null);
                    setSelectedGlobalChatId(null);
                  }}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {tab.id === 'global' ? (
                      <Users className="w-4 h-4" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                    <span>{tab.name}</span>
                    {tab.count !== undefined && (
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {tab.count}
                      </span>
                    )}
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Chat Lists */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'marketplace' ? (
                <ConversationList
                  conversations={conversations}
                  selectedConversation={selectedConversationId}
                  onSelectConversation={setSelectedConversationId}
                  loading={conversationsLoading}
                />
              ) : (
                <GlobalChatList
                  globalChats={globalChats}
                  selectedGlobalChat={selectedGlobalChatId}
                  onSelectGlobalChat={setSelectedGlobalChatId}
                  loading={globalChatsLoading}
                />
              )}
            </div>
          </div>

          {/* Right Panel - Chat Window */}
          <div className="col-span-8 bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 flex flex-col theme-transition">
            {activeTab === 'marketplace' ? (
              selectedConversationId ? (
                <ChatWindow conversationId={selectedConversationId} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium">No conversation selected</h3>
                    <p className="mt-2">Choose a conversation from the sidebar to start chatting</p>
                  </div>
                </div>
              )
            ) : (
              selectedGlobalChatId ? (
                <GlobalChatWindow
                  globalChatId={selectedGlobalChatId}
                  globalChat={selectedGlobalChat}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium">Welcome to College Chat</h3>
                    <p className="mt-2">Select a channel from the sidebar to start chatting with your college mates</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ChatPage };
