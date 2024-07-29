/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blackBackground: {
          DEFAULT: '#000000',
          primaryButton: '#69B6D7',
          primaryButtonText: '#69B6D7',
          secondaryButton: '#95B1BE',
          secondaryButtonText: '#95B1BE',
        },
        lightBackground: {
          DEFAULT: '#DEDEDE',
          primaryButton: '#232CBE',
          primaryButtonText: '#EDEFF2',
          secondaryButton: '#33365A',
          secondaryButtonText: '#EDEFF2',
        },
      },
    },
  },
  plugins: [],
}

