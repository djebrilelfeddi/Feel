import React from "react";

interface MoodEmojiProps {
  content: string;
  animation?: string;
}

const MoodEmoji = ({ content, animation }: MoodEmojiProps) => {
  const trimmedAnimation = animation?.trim();
  console.log('[MoodEmoji] Animation:', trimmedAnimation);
  return (
    <div className="text-8xl mb-8 select-none">
      <span
        key={trimmedAnimation === 'none' ? 'none' : `${trimmedAnimation}-${Date.now()}`}
        className={`inline-block ${trimmedAnimation && trimmedAnimation !== "none" ? `animate-emoji-${trimmedAnimation}` : ""}`}
        role="img"
        aria-label="emoji"
      >
        {content}
      </span>
    </div>
  );
};

export default MoodEmoji;