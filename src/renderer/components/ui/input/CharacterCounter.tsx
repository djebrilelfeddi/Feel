import React, { useEffect, useState } from "react";

interface CharacterCounterProps {
  count: number;
  isVisible: boolean;
}

const CharacterCounter = ({ count, isVisible }: CharacterCounterProps) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 100);
      return () => clearTimeout(timer);
    }
  }, [count]);

  if (!isVisible) return null;

  return (
    <div className={`mt-2 text-right text-sm text-white/80 drop-shadow-md font-light transition-all duration-300 ${
      isPulsing ? 'scale-105 text-white' : 'scale-100'
    }`}>
      {count} caractères
    </div>
  );
};

export default CharacterCounter;