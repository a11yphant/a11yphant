import { render, screen } from "@testing-library/react";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import { RequirementStatus } from "app/generated/graphql";
import React from "react";

const mockRequirements = [
  {
    description: "Mock Description 1",
    id: "558b7e40-0b80-43ac-8dad-b85ab557cd47",
    result: RequirementStatus.Success,
    rule: {
      id: "e21cb632-0edd-4094-aab3-08de5af67696",
      key: "mock-rule-1",
    },
    title: "Mock Title 1",
  },
  {
    description: "Mock Description 2",
    id: "86ddacfc-0a1a-4b3e-af08-00b5c2510070",
    result: RequirementStatus.Fail,
    rule: {
      id: "ef86682e-32a4-47de-9ae6-e4a4e2b360b2",
      key: "mock-rule-2",
    },
    title: "Mock Title 2",
  },
];

describe("EvaluationBody", () => {
  it("renders the list with classes", () => {
    const mockClassName = "mock-classname";
    render(<EvaluationBody className={mockClassName} requirements={mockRequirements} />);

    const lists = screen.getAllByRole("list");

    lists.forEach((list) => {
      expect(list).toHaveClass(mockClassName);
    });
  });

  it("renders two unordered lists containing the failed and successful requirements", () => {
    render(<EvaluationBody requirements={mockRequirements} />);

    expect(screen.getAllByRole("list")).toHaveLength(2);
  });

  it("renders the requirements as bullet points inside a list", () => {
    render(<EvaluationBody requirements={mockRequirements} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });
});
