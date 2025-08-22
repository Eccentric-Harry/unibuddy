import React, { useState } from 'react';
import { authService, type LoginRequest } from '../services/authService';

interface LoginFormProps {
  onSuccess?: (authResponse?: any) => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResendVerification(false);

    try {
      const response = await authService.login(formData);
      console.log('Login successful:', response);
      onSuccess?.(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      
      // Check if the error is related to email verification
      if (errorMessage.includes('not activated') || 
          errorMessage.includes('verify your email') ||
          errorMessage.includes('email not verified') ||
          errorMessage.includes('account not activated')) {
        setShowResendVerification(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    setResendLoading(true);
    try {
      await authService.resendVerificationEmail(formData.email);
      setVerificationEmailSent(true);
      setShowResendVerification(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Login to College Buddy
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your-email@college.edu"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {verificationEmailSent && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Verification email sent! Please check your inbox and click the verification link.
          </div>
        )}

        {showResendVerification && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <p className="text-sm mb-2">
              Your account needs to be verified before you can log in.
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
            >
              {resendLoading ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          } text-white transition duration-200`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
