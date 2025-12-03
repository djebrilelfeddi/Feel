import React from "react";
import { AVAILABLE_MODELS } from "../../../constants/appConstants";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => (
  <div>
    <label className="block text-sm font-medium mb-3 text-white/90 drop-shadow-md">Modèle IA</label>
    <select
      value={selectedModel}
      onChange={(e) => onModelChange(e.target.value)}
      className="w-full p-3 glass-effect text-white border-0 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all bg-black/30 backdrop-blur-sm hover-lift"
    >
      {AVAILABLE_MODELS.map((model) => (
        <option key={model.id} value={model.id} className="bg-gray-800 text-white">
          {model.name}
        </option>
      ))}
    </select>
    <p className="text-xs text-white/70 mt-2 drop-shadow-md">
      {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.description}
    </p>
  </div>
);

export default ModelSelector;