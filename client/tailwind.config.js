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
          DEFAULT: '#C6FF00',
          hover: '#b2ea00',
          dark: '#99c900',
          glow: 'rgba(198, 255, 0, 0.4)',
        },
        gym: {
          bg: '#191D20',
          dark: '#111613',
          surface: '#22292A',
          surfaceLight: '#2c3537',
          surfaceHover: '#364245',
          border: '#333e40',
          borderLight: '#435154',
          primary: '#C6FF00', // Neon Lime from references
          primaryHover: '#b2ea00',
          emerald: '#10B981', // Secondary Accent
          emeraldDark: '#047857',
          accent: '#C6FF00',
          text: '#FFFFFF',
          muted: '#AEB5B2',
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
        sans: ['Inter', 'Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Bebas Neue"', '"Barlow Condensed"', '"Oswald"', 'sans-serif'],
        heading: ['"Bebas Neue"', '"Oswald"', '"Barlow Condensed"', 'sans-serif'],
        body: ['Inter', 'Montserrat', 'sans-serif'],
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
