import React from "react";
import { Settings } from "lucide-react";

interface SettingsButtonProps {
  onClick: () => void;
  hasOpenedSettings: boolean;
}

const SettingsButton = ({ onClick, hasOpenedSettings }: SettingsButtonProps) => (
  <div className="relative">
    <button
      onClick={onClick}
      className="btn-settings"
    >
      <Settings size={24} className="transition-transform duration-300 hover:rotate-90" />
    </button>
    {!hasOpenedSettings && (
      <div className="indicator-new"></div>
    )}
  </div>
);

export default SettingsButton;