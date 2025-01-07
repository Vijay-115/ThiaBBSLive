/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        logoPrimary: '#dc2043',
        primary: '#dc2043',
        secondary: '#002f4b',
        tertiary: '#0da89c',
        logoSecondary: '#0da89c',
      },
      borderColor: theme => ({
        ...theme('colors'),
        logoPrimary: theme('colors.logoPrimary'),
        primary: theme('colors.primary'),
        secondary: theme('colors.secondary'),
        tertiary: theme('colors.tertiary'),
        logoSecondary: theme('colors.logoSecondary'),
      }),
      textColor: theme => ({
        ...theme('colors'),
        logoPrimary: theme('colors.logoPrimary'),
        primary: theme('colors.primary'),
        secondary: theme('colors.secondary'),
        tertiary: theme('colors.tertiary'),
        logoSecondary: theme('colors.logoSecondary'),
      }),
    },
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