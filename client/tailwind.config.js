/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dmsans': ['DM Serif Text', 'serif'],
        'heebo': ['Heebo', 'sans-serif'],
      }
    },
  },
  plugins: [require("@tailwindcss/forms")]
}