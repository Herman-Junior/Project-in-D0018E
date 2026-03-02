/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: ['Questrial', 'sans-serif'],
      },
      colors: {
        'main': 'var(--main-text-color)',
        'highlight': 'var(--highlight-color)',
        'second': 'var(--second-text-color)',
        'hover-text': 'var(--hover-text-color)',
        'gold': 'var(--gold-color)',
      },
    },
  },
  plugins: [],
}