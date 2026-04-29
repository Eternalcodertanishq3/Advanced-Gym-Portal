/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1440px'
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
  			brand: {
  				orange: '#E85D26',
  				'orange-soft': '#FDF0EA',
  				'orange-hover': '#D4501E',
  				navy: '#1A3A4A',
  				'navy-light': '#A8D5E8',
  				gold: '#C9892A',
  				'gold-soft': '#FDF6E9'
  			},
  			surface: {
  				base: '#FAFAF8',
  				card: '#FFFFFF',
  				elevated: '#F4F3F0',
  				sunken: '#EDECE8',
  				border: '#E5E3DF',
  				'border-hover': '#D1CFC9',
  				'base-dark': '#0F1117',
  				'card-dark': '#1A1D27',
  				'elevated-dark': '#22252F',
  				'border-dark': '#2A2D3A'
  			},
  			success: {
  				DEFAULT: '#16A34A',
  				soft: '#F0FDF4',
  				dark: '#15803D'
  			},
  			warning: {
  				DEFAULT: '#D97706',
  				soft: '#FFFBEB',
  				dark: '#B45309'
  			},
  			danger: {
  				DEFAULT: '#DC2626',
  				soft: '#FEF2F2',
  				dark: '#B91C1C'
  			},
  			info: {
  				DEFAULT: '#2563EB',
  				soft: '#EFF6FF',
  				dark: '#1D4ED8'
  			},
  			role: {
  				'super-admin': '#7C3AED',
  				admin: '#E85D26',
  				receptionist: '#0D9488',
  				trainer: '#16A34A',
  				member: '#C9892A',
  				worker: '#64748B'
  			},
        obsidian: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#12141C',
          950: '#0A0B10',
        },
  			txt: {
  				primary: '#111827',
  				secondary: '#4B5563',
  				tertiary: '#9CA3AF',
  				inverse: '#FFFFFF'
  			},
  			crimson: '#FF3131',
  			'electric-cyan': '#00E5FF',
  			'neon-green': '#39FF14'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			display: [
  				'var(--font-jakarta)',
  				'system-ui',
  				'sans-serif'
  			],
  			sans: [
  				'var(--font-inter)',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-jetbrains)',
  				'monospace'
  			],
  			accent: [
  				'var(--font-sora)',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			stat: [
  				'2rem',
  				{
  					lineHeight: '1',
  					fontWeight: '700',
  					letterSpacing: '-0.02em'
  				}
  			]
  		},
  		spacing: {
  			'13': '3.25rem',
  			'15': '3.75rem',
  			'18': '4.5rem',
  			'4.5': '1.125rem'
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
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			'fade-in-up': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(8px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.96)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			'slide-in-right': {
  				'0%': {
  					transform: 'translateX(100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			'pulse-dot': {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.5'
  				}
  			},
  			shake: {
  				'0%, 100%': {
  					transform: 'translateX(0)'
  				},
  				'10%, 30%, 50%, 70%, 90%': {
  					transform: 'translateX(-4px)'
  				},
  				'20%, 40%, 60%, 80%': {
  					transform: 'translateX(4px)'
  				}
  			},
  			counter: {
  				from: {
  					'--num': '0'
  				},
  				to: {
  					'--num': 'var(--target)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			shimmer: 'shimmer 2s linear infinite',
  			'fade-in-up': 'fade-in-up 0.25s ease-out',
  			'scale-in': 'scale-in 0.2s ease-out',
  			'slide-in-right': 'slide-in-right 0.3s ease-out',
  			'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
  			shake: 'shake 0.5s ease-in-out'
  		},
  		boxShadow: {
  			card: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
  			'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
  			'brand-glow': '0 4px 14px rgba(232, 93, 38, 0.25)',
  			nav: '0 1px 3px rgba(0,0,0,0.06)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
