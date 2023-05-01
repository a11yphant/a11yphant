import React from "react";

// https://www.joshwcomeau.com/react/prefers-reduced-motion/
const QUERY = "(prefers-reduced-motion: no-preference)";

function supportsMatchMedia(): boolean {
  return window && "matchMedia" in window;
}

export function usePrefersReducedMotion(): boolean {
  // Default no-animations, since we don't know what the user's preference is on the server
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(true);

  React.useEffect(() => {
    if (!supportsMatchMedia()) {
      return;
    }

    const mediaQueryList = window.matchMedia(QUERY);

    // Set the true initial value, now that we're on the client:
    setPrefersReducedMotion(!window.matchMedia(QUERY).matches);

    const listener = (event: MediaQueryListEvent): void => {
      setPrefersReducedMotion(!event.matches);
    };

    mediaQueryList.addEventListener("change", listener);

    return () => {
      if (!supportsMatchMedia()) {
        return;
      }
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);

  return prefersReducedMotion;
}
