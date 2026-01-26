/**
 * CuratedGallery Component
 * Pre-selected beautiful background images by category
 */

import { motion } from 'framer-motion';
import {
  Mountain,
  Palette,
  Square,
  Sparkles,
  Waves,
  TreePine,
  Building2,
  Sunrise,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackgroundImage, curatedCategories } from '@/lib/imageSettings';
import { ImageGrid } from './ImageGrid';
import { cn } from '@/lib/utils';

interface CuratedGalleryProps {
  images: BackgroundImage[];
  isLoading: boolean;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  selectedImage: BackgroundImage | null;
  onSelectImage: (image: BackgroundImage) => void;
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  nature: Mountain,
  abstract: Palette,
  minimal: Square,
  space: Sparkles,
  ocean: Waves,
  forest: TreePine,
  city: Building2,
  sunset: Sunrise,
};

export function CuratedGallery({
  images,
  isLoading,
  selectedCategory,
  onSelectCategory,
  selectedImage,
  onSelectImage,
}: CuratedGalleryProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Category filters */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Browse by category</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            className="h-8 text-xs"
            onClick={() => onSelectCategory(null)}
          >
            All
          </Button>
          {curatedCategories.map((category) => {
            const Icon = categoryIcons[category.id] || Square;
            const isSelected = selectedCategory === category.id;

            return (
              <Button
                key={category.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'h-8 text-xs gap-1.5',
                  isSelected && 'shadow-sm'
                )}
                onClick={() => onSelectCategory(category.id)}
              >
                <Icon className="w-3.5 h-3.5" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Image grid */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <ImageGrid
          images={images}
          selectedImage={selectedImage}
          onSelectImage={onSelectImage}
          isLoading={isLoading}
          loadingMessage="Loading curated images..."
          emptyMessage="No images available. Try another category."
          showAttribution
        />
      </div>

      {/* Attribution */}
      <div className="pt-3 border-t border-border mt-3">
        <p className="text-[10px] text-muted-foreground text-center">
          Curated photos from{' '}
          <a
            href="https://unsplash.com/?utm_source=lantern&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Unsplash
          </a>
        </p>
      </div>
    </div>
  );
}

export default CuratedGallery;
