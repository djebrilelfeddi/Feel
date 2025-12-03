import React, { memo } from 'react';
import type { FloatingEmojiItem } from '../../../types/types';

interface FloatingEmojisProps {
  emojis: FloatingEmojiItem[];
}

const FloatingEmojis = ({ emojis }: FloatingEmojisProps) => (
  <>
    {emojis.map((item) => (
      <div
        key={item.id}
        className="absolute pointer-events-none opacity-0 text-white drop-shadow-lg"
        style={{
          left: `${item.left}%`,
          bottom: '0%',
          fontSize: `${item.size}rem`,
          animation: `float ${item.duration}s ease-in-out infinite`,
          animationDelay: `${item.delay}s`,
        }}
        role="presentation"
      >
        {item.emoji}
      </div>
    ))}
  </>
);

export default memo(FloatingEmojis);