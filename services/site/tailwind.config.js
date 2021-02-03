module.exports = {
  purge: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        inherit: "inherit",
        screenHalf: "50vh",
      },
      colors: {
        primary: "#5000B7",
      },
      fontFamily: {
        ibmPlex: ["IBM Plex Sans", "sans-serif"],
      },
      transitionProperty: {
        width: "width",
        display: "display",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
