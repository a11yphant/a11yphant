import { renderHook } from "@testing-library/react";
import { useSessionState } from "app/hooks/sessionState/useSessionState";

describe("useSessionState", () => {
  const mockKey = "key";

  beforeEach(() => {
    sessionStorage.clear();
  });

  it("initially sets state to initial value", () => {
    const initialValue = "abc";

    const { result } = renderHook(() => useSessionState(mockKey, initialValue));

    expect(result.current[0]).toBe(initialValue);
  });

  it("saves string state to sessionStorage", () => {
    const initialValue = "abc";

    renderHook(() => useSessionState(mockKey, initialValue));

    expect(JSON.parse(sessionStorage.getItem(mockKey))).toBe(initialValue);
  });

  it("reads string state from sessionStorage", () => {
    const initialValue = "abc";
    const value = "mock-value";
    sessionStorage.setItem(mockKey, JSON.stringify(value));

    const { result } = renderHook(() => useSessionState(mockKey, initialValue));

    expect(result.current[0]).toBe(value);
  });

  it("saves object state to sessionStorage", () => {
    const initialValue = {
      a: "a",
      b: "b",
    };

    renderHook(() => useSessionState(mockKey, initialValue));

    expect(JSON.parse(sessionStorage.getItem(mockKey))).toEqual(initialValue);
  });

  it("reads object state from sessionStorage", () => {
    const value = {
      a: "a",
      b: "b",
    };
    sessionStorage.setItem(mockKey, JSON.stringify(value));

    const { result } = renderHook(() => useSessionState(mockKey));

    expect(result.current[0]).toEqual(value);
  });
});
