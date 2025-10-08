import type { ListingResponse } from '../types/marketplace';

export const dummyListings: ListingResponse[] = [
  {
    id: 'dummy-1',
    title: 'MacBook Pro 13" 2020',
    description: 'Gently used MacBook Pro in excellent condition. Comes with original charger and case. Perfect for students!',
    price: 899.99,
    category: 'Electronics',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
        path: 'dummy/macbook.jpg',
        alt: 'MacBook Pro laptop'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-1',
      name: 'Sarah Johnson',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      year: 3,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-2',
    title: 'Calculus Textbook - 10th Edition',
    description: 'Like new condition. No highlighting or notes. Great for MATH 101 and 102.',
    price: 45.00,
    category: 'Books',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
        path: 'dummy/textbook.jpg',
        alt: 'Calculus textbook'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-2',
      name: 'Mike Chen',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      year: 2,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-3',
    title: 'Mini Fridge - Perfect for Dorms',
    description: 'Compact refrigerator, barely used. Great for dorm rooms. Energy efficient and quiet.',
    price: 75.00,
    category: 'Furniture',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop',
        path: 'dummy/fridge.jpg',
        alt: 'Mini refrigerator'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-3',
      name: 'Emily Rodriguez',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      year: 4,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-4',
    title: 'Mountain Bike - 21 Speed',
    description: 'Excellent condition mountain bike. Regular maintenance done. Perfect for campus commuting.',
    price: 180.00,
    category: 'Sports',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=600&fit=crop',
        path: 'dummy/bike.jpg',
        alt: 'Mountain bike'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-4',
      name: 'Alex Thompson',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      year: 2,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-5',
    title: 'iPhone 12 - 128GB Blue',
    description: 'Unlocked iPhone in great condition. Battery health at 89%. Includes case and screen protector.',
    price: 450.00,
    category: 'Electronics',
    images: [
      {
        url: 'https://unsplash.com/photos/white-iphone-4s-held-by-person-4YmSIWff6aw',
        path: 'dummy/iphone.jpg',
        alt: 'iPhone 12'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-5',
      name: 'Jessica Lee',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
      year: 3,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-6',
    title: 'Desk Lamp - LED with USB Port',
    description: 'Modern LED desk lamp with adjustable brightness. Built-in USB charging port. Perfect for studying.',
    price: 25.00,
    category: 'Furniture',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop',
        path: 'dummy/lamp.jpg',
        alt: 'Desk lamp'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-6',
      name: 'David Park',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      year: 1,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-7',
    title: 'Nintendo Switch with Games',
    description: 'Console in perfect working condition. Includes 5 popular games and carrying case.',
    price: 280.00,
    category: 'Electronics',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=600&fit=crop',
        path: 'dummy/switch.jpg',
        alt: 'Nintendo Switch'
      }
    ],
    status: 'RESERVED',
    seller: {
      id: 'seller-7',
      name: 'Rachel Green',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
      year: 2,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-8',
    title: 'Wireless Headphones - Sony',
    description: 'Noise cancelling wireless headphones. Excellent sound quality. Barely used, includes all accessories.',
    price: 120.00,
    category: 'Electronics',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
        path: 'dummy/headphones.jpg',
        alt: 'Wireless headphones'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-8',
      name: 'Tom Wilson',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
      year: 3,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-9',
    title: 'Coffee Maker - Keurig K-Mini',
    description: 'Compact single-serve coffee maker. Perfect for dorm rooms. Clean and works great!',
    price: 40.00,
    category: 'Appliances',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=600&fit=crop',
        path: 'dummy/coffee.jpg',
        alt: 'Coffee maker'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-9',
      name: 'Olivia Martinez',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
      year: 4,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-10',
    title: 'Yoga Mat with Carrying Bag',
    description: 'High-quality yoga mat with extra cushioning. Includes carrying bag and strap. Like new!',
    price: 20.00,
    category: 'Sports',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=600&fit=crop',
        path: 'dummy/yoga.jpg',
        alt: 'Yoga mat'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-10',
      name: 'Chris Anderson',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
      year: 1,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-11',
    title: 'Study Desk - Wood Finish',
    description: 'Sturdy desk with drawer. Great for studying. Easy to assemble. Moving sale!',
    price: 60.00,
    category: 'Furniture',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop',
        path: 'dummy/desk.jpg',
        alt: 'Study desk'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-11',
      name: 'Amy Zhang',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amy',
      year: 4,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dummy-12',
    title: 'Skateboard - Complete Setup',
    description: 'Professional quality skateboard. Barely used. Great for beginners and experienced riders.',
    price: 85.00,
    category: 'Sports',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&h=600&fit=crop',
        path: 'dummy/skateboard.jpg',
        alt: 'Skateboard'
      }
    ],
    status: 'ACTIVE',
    seller: {
      id: 'seller-12',
      name: 'Jake Brown',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake',
      year: 2,
      collegeName: 'Sample University'
    },
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
];
