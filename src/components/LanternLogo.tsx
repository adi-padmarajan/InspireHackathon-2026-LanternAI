import { Lamp } from "lucide-react";

interface LanternLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-14 w-14",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export const LanternLogo = ({ className = "", size = "md", showText = true }: LanternLogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Emblem */}
      <div className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 p-3 shadow-[0_6px_20px_rgba(251,191,36,0.25)]">
        {/* Directional light beam */}
        <div className="absolute left-full top-1/2 h-6 w-16 -translate-y-1/2 bg-gradient-to-r from-amber-300/40 to-transparent blur-xl" />

        {/* Inner flame */}
        <div className="absolute h-1/2 w-1/2 rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 blur-md opacity-80" />

        {/* Lantern icon */}
        <Lamp
          className={`${sizeClasses[size]} relative z-10 text-amber-600 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]`}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textSizeClasses[size]} font-serif font-bold tracking-wide text-foreground`}>Lantern</span>
          <span className="text-xs tracking-widest uppercase text-muted-foreground">Your AI Companion</span>
        </div>
      )}
    </div>
  );
};
