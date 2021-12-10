/**
 * To fix the warning "useLayoutEffect does nothing on the server"
 * @jest-environment node
 */

import { cleanup } from "@testing-library/react";
import HintBox from "app/components/challenge/sidebar/HintBox";
import HintList from "app/components/challenge/sidebar/HintList";
import { Task } from "app/generated/graphql";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

const mockTasks: Task[] = [
  {
    id: "923438fa-8c5f-4b97-897e-bf906f467c47",
    text: "Mock Task 1",
    hints: [
      {
        id: "e6048f13-1801-484c-a5a8-83db763896d4",
        text: "Mock Hint 1.1",
      },
      {
        id: "54a0b53c-cfad-4b88-9f49-50edf065d6f9",
        text: "Mock Hint 1.2",
      },
    ],
  },
  {
    id: "33d12b2b-300d-4bc7-9ace-e2a597df3d82",
    text: "Mock Task 2",
    hints: [
      {
        id: "6561eb57-39d2-48d2-89b0-cb91dabef391",
        text: "Mock Hint 2.1",
      },
      {
        id: "6b52a40b-6d05-4935-a76c-4e58114a8c80",
        text: "Mock Hint 2.2",
      },
    ],
  },
];

describe("HintList", () => {
  it("renders text and a HintBox when there is only one hint", () => {
    const task = mockTasks[0];
    const wrapper = shallow(<HintList tasks={[task]} />);

    expect(wrapper.exists("ol")).toBeFalsy();
    expect(wrapper.exists("li")).toBeFalsy();
    expect(wrapper.exists("div")).toBeTruthy();
    expect(wrapper.exists(HintBox)).toBeTruthy();
  });

  it("renders text as HTML when there is only one hint", () => {
    const task = mockTasks[0];
    const wrapper = shallow(<HintList tasks={[task]} />);

    expect(wrapper.html()).toContain(task.text);
  });

  it("renders a list of text and HintBoxes when there are multiple hints", () => {
    const wrapper = shallow(<HintList tasks={mockTasks} />);

    expect(wrapper.exists("ol")).toBeTruthy();
    expect(wrapper.find("li").length).toBe(mockTasks.length);
    expect(wrapper.find("li>div").length).toBe(mockTasks.length);
    expect(wrapper.find(HintBox).length).toBe(mockTasks.length);
  });

  it("renders the numbered list as HTML when there are multiple hints", () => {
    const wrapper = shallow(<HintList tasks={mockTasks} />);

    expect(wrapper.find("li").at(0).html()).toContain("1.");
    expect(wrapper.find("li").at(0).html()).toContain(mockTasks[0].text);

    expect(wrapper.find("li").at(1).html()).toContain("2.");
    expect(wrapper.find("li").at(1).html()).toContain(mockTasks[1].text);
  });
});
