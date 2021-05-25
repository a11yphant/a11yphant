module.exports = {
  purge: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        modal: "0px 24px 38px rgba(0, 0, 0, 0.14), 0px 0px 46px rgba(0, 0, 0, 0.12), 0px 0px 15px rgba(0, 0, 0, 0.2)",
      },
      spacing: {
        inherit: "inherit",
        screenHalf: "50vh",
        navigation: "8%",
        main: "92%",
        sidebar: "28%",
        "18/20": "90%",
        fitContent: "fit-content",
      },
      maxWidth: {
        "80ch": "80ch",
      },
      colors: {
        primary: "#7331FF",
        primaryLight: "#B795FF",
        primaryDark: "#6657C5",
        error: "#E75A7C",
        background: "#121212",
        backgroundMiddle: "#1C1C1C",
        grey: "#EDEDED",
        greyLight: "#EFEFEF",
        greyMiddle: "#B4B8B8",
        greyDark: "#4F4F4F",
        light: "#FFFFFF",
        dark: "#121212",
      },
      fontFamily: {
        ibmPlex: ["IBM Plex Sans", "sans-serif"],
        ibmPlexMono: ["IBM Plex Mono", "sans-serif"],
      },
      transitionProperty: {
        width: "width",
        display: "display",
      },
      backgroundImage: (theme) => ({
        "gradient-easy": "url('/images/01_easy.jpg')",
        "gradient-medium": "url('/images/02_medium.jpg')",
        "gradient-hard": "url('/images/03_hard.jpg')",
      }),
    },
  },
  variants: {
    extend: {
      textColor: ["group-focus"],
    },
  },
  plugins: [],
};
