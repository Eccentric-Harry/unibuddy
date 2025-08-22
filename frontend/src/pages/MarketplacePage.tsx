import { ShoppingBag } from 'lucide-react';

export function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketplace</h1>
        <p className="text-gray-600">Coming soon! Buy and sell items with fellow students.</p>
      </div>
    </div>
  );
}
