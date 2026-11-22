/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blood: {
          50: '#FDF5F5',
          100: '#FAE8E9',
          200: '#F6D5D8',
          300: '#EDB4B9',
          400: '#E08691',
          500: '#CF5967',
          600: '#B63344',
          700: '#992233',
          800: '#841725', // Primary brand crimson matching the reference image
          900: '#6E131E', // Deep maroon
          950: '#47080F', // Top announcement strip
        },
        surface: {
          50: '#FCF9F9',
          100: '#F9F4F4',
          200: '#F3E8E9',
          300: '#E9D6D8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(132, 23, 37, 0.08)',
        'card': '0 6px 24px -4px rgba(0, 0, 0, 0.06), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'maroon': '0 8px 24px -4px rgba(132, 23, 37, 0.35)',
      }
    },
  },
  plugins: [],
}
