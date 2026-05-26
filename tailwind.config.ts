import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#00B4D8",
          light: "#00E5FF",
          dark: "#0096C7",
        },
        cyber: "#00E5FF",
        ink: {
          DEFAULT: "#030508",
          muted: "#0c1220",
          card: "#0f1628",
        },
        deep: "#030508",
        neon: {
          blue: "#00E5FF",
          cyan: "#00E5FF",
          electric: "#00B4D8",
        },
        surface: {
          DEFAULT: "#060a12",
          overlay: "rgba(12, 18, 32, 0.92)",
          raised: "rgba(14, 24, 42, 0.88)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        site: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
