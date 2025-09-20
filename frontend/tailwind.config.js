/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ol-brand': {
          50: '#fef2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f87171',
          500: '#c9252c',
          600: '#821314',
          700: '#7f1d1d',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'ol-gray': {
          50: '#fcfcfc',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#cccccc',
          500: '#a3a3a3',
          600: '#737373',
          700: '#525252',
          800: '#404040',
          900: '#262626',
        }
      },
    },
  },
  plugins: [],
}
