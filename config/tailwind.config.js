module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
    safelist: [
    'animate-emoji-rotation',
    'animate-emoji-zoom',
    'animate-emoji-shake',
    'animate-emoji-bounce',
    'animate-emoji-pulse',
    'animate-emoji-wiggle',
  ],
};
