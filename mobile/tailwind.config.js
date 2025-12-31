/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f2fcf5',
          100: '#e1f8e8',
          200: '#c3efd2',
          300: '#94e0b3',
          400: '#5cc98d',
          500: '#34ae75',
          600: '#238c5b',
          700: '#1d704b',
          800: '#1a593e',
          900: '#164935',
        },
      },
    },
  },
  plugins: [],
}
