/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #a1c4fd 10%, #c2e9fb 90%)',
      },
    },
  },
  plugins: [],
}