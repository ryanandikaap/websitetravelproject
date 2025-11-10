// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 🚀 Langkah 2: TERAPKAN FONT
      fontFamily: {
        // 'sans' adalah default untuk body text. Oswald akan digunakan di mana pun 'font-sans' dipanggil.
        sans: ['Oswald', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}