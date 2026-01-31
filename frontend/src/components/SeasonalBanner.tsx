import React from 'react';
import { Cloud, Sun, Umbrella, Snowflake, Wind, Sunset } from 'lucide-react';
import type { SeasonalContext } from '../lib/api';

interface SeasonalBannerProps {
  context: SeasonalContext;
  onSunsetClick?: () => void;
  onSuggestionClick?: (suggestionId: string) => void;
  showSuggestions?: boolean;
}

const toneConfig = {
  cozy: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-200',
    label: 'Cozy mode',
  },
  bright: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-200',
    label: 'Bright mode',
  },
  neutral: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    text: 'text-sky-200',
    label: 'Gentle mode',
  },
};

function getWeatherIcon(context: SeasonalContext) {
  if (context.is_rainy) return <Umbrella className="w-4 h-4" />;
  if (context.tags.includes('snowy_day')) return <Snowflake className="w-4 h-4" />;
  if (context.is_clear) return <Sun className="w-4 h-4" />;
  if (context.tags.includes('windy')) return <Wind className="w-4 h-4" />;
  return <Cloud className="w-4 h-4" />;
}

function getWeatherLabel(context: SeasonalContext): string {
  if (context.is_rainy) return 'Rainy day';
  if (context.is_clear) return 'Clear day';
  if (context.tags.includes('snowy_day')) return 'Snowy day';
  if (context.tags.includes('overcast')) return 'Overcast';
  return 'Today';
}

export const SeasonalBanner: React.FC<SeasonalBannerProps> = ({
  context,
  onSunsetClick,
  onSuggestionClick,
  showSuggestions = false,
}) => {
  const config = toneConfig[context.tone];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Weather/Tone Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.border} border ${config.text}`}
        >
          {getWeatherIcon(context)}
          <span>{getWeatherLabel(context)}</span>
          {context.temperature_c !== null && (
            <>
              <span className="opacity-60">•</span>
              <span>{Math.round(context.temperature_c)}°C</span>
            </>
          )}
          <span className="opacity-60">•</span>
          <span>{config.label}</span>
        </div>
        
        {/* Sunset Alert */}
        {context.sunset_alert && (
          <button
            onClick={onSunsetClick}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-200 hover:bg-orange-500/20 transition-colors"
          >
            <Sunset className="w-3 h-3" />
            {context.minutes_to_sunset
              ? `${context.minutes_to_sunset}min to sunset`
              : 'Quick loop before dark?'}
          </button>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && context.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {context.suggestions.slice(0, 3).map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => onSuggestionClick?.(suggestion.id)}
              className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
            >
              {suggestion.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
