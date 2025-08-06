module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          light: '#A0D3D0',
          DEFAULT: '#008C8C',
          dark: '#005757',
        },
        green: {
          light: '#A8D8B9',
          DEFAULT: '#4CAF50',
          dark: '#2E7D32',
        },
        brown: {
          light: '#D7C49E',
          DEFAULT: '#8B5B29',
          dark: '#5B3A1A',
        },
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}