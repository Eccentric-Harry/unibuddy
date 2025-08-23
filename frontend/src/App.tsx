import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { OtpVerificationForm } from './components/auth/OtpVerificationForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterForm />} 
            />
            <Route 
              path="/verify-otp" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <OtpVerificationForm />} 
            />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
            />
            
            {/* Catch all */}
            <Route 
              path="*" 
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
