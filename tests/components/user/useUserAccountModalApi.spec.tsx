import { act, renderHook } from "@testing-library/react";
import { UserAccountModalProvider } from "app/components/user/UserAccountModalProvider";
import { useUserAccountModalApi } from "app/components/user/useUserAccountModalApi";
import React from "react";

jest.mock("app/components/user/UserAccountModal", () => {
  return () => <></>;
});

describe("useUserAccountModalApi", () => {
  it("throws an error if 'show' is called outside UserAccountModalContext", (done) => {
    const { result } = renderHook(() => useUserAccountModalApi());

    expect(result.current.show).toBeTruthy();
    try {
      result.current.show("signup");
      done("should throw error");
    } catch (err) {
      expect(err.message).toBe("userAccountModalApi.show is used outside of UserAccountModalProvider");
      done();
    }
  });

  it("does not throw errors if used inside UserAccountModalContext", (done) => {
    const wrapper = ({ children }): React.ReactElement => <UserAccountModalProvider>{children}</UserAccountModalProvider>;
    const { result } = renderHook(() => useUserAccountModalApi(), { wrapper: wrapper });

    expect(result.current.show).toBeTruthy();
    try {
      act(() => {
        result.current.show("signup");
      });
      done();
    } catch (err) {
      done(err);
    }
  });

  it("hide throws error if it is used outside UserAccountModalContext", (done) => {
    const { result } = renderHook(() => useUserAccountModalApi());

    expect(result.current.hide).toBeTruthy();
    try {
      result.current.hide();
      done("should throw error");
    } catch (err) {
      expect(err.message).toBe("userAccountModalApi.hide is used outside of UserAccountModalProvider");
      done();
    }
  });

  it("hide throws no errors if used inside UserAccountModalContext", (done) => {
    const wrapper = ({ children }): React.ReactElement => <UserAccountModalProvider>{children}</UserAccountModalProvider>;
    const { result } = renderHook(() => useUserAccountModalApi(), { wrapper });

    expect(result.current.hide).toBeTruthy();
    try {
      result.current.hide();
      done();
    } catch (err) {
      done(err);
    }
  });
});
