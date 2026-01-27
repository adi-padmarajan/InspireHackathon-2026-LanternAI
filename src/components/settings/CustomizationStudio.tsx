/**
 * CustomizationStudio - Award-Winning Customization Experience
 * Cinematic, immersive background and theme customization
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
  Sparkles, Palette, Wand2,
  Sun, Moon, Monitor, Check, Search, Upload, X, Sliders,
  Play, RotateCcw, Zap, Circle, Minus, Layers, Loader2,
  Mountain, Waves, TreePine, Building2, Sunrise, Camera
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import {
  Wallpaper,
  ImageWallpaper,
  MoodPreset,
  MoodCategory,
  curatedGradients,
  curatedMeshGradients,
  curatedSolidColors,
  curatedPatterns,
  curatedDynamicWallpapers,
  moodPresets,
  moodCategories,
  getGradientCSS,
  getMeshGradientCSS,
} from '@/lib/wallpapers';
import {
  BackgroundImage,
  UnsplashPhoto,
  unsplashPhotoToBackgroundImage,
  curatedCategories,
} from '@/lib/imageSettings';
import { AnimationIntensity, BackgroundStyle } from '@/lib/themes';

// ============================================================================
// TYPES
// ============================================================================

type StudioTab = 'moods' | 'wallpapers' | 'colors' | 'effects';
type WallpaperTab = 'gradients' | 'mesh' | 'solid' | 'patterns' | 'dynamic' | 'images';

// ============================================================================
// WALLPAPER PREVIEW COMPONENT
// ============================================================================

const WallpaperPreview = ({
  wallpaper,
  isSelected,
  onClick,
  size = 'medium',
}: {
  wallpaper: Wallpaper;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}) => {
  const getBackground = () => {
    switch (wallpaper.type) {
      case 'gradient':
        return getGradientCSS(wallpaper);
      case 'mesh':
        return getMeshGradientCSS(wallpaper);
      case 'solid':
        return wallpaper.color;
      case 'pattern':
        return wallpaper.baseColor;
      case 'dynamic':
        return `linear-gradient(135deg, ${wallpaper.colors.join(', ')})`;
      case 'image':
        return `url(${wallpaper.thumbnailUrl || wallpaper.url})`;
      default:
        return '#000';
    }
  };

  const sizeClasses = {
    small: 'h-16 w-16 rounded-lg',
    medium: 'h-24 w-full rounded-xl',
    large: 'h-32 w-full rounded-2xl',
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden transition-all group',
        sizeClasses[size],
        isSelected
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 hover:ring-offset-background'
      )}
      style={{
        background: wallpaper.type === 'image' ? undefined : getBackground(),
        backgroundImage: wallpaper.type === 'image' ? getBackground() : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Inset border for light-colored backgrounds */}
      <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[inherit]" />

      {/* Pattern overlay for pattern type */}
      {wallpaper.type === 'pattern' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              wallpaper.pattern === 'dots'
                ? `radial-gradient(${wallpaper.patternColor} 1px, transparent 1px)`
                : wallpaper.pattern === 'grid'
                ? `linear-gradient(${wallpaper.patternColor}40 1px, transparent 1px), linear-gradient(90deg, ${wallpaper.patternColor}40 1px, transparent 1px)`
                : undefined,
            backgroundSize: wallpaper.pattern === 'dots' ? '10px 10px' : '20px 20px',
            opacity: wallpaper.opacity,
          }}
        />
      )}

      {/* Dynamic animation indicator */}
      {wallpaper.type === 'dynamic' && (
        <motion.div
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Play className="w-2.5 h-2.5 text-white" />
        </motion.div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Check className="w-4 h-4 text-primary-foreground" />
          </motion.div>
        </motion.div>
      )}

      {/* Name overlay - always visible */}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <p className="text-xs text-white font-medium truncate drop-shadow-sm">{wallpaper.name}</p>
      </div>
    </motion.button>
  );
};

// ============================================================================
// MOOD PRESET CARD
// ============================================================================

const MoodPresetCard = ({
  preset,
  isSelected,
  onClick,
}: {
  preset: MoodPreset;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  const getPreviewBackground = () => {
    const { wallpaper } = preset;
    if (!wallpaper) return 'linear-gradient(135deg, #334155, #475569)';
    switch (wallpaper.type) {
      case 'gradient':
        return getGradientCSS(wallpaper);
      case 'mesh':
        return getMeshGradientCSS(wallpaper);
      case 'solid':
        return wallpaper.color;
      case 'dynamic':
        return `linear-gradient(135deg, ${wallpaper.colors.join(', ')})`;
      default:
        return 'linear-gradient(135deg, #334155, #475569)';
    }
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-2xl p-4 text-left transition-all w-full',
        'bg-card border-2 hover:shadow-lg',
        isSelected
          ? 'border-primary shadow-lg shadow-primary/20'
          : 'border-border hover:border-primary/50'
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Preview gradient - using negative margins to extend to card edges */}
      <div
        className="h-20 -mx-4 -mt-4 mb-3 relative overflow-hidden"
        style={{ background: getPreviewBackground() }}
      >
        {/* Inset border for light gradients */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Emoji badge */}
        <motion.div
          className="absolute top-3 right-3 text-2xl drop-shadow-lg"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {preset.emoji}
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground text-sm">{preset.name}</h3>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"
            >
              <Check className="w-2.5 h-2.5 text-primary-foreground" />
            </motion.div>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{preset.description}</p>
      </div>

      {/* Accent color indicator */}
      {preset.accentColor && (
        <div
          className="absolute bottom-4 right-4 w-4 h-4 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: preset.accentColor }}
        />
      )}
    </motion.button>
  );
};

// ============================================================================
// MOOD CATEGORY PILLS
// ============================================================================

const MoodCategoryPills = ({
  selected,
  onSelect,
}: {
  selected: MoodCategory | 'all';
  onSelect: (category: MoodCategory | 'all') => void;
}) => {
  const categories = [
    { id: 'all' as const, name: 'All', emoji: '✨' },
    ...moodCategories,
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors',
            selected === cat.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onSelect(cat.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{cat.emoji}</span>
          <span className="font-medium">{cat.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

// ============================================================================
// TAB NAVIGATION
// ============================================================================

const StudioTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
}) => {
  const tabs: { id: StudioTab; label: string; icon: any }[] = [
    { id: 'moods', label: 'Moods', icon: Wand2 },
    { id: 'wallpapers', label: 'Wallpapers', icon: Layers },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'effects', label: 'Effects', icon: Sliders },
  ];

  return (
    <div className="flex bg-muted/50 rounded-2xl p-1.5">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => onTabChange(tab.id)}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

// ============================================================================
// WALLPAPER TABS
// ============================================================================

const WallpaperTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: WallpaperTab;
  onTabChange: (tab: WallpaperTab) => void;
}) => {
  const tabs: { id: WallpaperTab; label: string }[] = [
    { id: 'gradients', label: 'Gradients' },
    { id: 'mesh', label: 'Mesh' },
    { id: 'solid', label: 'Solid' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'dynamic', label: 'Dynamic' },
    { id: 'images', label: 'Images' },
  ];

  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
            activeTab === tab.id
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
          onClick={() => onTabChange(tab.id)}
          whileTap={{ scale: 0.98 }}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};

// ============================================================================
// MOODS TAB CONTENT
// ============================================================================

const MoodsTabContent = ({
  selectedMood,
  onMoodSelect,
}: {
  selectedMood: MoodPreset | null;
  onMoodSelect: (mood: MoodPreset) => void;
}) => {
  const [categoryFilter, setCategoryFilter] = useState<MoodCategory | 'all'>('all');

  const filteredPresets = useMemo(() => {
    if (categoryFilter === 'all') return moodPresets;
    return moodPresets.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground">Choose a Mood</h3>
        <p className="text-xs text-muted-foreground">
          Pre-configured experiences with matching wallpapers, colors, and effects
        </p>
      </div>

      <MoodCategoryPills selected={categoryFilter} onSelect={setCategoryFilter} />

      <div className="grid grid-cols-2 gap-3 auto-rows-fr">
        <AnimatePresence mode="popLayout">
          {filteredPresets.map((preset, index) => (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="min-h-0"
            >
              <MoodPresetCard
                preset={preset}
                isSelected={selectedMood?.id === preset.id}
                onClick={() => onMoodSelect(preset)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================================================
// IMAGE PREVIEW COMPONENT (for Unsplash images)
// ============================================================================

const ImagePreview = ({
  image,
  isSelected,
  onClick,
}: {
  image: BackgroundImage;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <motion.button
      className={cn(
        'relative overflow-hidden h-24 w-full rounded-xl transition-all group',
        isSelected
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 hover:ring-offset-background'
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img
        src={image.thumbnailUrl || image.url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Check className="w-4 h-4 text-primary-foreground" />
          </motion.div>
        </motion.div>
      )}

      {/* Attribution on hover */}
      {image.attribution && (
        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-[10px] text-white/80 truncate">
            by {image.attribution.photographerName}
          </p>
        </div>
      )}
    </motion.button>
  );
};

// ============================================================================
// CURATED CATEGORY PILLS
// ============================================================================

const CuratedCategoryPills = ({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (category: string | null) => void;
}) => {
  const iconMap: Record<string, any> = {
    Mountain,
    Palette: LucideIcons.Palette,
    Square: LucideIcons.Square,
    Sparkles,
    Waves,
    TreePine,
    Building2,
    Sunrise,
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
      <motion.button
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors',
          selected === null
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
        )}
        onClick={() => onSelect(null)}
        whileTap={{ scale: 0.98 }}
      >
        <Camera className="w-3 h-3" />
        <span>All</span>
      </motion.button>
      {curatedCategories.map((cat) => {
        const Icon = iconMap[cat.icon] || Sparkles;
        return (
          <motion.button
            key={cat.id}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors',
              selected === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            )}
            onClick={() => onSelect(cat.id)}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-3 h-3" />
            <span>{cat.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

// ============================================================================
// UNSPLASH IMAGES CONTENT
// ============================================================================

const UnsplashImagesContent = ({
  selectedImageId,
  onImageSelect,
}: {
  selectedImageId: string | null;
  onImageSelect: (image: BackgroundImage) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BackgroundImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [curatedImages, setCuratedImages] = useState<BackgroundImage[]>([]);
  const [isLoadingCurated, setIsLoadingCurated] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search Unsplash
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchUnsplash = async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const response = await api.images.searchUnsplash(debouncedQuery, 1, 20);
        const images = response.results.map((photo: UnsplashPhoto) =>
          unsplashPhotoToBackgroundImage(photo)
        );
        setSearchResults(images);
        setTotalPages(response.total_pages);
        setPage(1);
      } catch (error) {
        setSearchError('Failed to search images');
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchUnsplash();
  }, [debouncedQuery]);

  // Load more search results
  const loadMore = useCallback(async () => {
    if (isSearching || page >= totalPages || !debouncedQuery) return;

    setIsSearching(true);
    try {
      const response = await api.images.searchUnsplash(debouncedQuery, page + 1, 20);
      const images = response.results.map((photo: UnsplashPhoto) =>
        unsplashPhotoToBackgroundImage(photo)
      );
      setSearchResults(prev => [...prev, ...images]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [isSearching, page, totalPages, debouncedQuery]);

  // Load curated images by category
  useEffect(() => {
    const loadCurated = async () => {
      setIsLoadingCurated(true);
      try {
        const category = curatedCategories.find(c => c.id === selectedCategory);
        const query = category?.query || 'wallpaper background';
        const response = await api.images.searchUnsplash(query, 1, 24);
        const images = response.results.map((photo: UnsplashPhoto) =>
          unsplashPhotoToBackgroundImage(photo)
        );
        setCuratedImages(images);
      } catch (error) {
        console.error('Failed to load curated:', error);
      } finally {
        setIsLoadingCurated(false);
      }
    };

    if (!debouncedQuery) {
      loadCurated();
    }
  }, [selectedCategory, debouncedQuery]);

  // Handle scroll for infinite loading
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMore();
    }
  }, [loadMore]);

  const displayImages = debouncedQuery ? searchResults : curatedImages;
  const isLoading = debouncedQuery ? isSearching : isLoadingCurated;

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search millions of photos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-8"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category pills (only show when not searching) */}
      {!debouncedQuery && (
        <CuratedCategoryPills
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}

      {/* Images grid */}
      <div
        ref={scrollRef}
        className="max-h-[320px] overflow-y-auto scrollbar-hide"
        onScroll={handleScroll}
      >
        {isLoading && displayImages.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : displayImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Camera className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {debouncedQuery ? 'No images found' : 'Search for beautiful photos'}
            </p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-3 gap-2" layout>
            <AnimatePresence mode="popLayout">
              {displayImages.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ImagePreview
                    image={image}
                    isSelected={selectedImageId === image.id}
                    onClick={() => onImageSelect(image)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Loading more indicator */}
        {isLoading && displayImages.length > 0 && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Unsplash attribution */}
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
  );
};

// ============================================================================
// WALLPAPERS TAB CONTENT
// ============================================================================

const WallpapersTabContent = ({
  selectedWallpaper,
  selectedImageId,
  onWallpaperSelect,
  onImageSelect,
}: {
  selectedWallpaper: Wallpaper | null;
  selectedImageId: string | null;
  onWallpaperSelect: (wallpaper: Wallpaper) => void;
  onImageSelect: (image: BackgroundImage) => void;
}) => {
  const [wallpaperTab, setWallpaperTab] = useState<WallpaperTab>('gradients');

  const getWallpapers = (): Wallpaper[] => {
    switch (wallpaperTab) {
      case 'gradients':
        return curatedGradients;
      case 'mesh':
        return curatedMeshGradients;
      case 'solid':
        return curatedSolidColors;
      case 'patterns':
        return curatedPatterns;
      case 'dynamic':
        return curatedDynamicWallpapers;
      case 'images':
        return [];
      default:
        return [];
    }
  };

  const wallpapers = getWallpapers();

  return (
    <div className="space-y-4">
      <WallpaperTabs activeTab={wallpaperTab} onTabChange={setWallpaperTab} />

      {wallpaperTab === 'images' ? (
        <UnsplashImagesContent
          selectedImageId={selectedImageId}
          onImageSelect={onImageSelect}
        />
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <AnimatePresence mode="popLayout">
            {wallpapers.map((wallpaper, index) => (
              <motion.div
                key={wallpaper.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <WallpaperPreview
                  wallpaper={wallpaper}
                  isSelected={selectedWallpaper?.id === wallpaper.id}
                  onClick={() => onWallpaperSelect(wallpaper)}
                  size="medium"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COLORS TAB CONTENT
// ============================================================================

const ColorsTabContent = () => {
  const { settings, setColorMode, setCustomAccentColor, currentTheme } = useTheme();

  const colorModes = [
    { id: 'light' as const, icon: Sun, label: 'Light', description: 'Bright and clean' },
    { id: 'dark' as const, icon: Moon, label: 'Dark', description: 'Easy on the eyes' },
    { id: 'system' as const, icon: Monitor, label: 'Auto', description: 'Match system' },
  ];

  const accentColors = [
    { color: null, label: 'Theme' },
    { color: '350 80% 60%', label: 'Pink' },
    { color: '25 95% 55%', label: 'Orange' },
    { color: '45 95% 50%', label: 'Yellow' },
    { color: '152 55% 45%', label: 'Green' },
    { color: '200 85% 55%', label: 'Blue' },
    { color: '270 80% 60%', label: 'Purple' },
    { color: '320 100% 60%', label: 'Magenta' },
  ];

  return (
    <div className="space-y-6">
      {/* Color Mode */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Appearance</h3>
        <div className="grid grid-cols-3 gap-2">
          {colorModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = settings.colorMode === mode.id;
            return (
              <motion.button
                key={mode.id}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  isActive
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 bg-card'
                )}
                onClick={() => setColorMode(mode.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    isActive ? 'bg-primary/10' : 'bg-muted'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isActive ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {mode.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{mode.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Accent Color</h3>
          {settings.customAccentColor && (
            <button
              onClick={() => setCustomAccentColor(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {accentColors.map((item, i) => {
            const isActive =
              item.color === settings.customAccentColor ||
              (item.color === null && !settings.customAccentColor);
            const displayColor = item.color
              ? `hsl(${item.color})`
              : `hsl(${currentTheme.colors.light.primary})`;

            return (
              <motion.button
                key={i}
                className={cn(
                  'relative w-10 h-10 rounded-full transition-all',
                  isActive
                    ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground'
                    : 'hover:ring-2 hover:ring-offset-1 hover:ring-offset-background hover:ring-primary/50'
                )}
                style={{ backgroundColor: displayColor }}
                onClick={() => setCustomAccentColor(item.color)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={item.label}
              >
                {item.color === null && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
                    T
                  </span>
                )}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-4 h-4 text-white drop-shadow" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EFFECTS TAB CONTENT
// ============================================================================

const EffectsTabContent = ({
  overlayOpacity,
  blur,
  onOverlayChange,
  onBlurChange,
}: {
  overlayOpacity: number;
  blur: number;
  onOverlayChange: (value: number) => void;
  onBlurChange: (value: number) => void;
}) => {
  const { settings, setAnimationIntensity, setBackgroundStyle } = useTheme();

  const intensities: { id: AnimationIntensity; icon: any; label: string }[] = [
    { id: 'none', icon: Minus, label: 'None' },
    { id: 'subtle', icon: Circle, label: 'Subtle' },
    { id: 'normal', icon: Sparkles, label: 'Normal' },
    { id: 'energetic', icon: Zap, label: 'Energetic' },
  ];

  const bgStyles: { id: BackgroundStyle; label: string; description: string }[] = [
    { id: 'particles', label: 'Particles', description: 'Theme-specific' },
    { id: 'orbs', label: 'Orbs', description: 'Floating blobs' },
    { id: 'minimal', label: 'Minimal', description: 'Clean look' },
    { id: 'dynamic', label: 'Dynamic', description: 'Enhanced' },
  ];

  return (
    <div className="space-y-6">
      {/* Overlay & Blur */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Wallpaper Adjustments</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">Overlay Darkness</label>
            <span className="text-xs font-medium text-foreground">{overlayOpacity}%</span>
          </div>
          <Slider
            value={[overlayOpacity]}
            min={0}
            max={80}
            step={5}
            onValueChange={([v]) => onOverlayChange(v)}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">Background Blur</label>
            <span className="text-xs font-medium text-foreground">{blur}px</span>
          </div>
          <Slider
            value={[blur]}
            min={0}
            max={20}
            step={1}
            onValueChange={([v]) => onBlurChange(v)}
          />
        </div>
      </div>

      {/* Animation Intensity */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Animation Intensity</h3>
        <div className="grid grid-cols-4 gap-2">
          {intensities.map((item) => {
            const Icon = item.icon;
            const isActive = settings.animationIntensity === item.id;
            return (
              <motion.button
                key={item.id}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 bg-card'
                )}
                onClick={() => setAnimationIntensity(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon
                  className={cn(
                    'w-4 h-4',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Background Style */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Particle Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {bgStyles.map((style) => {
            const isActive = settings.backgroundStyle === style.id;
            return (
              <motion.button
                key={style.id}
                className={cn(
                  'flex flex-col items-start p-3 rounded-xl border transition-all text-left',
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 bg-card'
                )}
                onClick={() => setBackgroundStyle(style.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    isActive ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {style.label}
                </span>
                <span className="text-[10px] text-muted-foreground">{style.description}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN CUSTOMIZATION STUDIO
// ============================================================================

export function CustomizationStudio() {
  const { currentBackground, setBackgroundSettings, resetToDefaults } = useTheme();

  const [activeTab, setActiveTab] = useState<StudioTab>('moods');
  const [selectedMood, setSelectedMood] = useState<MoodPreset | null>(null);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    currentBackground?.image?.id || null
  );
  const [overlayOpacity, setOverlayOpacity] = useState(
    currentBackground?.overlayOpacity ?? 30
  );
  const [blur, setBlur] = useState(currentBackground?.blur ?? 0);

  const handleMoodSelect = useCallback((mood: MoodPreset) => {
    setSelectedMood(mood);
    setSelectedWallpaper(mood.wallpaper);
    setSelectedImageId(null);
    setOverlayOpacity(mood.overlayOpacity);
    setBlur(mood.blur);

    // Apply the wallpaper
    applyWallpaper(mood.wallpaper, mood.overlayOpacity, mood.blur);
  }, []);

  const handleWallpaperSelect = useCallback((wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper);
    setSelectedImageId(null);
    setSelectedMood(null);
    applyWallpaper(wallpaper, overlayOpacity, blur);
  }, [overlayOpacity, blur]);

  const handleImageSelect = useCallback((image: BackgroundImage) => {
    setSelectedImageId(image.id);
    setSelectedWallpaper(null);
    setSelectedMood(null);

    // Track Unsplash download
    if (image.source === 'unsplash' || image.attribution) {
      api.images.trackUnsplashDownload(image.id).catch(() => {});
    }

    // Apply the image as background
    const settings: any = {
      enabled: true,
      image: {
        id: image.id,
        source: image.source,
        url: image.url,
        thumbnailUrl: image.thumbnailUrl,
        blurHash: image.blurHash,
        attribution: image.attribution,
        width: image.width,
        height: image.height,
      },
      wallpaper: null,
      position: { x: 50, y: 50 },
      overlayOpacity: overlayOpacity,
      overlayColor: 'theme',
      blur: blur,
      brightness: 100,
      saturation: 100,
    };

    setBackgroundSettings(settings);
  }, [overlayOpacity, blur, setBackgroundSettings]);

  const applyWallpaper = (wallpaper: Wallpaper, opacity: number, blurAmount: number) => {
    // Convert wallpaper to background settings format
    let backgroundImage: any = null;

    if (wallpaper.type === 'image') {
      backgroundImage = {
        id: wallpaper.id,
        source: wallpaper.source,
        url: wallpaper.url,
        thumbnailUrl: wallpaper.thumbnailUrl,
        attribution: wallpaper.attribution,
        width: 1920,
        height: 1080,
      };
    }

    // For non-image wallpapers, we'll store them differently
    const settings: any = {
      enabled: true,
      image: backgroundImage,
      wallpaper: wallpaper.type !== 'image' ? wallpaper : null,
      position: { x: 50, y: 50 },
      overlayOpacity: opacity,
      overlayColor: 'theme',
      blur: blurAmount,
      brightness: 100,
      saturation: 100,
    };

    setBackgroundSettings(settings);
  };

  const handleOverlayChange = (value: number) => {
    setOverlayOpacity(value);
    if (selectedWallpaper) {
      applyWallpaper(selectedWallpaper, value, blur);
    } else if (selectedImageId && currentBackground?.image) {
      // Re-apply image with new overlay
      const settings: any = {
        ...currentBackground,
        overlayOpacity: value,
      };
      setBackgroundSettings(settings);
    }
  };

  const handleBlurChange = (value: number) => {
    setBlur(value);
    if (selectedWallpaper) {
      applyWallpaper(selectedWallpaper, overlayOpacity, value);
    } else if (selectedImageId && currentBackground?.image) {
      // Re-apply image with new blur
      const settings: any = {
        ...currentBackground,
        blur: value,
      };
      setBackgroundSettings(settings);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Tabs */}
      <StudioTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'moods' && (
            <MoodsTabContent selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
          )}
          {activeTab === 'wallpapers' && (
            <WallpapersTabContent
              selectedWallpaper={selectedWallpaper}
              selectedImageId={selectedImageId}
              onWallpaperSelect={handleWallpaperSelect}
              onImageSelect={handleImageSelect}
            />
          )}
          {activeTab === 'colors' && <ColorsTabContent />}
          {activeTab === 'effects' && (
            <EffectsTabContent
              overlayOpacity={overlayOpacity}
              blur={blur}
              onOverlayChange={handleOverlayChange}
              onBlurChange={handleBlurChange}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Reset Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          className="w-full gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Everything
        </Button>
      </div>
    </motion.div>
  );
}

export default CustomizationStudio;
