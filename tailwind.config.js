/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0060a8',
          dark: '#004375',
          light: '#e6eff7',
          accent: '#007bd1',
        }
      }
    },
  },
  plugins: [],
}
