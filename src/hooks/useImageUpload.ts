import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseImageUploadOptions {
  bucket: string;
  path?: string;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
}

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string | null>;
  uploadImages: (files: File[]) => Promise<string[]>;
  deleteImage: (url: string) => Promise<boolean>;
  loading: boolean;
  progress: number;
  error: string | null;
}

export function useImageUpload({
  bucket,
  path = '',
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}: UseImageUploadOptions): UseImageUploadReturn {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`;
    }
    if (file.size > maxFileSize) {
      return `File too large. Maximum size: ${maxFileSize / 1024 / 1024}MB`;
    }
    return null;
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExt = file.name.split('.').pop();
      const filePath = `${path}${timestamp}_${randomString}.${fileExt}`;

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrl } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setProgress(100);
      return publicUrl.publicUrl;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      if (url) urls.push(url);
      setProgress(((i + 1) / files.length) * 100);
    }

    return urls;
  };

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      // Extract the file path from the URL
      const path = url.split('/').pop();
      if (!path) throw new Error('Invalid image URL');

      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return false;
    }
  };

  return {
    uploadImage,
    uploadImages,
    deleteImage,
    loading,
    progress,
    error,
  };
}