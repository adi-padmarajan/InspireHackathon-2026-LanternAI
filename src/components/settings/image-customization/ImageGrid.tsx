/**
 * ImageGrid Component
 * Responsive grid layout for displaying images
 */

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { BackgroundImage } from '@/lib/imageSettings';
import { ImageCard } from './ImageCard';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  images: BackgroundImage[];
  selectedImage: BackgroundImage | null;
  onSelectImage: (image: BackgroundImage) => void;
  onDeleteImage?: (imageId: string) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  showAttribution?: boolean;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const loadingVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
};

export function ImageGrid({
  images,
  selectedImage,
  onSelectImage,
  onDeleteImage,
  isLoading = false,
  loadingMessage = 'Loading images...',
  emptyMessage = 'No images found',
  showAttribution = true,
  className,
}: ImageGridProps) {
  // Loading state
  if (isLoading && images.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16 text-muted-foreground"
        variants={loadingVariants}
        initial="initial"
        animate="animate"
      >
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm">{loadingMessage}</p>
      </motion.div>
    );
  }

  // Empty state
  if (!isLoading && images.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16 text-muted-foreground"
        variants={loadingVariants}
        initial="initial"
        animate="animate"
      >
        <p className="text-sm">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 gap-3',
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {images.map((image, index) => (
        <ImageCard
          key={image.id}
          image={image}
          isSelected={selectedImage?.id === image.id}
          onSelect={() => onSelectImage(image)}
          onDelete={onDeleteImage ? () => onDeleteImage(image.id) : undefined}
          index={index}
          showAttribution={showAttribution}
        />
      ))}

      {/* Loading indicator for more items */}
      {isLoading && images.length > 0 && (
        <motion.div
          className="col-span-full flex justify-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default ImageGrid;
