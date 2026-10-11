/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        script: ["Allura", "cursive"],
        display: ['"Bodoni Moda"', "serif"],
      },
      colors: {
        accent: "#D6001C",
      },
    },
  },
  plugins: [],
}

