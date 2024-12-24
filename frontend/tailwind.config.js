/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'w-881': '881px',
      'lg': '1024px',
      'w-1125': '1125px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}