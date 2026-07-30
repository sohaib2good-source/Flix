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
  // variant 'light' -> Default transparent logo (navy text)
  // variant 'white' -> Force white logo (for dark backgrounds)
  
  return (
    <img 
      src="/images/official_logo.png" 
      alt="Ocean Yacht Registration" 
      className={cn(
        "object-contain transition-all duration-500 hover:scale-105",
        variant === 'white' && "drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]",
        className
      )}
      style={{
        backgroundColor: 'transparent',
      }}
    />
  );
}
