import React from 'react';
import { Lamp } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={className}>
      <Lamp className="h-8 w-8 text-primary" />
    </div>
  );
};
