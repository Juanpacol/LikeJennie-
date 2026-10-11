/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        script: ["Allura", "cursive"],
        display: ['"Bodoni Moda"', "serif"],
      },
    },
  },
  plugins: [],
}

