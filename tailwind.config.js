/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "macos-monterey": "url(../public/macos-monterey.jpg)",
      },
    },
  },
  plugins: [],
};
