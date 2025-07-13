/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // or 'class' if you want manual control
  theme: {
    extend: {},
  },
  plugins: [],
}


module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#242424', // Your dark color
        foreground: 'rgba(255, 255, 255, 0.87)', // Your text color
      },
    },
  },
  // ... rest of config
}


