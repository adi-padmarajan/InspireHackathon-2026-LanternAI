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
        {/* Outer glow - large diffuse light */}
        <div className="absolute inset-0 -m-2 blur-xl opacity-60 animate-pulse">
          <div className={`${sizeClasses[size]} bg-amber-400 rounded-full`} />
        </div>
        {/* Middle glow - warm light emission */}
        <div className="absolute inset-0 -m-1 blur-md opacity-70">
          <Lamp className={`${sizeClasses[size]} text-amber-300`} />
        </div>
        {/* Inner glow - bright core */}
        <div className="absolute inset-0 blur-sm opacity-80">
          <Lamp className={`${sizeClasses[size]} text-yellow-400`} />
        </div>
        {/* Main lamp icon */}
        <Lamp className={`${sizeClasses[size]} text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] relative z-10`} />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-serif font-bold text-foreground`}>
          Lantern
        </span>
      )}
    </div>
  );
};
