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
        <Lamp className={`${sizeClasses[size]} text-secondary`} />
        <div className="absolute inset-0 blur-md opacity-50">
          <Lamp className={`${sizeClasses[size]} text-secondary`} />
        </div>
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-serif font-bold text-foreground`}>
          Lantern
        </span>
      )}
    </div>
  );
};
