import daisyui
 from "daisyui"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line to include all your component files
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
