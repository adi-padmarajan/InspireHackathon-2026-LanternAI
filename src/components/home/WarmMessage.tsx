import { Sparkles } from "lucide-react";

export const WarmMessage = () => {
  return (
    <div className="text-center max-w-2xl mx-auto animate-fade-in stagger-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 backdrop-blur-sm text-accent-foreground text-sm font-medium mb-6">
        <Sparkles className="h-4 w-4" />
        <span>Your UVic AI Companion</span>
      </div>
      
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
        I'm <span className="text-primary font-semibold">Lantern</span>, your personal wellness companion. 
        Whether you need someone to talk to, help finding your way around campus, or just a friendly check-in—I'm here for you, 24/7.
      </p>
    </div>
  );
};
