import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: '#fdf3f2',
          100: '#fbe4e1',
          200: '#f9ccc7',
          300: '#f4a8a0',
          400: '#ec786c',
          500: '#e14d3f',
          600: '#cd3325',
          700: '#ac281c',
          800: '#8e241b',
          900: '#75241d',
          950: '#400e0a',
        },
        slateCustom: {
          850: '#172033',
          900: '#0f172a',
          950: '#090d16',
        }
      },
    },
  },
  plugins: [],
};
export default config;
