module.exports = {
  purge: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        inherit: "inherit",
        screenHalf: "50vh",
        "1/20": "5%",
        "19/20": "95%",
        "18/20": "92.5%",
        fitContent: "fit-content",
      },
      maxWidth: {
        "80ch": "80ch",
      },
      colors: {
        primaryLight: "#9262FA",
        primary: "#7331FF",
        primaryDark: "#5000B7",
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
    extend: {
      textColor: ["group-focus"],
    },
  },
  plugins: [],
};
