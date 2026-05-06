import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F8F5EE",
        sand: "#EFEAE0",
        navy: {
          DEFAULT: "#1A2A47",
          900: "#0F1B2F",
          700: "#26375A",
        },
        terracotta: {
          DEFAULT: "#C04A2A",
          600: "#A93E22",
          400: "#D8694B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(26, 42, 71, 0.08)",
        card: "0 6px 24px -8px rgba(26, 42, 71, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
