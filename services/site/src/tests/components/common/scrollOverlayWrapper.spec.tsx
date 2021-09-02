import { cleanup } from "@testing-library/react";
import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return;
  },
}));

describe("Scroll Overlay Wrapper", () => {
  it("renders Wrapper div", () => {
    const wrapper = shallow(<ScrollOverlayWrapper />);

    expect(wrapper.find("div")).toBeTruthy();
  });

  //   TODO: write more tests when you know how to
  //   it("renders both overlays", () => {
  //     const wrapper = mount(<ScrollOverlayWrapper />);
  //     expect(wrapper.find("div.custom-overlay").length).toBe(2);
  //   });

  //   it("renders only top overlay", () => {
  //     const wrapper = shallow(<ScrollOverlayWrapper displayBottom={false} />);
  //     expect(wrapper.find("div.custom-overlay").length).toBe(1);
  //   });

  //   it("renders only bottom overlay", async () => {
  //     const wrapper = mount(<ScrollOverlayWrapper displayTop={false} />);

  //     jest.spyOn(wrapper.getDOMNode(), "scrollHeight", "get").mockImplementation(() => 100);

  //     await act(async () => {
  //       wrapper.update();
  //     });
  //     // wrapper.find("div").first().getDOMNode().scrollHeight = 100;

  //     expect(wrapper.find(".custom-overlay").length).toBe(1);
  //   });

  it("renders no overlay", () => {
    const wrapper = shallow(<ScrollOverlayWrapper displayTop={false} displayBottom={false} />);
    expect(wrapper.find("div.custom-overlay").length).toBe(0);
  });
});
