/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: [
    './src/pages/*.{js,jsx,ts,tsx}',
    './src/components/*/*.{js,jsx,ts,tsx}',
    './src/components/*.{js,jsx,ts,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Wotfard', ...defaultTheme.fontFamily.sans],
      thin: ['Cassannet']
    },
    extend: {
      colors: {
        cyan: colors.cyan,
        gray: colors.coolGray,
        blue: colors.blue,
        ...colors
      }
    }
  },
  variants: {
    opacity: ({after}) => after(['disabled']),
    backgroundColor: ({after}) => after(['disabled'])
  },
  plugins: [require('@tailwindcss/forms')]
};
