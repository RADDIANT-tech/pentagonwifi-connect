
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/26866c68-f024-4805-84f8-642495567891.png" 
        alt="Pentagon WiFi Logo" 
        className="h-16 md:h-20 animate-pulse-slow" 
      />
    </div>
  );
};

export default Logo;
