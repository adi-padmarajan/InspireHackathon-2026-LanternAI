import React from 'react';
import { MessageCircle, ListChecks, Wind, Sparkles } from 'lucide-react';

type CopingStyle = 'talking' | 'planning' | 'grounding';

interface PersonalizationPillProps {
  copingStyle: CopingStyle | null;
  className?: string;
}

const styleConfig: Record<CopingStyle, { label: string; icon: React.ReactNode; color: string }> = {
  talking: {
    label: 'Talking',
    icon: <MessageCircle className="w-3 h-3" />,
    color: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
  },
  planning: {
    label: 'Planning',
    icon: <ListChecks className="w-3 h-3" />,
    color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
  },
  grounding: {
    label: 'Grounding',
    icon: <Wind className="w-3 h-3" />,
    color: 'bg-amber-500/20 border-amber-500/30 text-amber-200',
  },
};

export const PersonalizationPill: React.FC<PersonalizationPillProps> = ({
  copingStyle,
  className = '',
}) => {
  if (!copingStyle) return null;

  const config = styleConfig[copingStyle];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color} ${className}`}>
      <Sparkles className="w-3 h-3" />
      <span>Personalized for:</span>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};
