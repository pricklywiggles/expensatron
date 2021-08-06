const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: [
    './src/pages/*.{js,jsx,ts,tsx}',
    './src/components/*.{js,jsx,ts,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Wotfard', ...defaultTheme.fontFamily.sans]
    },
    extend: {
      colors: {
        cyan: colors.cyan,
        gray: colors.coolGray,
        blue: colors.blue
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
};
