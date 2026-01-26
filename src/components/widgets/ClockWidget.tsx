/**
 * ClockWidget Component
 * Beautiful animated clock with multiple styles
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ClockWidgetProps {
  size?: 'small' | 'medium' | 'large';
  style?: 'minimal' | 'modern' | 'classic';
  showDate?: boolean;
  showSeconds?: boolean;
  className?: string;
}

export function ClockWidget({
  size = 'medium',
  style = 'modern',
  showDate = true,
  showSeconds = false,
  className,
}: ClockWidgetProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const formatTime = () => {
    const h = hours % 12 || 12;
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    if (showSeconds) {
      return { time: `${h}:${m}:${s}`, ampm };
    }
    return { time: `${h}:${m}`, ampm };
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return time.toLocaleDateString('en-US', options);
  };

  const { time: timeString, ampm } = formatTime();

  const sizeClasses = {
    small: 'text-3xl',
    medium: 'text-5xl',
    large: 'text-7xl',
  };

  const dateSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  if (style === 'minimal') {
    return (
      <motion.div
        className={cn('flex flex-col items-center', className)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className={cn('font-light tracking-tight text-foreground/90', sizeClasses[size])}>
          {timeString}
          <span className="text-[0.4em] ml-1 text-muted-foreground">{ampm}</span>
        </div>
        {showDate && (
          <p className={cn('text-muted-foreground mt-1', dateSizeClasses[size])}>
            {formatDate()}
          </p>
        )}
      </motion.div>
    );
  }

  if (style === 'classic') {
    return (
      <motion.div
        className={cn(
          'relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50',
          'shadow-lg',
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-baseline gap-2">
          <span className={cn('font-serif font-medium text-foreground', sizeClasses[size])}>
            {timeString}
          </span>
          <span className="text-lg text-muted-foreground font-serif">{ampm}</span>
        </div>
        {showDate && (
          <p className={cn('text-muted-foreground mt-2 font-serif', dateSizeClasses[size])}>
            {formatDate()}
          </p>
        )}
      </motion.div>
    );
  }

  // Modern style (default)
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden',
        'p-6 rounded-2xl',
        'bg-gradient-to-br from-card/80 to-card/40',
        'backdrop-blur-md border border-white/10',
        'shadow-2xl shadow-black/10',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      {/* Animated dots */}
      <motion.div
        className="absolute top-4 right-4 flex gap-1"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
      </motion.div>

      <div className="relative">
        <div className="flex items-baseline gap-3">
          <motion.span
            className={cn('font-bold tracking-tight text-foreground', sizeClasses[size])}
            key={timeString}
            initial={{ opacity: 0.8, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {timeString}
          </motion.span>
          <span className="text-xl font-medium text-primary">{ampm}</span>
        </div>

        {showDate && (
          <motion.p
            className={cn('text-muted-foreground mt-2 font-medium', dateSizeClasses[size])}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {formatDate()}
          </motion.p>
        )}
      </div>

      {/* Decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
}

export default ClockWidget;
