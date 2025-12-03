import React from "react";

interface SubmitButtonProps {
  isVisible: boolean;
  isDisabled: boolean;
}

const SubmitButton = ({ isVisible, isDisabled }: SubmitButtonProps) => {
  if (!isVisible) return null;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`btn-submit ${isDisabled ? "state-disabled" : "state-enabled"}`}
      title={isDisabled ? "Ecrivez quelque chose" : "Envoyer"}
    >
      <span className="text-xl transition-transform duration-300 hover:translate-x-1">➤</span>
    </button>
  );
};

export default SubmitButton;