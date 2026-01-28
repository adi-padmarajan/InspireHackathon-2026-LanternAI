import { Lamp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const UserGreeting: React.FC = () => {
  const { user } = useAuth();
  const username = user?.display_name || 'Friend';

  return (
    <div className="flex items-center gap-3 bg-accent rounded-lg p-3">
      <div className="p-2 rounded-full bg-primary/10">
        <Lamp className="h-6 w-6 text-primary" />
      </div>
      <span className="font-semibold text-foreground">
        {username}
      </span>
    </div>
  );
};
