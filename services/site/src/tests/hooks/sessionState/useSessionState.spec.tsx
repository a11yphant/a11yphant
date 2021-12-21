import { renderHook } from "@testing-library/react-hooks";
import useSessionState from "app/hooks/sessionState/useSessionState";

describe("useSessionState", () => {
  const mockKey = "key";

  it("initially sets state to initial value", () => {
    const initialValue = "abc";

    const { result } = renderHook(() => useSessionState(mockKey, initialValue));

    expect(result.current[0]).toBe(initialValue);
  });

  it("saves state to sessionStorage", () => {
    const initialValue = "abc";

    renderHook(() => useSessionState(mockKey, initialValue));

    expect(JSON.parse(sessionStorage.getItem(mockKey))).toBe(initialValue);
  });

  it("reads state from sessionStorage", () => {
    const initialValue = "abc";
    const value = "mock-value";
    sessionStorage.setItem(mockKey, JSON.stringify(value));

    const { result } = renderHook(() => useSessionState(mockKey, initialValue));

    expect(result.current[0]).toBe(value);
  });

  it.todo("initialValue is a function");
  it.todo("remove item");
  it.todo("works for object, integer and string");
});
