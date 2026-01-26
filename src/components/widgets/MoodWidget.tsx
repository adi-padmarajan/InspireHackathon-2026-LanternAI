/**
 * MoodWidget Component
 * Quick mood tracker for the dashboard
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'rough';

interface MoodOption {
  level: MoodLevel;
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
}

const moods: MoodOption[] = [
  { level: 'great', icon: Sparkles, label: 'Great', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
  { level: 'good', icon: Sun, label: 'Good', color: 'text-green-500', bgColor: 'bg-green-500/20' },
  { level: 'okay', icon: Cloud, label: 'Okay', color: 'text-blue-400', bgColor: 'bg-blue-400/20' },
  { level: 'low', icon: Meh, label: 'Low', color: 'text-orange-400', bgColor: 'bg-orange-400/20' },
  { level: 'rough', icon: CloudRain, label: 'Rough', color: 'text-purple-400', bgColor: 'bg-purple-400/20' },
];

interface MoodWidgetProps {
  size?: 'small' | 'medium' | 'large';
  onMoodSelect?: (mood: MoodLevel) => void;
  className?: string;
}

export function MoodWidget({
  size = 'medium',
  onMoodSelect,
  className,
}: MoodWidgetProps) {
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [showThanks, setShowThanks] = useState(false);

  const handleMoodSelect = (mood: MoodLevel) => {
    setSelectedMood(mood);
    onMoodSelect?.(mood);

    // Show thank you message
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 2000);
  };

  const sizeConfig = {
    small: {
      container: 'p-3',
      iconSize: 'w-6 h-6',
      buttonSize: 'w-10 h-10',
      spacing: 'gap-1.5',
      title: 'text-xs',
    },
    medium: {
      container: 'p-4',
      iconSize: 'w-7 h-7',
      buttonSize: 'w-12 h-12',
      spacing: 'gap-2',
      title: 'text-sm',
    },
    large: {
      container: 'p-5',
      iconSize: 'w-8 h-8',
      buttonSize: 'w-14 h-14',
      spacing: 'gap-3',
      title: 'text-base',
    },
  };

  const sz = sizeConfig[size];

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-gradient-to-br from-card/90 to-card/50',
        'backdrop-blur-md border border-white/10',
        'shadow-xl',
        sz.container,
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Title */}
      <p className={cn('font-medium text-foreground mb-3', sz.title)}>
        How are you feeling?
      </p>

      {/* Mood selector */}
      <AnimatePresence mode="wait">
        {!showThanks ? (
          <motion.div
            key="moods"
            className={cn('flex items-center justify-center', sz.spacing)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {moods.map((mood, index) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.level;

              return (
                <motion.button
                  key={mood.level}
                  className={cn(
                    'relative rounded-full flex items-center justify-center',
                    'transition-all duration-200',
                    sz.buttonSize,
                    isSelected
                      ? cn(mood.bgColor, mood.color, 'ring-2 ring-current')
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => handleMoodSelect(mood.level)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Icon className={sz.iconSize} />

                  {/* Tooltip */}
                  <span
                    className={cn(
                      'absolute -bottom-6 left-1/2 -translate-x-1/2',
                      'text-[10px] font-medium whitespace-nowrap',
                      isSelected ? mood.color : 'text-muted-foreground'
                    )}
                  >
                    {mood.label}
                  </span>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="thanks"
            className="flex items-center justify-center h-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Thanks for sharing!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent moods indicator */}
      {selectedMood && !showThanks && (
        <motion.p
          className="text-[10px] text-muted-foreground text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Tracked today
        </motion.p>
      )}
    </motion.div>
  );
}

export default MoodWidget;
