/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "macos-monterey": "url(../public/macos-monterey.jpg)",
      },
    },
  },
  plugins: [],
};
