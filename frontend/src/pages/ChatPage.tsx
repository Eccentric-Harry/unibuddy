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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
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
      <div className="min-h-screen bg-gray-50">
        {!showChatView ? (
          // Chat List View
          <div className="flex flex-col h-screen bg-white">
            {/* Mobile Header with Dropdown */}
            <div className="border-b border-gray-200 bg-white p-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    {activeTab === 'global' ? (
                      <Users className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-indigo-600" />
                    )}
                    <span className="font-medium text-gray-900">
                      {tabs.find(t => t.id === activeTab)?.name}
                    </span>
                    {tabs.find(t => t.id === activeTab)?.count !== undefined && (
                      <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {tabs.find(t => t.id === activeTab)?.count}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowDropdown(false);
                          setSelectedConversationId(null);
                          setSelectedGlobalChatId(null);
                        }}
                        className={`flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          activeTab === tab.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-900'
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
                          <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
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
          // Chat View
          <div className="flex flex-col h-screen bg-white">
            {/* Mobile Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200 bg-white">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToList}
                className="mr-3"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {getCurrentChatName()}
              </h2>
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

  // Desktop view with dropdown
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Desktop Header with Dropdown */}
          <div className="border-b border-gray-200 bg-white p-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {activeTab === 'global' ? (
                    <Users className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                  )}
                  <span className="font-medium text-gray-900">
                    {tabs.find(t => t.id === activeTab)?.name}
                  </span>
                  {tabs.find(t => t.id === activeTab)?.count !== undefined && (
                    <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {tabs.find(t => t.id === activeTab)?.count}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowDropdown(false);
                        if (tab.id === 'marketplace') {
                          setSelectedGlobalChatId(null);
                        } else {
                          setSelectedConversationId(null);
                        }
                      }}
                      className={`flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        activeTab === tab.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-900'
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
                        <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
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

        {/* Chat Window */}
        <div className="flex-1">
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
  );
}

export { ChatPage };
