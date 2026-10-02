/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#E8531A',
          'orange-light': '#F97316',
          'orange-dark': '#C2410C',
          green: '#16A34A',
          'green-dark': '#15803D',
          plum: '#7E22CE',
          cream: '#FFFBF5',
          'cream-dark': '#FEF3C7',
          charcoal: '#1C1917',
          muted: '#78716C',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['DM Serif Display', 'serif'],
      },
    },
  },
  plugins: [],
}
