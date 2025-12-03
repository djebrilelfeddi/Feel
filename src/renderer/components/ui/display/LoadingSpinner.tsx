import React from "react";

interface LoadingSpinnerProps {
  isVisible: boolean;
  size?: string;
}

const LoadingSpinner = ({ isVisible, size = "w-5 h-5" }: LoadingSpinnerProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-full transition-all duration-500 bg-black/50 glass-effect">
      <span className={`inline-block border-2 border-white border-t-transparent rounded-full animate-spin ${size}`} />
    </div>
  );
};

export default LoadingSpinner;