import { render } from "@testing-library/react";
import { FlashMessageContextProvider } from "app/components/common/flashMessage/FlashMessageContext";
import { FlashMessagePortalRoot } from "app/components/common/flashMessage/FlashMessagePortalRoot";
import React from "react";

afterEach(() => {
  jest.resetAllMocks();
});

describe("FlashMessagePortalRoot", () => {
  it("renders sets the ref for the portal root", () => {
    jest.spyOn(React, "useRef");

    render(
      <>
        <FlashMessagePortalRoot />
      </>,
      { wrapper: FlashMessageContextProvider },
    );

    expect(React.useRef).toHaveBeenCalled();
  });
});
