import React from "react";

const QUERY = "(prefers-reduced-motion: no-preference)";

// https://www.joshwcomeau.com/react/prefers-reduced-motion/
export function usePrefersReducedMotion(): boolean {
  // Default no-animations, since we don't know what the user's preference is on the server
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(true);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);

    console.log(mediaQueryList);
    console.log(`initital: ${prefersReducedMotion}`);

    // Set the true initial value, now that we're on the client:
    setPrefersReducedMotion(!window.matchMedia(QUERY).matches);

    console.log(!window.matchMedia(QUERY).matches);
    console.log(`should be different but is: ${prefersReducedMotion}`);

    // Register our event listener
    const listener = (event): any => {
      setPrefersReducedMotion(!event.matches);
    };

    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);

  return prefersReducedMotion;
}
