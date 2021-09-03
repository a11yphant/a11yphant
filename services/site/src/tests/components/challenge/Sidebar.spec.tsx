import { cleanup } from "@testing-library/react";
import Sidebar from "app/components/challenge/Sidebar";
import HintList from "app/components/challenge/sidebar/HintList";
import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { Level } from "app/generated/graphql";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

const mockChallengeName = "Mock Challenge";

const mockLevel: Pick<Level, "instructions" | "tasks"> = {
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
  it("renders wrapper aside and div", () => {
    const wrapper = shallow(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.find("aside").length).toBe(1);
    expect(wrapper.find(ScrollOverlayWrapper).length).toBe(1);
  });

  it("renders challenge name as heading", () => {
    const wrapper = shallow(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.find("h2").length).toBe(1);
    expect(wrapper.find("h2").text()).toBe(mockChallengeName);
  });

  it("renders instructions heading", () => {
    const wrapper = shallow(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.find("h3").length).toBe(1);
    expect(wrapper.find("h3").text()).toBe("Instructions");
  });

  it("renders instructions as html", () => {
    const wrapper = shallow(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.find("p").html()).toContain(mockLevel.instructions);
  });

  it("renders HintList", () => {
    const wrapper = shallow(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.find(HintList).length).toBe(1);
  });

  it("adds className", () => {
    const mockClassName = "mock-class";
    const wrapper = shallow(<Sidebar className={mockClassName} challengeName={mockChallengeName} level={mockLevel} />);

    expect(wrapper.find("aside").props().className).toContain(mockClassName);
  });
});
