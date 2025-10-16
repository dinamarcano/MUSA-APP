/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 🔥 Aquí le dices a Tailwind dónde buscar clases
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
