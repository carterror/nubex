import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UploadOptions {
  bucket: string;
  path?: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
}

interface UploadHook {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadFile: (file: File) => Promise<string | null>;
  uploadFiles: (files: File[]) => Promise<string[]>;
}

export function useUpload({
  bucket,
  path = '',
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024, // 5MB default
}: UploadOptions): UploadHook {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFileTypes.includes(file.type)) {
      return `Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`;
    }
    if (file.size > maxFileSize) {
      return `File too large. Maximum size: ${maxFileSize / 1024 / 1024}MB`;
    }
    return null;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${path}${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

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
      setUploading(false);
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }

    return urls;
  };

  return {
    uploading,
    progress,
    error,
    uploadFile,
    uploadFiles,
  };
}