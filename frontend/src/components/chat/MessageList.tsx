import React, { useEffect, useRef, useState } from 'react';
import type { Message } from '../../types';
import { ImageModal } from '../ui/ImageModal';
import { useAuthStore } from '../../store/authStore';

interface MessageListProps {
  messages: Message[];
  onScroll?: () => void;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onScroll,
  className = ""
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return null;

  return (
    <>
      <div 
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${className}`}
        onScroll={onScroll}
      >
        {messages.map((message, index) => {
          const isCurrentUser = message.sender.id === user.id;
          const previousMessage = messages[index - 1];
          const showAvatar = !previousMessage || previousMessage.sender.id !== message.sender.id;
          const showName = showAvatar && !isCurrentUser;

          return (
            <div
              key={message.id}
              className={`flex items-end space-x-2 group ${
                isCurrentUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Avatar */}
              {showAvatar && !isCurrentUser && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  {message.sender.avatarUrl ? (
                    <img
                      src={message.sender.avatarUrl}
                      alt={message.sender.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium text-gray-600">
                      {message.sender.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              )}

              {/* Message Content */}
              <div className={showAvatar ? '' : isCurrentUser ? 'mr-10' : 'ml-10'}>
                {showName && (
                  <p className="text-xs text-gray-500 mb-1 px-3">
                    {message.sender.name}
                  </p>
                )}
                
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md xl:max-w-lg ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.messageText && (
                    <p className="text-sm whitespace-pre-wrap">{message.messageText}</p>
                  )}
                  
                  {message.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={message.imageUrl}
                        alt="Shared image"
                        className="max-w-full h-auto rounded max-h-60 object-cover cursor-pointer"
                        onError={(e) => {
                          console.error('Failed to load image:', message.imageUrl);
                          // Show a fallback div with download link instead of hiding
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.className = 'bg-gray-200 border-2 border-dashed border-gray-400 rounded p-4 text-center cursor-pointer hover:bg-gray-300';
                          fallbackDiv.innerHTML = `
                            <div class="text-gray-600">
                              <svg class="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p class="text-sm">Click to view image</p>
                            </div>
                          `;
                          fallbackDiv.onclick = () => window.open(message.imageUrl, '_blank');
                          e.currentTarget.parentNode?.replaceChild(fallbackDiv, e.currentTarget);
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', message.imageUrl);
                        }}
                        onClick={() => {
                          if (message.imageUrl) {
                            setSelectedImage(message.imageUrl);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <p className={`text-xs text-gray-500 mt-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isCurrentUser ? 'text-right' : 'text-left'
                }`}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {/* Avatar placeholder for current user to maintain alignment */}
              {showAvatar && isCurrentUser && (
                <div className="w-8 h-8" />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Modal */}
      <ImageModal
        imageUrl={selectedImage || ''}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        alt="Chat image"
      />
    </>
  );
};

export default MessageList;
