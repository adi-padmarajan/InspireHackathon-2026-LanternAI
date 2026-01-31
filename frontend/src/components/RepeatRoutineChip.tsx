import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

interface RepeatRoutineChipProps {
  routineId: string;
  message?: string;
  onRepeat: () => void;
}

export const RepeatRoutineChip: React.FC<RepeatRoutineChipProps> = ({
  routineId,
  message = 'This helped you last time. Want to try it again?',
  onRepeat,
}) => {
  return (
    <button
      onClick={onRepeat}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-200 hover:bg-violet-500/20 transition-colors group"
    >
      <Sparkles className="w-4 h-4 text-violet-400" />
      <span className="text-sm">{message}</span>
      <RefreshCw className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
