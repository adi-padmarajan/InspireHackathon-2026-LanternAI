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
        {/* Ambient glow */}
        <div className="absolute inset-0 -m-3 rounded-full bg-yellow-300/30 blur-2xl" />

        {/* Inner flame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 blur-md opacity-80 animate-[flicker_6s_ease-in-out_infinite]" />
        </div>

        {/* Soft lamp glow */}
        <Lamp className={`${sizeClasses[size]} absolute inset-0 text-yellow-300 blur-sm opacity-70`} />

        {/* Main lamp */}
        <Lamp
          className={`${sizeClasses[size]} relative z-10 text-amber-500 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]`}
        />
      </div>

      {showText && (
        <span className={`${textSizeClasses[size]} font-serif font-semibold tracking-wide text-foreground/90`}>
          Lantern
        </span>
      )}
    </div>
  );
};
