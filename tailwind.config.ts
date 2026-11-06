import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        marino: {
          DEFAULT: "#1c3c5c",
          dark: "#0a2a43",
          light: "#405861",
        },
        cielo: {
          DEFAULT: "#aed9fa",
          deep: "#ACD4E4",
        },
        crema: {
          DEFAULT: "#F7EFE8",
          soft: "#f7f5f3",
        },
        pizarra: "#405861",
        niebla: "#879296",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(28, 60, 92, 0.18)",
        card: "0 2px 20px -4px rgba(28, 60, 92, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
