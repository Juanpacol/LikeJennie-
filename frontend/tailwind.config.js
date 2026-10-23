/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        script: ["Allura", "cursive"],
        condensed: ["Antonio", "sans-serif"],
        heavy: ["Poppins", "sans-serif"],
        display: ['"Bodoni Moda"', "serif"],
      },
      keyframes: {
        "toast-in": { from: { opacity: "0", transform: "translateX(1rem)" } },
        "toast-progress": {
          from: { transform: "scaleX(1)" },
          to: { transform: "scaleX(0)" },
        },
        "toast-out": { to: { opacity: "0", transform: "translateX(1rem)" } },
        "slide-in-left": { from: { transform: "translateX(-100%)" } },
        "fade-in": { from: { opacity: "0" } },
        "banner-in": { from: { opacity: "0", transform: "scale(1.12)" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(1.5rem)" } },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(4rem)" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "toast-progress": "toast-progress linear forwards",
        "toast-out": "toast-out 0.25s cubic-bezier(0.4, 0, 1, 1) both",
        "slide-in-left":
          "slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.3s ease-out both",
        "banner-in": "banner-in 1.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-in-right":
          "slide-in-right 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      colors: {
        accent: "#D6001C",
        lilac: { DEFAULT: "#D9C8E0", deep: "#24102F" },
      },
    },
  },
  plugins: [],
};
