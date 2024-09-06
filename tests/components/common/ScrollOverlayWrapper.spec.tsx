import { render } from "@testing-library/react";
import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import React from "react";

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return;
  },
}));

describe("Scroll Overlay Wrapper", () => {
  it("renders no scroll overlay by default", () => {
    const { container } = render(<ScrollOverlayWrapper />);

    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    expect(container.querySelectorAll("div.scroll-overlay")).toHaveLength(0);
  });

  it.todo("renders both overlays");

  it.todo("renders only top overlay");

  it.todo("renders only bottom overlay");
});
