/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ol-brand': {
          50:  '#f7e6f0',
          100: '#eecce1',
          200: '#dd99c3',
          300: '#cc66a5',
          400: '#bb3387',
          500: '#6B003E', // cor principal do logo
          600: '#5f0038',
          700: '#4c002d',
          800: '#390022',
          900: '#260017'
        },
        'ol-gray': {
          50:  '#f9f9f9',
          100: '#f2f2f2',
          200: '#e6e6e6',
          300: '#d9d9d9',
          400: '#cccccc', // base fornecida
          500: '#b3b3b3',
          600: '#999999',
          700: '#808080',
          800: '#666666',
          900: '#4d4d4d'
        }
      }
    },
  },
  plugins: [],
}
