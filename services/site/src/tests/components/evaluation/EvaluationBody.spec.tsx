import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import CollapsableSection from "app/components/evaluation/CollapsableSection";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import { RequirementStatus } from "app/generated/graphql";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

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
  it("renders ul", () => {
    const wrapper = shallow(<EvaluationBody requirements={mockRequirements} />);

    expect(wrapper.find("ul").length).toBe(1);
  });

  it("renders requirements", () => {
    const wrapper = shallow(<EvaluationBody requirements={mockRequirements} />);

    expect(wrapper.find("li").length).toBe(2);
    expect(wrapper.find(CollapsableSection).length).toBe(2);
  });

  it("adds className", () => {
    const mockClassName = "mock-classname";
    const wrapper = shallow(<EvaluationBody className={mockClassName} requirements={mockRequirements} />);

    expect(wrapper.find("ul").props().className).toContain(mockClassName);
  });
});
