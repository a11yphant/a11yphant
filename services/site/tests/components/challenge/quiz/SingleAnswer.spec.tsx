import { render, screen } from "@testing-library/react";
import SingleAnswer, { SingleAnswerProps } from "app/components/challenge/quiz/SingleAnswer";
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
  jest.clearAllMocks();
});

const renderSingleAnswer = (props?: Partial<SingleAnswerProps>): void => {
  render(<SingleAnswer srTitle={mockSRTitle} answers={mockAnswers} {...props} />);
};

describe("SingleAnswer", () => {
  it("renders a group of radio elements", () => {
    renderSingleAnswer();

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders screen reader title", () => {
    renderSingleAnswer({ srTitle: mockSRTitle });

    expect(screen.getByText(mockSRTitle, { selector: ".sr-only" })).toBeInTheDocument();
  });

  it("renders multiple quiz answers", () => {
    renderSingleAnswer({ answers: mockAnswers });

    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });
});
