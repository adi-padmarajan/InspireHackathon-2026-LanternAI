import React from 'react';
import { Cloud, Sun, Umbrella, Snowflake, Wind } from 'lucide-react';

interface SeasonalBannerProps {
  tone: 'cozy' | 'uplifting' | 'gentle';
  tags: string[];
  sunsetAlert?: boolean;
  onSunsetClick?: () => void;
}

const toneConfig = {
  cozy: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-200',
    label: 'Cozy mode',
  },
  uplifting: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-200',
    label: 'Uplifting mode',
  },
  gentle: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    text: 'text-sky-200',
    label: 'Gentle mode',
  },
};

function getWeatherIcon(tags: string[]) {
  if (tags.includes('rainy_day')) return <Umbrella className="w-4 h-4" />;
  if (tags.includes('snowy_day')) return <Snowflake className="w-4 h-4" />;
  if (tags.includes('sunny')) return <Sun className="w-4 h-4" />;
  if (tags.includes('windy')) return <Wind className="w-4 h-4" />;
  return <Cloud className="w-4 h-4" />;
}

export const SeasonalBanner: React.FC<SeasonalBannerProps> = ({
  tone,
  tags,
  sunsetAlert,
  onSunsetClick,
}) => {
  const config = toneConfig[tone];
  const weatherLabel = tags.find(t => t.includes('day') || t === 'sunny' || t === 'overcast') || 'today';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.border} border ${config.text}`}
      >
        {getWeatherIcon(tags)}
        <span className="capitalize">{weatherLabel.replace('_', ' ')}</span>
        <span className="opacity-60">•</span>
        <span>{config.label}</span>
      </div>
      
      {sunsetAlert && (
        <button
          onClick={onSunsetClick}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-200 hover:bg-orange-500/20 transition-colors"
        >
          <Sun className="w-3 h-3" />
          Quick outside loop before sunset?
        </button>
      )}
    </div>
  );
};
