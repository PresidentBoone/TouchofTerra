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
        // Touch of Terra Brand Colors
        'tot-green': {
          primary: '#7BA05B',
          light: '#9BC177',
          sage: '#A8B89C',
        },
        'tot-beige': {
          DEFAULT: '#F5F2E8',
          warm: '#EDE7D9',
        },
        'tot-brown': '#B8A082',
        'tot-teal': {
          DEFAULT: '#5D8A7A',
          dark: '#4A6B5D',
        },
        'tot-text': {
          dark: '#2D3E35',
          light: '#6B7C73',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'tot-light': '0 4px 20px rgba(123, 160, 91, 0.1)',
        'tot-medium': '0 8px 30px rgba(123, 160, 91, 0.15)',
        'tot-large': '0 12px 48px rgba(123, 160, 91, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
