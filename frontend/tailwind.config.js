/* eslint-disable prettier/prettier */
import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  safelist: [
    "bg-red-100", "dark:bg-red-800",
    "bg-green-100", "dark:bg-green-800",
    "bg-yellow-100", "dark:bg-yellow-800",
    "bg-pink-100", "dark:bg-pink-800",
    "bg-purple-100", "dark:bg-purple-800",
    "bg-indigo-100", "dark:bg-indigo-800",
    "bg-teal-100", "dark:bg-teal-800",
    "bg-orange-100", "dark:bg-orange-800",
    "bg-gray-100", "dark:bg-gray-800",
    "bg-cyan-100", "dark:bg-cyan-800",
    "bg-rose-100", "dark:bg-rose-800",
    "bg-blue-100", "dark:bg-blue-800",

    "bg-red-400", "dark:bg-red-800",
    "bg-green-400", "dark:bg-green-800",
    "bg-yellow-400", "dark:bg-yellow-800",
    "bg-pink-400", "dark:bg-pink-800",
    "bg-purple-400", "dark:bg-purple-800",
    "bg-indigo-400", "dark:bg-indigo-800",
    "bg-teal-400", "dark:bg-teal-800",
    "bg-orange-400", "dark:bg-orange-800",
    "bg-gray-400", "dark:bg-gray-800",
    "bg-cyan-400", "dark:bg-cyan-800",
    "bg-rose-400", "dark:bg-rose-800",
    "bg-blue-400", "dark:bg-blue-800",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-sans)'
  			],
  			mono: [
  				'var(--font-mono)'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			'cream': '#faf9f5',
  			'lBlack': '#111827',
  			'lGray': '#374151',
  			'crem-500': '#f5f3ec',
  			'crem-600': '#e7e5d9',
  			'crem-700': '#d6d3c8',
  			'crem-800': '#d1d5db',
  			'crem-900': '#d1d5db'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  darkMode: ["class"],
  plugins: [nextui(), require("tailwindcss-animate")],
}
