/**
 * UserGreeting - Simple user greeting component
 */

import { Lamp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const UserGreeting: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.display_name || "Friend";

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
      <div className="p-2 rounded-lg bg-primary/10">
        <Lamp className="h-5 w-5 text-primary" />
      </div>
      <span className="font-medium text-foreground">
        Hello, {displayName}
      </span>
    </div>
  );
};
