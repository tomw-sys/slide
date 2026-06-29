import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#100F0C',
        surface: '#17150F',
        border: '#3a3730',
        accent: {
          DEFAULT: '#C6F23E',
          foreground: '#100F0C',
          hover: '#ADDA38',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#FBF8F1',
        },
        foreground: {
          DEFAULT: '#FBF8F1',
          secondary: '#F4EFE3',
          muted: '#8a8575',
          subtle: '#5C584C',
        },
        pink: '#FF5C9D',
        purple: '#7C5CFF',
        blue: '#4D8BFF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-unbounded)', 'Unbounded', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
      },
    },
  },
  plugins: [],
}

export default config
