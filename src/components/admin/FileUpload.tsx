import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useUpload } from '../../hooks/useUpload';

interface FileUploadProps {
  bucket: string;
  path?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  value?: string[];
  onChange?: (urls: string[]) => void;
  onError?: (error: string) => void;
}

export default function FileUpload({
  bucket,
  path = '',
  accept = 'image/*',
  multiple = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  value = [],
  onChange,
  onError,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string[]>(value);

  const { uploadFiles, uploading, error } = useUpload({
    bucket,
    path,
    acceptedFileTypes: accept.split(','),
    maxFileSize: maxSize,
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
    if (!multiple && files.length > 1) {
      const error = 'Only one file can be uploaded';
      onError?.(error);
      return;
    }

    if (files.length > maxFiles) {
      const error = `Maximum ${maxFiles} files can be uploaded`;
      onError?.(error);
      return;
    }

    const urls = await uploadFiles(files);
    if (urls.length > 0) {
      const newPreview = multiple ? [...preview, ...urls] : urls;
      setPreview(newPreview);
      onChange?.(newPreview);
    }

    if (error) {
      onError?.(error);
    }
  };

  const removeFile = (index: number) => {
    const newPreview = preview.filter((_, i) => i !== index);
    setPreview(newPreview);
    onChange?.(newPreview);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          uploading ? 'bg-gray-50' : 'hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {uploading
            ? 'Uploading...'
            : `Drag and drop ${multiple ? 'files' : 'a file'} here, or click to select`}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {`Maximum file size: ${maxSize / 1024 / 1024}MB`}
        </p>
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
                onClick={() => removeFile(index)}
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