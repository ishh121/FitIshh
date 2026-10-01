/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#070A0E',
          900: '#0C1017',
          850: '#111721',
          800: '#161F2C',
          700: '#202D3F',
        },
        prana: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          950: '#022C22',
        },
        surya: {
          DEFAULT: '#F59E0B',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          950: '#431407',
          glow: '#EA580C',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F5EFE6',
          200: '#E8DDCB',
          300: '#D4C3A3',
          400: '#B8A07A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-prana': '0 0 35px -5px rgba(16, 185, 129, 0.3)',
        'glow-surya': '0 0 35px -5px rgba(245, 158, 11, 0.3)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-card-light': '0 4px 24px 0 rgba(0, 0, 0, 0.07)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'scanline': 'scanline 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        scanline: {
          '0%': { top: '0%' },
          '50%': { top: '90%' },
          '100%': { top: '0%' },
        }
      }
    },
  },
  plugins: [],
}
