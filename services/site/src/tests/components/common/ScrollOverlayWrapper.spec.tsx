import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { shallow } from "enzyme";
import React from "react";

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return;
  },
}));

describe("Scroll Overlay Wrapper", () => {
  it("renders wrapper element", () => {
    const wrapper = shallow(<ScrollOverlayWrapper />);

    expect(wrapper.find("div")).toBeTruthy();
  });

  it.todo("renders both overlays");

  it.todo("renders only top overlay");

  it.todo("renders only bottom overlay");

  it("renders no scroll overlay", () => {
    const wrapper = shallow(<ScrollOverlayWrapper enableTopOverlay={false} enableBottomOverlay={false} />);
    expect(wrapper.find("div.scroll-overlay").length).toBe(0);
  });
});
