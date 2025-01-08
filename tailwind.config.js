/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        paytone: ["'Paytone One'", "sans-serif"],
        opensans: ["'Noto Sans Thai'", "sans-serif"],
      },
      colors: {
        primary: "#FF914D", // Orange
        secondary: "#5D7DAF", // Blue
        neutral: "#191919", // Black
      },
    },
    fontFamily: {
      sans: ["'Noto Sans Thai'", "sans-serif"],
    },
  },
  plugins: [],
};
