module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "426px",
        // => @media (min-width: 640px) { ... }
      },
      boxShadow: {
        card: "0 0 1.25rem 0.25rem rgba(0, 0, 0, 0.8)",
        modal: "0px 24px 38px rgba(0, 0, 0, 0.14), 0px 0px 46px rgba(0, 0, 0, 0.12), 0px 0px 15px rgba(0, 0, 0, 0.2)",
      },
      spacing: {
        inherit: "inherit",
        "fit-content": "fit-content",
      },
      maxWidth: {
        "80ch": "80ch",
        "screen-3xl": "1800px",
      },
      minHeight: {
        "4/10": "40%",
      },
      outlineWidth: {
        3: "3px",
      },
      colors: {
        light: "#FFFFFF",
        dark: "#121212",
        error: {
          DEFAULT: "#E75A7C",
          light: "#F094A9",
          dark: "#C41C43",
        },
        success: "#9ADB66",
        primary: {
          DEFAULT: "#7331FF",
          light: "#B795FF",
          dark: "#5719D9",
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
      rotate: {
        "-260": "-260deg",
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
              overflowWrap: "anywhere",
              "&::before": {
                // cannot overwrite the content without important...
                content: "none !important",
              },
              "&::after": {
                content: "none !important",
              },
            },
            a: {
              color: theme("colors.grey.DEFAULT"),
              textDecorationLine: "none",
              borderColor: theme("colors.grey.DEFAULT"),
              fontWeight: theme("fontWeight.normal"),
              "&:hover": {
                color: theme("colors.primary.light"),
                borderColor: theme("colors.transparent"),
              },
              "&:focus": {
                borderRadius: theme("borderRadius.DEFAULT"),
                borderColor: theme("colors.transparent"),
                outlineOffset: theme("outlineOffset.4"),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
