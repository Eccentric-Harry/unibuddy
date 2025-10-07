import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  alt?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ 
  imageUrl, 
  isOpen, 
  onClose, 
  alt = "Image",
  onNext,
  onPrevious
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        {onPrevious && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {onNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            // If image fails to load in modal, show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'bg-gray-800 text-white p-8 rounded-lg text-center';
            errorDiv.innerHTML = `
              <div class="text-red-400 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-lg">Failed to load image</p>
              <a href="${imageUrl}" target="_blank" class="text-blue-400 hover:text-blue-300 underline mt-2 inline-block">
                Open in new tab
              </a>
            `;
            e.currentTarget.parentNode?.replaceChild(errorDiv, e.currentTarget);
          }}
        />
      </div>
    </div>
  );
};
