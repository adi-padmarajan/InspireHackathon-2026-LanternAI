/**
 * FocusTimerWidget Component
 * Pomodoro-style focus timer with beautiful animations
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Target, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TimerState = 'idle' | 'focus' | 'break' | 'completed';

interface FocusTimerWidgetProps {
  size?: 'small' | 'medium' | 'large';
  focusDuration?: number; // minutes
  breakDuration?: number; // minutes
  className?: string;
}

export function FocusTimerWidget({
  size = 'medium',
  focusDuration = 25,
  breakDuration = 5,
  className,
}: FocusTimerWidgetProps) {
  const [state, setState] = useState<TimerState>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [sessions, setSessions] = useState(0);

  const totalTime = state === 'break' ? breakDuration * 60 : focusDuration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer completed
      if (state === 'focus') {
        setSessions((prev) => prev + 1);
        setState('break');
        setTimeLeft(breakDuration * 60);
        // Could add notification/sound here
      } else if (state === 'break') {
        setState('completed');
        setIsRunning(false);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, state, breakDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (state === 'idle' || state === 'completed') {
      setState('focus');
      setTimeLeft(focusDuration * 60);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setState('idle');
    setTimeLeft(focusDuration * 60);
  };

  const handleSkip = () => {
    if (state === 'break') {
      setState('focus');
      setTimeLeft(focusDuration * 60);
      setIsRunning(true);
    }
  };

  const stateConfig = {
    idle: {
      label: 'Ready to Focus',
      icon: Target,
      color: 'text-muted-foreground',
      ringColor: 'stroke-muted',
      progressColor: 'stroke-primary',
    },
    focus: {
      label: 'Focus Time',
      icon: Target,
      color: 'text-primary',
      ringColor: 'stroke-muted',
      progressColor: 'stroke-primary',
    },
    break: {
      label: 'Take a Break',
      icon: Coffee,
      color: 'text-green-500',
      ringColor: 'stroke-muted',
      progressColor: 'stroke-green-500',
    },
    completed: {
      label: 'Great Work!',
      icon: CheckCircle2,
      color: 'text-primary',
      ringColor: 'stroke-primary/30',
      progressColor: 'stroke-primary',
    },
  };

  const config = stateConfig[state];
  const StateIcon = config.icon;

  const sizeConfig = {
    small: {
      container: 'p-3',
      ring: 80,
      strokeWidth: 4,
      timeText: 'text-xl',
      labelText: 'text-[10px]',
    },
    medium: {
      container: 'p-4',
      ring: 120,
      strokeWidth: 6,
      timeText: 'text-3xl',
      labelText: 'text-xs',
    },
    large: {
      container: 'p-6',
      ring: 160,
      strokeWidth: 8,
      timeText: 'text-4xl',
      labelText: 'text-sm',
    },
  };

  const sz = sizeConfig[size];
  const radius = (sz.ring - sz.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex flex-col items-center">
        {/* Timer Ring */}
        <div className="relative" style={{ width: sz.ring, height: sz.ring }}>
          <svg
            className="transform -rotate-90"
            width={sz.ring}
            height={sz.ring}
          >
            {/* Background ring */}
            <circle
              className={config.ringColor}
              strokeWidth={sz.strokeWidth}
              fill="none"
              r={radius}
              cx={sz.ring / 2}
              cy={sz.ring / 2}
            />
            {/* Progress ring */}
            <motion.circle
              className={config.progressColor}
              strokeWidth={sz.strokeWidth}
              fill="none"
              r={radius}
              cx={sz.ring / 2}
              cy={sz.ring / 2}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={state}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-col items-center"
              >
                <StateIcon className={cn('w-4 h-4 mb-1', config.color)} />
                <span className={cn('font-bold tracking-tight', sz.timeText, config.color)}>
                  {formatTime(timeLeft)}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Label */}
        <motion.p
          className={cn('font-medium mt-2', sz.labelText, config.color)}
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {config.label}
        </motion.p>

        {/* Controls */}
        <div className="flex items-center gap-2 mt-3">
          {!isRunning ? (
            <Button
              variant="default"
              size={size === 'small' ? 'sm' : 'default'}
              className="gap-2"
              onClick={handleStart}
            >
              <Play className="w-4 h-4" />
              {state === 'idle' ? 'Start' : 'Resume'}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size={size === 'small' ? 'sm' : 'default'}
              className="gap-2"
              onClick={handlePause}
            >
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Sessions counter */}
        {sessions > 0 && (
          <motion.div
            className="flex items-center gap-1.5 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Array.from({ length: Math.min(sessions, 4) }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
            {sessions > 4 && (
              <span className="text-xs text-muted-foreground">+{sessions - 4}</span>
            )}
            <span className="text-xs text-muted-foreground ml-1">
              session{sessions !== 1 ? 's' : ''}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default FocusTimerWidget;
