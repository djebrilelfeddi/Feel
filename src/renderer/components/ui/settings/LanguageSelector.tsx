import React from "react";

interface LanguageSelectorProps {
  language: 'fr' | 'en';
  onLanguageChange: (lang: 'fr' | 'en') => void;
}

const LanguageSelector = ({ language, onLanguageChange }: LanguageSelectorProps) => (
  <div>
    <label className="block text-sm font-medium mb-3 text-white/90 drop-shadow-md">
      Langue
    </label>
    <select
      value={language}
      onChange={(e) => onLanguageChange(e.target.value as 'fr' | 'en')}
      className="w-full p-3 glass-effect text-white border-0 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all bg-black/30 backdrop-blur-sm hover-lift"
    >
      <option value="fr" className="bg-gray-800 text-white">Français</option>
      <option value="en" className="bg-gray-800 text-white">English</option>
    </select>
  </div>
);

export default LanguageSelector;