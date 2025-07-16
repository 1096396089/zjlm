/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
      },
      zIndex: {
        '100': '100',
        '1000': '1000',
      },
      scale: {
        '120': '1.2',
      },
      spacing: {
        '2.5': '0.625rem',
      },
    },
  },
  plugins: [],
}
