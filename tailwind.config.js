/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFFFF',
        sand: '#F2F0F1',
        ink: '#000000',
        char: '#2a2a2a',
        muted: '#F0F0F0',
        star: '#000000',
        discount: '#000000'
      },
      fontFamily: {
        sans: ['var(--font-family)', 'sans-serif'],
        integral: ['var(--font-heading)', 'sans-serif'],
        satoshi: ['var(--font-family)', 'sans-serif'],
        serif: ['var(--font-heading)', 'sans-serif']
      }
    }
  },
  plugins: []
}
