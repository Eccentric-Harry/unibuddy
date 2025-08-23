import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import api from '../services/api';

const resendSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResendFormData = z.infer<typeof resendSchema>;

export function ResendVerificationPage() {
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
  });

  const onSubmit = async (data: ResendFormData) => {
    setIsLoading(true);
    try {
      await api.post(`/auth/resend-verification?email=${encodeURIComponent(data.email)}`);
      setStatus('success');
      setMessage('Verification code has been sent! Please check your inbox and use the 6-digit code to verify your email.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-center text-green-600">
              Email Sent!
            </CardTitle>
            <CardDescription className="text-center text-green-700">
              {message}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-3">
            <Link to="/verify-totp" className="w-full">
              <Button className="w-full">Enter Verification Code</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="text-white w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Resend Verification</CardTitle>
          <CardDescription className="text-center">
            Enter your email address to receive a new 6-digit verification code
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {status === 'error' && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {message}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </Button>
            <div className="text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
