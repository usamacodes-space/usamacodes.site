/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'rgba(93, 112, 127, 0.25)',
        foreground: { DEFAULT: '#ecebf3' },
        'muted-foreground': '#b5c1d2',
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
