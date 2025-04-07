/**** eslint-disable prettier/prettier */
import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-gradient-to-r",
    "from-gray-300",
    "to-gray-400",
    "from-gray-400",
    "to-gray-300",
    "from-green-300",
    "to-green-400",
    "from-green-400",
    "to-green-300",
    "from-red-300",
    "to-red-400",
    "from-red-400",
    "to-red-300",
    "from-purple-400",
    "to-purple-600",
    "from-indigo-400",
    "to-indigo-600",
    "from-pink-400",
    "to-pink-600",
    "from-blue-400",
    "to-blue-600",
    "from-yellow-400",
    "to-yellow-500",
    "from-emerald-400",
    "to-emerald-500",
    "from-violet-400",
    "to-violet-500",
    "from-orange-300",
    "to-orange-500",
    "from-cyan-400",
    "to-cyan-500",
    "from-rose-400",
    "to-rose-500",
    "from-sky-400",
    "to-sky-500",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        cream: "#faf9f5",
        lBlack: "#111827",
        lGray: "#374151",
        "crem-500": "#f5f3ec",
        "crem-600": "#e7e5d9",
        "crem-700": "#d6d3c8",
        "crem-800": "#d1d5db",
        "crem-900": "#d1d5db",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  darkMode: ["class"],
  plugins: [nextui(), require("tailwindcss-animate")],
};
