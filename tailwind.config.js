/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-accent": "#007bff",
        "purple-accent": "#007bff",
      },
    },
  },
  plugins: [],
};
