import tailwindcss_animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
    darkMode: ["class"],

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindcss_animate,
  ],
};

export default config;
