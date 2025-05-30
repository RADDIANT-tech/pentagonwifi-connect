
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/26866c68-f024-4805-84f8-642495567891.png" 
        alt="Pentagon WiFi Logo" 
        className="h-24 md:h-32 lg:h-40 animate-pulse-slow" 
      />
    </div>
  );
};

export default Logo;
