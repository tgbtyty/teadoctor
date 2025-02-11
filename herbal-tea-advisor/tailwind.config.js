/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(-10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' }
          },
          popIn: {
            '0%': { opacity: '0', transform: 'scale(0.9)' },
            '70%': { transform: 'scale(1.05)' },
            '100%': { opacity: '1', transform: 'scale(1)' }
          }
        },
        animation: {
          fadeIn: 'fadeIn 0.5s ease-out forwards',
          popIn: 'popIn 0.5s ease-out forwards'
        }
      },
    },
    plugins: [],
  }