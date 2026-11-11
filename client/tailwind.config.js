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
        gym: {
          bg: '#101312',
          surface: '#191F1C',
          surfaceLight: '#222B27',
          surfaceHover: '#2A3631',
          border: '#2C3A33',
          borderLight: '#3D5047',
          primary: '#10B981',
          primaryHover: '#059669',
          primaryDark: '#047857',
          accent: '#34D399',
          text: '#F5F7F6',
          muted: '#9CA3AF',
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
      }
    },
  },
  plugins: [],
}

