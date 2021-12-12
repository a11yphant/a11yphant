import { cleanup } from "@testing-library/react";
import Button from "app/components/buttons/Button";
import HintBox from "app/components/challenge/sidebar/HintBox";
import Chevron from "app/components/icons/Chevron";
import { mount } from "enzyme";
import React from "react";

afterEach(cleanup);

const hints = [
  {
    id: "e6048f13-1801-484c-a5a8-83db763896d4",
    text: "Mock Hint 1",
  },
  {
    id: "54a0b53c-cfad-4b88-9f49-50edf065d6f9",
    text: "Mock Hint 2",
  },
];

describe("HintBox", () => {
  it("renders closed hint box", () => {
    const wrapper = mount(<HintBox hints={hints} />);

    expect(wrapper.find("h4").text()).toContain("Stuck? Click to reveal a hint");
    expect(wrapper.find(Chevron).props().style.transform).toContain("rotate(180deg)");

    expect(wrapper.exists("ol")).toBeFalsy();
  });

  it("renders open HintBox after click", () => {
    const wrapper = mount(<HintBox hints={hints} />);

    wrapper.find(Button).simulate("click");

    // show one hint in a list after click
    expect(wrapper.exists("ol")).toBeTruthy();
    expect(wrapper.exists("li")).toBeTruthy();
    expect(wrapper.find("li").text()).toBe(hints[0].text);
    // switch heading text to "Hint"
    expect(wrapper.find("h4").text()).toContain("Hint");
    // show "Show me another hint" button since there are two mocked hints
    expect(wrapper.findWhere((n) => n.type() === Button && n.text().includes("Show me another hint")).length).toBe(1);

    // Spring Animation is not executed in test and I haven't (yet) found a solution
    // expect(wrapper.find(Chevron).props().style.transform).toContain("rotate(0deg)");
  });

  it("renders another hint in open HintBox after click", () => {
    const wrapper = mount(<HintBox hints={hints} />);

    wrapper.find("h4").children(Button).simulate("click");

    wrapper.findWhere((n) => n.type() === Button && n.text().includes("Show me another hint")).simulate("click");

    // show 2 li tags after clicking "Show me another hint"
    expect(wrapper.find("li").length).toBe(2);
    expect(wrapper.find("li").first().text()).toBe(hints[0].text);
    expect(wrapper.find("li").last().text()).toBe(hints[1].text);
    // Since there are two mocked hints, the "Show me another hint" button disappears once both hints are shown
    expect(wrapper.findWhere((n) => n.type() === Button && n.text().includes("Show me another hint")).length).toBe(0);
  });
});
