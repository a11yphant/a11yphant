import { cleanup } from "@testing-library/react-hooks";

jest.unmock("app/hooks/prefersReducedMotion");

afterEach(cleanup);

describe("preferrsReducedMotion", () => {
  // against Type Error "window.matchMedia is not a function"
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("user does not preferr reduced motion", async () => {
    return;
  });

  it.todo("returns true during SSR");

  it.todo("returns true on the client initially");

  it.todo("returns true if prefers-reduced-motion is activated");

  it.todo("returns false if prefers-reduced-motion is not activated");
});
