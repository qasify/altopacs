/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        current: "currentColor",
        transparent: "transparent",
        white: "#ffffff",
        black: "#000000",
  
        background: {
          dark: "#15191C",
          light: "#F4F4F4",
          "white-transparent": "rgba(255, 255, 255, 0)",
        },
  
        hover: {
          dark: "#363232",
          light: "#F4F4F4",
        },
  
        border: {
          light: "rgba(0, 0, 0, 0.1)",
          dark: "rgba(255, 255, 255, 0.1)",
        },
  
        error: "#fc2c03",
  
        primary: {
          light: "#00C853",
        },
  
        text: {
          light: "#444444",
          dark: "#CECECE",
          active: '#8241F3',
        },
      },
    },
  },
  plugins: [],
}

