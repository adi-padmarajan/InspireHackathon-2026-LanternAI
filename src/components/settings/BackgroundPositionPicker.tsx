import React from 'react';
import { useBackgroundStore } from '../../store/backgroundStore';

const positionOptions = [
  { value: 'top left', label: '↖' },
  { value: 'top center', label: '↑' },
  { value: 'top right', label: '↗' },
  { value: 'center left', label: '←' },
  { value: 'center', label: '⊙' },
  { value: 'center right', label: '→' },
  { value: 'bottom left', label: '↙' },
  { value: 'bottom center', label: '↓' },
  { value: 'bottom right', label: '↘' },
];

export const BackgroundPositionPicker: React.FC = () => {
  const { backgroundImage, backgroundPosition, setBackgroundPosition } = useBackgroundStore();

  if (!backgroundImage) return null;

  return (
    <div className="mt-4 p-4 rounded-lg border border-border bg-card">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Reposition Image</h4>
      <div className="grid grid-cols-3 gap-1 w-fit">
        {positionOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setBackgroundPosition(option.value)}
            className={`w-10 h-10 text-lg rounded-md border transition-colors ${
              backgroundPosition === option.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:bg-muted text-muted-foreground'
            }`}
            title={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
