/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: '#B7FF00',
          hover: '#a0e000',
          dark: '#85bb00',
          glow: 'rgba(183, 255, 0, 0.4)',
        },
        gym: {
          bg: '#111413',
          surface: '#172017',
          surfaceLight: '#1f2b20',
          surfaceHover: '#263628',
          border: '#243426',
          borderLight: '#324a35',
          primary: '#B7FF00', // Neon Lime from references
          primaryHover: '#a0e000',
          emerald: '#10B981', // Secondary Accent
          emeraldDark: '#047857',
          accent: '#B7FF00',
          text: '#FFFFFF',
          muted: '#A5ACA7',
          mutedDark: '#6B7280',
          danger: '#EF4444',
          dangerHover: '#DC2626',
          warning: '#F59E0B',
          warningHover: '#D97706',
          success: '#10B981',
          info: '#3B82F6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Barlow Condensed"', '"Oswald"', 'sans-serif'],
        heading: ['"Oswald"', '"Barlow Condensed"', 'sans-serif'],
      },
      boxShadow: {
        'neon-glow': '0 0 30px rgba(183, 255, 0, 0.35)',
        'neon-strong': '0 0 50px rgba(183, 255, 0, 0.55)',
        'emerald-glow': '0 0 35px rgba(16, 185, 129, 0.35)',
        'card-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatDelay: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        }
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        floatSlow: 'floatSlow 4.5s ease-in-out infinite',
        floatDelay: 'floatDelay 5s ease-in-out infinite',
        spinSlow: 'spinSlow 20s linear infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
