import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useAuthStore } from '../../store/authStore';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface LocationState {
  email?: string;
}

export function OtpVerificationForm() {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, isLoading, error, clearError } = useAuthStore();
  
  const state = location.state as LocationState;
  const email = state?.email;

  // Redirect to register if no email provided
  if (!email) {
    navigate('/register');
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const otpValue = watch('otp', '');

  const onSubmit = async (data: OtpFormData) => {
    try {
      clearError();
      await verifyOtp({ email, otp: data.otp });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      setResendSuccess(false);
      await resendOtp({ email });
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="text-white w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a 6-digit verification code to<br />
            <span className="font-medium text-gray-900">{email}</span>
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            {resendSuccess && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                New verification code sent successfully!
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-2xl font-mono tracking-wider"
                {...register('otp')}
                autoComplete="one-time-code"
              />
              {errors.otp && (
                <p className="text-sm text-red-600">{errors.otp.message}</p>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-800"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || otpValue.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              Need to change your email?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:underline font-medium"
              >
                Go back to registration
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
