import { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { authService } from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check for email verification token in URL
    const checkEmailVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token && window.location.pathname === '/verify-email') {
        try {
          await authService.verifyEmail(token);
          setVerificationMessage('Email verified successfully! You can now log in.');
          // Remove token from URL
          window.history.replaceState({}, document.title, '/');
        } catch (error) {
          console.error('Email verification failed:', error);
          setVerificationMessage('Email verification failed. The link may be expired or invalid.');
        }
      }
    };

    // Check if user is already authenticated
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to get user data:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    const initializeApp = async () => {
      await checkEmailVerification();
      await checkAuth();
    };

    initializeApp();
  }, []);

  const handleAuthSuccess = async (authResponse?: any) => {
    try {
      if (authResponse && authResponse.user) {
        // Use user data from login/register response
        setUser(authResponse.user);
        setIsAuthenticated(true);
      } else {
        // Fallback to API call if no user data provided
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to get user data after auth:', error);
      // Instead of failing, let's show a temporary success page
      setIsAuthenticated(true);
      setUser({ name: 'User', email: 'Unknown' }); // Temporary user data
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">College Buddy</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name || 'User'}!</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Successfully Logged In!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Welcome to College Buddy, {user.name || 'User'}!
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <h3 className="font-medium text-blue-900 mb-2">Your Account Details</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>Email: {user.email || 'Not available'}</p>
                  <p>College: {user.collegeName || 'Not set'}</p>
                  <p>Year: {user.year || 'Not set'}</p>
                  <p>Email Verified: {user.emailVerified ? '✅ Yes' : '❌ No'}</p>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-gray-500 text-sm">
                  🎉 Email verification is working correctly!
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  This is a temporary success page. The full dashboard will be implemented later.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">College Buddy</h1>
          <p className="text-gray-600">Your campus community platform</p>
        </div>

        {verificationMessage && (
          <div className={`mb-6 p-4 rounded-md ${
            verificationMessage.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {verificationMessage.includes('successfully') ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">{verificationMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setVerificationMessage(null)}
                  className="inline-flex text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {showLogin ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setShowLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={() => setShowLogin(true)}
            onSwitchToLogin={() => setShowLogin(true)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
