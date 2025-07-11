/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#007bff', 
        'primary-dark': '#0056b3',
        secondary: '#3F51B5', 
        'light-bg': '#f9fafb', // Softer light background (Tailwind gray-50)
        'accent-black': '#343a40' 
      },
    },
  },
  plugins: [],
}
