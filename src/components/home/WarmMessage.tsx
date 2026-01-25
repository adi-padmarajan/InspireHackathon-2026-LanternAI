import { Sparkles, Heart } from "lucide-react";

interface WarmMessageProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export const WarmMessage = ({ isAuthenticated = false, userName }: WarmMessageProps) => {
  if (isAuthenticated && userName) {
    // Personal, companion-like message for signed-in users
    return (
      <div className="text-center max-w-2xl mx-auto animate-fade-in stagger-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 backdrop-blur-sm text-accent-foreground text-sm font-medium mb-6">
          <Heart className="h-4 w-4" />
          <span>Your friend at UVic</span>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Hey {userName}, it's so good to see you! I'm <span className="text-primary font-semibold">Lantern</span>,
          and I'm always here whenever you need to chat, vent, or just hang out.
          What's on your mind today?
        </p>
      </div>
    );
  }

  // Welcome message for guests
  return (
    <div className="text-center max-w-2xl mx-auto animate-fade-in stagger-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 backdrop-blur-sm text-accent-foreground text-sm font-medium mb-6">
        <Sparkles className="h-4 w-4" />
        <span>Your UVic AI Companion</span>
      </div>

      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
        I'm <span className="text-primary font-semibold">Lantern</span>, your personal wellness companion.
        Sign in with your NetLink ID and let's get to know each other!
      </p>
    </div>
  );
};
