import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import { LottieProps } from "app/components/Lottie";
import React from "react";

jest.mock("app/components/Lottie", () => (): React.FunctionComponent<LottieProps> => {
  return;
});

const fail = {
  score: 30,
  passed: false,
};

describe("EvaluationHeader", () => {
  it("renders wrapper element with classes", () => {
    const { container } = render(
      <EvaluationHeader challengeName="Name" levelIdx={2} score={fail.score} passed={fail.passed} className={"class-name"} />,
    );

    // eslint-disable-next-line testing-library/prefer-screen-queries, testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector(".class-name")).toBeInTheDocument();
  });

  it("renders the challengeName, levelIdx and score", () => {
    render(<EvaluationHeader challengeName={"Challenge Name"} levelIdx={2} score={fail.score} passed={fail.passed} />);

    expect(screen.getByText(/Challenge Name/)).toBeInTheDocument();
    expect(screen.getByText(/02/)).toBeInTheDocument();
    expect(screen.getByText(`${fail.score}%`)).toBeInTheDocument();
  });
});
