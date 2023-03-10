/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@navikt/ds-tailwind')],
  content: ['./src/**/*.{js,jsx,ts,tsx}', '/dist/index.html'],
  theme: {
    extend: {},
  },
  plugins: [],
};
