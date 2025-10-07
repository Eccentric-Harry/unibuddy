import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Supabase URL is missing. Please add VITE_SUPABASE_URL to your .env file. Check .env.example for reference.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Supabase Anon Key is missing. Please add VITE_SUPABASE_ANON_KEY to your .env file. Check .env.example for reference.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name - this must match a pre-created bucket in your Supabase project
export const STORAGE_BUCKET = 'listing-images';

/**
 * Test connection to Supabase
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const testSupabaseConnection = async (): Promise<{success: boolean, message?: string, error?: string}> => {
  try {
    // Attempt to fetch the Supabase version which should be accessible with any key
    const { error } = await supabase.from('_availability').select('*').limit(1);

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
  } catch (err: any) {
    console.error('Error testing Supabase connection:', err);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Check the current auth status with Supabase
 * @returns {Promise<{isAuthenticated: boolean, user?: any, error?: string}>}
 */
export const checkAuthState = async (): Promise<{isAuthenticated: boolean, user?: any, error?: string}> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return { isAuthenticated: false, error: error.message };
    }

    const user = session?.user;
    return {
      isAuthenticated: !!session,
      user
    };
  } catch (err: any) {
    return { isAuthenticated: false, error: err.message };
  }
};

/**
 * Signs in user with custom JWT to create a Supabase session
 * This is useful when you're using your own auth system but need to use Supabase services
 * @param {string} jwt - Your backend-issued JWT token
 */
export const signInWithCustomJWT = async (jwt: string): Promise<boolean> => {
  try {
    // First sign out any existing session
    await supabase.auth.signOut();

    // Then sign in with the custom JWT
    const { error } = await supabase.auth.signInWithPassword({
      email: 'temp-email@example.com', // Supabase requires an email, use a placeholder
      password: jwt, // Use the JWT as the password
    });

    if (error) {
      console.error('Error signing in with JWT:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in signInWithCustomJWT:', error);
    return false;
  }
};

/**
 * Upload an image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} userId - The ID of the user uploading the file
 * @returns {Promise<{ url: string, path: string, alt: string } | null>} The URL and path of the uploaded file
 */
export const uploadImage = async (file: File, userId: string): Promise<{ url: string, path: string, alt: string } | null> => {
  try {
    if (!file) {
      console.error('No file provided for upload');
      return null;
    }

    // Create folder path with user ID and timestamp for uniqueness
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    // Check authentication status before upload
    const authState = await checkAuthState();
    if (!authState.isAuthenticated) {
      console.warn('No Supabase session found. Attempting to upload with anon key only.');
      // This might fail if your bucket requires authentication
    }

    // Upload file
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      // Handle specific storage errors with more detail
      if (error.message.includes('bucket') && error.message.toLowerCase().includes('not found')) {
        console.error(`Error: The bucket "${STORAGE_BUCKET}" does not exist in your Supabase project.`);
        console.error('Please create this bucket in the Supabase dashboard before uploading files.');
        throw new Error(`Storage bucket "${STORAGE_BUCKET}" not found. Please create it in the Supabase dashboard.`);
      } else {
        console.error('Error uploading file:', error);
        throw error; // Rethrow to be caught by the caller
      }
    }

    // Get public URL
    const { data: publicURL } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: publicURL.publicUrl,
      path: filePath,
      alt: file.name.split('.')[0] // Use filename as alt text by default
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // Rethrow to be caught by the caller
  }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} path - The path of the file to delete
 * @returns {Promise<boolean>} Whether the deletion was successful
 */
export const deleteImage = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
