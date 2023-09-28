/** @type {import('tailwindcss').Config} */

import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: {
          600: "#7952CB",
          700: "#5632A1",
        },
      }
    },
  },
  plugins: [typography],
}

