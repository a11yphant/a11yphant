import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import ButtonLoading from "app/components/buttons/ButtonLoading";
import QuizLevel from "app/components/challenge/level/QuizLevel";
import SingleAnswer from "app/components/challenge/quiz/SingleAnswer";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

const mockHeading = "Quiz";
const mockText = "What is the purpose of the head tag?";
const mockAnswers = [
  {
    id: "1",
    text: "This tag does not exist in the HTML specification.",
  },
  {
    id: "2",
    text: "It contains meta information regarding the page, for example the title.",
  },
  {
    id: "3",
    text: "It contains the content of the page.",
  },
  {
    id: "4",
    text: "This tag should contain the website's logo.",
  },
];

describe("Quiz Level", () => {
  it("renders wrapper elements", () => {
    const wrapper = shallow(<QuizLevel question={mockText} answers={mockAnswers} />);

    expect(wrapper.find("section").length).toBe(1);
  });

  it("renders heading", () => {
    const wrapper = shallow(<QuizLevel question={mockText} answers={mockAnswers} />);

    expect(wrapper.find("h2").length).toBe(1);
    expect(wrapper.find("h2").text()).toBe(mockHeading);
  });

  it("renders question as html", () => {
    const wrapper = shallow(<QuizLevel question={mockText} answers={mockAnswers} />);

    expect(wrapper.find("h3").html()).toContain(mockText);
  });

  it("renders answers", () => {
    const wrapper = shallow(<QuizLevel question={mockText} answers={mockAnswers} />);

    expect(wrapper.find(SingleAnswer).length).toBe(1);
  });

  it("renders button", () => {
    const wrapper = shallow(<QuizLevel question={mockText} answers={mockAnswers} />);

    expect(wrapper.find(ButtonLoading).length).toBe(1);
  });
});
