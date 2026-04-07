/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        border: 'rgba(93, 112, 127, 0.25)',
        foreground: { DEFAULT: '#ecebf3' },
        'muted-foreground': '#9ca8b8',
        background: '#0f1117',
        primary: '#f97316',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
