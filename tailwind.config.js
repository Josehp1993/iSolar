/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1b3d6f',
        'navy-dark': '#142d52',
        'navy-light': '#2a5a9e',
        solar: '#2E8B3E',
        'solar-dark': '#1e6b2e',
        'solar-light': '#4CAF50',
        accent: '#3a7cc0',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
