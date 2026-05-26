/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f0ff',
          100: '#e6dfff',
          500: '#7c5cff',
          600: '#6747e6',
          700: '#523ab8',
        },
      },
    },
  },
  plugins: [],
};
