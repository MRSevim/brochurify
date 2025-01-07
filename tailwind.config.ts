import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "400px",
      },
      height: {
        "screen-header-excluded": "calc(100vh - 40px);",
      },
      colors: {
        dark: "var(--dark)",
        light: "var(--light)",
      },
    },
  },
  plugins: [],
} satisfies Config;
