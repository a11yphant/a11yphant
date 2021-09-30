import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import ButtonLoading from "app/components/buttons/ButtonLoading";
import SingleAnswer from "app/components/challenge/quiz/SingleAnswer";
import Quiz from "app/pages/quiz";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

const mockHeading = "Quiz";
const mockText = "What is the purpose of the head tag?";

describe("Quiz Page", () => {
  it("renders wrapper elements", () => {
    const wrapper = shallow(<Quiz />);

    expect(wrapper.find("main").length).toBe(1);
    expect(wrapper.find("section").length).toBe(1);
  });

  it("renders heading", () => {
    const wrapper = shallow(<Quiz />);

    expect(wrapper.find("h2").length).toBe(1);
    expect(wrapper.find("h2").text()).toBe(mockHeading);
  });

  it("renders question", () => {
    const wrapper = shallow(<Quiz />);

    expect(wrapper.find("h3").length).toBe(1);
    expect(wrapper.find("h3").text()).toBe(mockText);
  });

  it("renders answers", () => {
    const wrapper = shallow(<Quiz />);

    expect(wrapper.find(SingleAnswer).length).toBe(1);
  });

  it("renders button", () => {
    const wrapper = shallow(<Quiz />);

    expect(wrapper.find(ButtonLoading).length).toBe(1);
  });
});
