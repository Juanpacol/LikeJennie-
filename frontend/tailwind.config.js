/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        script: ["Allura", "cursive"],
        display: ['"Bodoni Moda"', "serif"],
      },
      keyframes: {
        "toast-in": { from: { opacity: "0", transform: "translateX(1rem)" } },
        "toast-out": { to: { opacity: "0", transform: "translateX(1rem)" } },
        "slide-in-left": { from: { transform: "translateX(-100%)" } },
      },
      animation: {
        "toast-in": "toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "toast-out": "toast-out 0.25s cubic-bezier(0.4, 0, 1, 1) both",
        "slide-in-left": "slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      colors: {
        accent: "#D6001C",
        lilac: { DEFAULT: "#D9C8E0", deep: "#24102F" },
      },
    },
  },
  plugins: [],
}

