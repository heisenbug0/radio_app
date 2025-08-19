import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        appBg: {
          600: "#F4F5F4",
          700: "#FFFFFF14",
          800: "#282f39",
        },
        primary: {
          700: "#DB066F",
        },
      },
      fontFamily: {
        "manrope-bold": ["manrope-bold", "sans-serif"],
        "manrope-extrabold": ["manrope-extrabold", "sans-serif"],
        "manrope-extralight": ["manrope-extralight", "sans-serif"],
        "manrope-light": ["manrope-light", "sans-serif"],
        "manrope-medium": ["manrope-medium", "sans-serif"],
        "manrope-regular": ["manrope-regular", "sans-serif"],
        "manrope-semibold": ["manrope-semibold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
