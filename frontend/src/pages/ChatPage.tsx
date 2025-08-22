import { MessageCircle } from 'lucide-react';

export function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Global Chat</h1>
        <p className="text-gray-600">Coming soon! Connect with your campus community in real-time.</p>
      </div>
    </div>
  );
}
