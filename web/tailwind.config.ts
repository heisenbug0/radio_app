import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        Nunito_sans_black: ["Nunito_sans_black", "sans-serif"],
        Nunito_sans_bold: ["Nunito_sans_bold", "sans-serif"],
        Nunito_sans_extrabold: ["Nunito_sans_extrabold", "sans-serif"],
        Nunito_sans_light: ["Nunito_sans_light", "sans-serif"],
        Nunito_sans_medium: ["Nunito_sans_medium", "sans-serif"],
        Nunito_sans_regular: ["Nunito_sans_regular", "sans-serif"],
        Nunito_sans_semibold: ["Nunito_sans_semibold", "sans-serif"],
      },
      colors: {
        dark: {
          0: "#1C1F2E",
          1: "#161925",
          2: "#1F2339",
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
export default config;
