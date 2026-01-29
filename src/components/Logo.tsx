/**
 * Logo Component - Lantern Brand Logo
 */

import { Lamp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, iconOnly = false }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="p-2 rounded-lg bg-primary/10">
        <Lamp className="h-5 w-5 text-primary" />
      </div>
      {!iconOnly && (
        <span className="font-serif font-bold text-lg text-foreground">
          Lantern
        </span>
      )}
    </div>
  );
};
