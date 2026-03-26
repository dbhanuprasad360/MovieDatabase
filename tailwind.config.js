/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateX(12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%,100%": { transform: "translateX(-200%)" },
          "50%": { transform: "translateX(200%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        shimmer: "shimmer 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
