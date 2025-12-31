/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f2fcf5',
          100: '#e1f8e8',
          200: '#c3eed0',
          300: '#94deb0',
          400: '#5dc58a',
          500: '#36a869',
          600: '#268852',
          700: '#216c43',
          800: '#1e5638',
          900: '#194730',
          950: '#0c271b',
        },
        earth: {
          50: '#fbf7f1',
          100: '#f5ebd9',
          200: '#ebd6b3',
          300: '#dfbc86',
          400: '#d2a059',
          500: '#cb8638',
          600: '#be6c2e',
          700: '#9e5227',
          800: '#814225',
          900: '#693721',
          950: '#381b10',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wilt': 'wilt 2s ease-in-out forwards',
        'grow': 'grow 2s ease-in-out forwards',
      },
      keyframes: {
        wilt: {
          '0%': { transform: 'scale(1) rotate(0deg)', filter: 'grayscale(0%)' },
          '100%': { transform: 'scale(0.9) rotate(10deg)', filter: 'grayscale(80%)' },
        },
        grow: {
          '0%': { transform: 'scale(0.9) rotate(10deg)', filter: 'grayscale(80%)' },
          '100%': { transform: 'scale(1) rotate(0deg)', filter: 'grayscale(0%)' },
        }
      }
    },
  },
  plugins: [],
}
