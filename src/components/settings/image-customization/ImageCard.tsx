/**
 * ImageCard Component
 * Individual image card with selection, hover effects, and attribution
 */

import { motion } from 'framer-motion';
import { Check, Trash2, ExternalLink } from 'lucide-react';
import { BackgroundImage } from '@/lib/imageSettings';
import { cn } from '@/lib/utils';

interface ImageCardProps {
  image: BackgroundImage;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  index?: number;
  showAttribution?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  }),
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 },
  },
};

const checkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
};

export function ImageCard({
  image,
  isSelected,
  onSelect,
  onDelete,
  index = 0,
  showAttribution = true,
}: ImageCardProps) {
  const thumbnailUrl = image.thumbnailUrl || image.url;

  return (
    <motion.div
      className={cn(
        'group relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer',
        'border-2 transition-colors',
        isSelected
          ? 'border-primary ring-2 ring-primary/30'
          : 'border-transparent hover:border-primary/50'
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
      onClick={onSelect}
    >
      {/* Image */}
      <img
        src={thumbnailUrl}
        alt={image.attribution?.photographerName || 'Background image'}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isSelected ? 1 : 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Selected checkmark */}
      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
          variants={checkVariants}
          initial="hidden"
          animate="visible"
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}

      {/* Delete button for uploads */}
      {onDelete && (
        <motion.button
          className={cn(
            'absolute top-2 left-2 w-7 h-7 rounded-full',
            'bg-black/50 hover:bg-red-500 flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 transition-opacity'
          )}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-3.5 h-3.5 text-white" />
        </motion.button>
      )}

      {/* Attribution */}
      {showAttribution && image.attribution && (
        <motion.div
          className={cn(
            'absolute bottom-0 left-0 right-0 p-2',
            'opacity-0 group-hover:opacity-100 transition-opacity'
          )}
          initial={{ y: 10 }}
          whileHover={{ y: 0 }}
        >
          <a
            href={image.attribution.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-white/90 hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate">
              Photo by {image.attribution.photographerName}
            </span>
            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ImageCard;
