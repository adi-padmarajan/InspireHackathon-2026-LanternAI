import { Lamp } from "lucide-react";

interface LanternLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

const titleSizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

const subtitleSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const LanternLogo = ({ className = "", size = "md" }: LanternLogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Simple lantern icon */}
      <Lamp className={`${sizeClasses[size]} text-amber-500`} />

      {/* Text block */}
      <div className="flex flex-col leading-tight">
        <span className={`${titleSizeClasses[size]} font-extrabold text-foreground`}>Lantern</span>
        <span className={`${subtitleSizeClasses[size]} font-normal text-muted-foreground`}>Your AI Companion</span>
      </div>
    </div>
  );
};
