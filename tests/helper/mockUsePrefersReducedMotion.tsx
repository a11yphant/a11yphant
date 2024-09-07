export function mockUsePrefersReducedMotion(): void {
  jest.mock("app/hooks/prefersReducedMotion", () => {
    return {
      usePrefersReducedMotion: () => true,
    };
  });
}
