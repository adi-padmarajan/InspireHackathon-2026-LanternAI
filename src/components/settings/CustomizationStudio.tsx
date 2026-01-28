/**
 * CustomizationStudio - Award-Winning Cinematic Customization Experience
 * The most beautiful, immersive customization interface ever created
 * Featuring Hollywood-inspired themes, cinematic effects, and stunning visuals
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
  Sparkles, Palette, Wand2, Film, Image as ImageIcon,
  Sun, Moon, Monitor, Check, Search, Upload, X, Sliders,
  Play, RotateCcw, Zap, Circle, Minus, Layers, Loader2,
  Mountain, Waves, TreePine, Building2, Sunrise, Camera,
  Clapperboard, Star, Heart, Eye, Droplets, Wind, Flame,
  Snowflake, Leaf, CloudRain, Glasses, Focus, Contrast,
  SunDim, Aperture, Blend, Gauge, Timer, Volume2,
  type LucideIcon,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
  cinematicGradients,
  cinematicMoodPresets,
  getGradientCSS,
  getMeshGradientCSS,
  getCinematicWallpapers,
  getCinematicMoods,
} from '@/lib/wallpapers';
import {
  BackgroundImage,
  BackgroundSettings,
  UnsplashPhoto,
  unsplashPhotoToBackgroundImage,
  curatedCategories,
} from '@/lib/imageSettings';
import { AnimationIntensity, BackgroundStyle } from '@/lib/themes';

// ============================================================================
// TYPES
// ============================================================================

type StudioTab = 'moods' | 'wallpapers' | 'unsplash' | 'colors' | 'effects';
type WallpaperTab = 'cinematic' | 'gradients' | 'mesh' | 'solid' | 'patterns' | 'dynamic';
type UnsplashCategory = 'curated' | 'nature' | 'abstract' | 'architecture' | 'minimal' | 'cinematic' | 'dark' | 'colorful';

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
  const tabs: { id: StudioTab; label: string; icon: LucideIcon; gradient?: string }[] = [
    { id: 'moods', label: 'Moods', icon: Wand2, gradient: 'from-purple-500 to-pink-500' },
    { id: 'wallpapers', label: 'Wallpapers', icon: Layers, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'unsplash', label: 'Unsplash', icon: Camera, gradient: 'from-amber-500 to-orange-500' },
    { id: 'colors', label: 'Colors', icon: Palette, gradient: 'from-green-500 to-emerald-500' },
    { id: 'effects', label: 'Effects', icon: Film, gradient: 'from-red-500 to-rose-500' },
  ];

  return (
    <div className="relative">
      {/* Cinematic glow behind active tab */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl blur-xl" />

      <div className="relative flex bg-muted/50 backdrop-blur-sm rounded-2xl p-1.5 border border-border/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-medium transition-all relative overflow-hidden',
                isActive
                  ? 'bg-background text-foreground shadow-lg shadow-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active tab glow effect */}
              {isActive && (
                <motion.div
                  className={cn('absolute inset-0 bg-gradient-to-r opacity-10', tab.gradient)}
                  layoutId="activeTabGlow"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn('w-4 h-4 relative z-10', isActive && 'text-primary')} />
              <span className="hidden sm:inline relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
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
  const tabs: { id: WallpaperTab; label: string; icon: LucideIcon; special?: boolean }[] = [
    { id: 'cinematic', label: 'Cinematic', icon: Clapperboard, special: true },
    { id: 'gradients', label: 'Gradients', icon: Blend },
    { id: 'mesh', label: 'Mesh', icon: Layers },
    { id: 'solid', label: 'Solid', icon: Circle },
    { id: 'patterns', label: 'Patterns', icon: Aperture },
    { id: 'dynamic', label: 'Dynamic', icon: Play },
  ];

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
              activeTab === tab.id
                ? tab.special
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
            )}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.special && activeTab === tab.id && (
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            )}
          </motion.button>
        );
      })}
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
  const [categoryFilter, setCategoryFilter] = useState<MoodCategory | 'all' | 'hollywood'>('all');

  // Combine regular and cinematic moods
  const allMoods = useMemo(() => [...moodPresets, ...cinematicMoodPresets], []);

  const filteredPresets = useMemo(() => {
    if (categoryFilter === 'all') return allMoods;
    if (categoryFilter === 'hollywood') return cinematicMoodPresets;
    return allMoods.filter((p) => p.category === categoryFilter);
  }, [categoryFilter, allMoods]);

  // Extended categories with Hollywood
  const extendedCategories = useMemo(() => [
    { id: 'all' as const, name: 'All', emoji: '✨' },
    { id: 'hollywood' as const, name: 'Hollywood', emoji: '🎬' },
    ...moodCategories,
  ], []);

  return (
    <div className="space-y-4">
      {/* Header with cinematic flair */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 p-4 border border-primary/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Choose Your Mood</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Curated cinematic experiences with matching visuals, colors, and atmosphere
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {extendedCategories.map((cat) => (
          <motion.button
            key={cat.id}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all',
              categoryFilter === cat.id
                ? cat.id === 'hollywood'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setCategoryFilter(cat.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{cat.emoji}</span>
            <span className="font-medium">{cat.name}</span>
            {cat.id === 'hollywood' && categoryFilter !== 'hollywood' && (
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Moods Grid */}
      <div className="grid grid-cols-2 gap-3 auto-rows-fr max-h-[400px] overflow-y-auto scrollbar-hide pr-1">
        <AnimatePresence mode="popLayout">
          {filteredPresets.map((preset, index) => (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.25, delay: index * 0.02 }}
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
  const iconMap: Record<string, LucideIcon> = {
    Mountain,
    Palette: LucideIcons.Palette as LucideIcon,
    Square: LucideIcons.Square as LucideIcon,
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
  onWallpaperSelect,
}: {
  selectedWallpaper: Wallpaper | null;
  onWallpaperSelect: (wallpaper: Wallpaper) => void;
}) => {
  const [wallpaperTab, setWallpaperTab] = useState<WallpaperTab>('cinematic');

  const getWallpapers = (): Wallpaper[] => {
    switch (wallpaperTab) {
      case 'cinematic':
        return cinematicGradients;
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
      default:
        return [];
    }
  };

  const wallpapers = getWallpapers();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 p-4 border border-primary/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Wallpapers</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {wallpaperTab === 'cinematic'
              ? 'Hollywood-inspired cinematic gradients for stunning visuals'
              : 'Beautiful backgrounds crafted for the perfect aesthetic'}
          </p>
        </div>
      </div>

      <WallpaperTabs activeTab={wallpaperTab} onTabChange={setWallpaperTab} />

      {/* Wallpapers Grid */}
      <div className="grid grid-cols-3 gap-2 max-h-[350px] overflow-y-auto scrollbar-hide pr-1">
        <AnimatePresence mode="popLayout">
          {wallpapers.map((wallpaper, index) => (
            <motion.div
              key={wallpaper.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.015 }}
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

      {/* Wallpaper count */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {wallpapers.length} wallpapers in this collection
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// COLORS TAB CONTENT
// ============================================================================

// ============================================================================
// EXPANDED ACCENT COLORS - Huge variety including black and white
// ============================================================================

const accentColorCategories = [
  {
    name: 'Essentials',
    colors: [
      { color: null, label: 'Theme Default', hex: '#888' },
      { color: '0 0% 0%', label: 'Pure Black', hex: '#000000' },
      { color: '0 0% 100%', label: 'Pure White', hex: '#ffffff' },
      { color: '0 0% 50%', label: 'Gray', hex: '#808080' },
    ],
  },
  {
    name: 'Reds & Pinks',
    colors: [
      { color: '0 85% 60%', label: 'Red', hex: '#ef4444' },
      { color: '0 95% 45%', label: 'Crimson', hex: '#dc143c' },
      { color: '350 80% 60%', label: 'Rose', hex: '#f43f5e' },
      { color: '340 85% 65%', label: 'Pink', hex: '#ec4899' },
      { color: '330 80% 70%', label: 'Blush', hex: '#f472b6' },
      { color: '320 100% 60%', label: 'Magenta', hex: '#e879f9' },
      { color: '10 80% 55%', label: 'Coral', hex: '#f97316' },
      { color: '355 80% 50%', label: 'Ruby', hex: '#e11d48' },
    ],
  },
  {
    name: 'Oranges & Yellows',
    colors: [
      { color: '25 95% 55%', label: 'Orange', hex: '#f97316' },
      { color: '35 95% 55%', label: 'Amber', hex: '#f59e0b' },
      { color: '45 95% 50%', label: 'Yellow', hex: '#eab308' },
      { color: '50 95% 55%', label: 'Gold', hex: '#fbbf24' },
      { color: '55 95% 60%', label: 'Lemon', hex: '#fde047' },
      { color: '40 90% 45%', label: 'Tangerine', hex: '#fb923c' },
      { color: '30 100% 50%', label: 'Sunset', hex: '#ff8c00' },
      { color: '20 90% 50%', label: 'Peach', hex: '#ffab91' },
    ],
  },
  {
    name: 'Greens',
    colors: [
      { color: '120 60% 45%', label: 'Green', hex: '#22c55e' },
      { color: '140 70% 40%', label: 'Emerald', hex: '#10b981' },
      { color: '160 85% 40%', label: 'Teal', hex: '#14b8a6' },
      { color: '152 55% 45%', label: 'Jade', hex: '#34d399' },
      { color: '100 60% 50%', label: 'Lime', hex: '#84cc16' },
      { color: '170 75% 40%', label: 'Mint', hex: '#2dd4bf' },
      { color: '145 60% 35%', label: 'Forest', hex: '#059669' },
      { color: '80 65% 50%', label: 'Olive', hex: '#a3e635' },
    ],
  },
  {
    name: 'Blues & Cyans',
    colors: [
      { color: '200 85% 55%', label: 'Sky Blue', hex: '#38bdf8' },
      { color: '210 100% 50%', label: 'Blue', hex: '#3b82f6' },
      { color: '220 90% 55%', label: 'Royal', hex: '#6366f1' },
      { color: '225 100% 60%', label: 'Cobalt', hex: '#4f46e5' },
      { color: '180 70% 50%', label: 'Cyan', hex: '#06b6d4' },
      { color: '195 85% 45%', label: 'Azure', hex: '#0ea5e9' },
      { color: '240 70% 50%', label: 'Indigo', hex: '#4f46e5' },
      { color: '230 85% 60%', label: 'Electric', hex: '#818cf8' },
    ],
  },
  {
    name: 'Purples & Violets',
    colors: [
      { color: '270 80% 60%', label: 'Purple', hex: '#a855f7' },
      { color: '280 85% 55%', label: 'Violet', hex: '#8b5cf6' },
      { color: '290 75% 50%', label: 'Orchid', hex: '#c026d3' },
      { color: '300 85% 60%', label: 'Fuchsia', hex: '#d946ef' },
      { color: '260 80% 55%', label: 'Lavender', hex: '#a78bfa' },
      { color: '275 90% 45%', label: 'Amethyst', hex: '#9333ea' },
      { color: '310 75% 55%', label: 'Plum', hex: '#e879f9' },
      { color: '250 90% 65%', label: 'Periwinkle', hex: '#a5b4fc' },
    ],
  },
  {
    name: 'Neutrals & Earth',
    colors: [
      { color: '30 30% 40%', label: 'Brown', hex: '#78716c' },
      { color: '25 40% 50%', label: 'Sienna', hex: '#a16207' },
      { color: '35 50% 40%', label: 'Bronze', hex: '#b45309' },
      { color: '15 25% 35%', label: 'Espresso', hex: '#57534e' },
      { color: '45 30% 50%', label: 'Sand', hex: '#d4b896' },
      { color: '0 0% 20%', label: 'Charcoal', hex: '#333333' },
      { color: '0 0% 40%', label: 'Slate', hex: '#666666' },
      { color: '0 0% 80%', label: 'Silver', hex: '#cccccc' },
    ],
  },
  {
    name: 'Cinematic',
    colors: [
      { color: '195 100% 50%', label: 'Blade Runner', hex: '#00d4ff' },
      { color: '120 100% 40%', label: 'Matrix', hex: '#00cc00' },
      { color: '35 100% 55%', label: 'Dune', hex: '#ff9f1a' },
      { color: '180 100% 55%', label: 'Tron', hex: '#00ffff' },
      { color: '220 100% 60%', label: 'Avatar', hex: '#1e90ff' },
      { color: '280 100% 55%', label: 'Interstellar', hex: '#9932cc' },
      { color: '350 100% 60%', label: 'La La Land', hex: '#ff3366' },
      { color: '45 100% 60%', label: 'Mad Max', hex: '#ffcc00' },
    ],
  },
];

const ColorsTabContent = () => {
  const { settings, setColorMode, setCustomAccentColor, currentTheme } = useTheme();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Essentials');

  const colorModes = [
    { id: 'light' as const, icon: Sun, label: 'Light', description: 'Bright and clean', gradient: 'from-amber-400 to-orange-300' },
    { id: 'dark' as const, icon: Moon, label: 'Dark', description: 'Easy on the eyes', gradient: 'from-slate-700 to-slate-900' },
    { id: 'system' as const, icon: Monitor, label: 'Auto', description: 'Match system', gradient: 'from-blue-400 to-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 p-4 border border-primary/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/20 to-transparent rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Colors & Appearance</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Personalize your experience with 60+ accent colors
          </p>
        </div>
      </div>

      {/* Color Mode */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Sun className="w-4 h-4" />
          Appearance Mode
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {colorModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = settings.colorMode === mode.id;
            return (
              <motion.button
                key={mode.id}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all overflow-hidden',
                  isActive
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                    : 'border-border hover:border-primary/50 bg-card'
                )}
                onClick={() => setColorMode(mode.id)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient preview */}
                <div className={cn(
                  'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
                  mode.gradient
                )} />

                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    isActive ? 'bg-primary/20' : 'bg-muted'
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

                {isActive && (
                  <motion.div
                    className="absolute top-2 right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-4 h-4 text-primary" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Accent Colors - Expanded */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Accent Color
          </h3>
          {settings.customAccentColor && (
            <motion.button
              onClick={() => setCustomAccentColor(null)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </motion.button>
          )}
        </div>

        {/* Color Categories */}
        <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-hide pr-1">
          {accentColorCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <motion.button
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  expandedCategory === category.name
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  {/* Color preview dots */}
                  <div className="flex -space-x-1">
                    {category.colors.slice(0, 4).map((c, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full border border-background"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  {category.name}
                </span>
                <motion.div
                  animate={{ rotate: expandedCategory === category.name ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <LucideIcons.ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {expandedCategory === category.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 pl-2 pb-2">
                      {category.colors.map((item, i) => {
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
                              'relative w-9 h-9 rounded-full transition-all border-2',
                              isActive
                                ? 'ring-2 ring-offset-2 ring-offset-background ring-primary border-transparent scale-110'
                                : 'border-border/50 hover:scale-110 hover:border-primary/50'
                            )}
                            style={{ backgroundColor: displayColor }}
                            onClick={() => setCustomAccentColor(item.color)}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            title={item.label}
                          >
                            {item.color === null && (
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
                                T
                              </span>
                            )}
                            {/* Special border for white color */}
                            {item.label === 'Pure White' && (
                              <div className="absolute inset-0 rounded-full border border-gray-300" />
                            )}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Check
                                  className={cn(
                                    'w-4 h-4 drop-shadow',
                                    item.label === 'Pure White' || item.label === 'Pure Black'
                                      ? item.label === 'Pure White' ? 'text-black' : 'text-white'
                                      : 'text-white'
                                  )}
                                />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Current color indicator */}
        {settings.customAccentColor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
              style={{ backgroundColor: `hsl(${settings.customAccentColor})` }}
            />
            <span className="text-xs text-muted-foreground">
              Current accent color
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// EFFECTS TAB CONTENT
// ============================================================================

// ============================================================================
// CINEMATIC EFFECTS SYSTEM
// ============================================================================

interface CinematicEffects {
  filmGrain: number;
  vignette: number;
  colorTemperature: number;
  saturation: number;
  brightness: number;
  contrast: number;
  bloomIntensity: number;
  chromaticAberration: boolean;
  scanlines: boolean;
  letterbox: boolean;
}

const cinematicPresets = [
  {
    id: 'none',
    name: 'Clean',
    emoji: '✨',
    description: 'No effects applied',
    effects: { filmGrain: 0, vignette: 0, colorTemperature: 0, saturation: 100, brightness: 100, contrast: 100, bloomIntensity: 0, chromaticAberration: false, scanlines: false, letterbox: false }
  },
  {
    id: 'blade-runner',
    name: 'Blade Runner',
    emoji: '🌃',
    description: 'Neon noir cyberpunk',
    effects: { filmGrain: 15, vignette: 30, colorTemperature: -20, saturation: 120, brightness: 90, contrast: 120, bloomIntensity: 40, chromaticAberration: true, scanlines: false, letterbox: true }
  },
  {
    id: 'vintage-film',
    name: 'Vintage Film',
    emoji: '📽️',
    description: 'Classic 70s cinema look',
    effects: { filmGrain: 40, vignette: 25, colorTemperature: 30, saturation: 85, brightness: 95, contrast: 110, bloomIntensity: 20, chromaticAberration: false, scanlines: false, letterbox: false }
  },
  {
    id: 'matrix',
    name: 'The Matrix',
    emoji: '💚',
    description: 'Green-tinted digital rain',
    effects: { filmGrain: 10, vignette: 20, colorTemperature: -40, saturation: 70, brightness: 85, contrast: 130, bloomIntensity: 30, chromaticAberration: true, scanlines: true, letterbox: false }
  },
  {
    id: 'interstellar',
    name: 'Interstellar',
    emoji: '🌌',
    description: 'Epic space odyssey feel',
    effects: { filmGrain: 5, vignette: 35, colorTemperature: -10, saturation: 90, brightness: 100, contrast: 115, bloomIntensity: 50, chromaticAberration: false, scanlines: false, letterbox: true }
  },
  {
    id: 'la-la-land',
    name: 'La La Land',
    emoji: '💜',
    description: 'Dreamy romantic hues',
    effects: { filmGrain: 8, vignette: 15, colorTemperature: 15, saturation: 130, brightness: 105, contrast: 105, bloomIntensity: 35, chromaticAberration: false, scanlines: false, letterbox: false }
  },
  {
    id: 'mad-max',
    name: 'Mad Max',
    emoji: '🔥',
    description: 'Scorched desert fury',
    effects: { filmGrain: 25, vignette: 40, colorTemperature: 50, saturation: 140, brightness: 110, contrast: 140, bloomIntensity: 25, chromaticAberration: false, scanlines: false, letterbox: true }
  },
  {
    id: 'noir',
    name: 'Film Noir',
    emoji: '🎬',
    description: 'Classic black and white',
    effects: { filmGrain: 30, vignette: 45, colorTemperature: 0, saturation: 0, brightness: 95, contrast: 135, bloomIntensity: 10, chromaticAberration: false, scanlines: false, letterbox: false }
  },
];

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
  const [activePreset, setActivePreset] = useState<string>('none');
  const [cinematicEffects, setCinematicEffects] = useState<CinematicEffects>({
    filmGrain: 0,
    vignette: 0,
    colorTemperature: 0,
    saturation: 100,
    brightness: 100,
    contrast: 100,
    bloomIntensity: 0,
    chromaticAberration: false,
    scanlines: false,
    letterbox: false,
  });

  const applyPreset = (presetId: string) => {
    const preset = cinematicPresets.find(p => p.id === presetId);
    if (preset) {
      setActivePreset(presetId);
      setCinematicEffects(preset.effects);
    }
  };

  const updateEffect = <K extends keyof CinematicEffects>(key: K, value: CinematicEffects[K]) => {
    setCinematicEffects(prev => ({ ...prev, [key]: value }));
    setActivePreset('custom');
  };

  const intensities: { id: AnimationIntensity; icon: LucideIcon; label: string; description: string }[] = [
    { id: 'none', icon: Minus, label: 'None', description: 'No animations' },
    { id: 'subtle', icon: Circle, label: 'Subtle', description: 'Gentle motion' },
    { id: 'normal', icon: Sparkles, label: 'Normal', description: 'Balanced feel' },
    { id: 'energetic', icon: Zap, label: 'Energetic', description: 'Dynamic vibes' },
  ];

  const bgStyles: { id: BackgroundStyle; label: string; description: string; icon: LucideIcon }[] = [
    { id: 'particles', label: 'Particles', description: 'Floating elements', icon: Sparkles },
    { id: 'orbs', label: 'Orbs', description: 'Glowing blobs', icon: Circle },
    { id: 'minimal', label: 'Minimal', description: 'Clean aesthetic', icon: Minus },
    { id: 'dynamic', label: 'Dynamic', description: 'Full immersion', icon: Zap },
  ];

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto scrollbar-hide pr-1">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500/10 via-rose-500/10 to-pink-500/10 p-4 border border-primary/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/20 to-transparent rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Cinematic Effects</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Hollywood-grade visual effects for stunning aesthetics
          </p>
        </div>
      </div>

      {/* Cinematic Presets */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Clapperboard className="w-4 h-4" />
          Cinematic Presets
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {cinematicPresets.map((preset) => (
            <motion.button
              key={preset.id}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all',
                activePreset === preset.id
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                  : 'border-border hover:border-primary/50 bg-card'
              )}
              onClick={() => applyPreset(preset.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              title={preset.description}
            >
              <span className="text-lg">{preset.emoji}</span>
              <span className={cn(
                'text-[10px] font-medium text-center leading-tight',
                activePreset === preset.id ? 'text-primary' : 'text-muted-foreground'
              )}>
                {preset.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Wallpaper Adjustments */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Sliders className="w-4 h-4" />
          Wallpaper Adjustments
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <SunDim className="w-3 h-3" />
                Overlay
              </label>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <Focus className="w-3 h-3" />
                Blur
              </label>
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
      </div>

      {/* Film Effects */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Aperture className="w-4 h-4" />
          Film Effects
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Film Grain</label>
              <span className="text-xs font-medium text-foreground">{cinematicEffects.filmGrain}%</span>
            </div>
            <Slider
              value={[cinematicEffects.filmGrain]}
              min={0}
              max={100}
              step={5}
              onValueChange={([v]) => updateEffect('filmGrain', v)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Vignette</label>
              <span className="text-xs font-medium text-foreground">{cinematicEffects.vignette}%</span>
            </div>
            <Slider
              value={[cinematicEffects.vignette]}
              min={0}
              max={100}
              step={5}
              onValueChange={([v]) => updateEffect('vignette', v)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Temperature</label>
              <span className="text-xs font-medium text-foreground">
                {cinematicEffects.colorTemperature > 0 ? '+' : ''}{cinematicEffects.colorTemperature}
              </span>
            </div>
            <Slider
              value={[cinematicEffects.colorTemperature]}
              min={-100}
              max={100}
              step={10}
              onValueChange={([v]) => updateEffect('colorTemperature', v)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Bloom</label>
              <span className="text-xs font-medium text-foreground">{cinematicEffects.bloomIntensity}%</span>
            </div>
            <Slider
              value={[cinematicEffects.bloomIntensity]}
              min={0}
              max={100}
              step={5}
              onValueChange={([v]) => updateEffect('bloomIntensity', v)}
            />
          </div>
        </div>

        {/* Color Adjustments */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Saturation</label>
              <span className="text-xs font-medium">{cinematicEffects.saturation}%</span>
            </div>
            <Slider
              value={[cinematicEffects.saturation]}
              min={0}
              max={200}
              step={5}
              onValueChange={([v]) => updateEffect('saturation', v)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Brightness</label>
              <span className="text-xs font-medium">{cinematicEffects.brightness}%</span>
            </div>
            <Slider
              value={[cinematicEffects.brightness]}
              min={50}
              max={150}
              step={5}
              onValueChange={([v]) => updateEffect('brightness', v)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Contrast</label>
              <span className="text-xs font-medium">{cinematicEffects.contrast}%</span>
            </div>
            <Slider
              value={[cinematicEffects.contrast]}
              min={50}
              max={150}
              step={5}
              onValueChange={([v]) => updateEffect('contrast', v)}
            />
          </div>
        </div>

        {/* Toggle Effects */}
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            className={cn(
              'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all',
              cinematicEffects.chromaticAberration
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50'
            )}
            onClick={() => updateEffect('chromaticAberration', !cinematicEffects.chromaticAberration)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Glasses className="w-4 h-4" />
            <span className="text-xs font-medium">RGB Split</span>
          </motion.button>

          <motion.button
            className={cn(
              'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all',
              cinematicEffects.scanlines
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50'
            )}
            onClick={() => updateEffect('scanlines', !cinematicEffects.scanlines)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Gauge className="w-4 h-4" />
            <span className="text-xs font-medium">Scanlines</span>
          </motion.button>

          <motion.button
            className={cn(
              'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all',
              cinematicEffects.letterbox
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50'
            )}
            onClick={() => updateEffect('letterbox', !cinematicEffects.letterbox)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Layers className="w-4 h-4" />
            <span className="text-xs font-medium">Letterbox</span>
          </motion.button>
        </div>
      </div>

      {/* Animation Intensity */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Play className="w-4 h-4" />
          Animation Intensity
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {intensities.map((item) => {
            const Icon = item.icon;
            const isActive = settings.animationIntensity === item.id;
            return (
              <motion.button
                key={item.id}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all',
                  isActive
                    ? 'border-primary bg-primary/10 shadow-md shadow-primary/20'
                    : 'border-border hover:border-primary/50 bg-card'
                )}
                onClick={() => setAnimationIntensity(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={item.description}
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
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Blend className="w-4 h-4" />
          Particle Style
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {bgStyles.map((style) => {
            const Icon = style.icon;
            const isActive = settings.backgroundStyle === style.id;
            return (
              <motion.button
                key={style.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                  isActive
                    ? 'border-primary bg-primary/10 shadow-md shadow-primary/20'
                    : 'border-border hover:border-primary/50 bg-card'
                )}
                onClick={() => setBackgroundStyle(style.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  isActive ? 'bg-primary/20' : 'bg-muted'
                )}>
                  <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div>
                  <span className={cn('text-sm font-medium block', isActive ? 'text-primary' : 'text-foreground')}>
                    {style.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{style.description}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// UNSPLASH WALLPAPERS TAB - Dedicated Section
// ============================================================================

const unsplashCategories = [
  { id: 'curated', name: 'Curated', query: 'wallpaper background', icon: Star, emoji: '⭐' },
  { id: 'nature', name: 'Nature', query: 'nature landscape', icon: TreePine, emoji: '🌲' },
  { id: 'abstract', name: 'Abstract', query: 'abstract art colorful', icon: Blend, emoji: '🎨' },
  { id: 'architecture', name: 'Architecture', query: 'architecture building', icon: Building2, emoji: '🏛️' },
  { id: 'minimal', name: 'Minimal', query: 'minimal aesthetic', icon: Minus, emoji: '◻️' },
  { id: 'cinematic', name: 'Cinematic', query: 'cinematic movie aesthetic', icon: Film, emoji: '🎬' },
  { id: 'dark', name: 'Dark', query: 'dark moody aesthetic', icon: Moon, emoji: '🌙' },
  { id: 'colorful', name: 'Colorful', query: 'colorful vibrant', icon: Palette, emoji: '🌈' },
  { id: 'ocean', name: 'Ocean', query: 'ocean sea waves', icon: Waves, emoji: '🌊' },
  { id: 'mountains', name: 'Mountains', query: 'mountains landscape epic', icon: Mountain, emoji: '⛰️' },
  { id: 'sunset', name: 'Sunset', query: 'sunset golden hour', icon: Sunrise, emoji: '🌅' },
  { id: 'space', name: 'Space', query: 'space galaxy nebula', icon: Sparkles, emoji: '🌌' },
];

const UnsplashWallpapersTab = ({
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
  const [selectedCategory, setSelectedCategory] = useState<string>('curated');
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
        const response = await api.images.searchUnsplash(debouncedQuery, 1, 24);
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
    if (isSearching || page >= totalPages) return;

    const query = debouncedQuery || unsplashCategories.find(c => c.id === selectedCategory)?.query || 'wallpaper';

    setIsSearching(true);
    try {
      const response = await api.images.searchUnsplash(query, page + 1, 24);
      const images = response.results.map((photo: UnsplashPhoto) =>
        unsplashPhotoToBackgroundImage(photo)
      );
      if (debouncedQuery) {
        setSearchResults(prev => [...prev, ...images]);
      } else {
        setCuratedImages(prev => [...prev, ...images]);
      }
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [isSearching, page, totalPages, debouncedQuery, selectedCategory]);

  // Load curated images by category
  useEffect(() => {
    if (debouncedQuery) return;

    const loadCurated = async () => {
      setIsLoadingCurated(true);
      try {
        const category = unsplashCategories.find(c => c.id === selectedCategory);
        const query = category?.query || 'wallpaper background';
        const response = await api.images.searchUnsplash(query, 1, 30);
        const images = response.results.map((photo: UnsplashPhoto) =>
          unsplashPhotoToBackgroundImage(photo)
        );
        setCuratedImages(images);
        setTotalPages(response.total_pages);
        setPage(1);
      } catch (error) {
        console.error('Failed to load curated:', error);
      } finally {
        setIsLoadingCurated(false);
      }
    };

    loadCurated();
  }, [selectedCategory, debouncedQuery]);

  // Handle scroll for infinite loading
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 150) {
      loadMore();
    }
  }, [loadMore]);

  const displayImages = debouncedQuery ? searchResults : curatedImages;
  const isLoading = debouncedQuery ? isSearching : isLoadingCurated;

  return (
    <div className="space-y-4">
      {/* Header with Unsplash branding */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 p-4 border border-amber-500/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-semibold text-foreground">Unsplash Wallpapers</h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-medium">
              Millions of Photos
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Beautiful, free images from the world's most generous photographers
          </p>
        </div>
      </div>

      {/* Search bar with enhanced styling */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search millions of high-resolution photos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-8 bg-card border-border/50 focus:border-amber-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category pills (only show when not searching) */}
      {!debouncedQuery && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {unsplashCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setSelectedCategory(cat.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{cat.emoji}</span>
                <span className="font-medium">{cat.name}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Images grid */}
      <div
        ref={scrollRef}
        className="max-h-[380px] overflow-y-auto scrollbar-hide pr-1"
        onScroll={handleScroll}
      >
        {isLoading && displayImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-8 h-8 text-amber-500" />
            </motion.div>
            <p className="text-sm text-muted-foreground mt-3">Loading stunning photos...</p>
          </div>
        ) : displayImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {debouncedQuery ? 'No images found' : 'Explore Beautiful Photos'}
            </p>
            <p className="text-xs text-muted-foreground">
              {debouncedQuery ? 'Try a different search term' : 'Search or browse categories above'}
            </p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-3 gap-2" layout>
            <AnimatePresence mode="popLayout">
              {displayImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: index * 0.02 }}
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
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs text-muted-foreground ml-2">Loading more...</span>
          </div>
        )}
      </div>

      {/* Footer with count and attribution */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          {displayImages.length} photos loaded
        </p>
        <p className="text-[10px] text-muted-foreground">
          Photos by{' '}
          <a
            href="https://unsplash.com/?utm_source=verdant-bloom&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Unsplash
          </a>
        </p>
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
    const newSettings: BackgroundSettings = {
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

    setBackgroundSettings(newSettings);
  }, [overlayOpacity, blur, setBackgroundSettings]);

  const applyWallpaper = (wallpaper: Wallpaper, opacity: number, blurAmount: number) => {
    // Convert wallpaper to background settings format
    let backgroundImage: BackgroundImage | null = null;

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
    const newSettings: BackgroundSettings = {
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

    setBackgroundSettings(newSettings);
  };

  const handleOverlayChange = (value: number) => {
    setOverlayOpacity(value);
    if (selectedWallpaper) {
      applyWallpaper(selectedWallpaper, value, blur);
    } else if (selectedImageId && currentBackground?.image) {
      // Re-apply image with new overlay
      const newSettings: BackgroundSettings = {
        ...currentBackground,
        overlayOpacity: value,
      };
      setBackgroundSettings(newSettings);
    }
  };

  const handleBlurChange = (value: number) => {
    setBlur(value);
    if (selectedWallpaper) {
      applyWallpaper(selectedWallpaper, overlayOpacity, value);
    } else if (selectedImageId && currentBackground?.image) {
      // Re-apply image with new blur
      const newSettings: BackgroundSettings = {
        ...currentBackground,
        blur: value,
      };
      setBackgroundSettings(newSettings);
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
              onWallpaperSelect={handleWallpaperSelect}
            />
          )}
          {activeTab === 'unsplash' && (
            <UnsplashWallpapersTab
              selectedImageId={selectedImageId}
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
