/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  
    "./pages/**/*.{js,ts,jsx,tsx}", 
    "./components/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        ibm: ["IBM Plex Sans", "sans-serif"],
      },
      colors: {
        preto: "#14181C",
        azul: "#40BCF4",
        verde: "#00E054",
        laranja: "#FF8000",
        branco: "#ebeef0",
        cinza: "#99AABB",
        cinzaescuro: "#445566"
      },
    },
  },
  plugins: [],
};

