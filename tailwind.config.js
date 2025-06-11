/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          red: {
            DEFAULT: '#C3393C', // RedDog Red
          },
          navy: {
            light: '#223351',   // RedDog Navy 1
            dark: '#142645',    // RedDog Navy 2
          },
          cream: '#E3DBC2',     // RedDog Cream
          white: '#F6F6F3',     // RedDog White (corrected from your typo: F6F6**SF**3 → F6F6F3)
        },
      },
    },
    plugins: [],
  };
  