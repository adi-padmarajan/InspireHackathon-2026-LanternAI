import { RefreshCw, Sparkles } from "lucide-react";

interface RepeatRoutineChipProps {
  routineId: string;
  message?: string;
  onRepeat: () => void;
}

export const RepeatRoutineChip = ({
  routineId,
  message = "This helped you last time. Want to try it again?",
  onRepeat,
}: RepeatRoutineChipProps) => {
  return (
    <button
      onClick={onRepeat}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-foreground/90 hover:bg-primary/20 transition-colors group"
      aria-label={`Repeat routine ${routineId}`}
    >
      <Sparkles className="w-4 h-4 text-primary" />
      <span className="text-sm">{message}</span>
      <RefreshCw className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
