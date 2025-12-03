import React from "react";

interface TypewriterSpeedControlProps {
  typewriterSpeed: number;
  onTypewriterSpeedChange: (speed: number) => void;
}

const TypewriterSpeedControl = ({ typewriterSpeed, onTypewriterSpeedChange }: TypewriterSpeedControlProps) => (
  <div className="space-y-3">
    <label className="block text-sm font-medium text-white/90 drop-shadow-md">
      Vitesse du typewriter: <span className="text-white font-semibold">{typewriterSpeed}ms</span>
    </label>
    <div className="relative">
      <input
        type="range"
        min="10"
        max="100"
        value={typewriterSpeed}
        onChange={(e) => onTypewriterSpeedChange(Number(e.target.value))}
        className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-red-500/100 to-yellow-500/100 transition-all duration-300 border border-white/10 custom-range"
      />
      <div className="flex justify-between text-xs text-white/60 mt-2 px-1">
        <span>Rapide</span>
        <span>Lent</span>
      </div>
    </div>
  </div>
);

export default TypewriterSpeedControl;