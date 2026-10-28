/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Direct theme surfaces and elements
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
        elevated: 'var(--bg-elevated)',
        subtle: 'var(--border-subtle)',
        ink: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        gold: {
          300: '#E4CCA0',
          400: '#D6B97A',
          500: 'var(--gold-accent)',
          600: '#B28E43',
          700: '#8E7032',
        },
        emerald: {
          400: '#34D399',
          500: 'var(--emerald-accent)',
          600: '#059669',
        },
        ruby: {
          400: '#F87171',
          500: 'var(--ruby-accent)',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderColor: {
        subtle: 'var(--border-subtle)',
        card: 'var(--border-card)',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.15)',
        elevated: '0 4px 12px rgba(0, 0, 0, 0.2)',
        dropdown: '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        ticker: 'ticker 45s linear infinite',
      }
    },
  },
  plugins: [],
}
