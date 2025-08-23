import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import api from '../services/api';

const totpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  totpCode: z.string().min(6, 'Code must be 6 digits').max(6, 'Code must be 6 digits').regex(/^\d{6}$/, 'Code must contain only numbers'),
});

type TOTPFormData = z.infer<typeof totpSchema>;

export function TOTPVerificationPage() {
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get email from URL parameters
  const emailFromUrl = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TOTPFormData>({
    resolver: zodResolver(totpSchema),
    defaultValues: {
      email: emailFromUrl,
      totpCode: '',
    },
  });

  // Set email value when component mounts or when emailFromUrl changes
  useEffect(() => {
    if (emailFromUrl) {
      setValue('email', emailFromUrl);
    }
  }, [emailFromUrl, setValue]);

  const onSubmit = async (data: TOTPFormData) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await api.post('/auth/verify-totp', {
        email: data.email,
        totpCode: data.totpCode,
      });
      
      setStatus('success');
      setMessage(`Your email ${data.email} has been successfully verified! You can now log in to your account.`);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    if (!email) {
      setMessage('Please enter your email address first');
      return;
    }

    try {
      await api.post(`/auth/resend-verification?email=${encodeURIComponent(email)}`);
      setMessage('New verification code sent! Please check your email.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to send new code. Please try again.');
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
            <CardTitle className="text-2xl text-center">Email Verified!</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-green-700">
              {message}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/login">
              <Button>Continue to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            {emailFromUrl 
              ? `Enter the 6-digit verification code sent to ${emailFromUrl}`
              : 'Enter the 6-digit verification code sent to your email address'
            }
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {status === 'error' && message && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {message}
              </div>
            )}
            
            {message && status === 'form' && (
              <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                readOnly={!!emailFromUrl}
                className={emailFromUrl ? "bg-gray-50 cursor-not-allowed" : ""}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
              {emailFromUrl && (
                <p className="text-sm text-gray-600">Email address from registration</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totpCode">Verification Code</Label>
              <Input
                id="totpCode"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-lg tracking-widest font-mono"
                {...register('totpCode')}
              />
              {errors.totpCode && (
                <p className="text-sm text-red-600">{errors.totpCode.message}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
            
            <div className="flex flex-col items-center space-y-2 text-sm text-gray-600">
              <span>Didn't receive the code?</span>
              <Button type="button" variant="ghost" onClick={handleResendCode} className="p-0 h-auto text-blue-600">
                Resend verification code
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
