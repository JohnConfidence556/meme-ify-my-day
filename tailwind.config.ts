import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'vibe-black': '#0f0f0f',
        'vibe-white': '#fdfbf7', // Slightly creamy white
        'vibe-purple': '#a855f7',
        'vibe-yellow': '#facc15',
        'vibe-pink': '#ec4899',
        'vibe-blue': '#3b82f6',
      },
      boxShadow: {
        // The "Neo-Brutalist" hard shadow (X Y blur spread color)
        'neo': '5px 5px 0px 0px #000000',
        'neo-sm': '3px 3px 0px 0px #000000',
        'neo-lg': '8px 8px 0px 0px #000000',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        }
      }
    },
  },
  plugins: [],
};
export default config;