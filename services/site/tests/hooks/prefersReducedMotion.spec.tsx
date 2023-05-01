import { renderHook } from "@testing-library/react";
import { usePrefersReducedMotion } from "app/hooks/prefersReducedMotion";

jest.unmock("app/hooks/prefersReducedMotion");

const mockMatchMedia = (matches: boolean): void => {
  // against Type Error "window.matchMedia is not a function"
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe("prefersReducedMotion", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // If the site is rendered on the server, the default value "true" should be returned
  // That's because before we know if the user prefers reduced motion, we don't want to render any animations per default
  it("returns true during SSR", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBeTruthy();
  });

  it("returns true if prefers-reduced-motion is activated", async () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBeTruthy();
  });

  it("returns false if prefers-reduced-motion is not activated", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBeFalsy();
  });
});
