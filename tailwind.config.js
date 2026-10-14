/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B132B',
          navy: '#1C2541',
          blue: '#1E3A8A',
          teal: '#0D9488',
          tealLight: '#14B8A6',
          tealSoft: '#CCFBF1',
          orange: '#F97316',
          orangeSoft: '#FFEDD5',
          gold: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        cardHover: '0 12px 30px -4px rgba(15, 23, 42, 0.14), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
};
