/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#2B85FF",
        secondary: "#EF863E",
        'dark-background': '#1a202c', // Add your dark background color here
      },
    },
  },
  plugins: [],

  
};
