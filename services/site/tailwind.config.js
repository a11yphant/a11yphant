module.exports = {
  mode: "jit",
  purge: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        card: "0 0 1.25rem 0.25rem rgba(0, 0, 0, 0.8)",
        modal: "0px 24px 38px rgba(0, 0, 0, 0.14), 0px 0px 46px rgba(0, 0, 0, 0.12), 0px 0px 15px rgba(0, 0, 0, 0.2)",
      },
      spacing: {
        inherit: "inherit",
        navigation: "8%",
        main: "92%",
        preview: "90%",
        sidebar: "28%",
        "fit-content": "fit-content",
      },
      maxWidth: {
        "80ch": "80ch",
        "screen-3xl": "1800px",
      },
      colors: {
        light: "#FFFFFF",
        dark: "#121212",
        error: "#E75A7C",
        success: "#9ADB66",
        primary: {
          DEFAULT: "#7331FF",
          light: "#B795FF",
          dark: "#6657C5",
        },
        background: {
          DEFAULT: "#121212",
          light: "#202226",
        },
        grey: {
          DEFAULT: "#EDEDED",
          light: "#EFEFEF",
          middle: "#B4B8B8",
          dark: "#4F4F4F",
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.light"),
            code: {
              color: theme("colors.primary.light"),
              fontFamily: theme("fontFamily.mono").join(" "),
              fontSize: "1em",
              "&::before": {
                // cannot overwrite the content without important...
                content: "none !important",
              },
              "&::after": {
                content: "none !important",
              },
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      textColor: ["group-focus"],
      transitionProperty: ["hover", "motion-safe", "motion-reduce"],
      borderWidth: ["first", "last"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
