import { Sparkles } from "lucide-react";

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
}

const suggestedPrompts = [
  "I'm feeling overwhelmed with coursework",
  "How do I find accessible routes to the library?",
  "I want to join a club but I'm anxious about it",
  "What mental health resources are available?",
  "I'm an international student confused about office hours",
  "The dark winter days are affecting my mood",
  "I'm having trouble making friends",
  "I feel lonely and isolated",
];

export const SuggestedPrompts = ({ onPromptClick }: SuggestedPromptsProps) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        Common topics students ask about:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="text-sm px-3 py-2 rounded-full bg-accent hover:bg-accent/80 text-accent-foreground transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
