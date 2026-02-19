
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <span className="text-white font-[900] leading-none select-none tracking-tighter text-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
        4V
      </span>
    </div>
  );
};
