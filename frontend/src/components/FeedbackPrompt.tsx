import React, { useState } from 'react';
import { Star, X, Check, RefreshCw } from 'lucide-react';
import { useFeedback } from '../hooks/useFeedback';
import { useEvents } from '../hooks/useEvents';

interface FeedbackPromptProps {
  routineId?: string;
  playbookId?: string;
  actionId?: string;
  onDismiss?: () => void;
  onRepeat?: () => void;
  showRepeat?: boolean;
  label?: string;
}

export const FeedbackPrompt: React.FC<FeedbackPromptProps> = ({
  routineId,
  playbookId,
  actionId,
  onDismiss,
  onRepeat,
  showRepeat = false,
  label = 'Did this help?',
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const { submitting, submitted, submitFeedback } = useFeedback();
  const { logRoutineRepeated } = useEvents();

  const handleRating = async (rating: number) => {
    setSelectedRating(rating);
    await submitFeedback({
      rating,
      routine_id: routineId,
      playbook_id: playbookId,
      action_id: actionId,
    });
  };

  const handleRepeat = async () => {
    if (routineId) {
      await logRoutineRepeated(routineId, playbookId);
    }
    onRepeat?.();
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <Check className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-emerald-200">Thanks for your feedback!</span>
        {showRepeat && onRepeat && (
          <button
            onClick={handleRepeat}
            className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Repeat this
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => handleRating(rating)}
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(null)}
            disabled={submitting}
            className="p-1 transition-transform hover:scale-110 disabled:opacity-50"
            aria-label={`Rate ${rating} out of 5`}
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                (hoveredRating && rating <= hoveredRating) ||
                (selectedRating && rating <= selectedRating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-500'
              }`}
            />
          </button>
        ))}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-auto p-1 text-slate-400 hover:text-slate-200"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
