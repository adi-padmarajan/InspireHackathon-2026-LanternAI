/**
 * ImagePositioner Component
 * Drag to reposition the focal point of the background image (like Notion)
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Move, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackgroundImage, ImagePosition } from '@/lib/imageSettings';
import { cn } from '@/lib/utils';

interface ImagePositionerProps {
  image: BackgroundImage;
  position: ImagePosition;
  onPositionChange: (position: ImagePosition) => void;
  overlayOpacity?: number;
}

export function ImagePositioner({
  image,
  position,
  onPositionChange,
  overlayOpacity = 40,
}: ImagePositionerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [positionStart, setPositionStart] = useState({ x: 50, y: 50 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPositionStart({ ...position });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Calculate delta as percentage of container
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    // Invert the movement (drag left = move image right = decrease x)
    const newX = Math.max(0, Math.min(100, positionStart.x - deltaX));
    const newY = Math.max(0, Math.min(100, positionStart.y - deltaY));

    onPositionChange({ x: newX, y: newY });
  }, [isDragging, dragStart, positionStart, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse listeners when dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setPositionStart({ ...position });
  }, [position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const touch = e.touches[0];
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const deltaX = ((touch.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((touch.clientY - dragStart.y) / rect.height) * 100;

    const newX = Math.max(0, Math.min(100, positionStart.x - deltaX));
    const newY = Math.max(0, Math.min(100, positionStart.y - deltaY));

    onPositionChange({ x: newX, y: newY });
  }, [isDragging, dragStart, positionStart, onPositionChange]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetPosition = useCallback(() => {
    onPositionChange({ x: 50, y: 50 });
  }, [onPositionChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Position
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={resetPosition}
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>

      {/* Drag area */}
      <div
        ref={containerRef}
        className={cn(
          'relative aspect-video rounded-xl overflow-hidden',
          'border-2 border-border',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image */}
        <motion.img
          src={image.url}
          alt="Background preview"
          className="w-full h-full object-cover select-none"
          style={{
            objectPosition: `${position.x}% ${position.y}%`,
          }}
          draggable={false}
          animate={{
            scale: isDragging ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Overlay preview */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 pointer-events-none"
          style={{ opacity: overlayOpacity / 100 }}
        />

        {/* Drag indicator */}
        <motion.div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'bg-black/30 opacity-0 transition-opacity',
            isDragging && 'opacity-100'
          )}
          initial={false}
          animate={{ opacity: isDragging ? 1 : 0 }}
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 text-white text-sm">
            <Move className="w-4 h-4" />
            <span>Drag to reposition</span>
          </div>
        </motion.div>

        {/* Crosshair indicator */}
        <motion.div
          className="absolute w-8 h-8 border-2 border-white/80 rounded-full pointer-events-none"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.3)',
          }}
          animate={{
            scale: isDragging ? 1.2 : 1,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white shadow" />
          </div>
        </motion.div>
      </div>

      {/* Position coordinates */}
      <p className="text-xs text-muted-foreground text-center">
        Position: {Math.round(position.x)}%, {Math.round(position.y)}%
      </p>
    </div>
  );
}

export default ImagePositioner;
