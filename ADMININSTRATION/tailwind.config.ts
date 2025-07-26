import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#fCFCFC",
        black: "#000",
        cool: "#f7f7f7",
        primaryColor: "#a503a8",
        secondaryColor: "#680097",
        tertiaryColor: "#d600b1",
        extraEffect: "#d3b703",
      },
      fontFamily: {
        sans: ['Poppins', 'Graphik', 'sans-serif'],
      }
    },
  },
  plugins: [require('daisyui')],
};


export default config;
