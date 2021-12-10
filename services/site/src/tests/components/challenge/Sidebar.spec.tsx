/**
 * To fix the warning "useLayoutEffect does nothing on the server"
 * @jest-environment node
 */

import { cleanup } from "@testing-library/react";
import Sidebar from "app/components/challenge/Sidebar";
import HintList from "app/components/challenge/sidebar/HintList";
import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { CodeLevel } from "app/generated/graphql";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

const mockChallengeName = "Mock Challenge";

const mockLevel: Pick<CodeLevel, "instructions" | "tasks"> = {
  instructions: "<h4>Mock Instructions</h4>",
  tasks: [
    {
      id: "158d0b51-dd31-422a-9c52-f6f9e2a74c24",
      text: "Mock Task",
      hints: [
        {
          id: "e3b455de-6165-44d9-92cd-06bd5da0929b",
          text: "Mock Hint Text",
        },
      ],
    },
  ],
};

describe("Sidebar", () => {
  it("renders the wrapper element with classes", () => {
    const mockClassName = "mock-class";
    const wrapper = shallow(<Sidebar className={mockClassName} challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.find("section").props().className).toContain(mockClassName);
  });

  it("renders the scroll overlay", () => {
    const wrapper = shallow(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.exists(ScrollOverlayWrapper)).toBeTruthy();
  });

  it("renders the challenge name as heading", () => {
    const wrapper = shallow(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.exists("h2")).toBeTruthy();
    expect(wrapper.find("h2").text()).toBe(mockChallengeName);
  });

  it("renders a heading for instructions", () => {
    const wrapper = shallow(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.exists("h3")).toBeTruthy();
    expect(wrapper.find("h3").text()).toBe("Instructions");
  });

  it("renders the instructions as HTML", () => {
    const wrapper = shallow(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.html()).toContain(mockLevel.instructions);
  });

  it("renders the `HintList`component", () => {
    const wrapper = shallow(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.exists(HintList)).toBeTruthy();
  });
});
