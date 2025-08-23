import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginRequest, RegisterRequest } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<{ otpSent: boolean; email: string; name: string }>;
  verifyOtp: (data: { email: string; otp: string }) => Promise<void>;
  resendOtp: (data: { email: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.login(credentials);
          const { accessToken, refreshToken, user } = response.data;
          
          // Store tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.register(data);
          set({ isLoading: false });
          // Return the registration response data
          return {
            otpSent: response.data.otpSent,
            email: response.data.email,
            name: response.data.name
          };
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      verifyOtp: async (data: { email: string; otp: string }) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.verifyOtp(data);
          const { accessToken, refreshToken, user } = response.data;
          
          // Store tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'OTP verification failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      resendOtp: async (data: { email: string }) => {
        set({ isLoading: true, error: null });
        
        try {
          await authApi.resendOtp(data);
          set({ isLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Clear store
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
        
        // Call logout API
        authApi.logout().catch(console.error);
      },

      clearError: () => {
        set({ error: null });
      },

      getCurrentUser: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        
        try {
          const response = await authApi.getCurrentUser();
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          // Token might be expired, logout
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
