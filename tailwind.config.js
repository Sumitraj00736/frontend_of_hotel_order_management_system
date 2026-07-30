/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FC8019',
          hover: '#E67316',
          light: '#fff7ed',
          border: '#ffedd5',
        }
      }
    },
  },
  plugins: [],
}
