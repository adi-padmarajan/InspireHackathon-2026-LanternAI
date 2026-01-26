/**
 * ImageUploader Component
 * Drag-and-drop upload zone with progress indicator
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackgroundImage, validateImageFile } from '@/lib/imageSettings';
import { ImageGrid } from './ImageGrid';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  userUploads: BackgroundImage[];
  selectedImage: BackgroundImage | null;
  onSelectImage: (image: BackgroundImage) => void;
  onDeleteImage: (imageId: string) => void;
}

export function ImageUploader({
  onUpload,
  isUploading,
  uploadProgress,
  uploadError,
  userUploads,
  selectedImage,
  onSelectImage,
  onDeleteImage,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragError(null);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragError(null);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    const validation = validateImageFile(file);

    if (!validation.valid) {
      setDragError(validation.error || 'Invalid file');
      return;
    }

    await onUpload(file);
  }, [onUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateImageFile(file);

    if (!validation.valid) {
      setDragError(validation.error || 'Invalid file');
      return;
    }

    await onUpload(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onUpload]);

  const error = dragError || uploadError;

  return (
    <div className="flex flex-col h-full">
      {/* Upload Zone */}
      <motion.div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-6 mb-4 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50',
          isUploading && 'pointer-events-none'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <motion.div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center mb-3',
              isDragging ? 'bg-primary/20' : 'bg-muted'
            )}
            animate={{
              scale: isDragging ? 1.1 : 1,
              rotate: isDragging ? 5 : 0,
            }}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <Upload className={cn(
                'w-6 h-6',
                isDragging ? 'text-primary' : 'text-muted-foreground'
              )} />
            )}
          </motion.div>

          {isUploading ? (
            <>
              <p className="text-sm font-medium mb-1">Uploading...</p>
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>

              {/* Progress bar */}
              <div className="w-full max-w-xs h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-medium mb-1">
                {isDragging ? 'Drop image here' : 'Drag and drop an image'}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                or click to browse (JPEG, PNG, WebP, GIF up to 5MB)
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setDragError(null)}
              className="p-0.5 hover:bg-destructive/20 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User uploads */}
      <div className="flex-1 overflow-y-auto">
        <h4 className="text-sm font-medium mb-3">Your Uploads</h4>
        <ImageGrid
          images={userUploads}
          selectedImage={selectedImage}
          onSelectImage={onSelectImage}
          onDeleteImage={onDeleteImage}
          emptyMessage="No uploaded images yet"
          showAttribution={false}
        />
      </div>
    </div>
  );
}

export default ImageUploader;
