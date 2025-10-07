import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { createListing } from '../../services/api';
import { uploadImage, testSupabaseConnection, checkAuthState } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import type { ListingImage } from '../../types/marketplace';
import imageCompression from 'browser-image-compression';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  'Books',
  'Electronics',
  'Clothing',
  'Furniture',
  'Tickets',
  'Services',
  'Miscellaneous'
];

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 5;

export function CreateListingModal({ isOpen, onClose, onSuccess }: CreateListingModalProps) {
  const { user, accessToken } = useAuthStore();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<{connected: boolean, message?: string}>({
    connected: false
  });

  useEffect(() => {
    // Check Supabase connection when the component mounts
    const checkConnection = async () => {
      try {
        const result = await testSupabaseConnection();
        setConnectionStatus({
          connected: result.success,
          message: result.success ? result.message : result.error
        });

        if (result.success) {
          console.log('Supabase connection successful');
        } else {
          console.error('Supabase connection failed:', result.error);
        }

        // Also check authentication status
        const authStatus = await checkAuthState();
        console.log('Supabase auth status:', authStatus.isAuthenticated ? 'Authenticated' : 'Not authenticated');
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setConnectionStatus({
          connected: false,
          message: 'Error checking connection'
        });
      }
    };

    checkConnection();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    // Check file count
    if (images.length + selectedFiles.length > MAX_IMAGES) {
      toast({
        title: 'Too many images',
        description: `You can upload a maximum of ${MAX_IMAGES} images.`,
        variant: 'destructive'
      });
      return;
    }

    // Check file size and type
    const invalidFiles = selectedFiles.filter(file => {
      const sizeInMB = file.size / (1024 * 1024);
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      return sizeInMB > MAX_FILE_SIZE_MB || !isValidType;
    });

    if (invalidFiles.length > 0) {
      toast({
        title: 'Invalid files',
        description: `Some files are too large (max ${MAX_FILE_SIZE_MB}MB) or not in a supported format (JPG, PNG, WebP).`,
        variant: 'destructive'
      });
      return;
    }

    setImages(prev => [...prev, ...selectedFiles]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to create a listing.',
        variant: 'destructive'
      });
      return;
    }

    if (!title || !description || !price || !category) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: 'No images',
        description: 'Please upload at least one image.',
        variant: 'destructive'
      });
      return;
    }

    if (!connectionStatus.connected) {
      toast({
        title: 'Connection error',
        description: 'Cannot connect to storage service. Please try again later.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Check authentication status
      const authStatus = await checkAuthState();
      console.log('Auth status before upload:', authStatus.isAuthenticated ? 'Authenticated' : 'Not authenticated');

      // Compress and upload images
      const imagePromises = images.map(async (file, index) => {
        try {
          const compressedFile = await compressImage(file);
          const uploadedImage = await uploadImage(compressedFile, user.id);
          setUploadProgress(prev => prev + (100 / images.length));
          return uploadedImage;
        } catch (error) {
          console.error(`Error uploading image ${index}:`, error);
          // Continue with other uploads even if this one failed
          setUploadProgress(prev => prev + (100 / images.length));
          return null;
        }
      });

      const uploadedImages = await Promise.all(imagePromises);
      const validImages = uploadedImages.filter(Boolean) as ListingImage[];

      if (validImages.length === 0) {
        throw new Error('Failed to upload images');
      }

      // Create listing
      await createListing({
        title,
        description,
        price: parseFloat(price),
        category,
        images: validImages
      });

      toast({
        title: 'Listing created',
        description: 'Your listing has been created successfully.',
      });

      // Reset form and close modal
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory(CATEGORIES[0]);
      setImages([]);
      setIsUploading(false);
      setUploadProgress(0);

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating listing:', error);

      // Provide more specific error messages
      let errorMessage = 'Failed to create listing. Please try again.';

      if (error?.message?.includes('row-level security policy')) {
        errorMessage = 'Permission denied. You may not have access to upload files.';
      } else if (error?.message?.includes('bucket')) {
        errorMessage = 'Storage bucket not found. Please contact support.';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you selling?"
                required
                maxLength={255}
                disabled={isUploading}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                disabled={isUploading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  disabled={isUploading}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                  disabled={isUploading}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="images">Images (Max {MAX_IMAGES})</Label>
              <div className="mt-2">
                <Input
                  id="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageSelect}
                  disabled={isUploading || images.length >= MAX_IMAGES}
                  className="cursor-pointer"
                />
              </div>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        disabled={isUploading}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center mt-1">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
