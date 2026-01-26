/**
 * UnsplashSearch Component
 * Search Unsplash for background images
 */

import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BackgroundImage } from '@/lib/imageSettings';
import { ImageGrid } from './ImageGrid';
import { cn } from '@/lib/utils';

interface UnsplashSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: BackgroundImage[];
  isSearching: boolean;
  searchError: string | null;
  selectedImage: BackgroundImage | null;
  onSelectImage: (image: BackgroundImage) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const popularSearches = [
  'nature',
  'mountains',
  'ocean',
  'forest',
  'sunset',
  'space',
  'abstract',
  'minimal',
];

export function UnsplashSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  searchError,
  selectedImage,
  onSelectImage,
  onLoadMore,
  hasMore,
}: UnsplashSearchProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isSearching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      onLoadMore();
    }
  }, [isSearching, hasMore, onLoadMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search Unsplash for images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Popular searches (when no query) */}
      {!searchQuery && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-muted-foreground mb-2">Popular searches</p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSearchQuery(term)}
              >
                {term}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error message */}
      {searchError && (
        <motion.div
          className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{searchError}</span>
        </motion.div>
      )}

      {/* Results */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pr-2 -mr-2"
      >
        <ImageGrid
          images={searchResults}
          selectedImage={selectedImage}
          onSelectImage={onSelectImage}
          isLoading={isSearching}
          loadingMessage="Searching Unsplash..."
          emptyMessage={searchQuery ? 'No images found. Try a different search.' : 'Search for beautiful images from Unsplash'}
          showAttribution
        />

        {/* Load more button */}
        {hasMore && searchResults.length > 0 && !isSearching && (
          <div className="flex justify-center py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
            >
              Load more
            </Button>
          </div>
        )}
      </div>

      {/* Unsplash attribution */}
      <div className="pt-3 border-t border-border mt-3">
        <p className="text-[10px] text-muted-foreground text-center">
          Photos provided by{' '}
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

export default UnsplashSearch;
