// Simple utility to test Supabase connection
import { supabase } from '../services/supabase';

export const testSupabaseConnection = async () => {
  try {
    // A simple query that should work with any Supabase project
    const { data, error } = await supabase.from('_availability').select('*').limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase!'
    };
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    return {
      success: false,
      error: err.message
    };
  }
};

// Test the auth state
export const checkAuthState = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return {
        success: false,
        error: error.message,
        isAuthenticated: false
      };
    }

    return {
      success: true,
      isAuthenticated: !!session,
      session
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      isAuthenticated: false
    };
  }
};
