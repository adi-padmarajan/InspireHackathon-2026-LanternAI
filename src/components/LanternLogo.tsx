import { Lamp } from "lucide-react";

interface LanternLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export const LanternLogo = ({ className = "", size = "md", showText = true }: LanternLogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        {/* Ambient outer glow */}
        <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-r from-amber-300/40 via-yellow-300/50 to-amber-400/40 blur-2xl opacity-70 animate-[pulse_4s_ease-in-out_infinite]" />

        {/* Soft halo */}
        <div className="absolute inset-0 -m-1 rounded-full bg-yellow-300/40 blur-lg" />

        {/* Lamp glow */}
        <Lamp className={`${sizeClasses[size]} absolute inset-0 text-yellow-300 blur-sm opacity-80`} />

        {/* Main lamp icon */}
        <Lamp
          className={`${sizeClasses[size]} relative z-10 text-amber-500 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]`}
        />
      </div>

      {showText && (
        <span className={`${textSizeClasses[size]} font-serif font-bold text-foreground tracking-wide`}>Lantern</span>
      )}
    </div>
  );
};
