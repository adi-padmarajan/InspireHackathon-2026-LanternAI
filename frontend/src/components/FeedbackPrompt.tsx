import React, { useState } from 'react';
import { Star, X, Check } from 'lucide-react';
import { useFeedback } from '../hooks/useFeedback';

interface FeedbackPromptProps {
  playbookId?: string;
  stage?: string;
  onDismiss?: () => void;
}

export const FeedbackPrompt: React.FC<FeedbackPromptProps> = ({
  playbookId,
  stage,
  onDismiss,
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const { submitting, submitted, submitFeedback } = useFeedback();

  const handleRating = async (rating: number) => {
    setSelectedRating(rating);
    await submitFeedback(rating, undefined, {
      playbook_id: playbookId,
      stage,
    });
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm">
        <Check className="w-4 h-4" />
        <span>Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
      <span className="text-sm text-slate-300">Was this helpful?</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => handleRating(rating)}
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(null)}
            disabled={submitting}
            className="p-1 transition-transform hover:scale-110 disabled:opacity-50"
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
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
