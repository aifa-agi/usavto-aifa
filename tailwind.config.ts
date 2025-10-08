import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist)'],
        mono: ['var(--font-geist-mono)']
      },
      screens: {
        'toast-mobile': '600px'
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
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
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
        // Новая анимация: сильная пульсация для кнопки сохранения
        'pulse-strong': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.7)' // orange-500
          },
          '50%': {
            opacity: '0.85',
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 15px rgba(249, 115, 22, 0)'
          }
        },
        // Дополнительная анимация: волна (альтернативный эффект)
        'pulse-wave': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.7)'
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(249, 115, 22, 0)'
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(249, 115, 22, 0)'
          }
        },
        // Дополнительная анимация: мягкое свечение
        'glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(249, 115, 22, 0.8)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // Сильная пульсация (основная для кнопки сохранения)
        'pulse-strong': 'pulse-strong 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Волновой эффект (альтернатива)
        'pulse-wave': 'pulse-wave 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Мягкое свечение (можно комбинировать)
        'glow': 'glow 2s ease-in-out infinite'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
