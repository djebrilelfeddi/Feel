import React from "react";

interface BackgroundGradientProps {
  backgroundColors: string[];
  prevBackgroundColors: string[];
  activeLayer: 'prev' | 'current';
}

const BackgroundGradient = ({ backgroundColors, prevBackgroundColors, activeLayer }: BackgroundGradientProps) => (
  <>
    <div
      className="absolute inset-0 transition-opacity duration-1000"
      style={{
        background: `linear-gradient(to bottom right, ${backgroundColors.join(', ')})`,
        opacity: activeLayer === 'current' ? 1 : 0
      }}
    />
    <div
      className="absolute inset-0 transition-opacity duration-1000"
      style={{
        background: `linear-gradient(to bottom right, ${prevBackgroundColors.join(', ')})`,
        opacity: activeLayer === 'prev' ? 1 : 0
      }}
    />
  </>
);

export default BackgroundGradient;