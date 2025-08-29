"use client";

import React from 'react';

interface StableLayoutProps {
  children: React.ReactNode;
  minHeight?: string;
  className?: string;
}

export const StableLayout: React.FC<StableLayoutProps> = ({
  children,
  minHeight = "200px",
  className = ""
}) => {
  return (
    <div 
      className={`layout-stable no-layout-shift ${className}`}
      style={{
        minHeight,
        contain: 'layout style paint',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'contents'
      }}
    >
      {children}
    </div>
  );
};

export default StableLayout;
