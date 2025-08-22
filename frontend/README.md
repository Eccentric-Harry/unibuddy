# College Buddy Frontend

A modern React + TypeScript frontend for the College Buddy platform - connecting college students through campus-focused social features.

## 🚀 Features

### ✅ Implemented
- **Authentication System**
  - Beautiful login/register forms with validation
  - College email verification
  - JWT token management with automatic refresh
  - Protected routes and authentication state management

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Beautiful gradient backgrounds and card layouts
  - Icon integration with Lucide React
  - Form validation with React Hook Form + Zod

- **State Management**
  - Zustand for global state management
  - React Query for server state management
  - Persistent authentication state

### 🔄 Planned Features
- **Global Chat** - Real-time campus-wide messaging
- **Marketplace** - Buy/sell items with fellow students
- **Job Board** - Campus job and internship listings
- **Tutoring** - Peer-to-peer tutoring marketplace
- **College Info** - Campus announcements and events

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v3
- **State Management:** Zustand + React Query
- **Routing:** React Router DOM
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **UI Components:** Custom Radix UI-based components
- **Build Tool:** Vite
- **HTTP Client:** Axios

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/                # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       └── index.ts
├── pages/                 # Page components
│   ├── Dashboard.tsx
│   ├── ChatPage.tsx
│   └── MarketplacePage.tsx
├── store/                 # State management
│   └── authStore.ts       # Authentication store
├── services/              # API services
│   └── api.ts             # HTTP client & API calls
├── types/                 # TypeScript type definitions
│   └── index.ts
├── utils/                 # Utility functions
│   └── index.ts
├── App.tsx               # Main app component with routing
├── main.tsx              # App entry point
└── index.css             # Global styles
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running on `http://localhost:8080`

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🔐 Authentication Flow

1. **Registration**
   - Users register with their college email (.edu domain)
   - Form validation ensures proper email format and strong passwords
   - Email verification required before login

2. **Login**
   - Users log in with email and password
   - JWT tokens stored securely in localStorage
   - Automatic token refresh on API calls

3. **Protected Routes**
   - Dashboard and other features require authentication
   - Automatic redirect to login if not authenticated
   - Token validation on app load

## 🎨 UI Components

All components are built with accessibility in mind and follow modern design patterns:

- **Button** - Multiple variants (default, outline, secondary, ghost, destructive)
- **Input** - Form inputs with proper focus states
- **Card** - Content containers with headers, content, and footers
- **Label** - Accessible form labels

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)  
- Mobile (320px - 767px)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ESLint for code linting
- TypeScript for type safety
- Consistent import organization
- Component naming conventions

## 🚀 Deployment

The frontend can be deployed to:
- **Vercel** (recommended for Vite apps)
- **Netlify**
- **AWS S3 + CloudFront**
- **Any static hosting service**

## 🤝 API Integration

The frontend communicates with the Spring Boot backend through:

- **REST API** endpoints for CRUD operations
- **JWT authentication** for secure requests
- **Automatic token refresh** for seamless user experience
- **Error handling** with user-friendly messages

### API Structure

```typescript
// Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me

// Users
GET    /api/users/:id
PATCH  /api/users/profile

// Chat (planned)
GET    /api/chat/history
POST   /api/chat/messages

// Marketplace (planned)
GET    /api/listings
POST   /api/listings
```

## 🎯 Next Steps

1. **Implement Chat Feature**
   - WebSocket connection for real-time messaging
   - Message history and persistence
   - Channel-based communication

2. **Build Marketplace**
   - Create listing forms with image upload
   - Search and filter functionality
   - In-app messaging between buyers/sellers

3. **Add Job Board**
   - Job posting interface
   - Application tracking
   - Company verification

4. **Develop Tutoring Platform**
   - Tutor profiles and availability
   - Booking system
   - Rating and review system

## 📞 Support

For questions or support, please contact the development team or open an issue in the repository.

---

Built with ❤️ for college students everywhere.
