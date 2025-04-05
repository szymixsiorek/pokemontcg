
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				pokemon: {
					red: '#E53935',
					blue: '#1E88E5',
					yellow: '#FDD835',
					green: '#43A047',
					purple: '#8E24AA',
					brown: '#6D4C41',
					black: '#212121',
					white: '#FAFAFA',
				},
				series: {
					original: '#E53935',
					gold: '#FFD700',
					crystal: '#4FC3F7',
					ruby: '#B71C1C',
					sapphire: '#0D47A1',
					emerald: '#2E7D32',
					diamond: '#90A4AE',
					pearl: '#FFECB3',
					platinum: '#757575',
					heartgold: '#FFC107',
					soulsilver: '#B0BEC5',
					black: '#212121',
					white: '#FAFAFA',
					xy: '#FF4081',
					sunmoon: '#FF9800',
					sword: '#2196F3',
					shield: '#F44336',
					scarlet: '#F44336',
					violet: '#9C27B0',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
                'color-cycle': {
                    '0%': { color: '#4299e1' },
                    '14%': { color: '#f56565' },
                    '28%': { color: '#ecc94b' },
                    '42%': { color: '#48bb78' },
                    '56%': { color: '#9f7aea' },
                    '70%': { color: '#ed8936' },
                    '84%': { color: '#ed64a6' },
                    '100%': { color: '#38b2ac' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
                'color-cycle': 'color-cycle 8s infinite'
			},
			fontFamily: {
				sans: ['Nunito Sans', 'sans-serif'],
				heading: ['"Pokemon Solid"', 'sans-serif'],
                pixel: ['"Press Start 2P"', 'cursive'],
                mono: ['monospace']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
