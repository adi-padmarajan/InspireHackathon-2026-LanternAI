/**
 * WidgetDashboard Component
 * Displays customizable widgets in a beautiful layout
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, X, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useScene } from '@/contexts/SceneContext';
import { ClockWidget } from './ClockWidget';
import { InspirationWidget } from './InspirationWidget';
import { FocusTimerWidget } from './FocusTimerWidget';
import { MoodWidget } from './MoodWidget';
import { cn } from '@/lib/utils';

interface WidgetDashboardProps {
  layout?: 'compact' | 'expanded' | 'minimal';
  showControls?: boolean;
  className?: string;
}

export function WidgetDashboard({
  layout = 'compact',
  showControls = true,
  className,
}: WidgetDashboardProps) {
  const { settings, toggleWidgetVisibility } = useScene();
  const [isExpanded, setIsExpanded] = useState(layout === 'expanded');
  const [showSettings, setShowSettings] = useState(false);

  const visibleWidgets = settings.widgetLayout.filter(w => w.visible);

  // Determine which widgets to show based on configuration
  const showClock = visibleWidgets.some(w => w.type === 'clock');
  const showInspiration = settings.showDailyInspiration;
  const showFocusTimer = visibleWidgets.some(w => w.type === 'focus-timer');
  const showMoodTracker = visibleWidgets.some(w => w.type === 'mood-tracker');

  if (layout === 'minimal') {
    return (
      <motion.div
        className={cn('flex flex-col items-center gap-4', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Just show clock and inspiration in minimal mode */}
        <ClockWidget size="large" style="minimal" />
        {showInspiration && (
          <InspirationWidget size="medium" showRefresh={false} />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        'relative',
        isExpanded ? 'w-full max-w-2xl' : 'w-full max-w-md',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Controls */}
      {showControls && (
        <div className="absolute -top-10 right-0 flex gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-card/50 backdrop-blur-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {/* Widget Grid */}
      <div
        className={cn(
          'grid gap-4',
          isExpanded
            ? 'grid-cols-2 md:grid-cols-3'
            : 'grid-cols-1'
        )}
      >
        {/* Clock - Always prominent */}
        <motion.div
          className={cn(isExpanded && 'col-span-2 md:col-span-1')}
          layout
        >
          <ClockWidget
            size={isExpanded ? 'large' : 'medium'}
            style="modern"
            showDate
          />
        </motion.div>

        {/* Daily Inspiration */}
        <AnimatePresence>
          {showInspiration && (
            <motion.div
              className={cn(isExpanded && 'col-span-2')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <InspirationWidget
                size={isExpanded ? 'large' : 'medium'}
                showRefresh
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Focus Timer */}
        <AnimatePresence>
          {(showFocusTimer || isExpanded) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <FocusTimerWidget size={isExpanded ? 'medium' : 'small'} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood Tracker */}
        <AnimatePresence>
          {(showMoodTracker || isExpanded) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <MoodWidget size={isExpanded ? 'medium' : 'small'} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default WidgetDashboard;
