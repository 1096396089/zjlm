// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      keyframes: {
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(-80px) scale(1.1)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'card-in': 'card-in 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
