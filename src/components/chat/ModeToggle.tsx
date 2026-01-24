import { Accessibility, Globe, RefreshCw, Heart, Brain, Users, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatMode } from "@/components/chat/FloatingModeSelector";

interface ModeToggleProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onNewChat: () => void;
}

export const ModeToggle = ({ mode, onModeChange, onNewChat }: ModeToggleProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-4 py-4">
      <Button
        variant={mode === "accessibility" ? "lantern" : "outline"}
        size="sm"
        onClick={() => onModeChange(mode === "accessibility" ? "default" : "accessibility")}
        className="gap-2"
      >
        <Accessibility className="h-4 w-4" />
        Accessibility
      </Button>
      <Button
        variant={mode === "international" ? "lantern" : "outline"}
        size="sm"
        onClick={() => onModeChange(mode === "international" ? "default" : "international")}
        className="gap-2"
      >
        <Globe className="h-4 w-4" />
        International Students
      </Button>
      <Button variant="ghost" size="sm" onClick={onNewChat} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        New Chat
      </Button>
    </div>
  );
};

// Topic quick buttons for common issues
interface QuickTopicsProps {
  onSelect: (topic: string) => void;
}

export const QuickTopics = ({ onSelect }: QuickTopicsProps) => {
  const topics = [
    { icon: Brain, label: "Stress & Anxiety", prompt: "I'm feeling really stressed and anxious lately" },
    { icon: Sun, label: "Seasonal Depression", prompt: "The dark winter days are affecting my mood" },
    { icon: Users, label: "Making Friends", prompt: "I'm having trouble making friends at university" },
    { icon: Heart, label: "Social Anxiety", prompt: "I want to join clubs but I feel too anxious" },
    { icon: Accessibility, label: "Campus Access", prompt: "I need help finding accessible routes on campus" },
    {
      icon: Globe,
      label: "International Help",
      prompt: "As an international student, I'm confused about Canadian academic culture",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {topics.map((topic) => (
        <button
          key={topic.label}
          onClick={() => onSelect(topic.prompt)}
          className="flex items-center gap-2 text-sm px-3 py-3 rounded-lg bg-accent hover:bg-accent/80 text-accent-foreground transition-colors text-left"
        >
          <topic.icon className="h-4 w-4 flex-shrink-0 text-primary" />
          <span>{topic.label}</span>
        </button>
      ))}
    </div>
  );
};
