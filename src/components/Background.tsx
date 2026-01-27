import React from 'react';
import { useBackgroundStore } from '../store/backgroundStore';

export const Background: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { backgroundImage, backgroundPosition } = useBackgroundStore();

  return (
    <div
      className="min-h-screen w-full"
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: backgroundPosition || 'center',
        backgroundRepeat: 'no-repeat',
      } : undefined}
    >
      {children}
    </div>
  );
};