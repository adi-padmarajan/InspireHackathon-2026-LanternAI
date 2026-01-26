/**
 * ScenePicker Component
 * Settings panel for selecting and managing ambient scenes
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Leaf,
  Sparkles,
  Zap,
  Plus,
  X,
  ChevronDown,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useScene } from '@/contexts/SceneContext';
import { SceneCard } from './SceneCard';
import { SceneMood, moodConfig, prebuiltScenes } from '@/lib/scenes';
import { cn } from '@/lib/utils';

const moodIcons = {
  focus: Target,
  relax: Leaf,
  create: Sparkles,
  energize: Zap,
};

interface ScenePickerProps {
  className?: string;
}

export function ScenePicker({ className }: ScenePickerProps) {
  const {
    settings,
    activeScene,
    isSceneEnabled,
    setActiveScene,
    toggleSceneEnabled,
    getAvailableScenes,
  } = useScene();

  const [selectedMood, setSelectedMood] = useState<SceneMood | 'all'>('all');
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredScenes = selectedMood === 'all'
    ? getAvailableScenes()
    : getAvailableScenes(selectedMood);

  const moods: (SceneMood | 'all')[] = ['all', 'focus', 'relax', 'create', 'energize'];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" />
          <label className="text-sm font-medium text-foreground">
            Ambient Scenes
          </label>
        </div>
        <Switch
          checked={isSceneEnabled}
          onCheckedChange={toggleSceneEnabled}
        />
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground">
        Choose a scene to set the mood. Images are displayed beautifully as focal art pieces, not stretched backgrounds.
      </p>

      <AnimatePresence>
        {isSceneEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Active Scene Preview */}
            {activeScene && (
              <motion.div
                className="relative rounded-xl overflow-hidden border border-border"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="aspect-video relative">
                  <img
                    src={activeScene.image.thumbnailUrl || activeScene.image.url}
                    alt={activeScene.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Ambient glow preview */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 80%, hsl(${activeScene.colorAccent} / 0.3), transparent 60%)`,
                    }}
                  />

                  {/* Info */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                        {moodConfig[activeScene.mood].label}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold mt-1">{activeScene.name}</h4>
                    <p className="text-white/70 text-xs">{activeScene.description}</p>
                  </div>

                  {/* Clear button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 bg-black/40 hover:bg-black/60 text-white"
                    onClick={() => setActiveScene(null)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Mood Filter */}
            <div className="flex gap-1.5 flex-wrap">
              {moods.map((mood) => {
                const isSelected = selectedMood === mood;
                const Icon = mood === 'all' ? Sparkles : moodIcons[mood];
                const label = mood === 'all' ? 'All' : moodConfig[mood].label;

                return (
                  <motion.button
                    key={mood}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    onClick={() => setSelectedMood(mood)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </motion.button>
                );
              })}
            </div>

            {/* Scene Grid */}
            <div className="space-y-2">
              <button
                className="flex items-center justify-between w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span>{filteredScenes.length} scenes available</span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform',
                    isExpanded && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-2 overflow-hidden"
                  >
                    {filteredScenes.map((scene, index) => (
                      <motion.div
                        key={scene.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <SceneCard
                          scene={scene}
                          isActive={activeScene?.id === scene.id}
                          onSelect={() => setActiveScene(scene.id)}
                          size="small"
                          showMoodBadge={selectedMood === 'all'}
                          className="w-full h-24"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Scene Creator Hint */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Coming soon: Create your own scenes from Unsplash images with custom particles and effects.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ScenePicker;
