import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      screens: {
        sm: "400px",
      },
      width: {
        "screen-one-excluded": "calc(100vw - 384px);",
        "screen-both-excluded": "calc(100vw - 768px);",
      },
      colors: {
        background: "var(--background)",
        text: "var(--text)",
        gray: "var(--gray)",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
} satisfies Config;
