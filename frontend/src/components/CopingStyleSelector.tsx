import React from 'react';
import { MessageCircle, ListChecks, Wind } from 'lucide-react';

type CopingStyle = 'talking' | 'planning' | 'grounding';

interface CopingStyleSelectorProps {
  value: CopingStyle | null;
  onChange: (style: CopingStyle) => void;
  disabled?: boolean;
}

const styles: { id: CopingStyle; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'talking',
    label: 'Talking',
    description: 'Process through conversation and validation',
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    id: 'planning',
    label: 'Planning',
    description: 'Action-oriented with checklists and steps',
    icon: <ListChecks className="w-5 h-5" />,
  },
  {
    id: 'grounding',
    label: 'Grounding',
    description: 'Calm down first with somatic exercises',
    icon: <Wind className="w-5 h-5" />,
  },
];

export const CopingStyleSelector: React.FC<CopingStyleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-300">
        Preferred Coping Style
      </label>
      <div className="grid grid-cols-1 gap-2">
        {styles.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            disabled={disabled}
            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
              value === style.id
                ? 'bg-violet-500/20 border-violet-500/40 text-white'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`p-2 rounded-lg ${
              value === style.id ? 'bg-violet-500/30' : 'bg-white/10'
            }`}>
              {style.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{style.label}</div>
              <div className="text-xs opacity-70">{style.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
