import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
}

/**
 * Uniform Logo Component
 * Uses logo_v3.png as the standard professional asset.
 * Handles transparency and color variants.
 */
export default function Logo({ className, variant = 'light' }: LogoProps) {
  const src = variant === 'white' ? '/logo-white.png' : '/logo.png';
  
  return (
    <img 
      src={src} 
      alt="Felix Yacht Registration" 
      className={cn(
        "object-contain transition-all duration-300 hover:scale-105",
        className
      )}
      style={{
        backgroundColor: 'transparent',
      }}
    />
  );
}
