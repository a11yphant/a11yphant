import "@testing-library/jest-dom/extend-expect";

import { RadioGroup } from "@headlessui/react";
import { cleanup } from "@testing-library/react";
import SingleAnswer, { SingleAnswerProps } from "app/components/challenge/quiz/SingleAnswer";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";

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

const mockSRTitle = "Possible answers to the quiz";

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const renderSingleAnswer = (props?: Partial<SingleAnswerProps>): ShallowWrapper => {
  return shallow(<SingleAnswer srTitle={mockSRTitle} answers={mockAnswers} {...props} />);
};

describe("SingleAnswer", () => {
  it("renders correctly", () => {
    const wrapper = renderSingleAnswer();

    expect(wrapper.find(RadioGroup).length).toBe(1);
  });

  it("renders screen reader title", () => {
    const wrapper = renderSingleAnswer({ srTitle: mockSRTitle });

    expect(wrapper.find("label").contains(mockSRTitle));
  });

  it("shows answers", () => {
    const wrapper = renderSingleAnswer({ answers: mockAnswers });

    expect(wrapper.find(RadioGroup.Option).length).toBe(4);
  });
});
