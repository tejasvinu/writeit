import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // use class for dark mode instead of media
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
          soft: "var(--background-soft)",
          muted: "var(--background-muted)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          muted: "var(--foreground-muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
          subtle: "var(--primary-subtle)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          light: "var(--secondary-light)",
          dark: "var(--secondary-dark)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          subtle: "var(--accent-subtle)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          light: "var(--surface-light)",
          elevated: "var(--surface-elevated)",
        },
        success: {
          DEFAULT: "var(--success)",
          light: "var(--success-light)",
        },
        error: {
          DEFAULT: "var(--error)",
          light: "var(--error-light)",
        },
        input: {
          background: "var(--surface, #f5f5f5)",
          text: "var(--foreground, #333333)",
          border: "var(--surface-light, #e0e0e0)",
          placeholder: "var(--foreground-muted, #888888)",
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        float: 'float 3s ease-in-out infinite',
        'paper-float': 'paperFloat 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'float-delayed': 'floatDelayed 6s ease-in-out infinite',
        'paper-float-slow': 'floatSlow 8s ease-in-out infinite',
        'book-bounce': 'bookBounce 1s ease-in-out infinite',
        'page-turn': 'pageTurn 2s ease-in-out infinite',
        'book-open-left': 'bookOpenLeft 1s ease-out forwards',
        'book-open-right': 'bookOpenRight 1s ease-out forwards',
        'fade-in-delayed': 'fadeInDelayed 1s ease-out forwards',
        'paper-float-reverse': 'paperFloatReverse 5s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        paperFloat: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(0, -5px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.9' },
        },
        bookBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pageTurn: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(-15deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        bookOpenLeft: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-180deg)' },
        },
        bookOpenRight: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        fadeInDelayed: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        paperFloatReverse: {
          '0%, 100%': { transform: 'translateY(0) rotate(3deg)' },
          '50%': { transform: 'translateY(-8px) rotate(6deg)' },
        },
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      perspective: {
        '1000': '1000px',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addBase, theme }) {
      addBase({
        'input, select, textarea': {
          backgroundColor: theme('colors.input.background'),
          color: theme('colors.input.text'),
          borderColor: theme('colors.input.border'),
          '&::placeholder': {
            color: theme('colors.input.placeholder'),
          },
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: '#232323',
            borderColor: '#383838',
          }
        },
      });
    },
    function({ addComponents }) {
      addComponents({
        '.dark-elevated': {
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--secondary)',
          }
        }
      })
    }
  ],
} satisfies Config;
