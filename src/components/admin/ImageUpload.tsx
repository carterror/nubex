import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  onError?: (error: string) => void;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export default function ImageUpload({
  value = [],
  onChange,
  onError,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string[]>(value);

  const { uploadImages, deleteImage, loading, error } = useImageUpload({
    bucket: 'product-images',
    path: 'products/',
    maxFileSize: maxSize,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    if (files.length + preview.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const urls = await uploadImages(files);
    if (urls.length > 0) {
      const newPreview = [...preview, ...urls];
      setPreview(newPreview);
      onChange?.(newPreview);
    }

    if (error) {
      onError?.(error);
    }
  };

  const handleRemove = async (index: number) => {
    const url = preview[index];
    const success = await deleteImage(url);
    if (success) {
      const newPreview = preview.filter((_, i) => i !== index);
      setPreview(newPreview);
      onChange?.(newPreview);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          loading ? 'bg-gray-50' : 'hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        {loading ? (
          <div className="animate-pulse">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop images here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG, WebP up to {maxSize / 1024 / 1024}MB
              {maxFiles > 1 && ` (max ${maxFiles} files)`}
            </p>
          </>
        )}
      </div>

      {preview.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {preview.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}