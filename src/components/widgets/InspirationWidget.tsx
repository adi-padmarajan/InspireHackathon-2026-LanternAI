/**
 * InspirationWidget Component
 * Beautiful daily inspiration card with Unsplash images and quotes
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Heart, Share2, Quote, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScene } from '@/contexts/SceneContext';
import { getDailyQuote, inspirationalQuotes, moodConfig, SceneMood } from '@/lib/scenes';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface InspirationImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  attribution?: {
    photographerName: string;
    photographerUrl: string;
    unsplashUrl: string;
  };
}

interface InspirationWidgetProps {
  size?: 'small' | 'medium' | 'large';
  showRefresh?: boolean;
  className?: string;
}

// Mood-based search queries for fetching relevant images
const moodQueries: Record<SceneMood, string[]> = {
  focus: ['mountain peak', 'desk workspace', 'clear sky', 'minimal'],
  relax: ['calm ocean', 'forest path', 'peaceful nature', 'zen garden'],
  create: ['sunset colors', 'aurora', 'art studio', 'colorful abstract'],
  energize: ['city lights', 'sunrise', 'adventure', 'running'],
};

export function InspirationWidget({
  size = 'large',
  showRefresh = true,
  className,
}: InspirationWidgetProps) {
  const { dailyInspiration } = useScene();
  const [quote, setQuote] = useState(dailyInspiration);
  const [image, setImage] = useState<InspirationImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFull, setShowFull] = useState(false);

  // Fetch a random image based on quote mood
  const fetchImage = async (mood: SceneMood) => {
    setIsLoading(true);
    try {
      const queries = moodQueries[mood];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];

      const response = await api.images.getRandomUnsplash(randomQuery, 1);

      if (response.success && response.data.length > 0) {
        const img = response.data[0];
        setImage({
          id: img.id,
          url: img.url,
          thumbnailUrl: img.thumbnail_url,
          attribution: img.attribution ? {
            photographerName: img.attribution.photographer_name,
            photographerUrl: img.attribution.photographer_url,
            unsplashUrl: img.attribution.unsplash_url,
          } : undefined,
        });
      }
    } catch (error) {
      console.warn('Failed to fetch inspiration image:', error);
      // Use a fallback placeholder
      setImage({
        id: 'fallback',
        url: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800`,
        thumbnailUrl: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch image on mount and when quote changes
  useEffect(() => {
    fetchImage(quote.mood);
  }, [quote.mood]);

  const handleRefresh = () => {
    // Get a random different quote
    const otherQuotes = inspirationalQuotes.filter(
      q => q.quote !== quote.quote
    );
    const newQuote = otherQuotes[Math.floor(Math.random() * otherQuotes.length)];
    setQuote(newQuote);
    setIsLiked(false);
  };

  const handleShare = async () => {
    const text = `"${quote.quote}" - ${quote.author}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Inspiration from Lantern',
          text,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
    }
  };

  const mood = moodConfig[quote.mood];

  const sizeConfig = {
    small: {
      card: 'w-64 h-40',
      text: 'text-sm',
      author: 'text-xs',
      padding: 'p-3',
    },
    medium: {
      card: 'w-80 h-48',
      text: 'text-base',
      author: 'text-sm',
      padding: 'p-4',
    },
    large: {
      card: 'w-full max-w-md aspect-[4/3]',
      text: 'text-lg',
      author: 'text-sm',
      padding: 'p-5',
    },
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'shadow-2xl shadow-black/20',
        'border border-white/10',
        config.card,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: showFull ? 1 : 1.02 }}
      onClick={() => size === 'small' && setShowFull(true)}
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={image?.id || 'loading'}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {image ? (
            <img
              src={image.thumbnailUrl || image.url}
              alt="Inspiration"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Mood-based tint */}
      <div
        className={cn('absolute inset-0 opacity-20', mood.gradient)}
      />

      {/* Content */}
      <div className={cn('relative h-full flex flex-col justify-between', config.padding)}>
        {/* Top: Mood badge & actions */}
        <div className="flex items-start justify-between">
          <motion.span
            className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {mood.label}
          </motion.span>

          {showRefresh && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-white/10 hover:bg-white/20 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefresh();
                }}
                disabled={isLoading}
              >
                <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
              </Button>
            </div>
          )}
        </div>

        {/* Middle: Quote */}
        <motion.div
          className="flex-1 flex items-center justify-center py-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center">
            <Quote className="w-5 h-5 text-white/40 mx-auto mb-2" />
            <p className={cn('text-white font-medium leading-relaxed', config.text)}>
              "{quote.quote}"
            </p>
          </div>
        </motion.div>

        {/* Bottom: Author & actions */}
        <motion.div
          className="flex items-end justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className={cn('text-white/70 font-medium', config.author)}>
            — {quote.author}
          </p>

          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-7 w-7 text-white',
                isLiked ? 'bg-red-500/30 hover:bg-red-500/40' : 'bg-white/10 hover:bg-white/20'
              )}
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart className={cn('w-3.5 h-3.5', isLiked && 'fill-current')} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-white/10 hover:bg-white/20 text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
            >
              <Share2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Attribution */}
      {image?.attribution && (
        <motion.a
          href={image.attribution.unsplashUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1 left-3 text-[8px] text-white/40 hover:text-white/60 transition-colors flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={(e) => e.stopPropagation()}
        >
          Photo: {image.attribution.photographerName}
          <ExternalLink className="w-2 h-2" />
        </motion.a>
      )}

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-black/30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RefreshCw className="w-6 h-6 text-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default InspirationWidget;
