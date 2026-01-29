/**
 * ColorsTab - Color customization settings
 */

import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const accentColors = [
  { color: '#7c3aed', name: 'Purple' },
  { color: '#ec4899', name: 'Pink' },
  { color: '#f97316', name: 'Orange' },
  { color: '#eab308', name: 'Yellow' },
  { color: '#22c55e', name: 'Green' },
  { color: '#06b6d4', name: 'Cyan' },
  { color: '#3b82f6', name: 'Blue' },
  { color: '#ef4444', name: 'Red' },
];

export const ColorsTab = () => {
  const { settings, setCustomAccentColor } = useTheme();
  const [selectedAccent, setSelectedAccent] = useState(settings.customAccentColor);

  const handleAccentChange = (color: string) => {
    setSelectedAccent(color);
    setCustomAccentColor(color);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-foreground">Accent Colors</h3>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {accentColors.map(({ color, name }) => (
          <button
            key={color}
            onClick={() => handleAccentChange(color)}
            className={cn(
              "w-12 h-12 rounded-full transition-transform hover:scale-110",
              selectedAccent === color 
                ? "ring-2 ring-offset-2 ring-foreground" 
                : "",
              color === '#ffffff' || color === '#000000' 
                ? "border border-muted-foreground/50" 
                : ""
            )}
            style={{ backgroundColor: color }}
            title={name}
          >
            {selectedAccent === color && (
              <Check className="h-4 w-4 mx-auto text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
