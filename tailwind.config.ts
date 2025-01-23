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
      maxHeight: {
        "scrollable-container": "calc(100vh - 90px);",
      },
      width: {
        "screen-one-excluded": "calc(100vw - 384px);",
        "screen-both-excluded": "calc(100vw - 768px);",
      },
      colors: {
        dark: "var(--dark)",
        light: "var(--light)",
      },
    },
  },
  plugins: [],
} satisfies Config;
