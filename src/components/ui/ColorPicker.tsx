import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const defaultPresets = [
  '#000000', // Black
  '#ffffff', // White
  '#a855f7', // Purple
  '#7c3aed', // Violet
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  presetColors = defaultPresets,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-2 py-1 text-sm rounded-md border border-border bg-background text-foreground"
          placeholder="#000000"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
              value.toLowerCase() === color.toLowerCase() ? 'border-foreground' : 'border-muted-foreground/30'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
