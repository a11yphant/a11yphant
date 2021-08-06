import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import Check from "app/components/icons/Check";
import X from "app/components/icons/X";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

const challengeName = "Test Challenge Name";
const levelIdx = Number(2).toLocaleString("de-AT", {
  minimumIntegerDigits: 2,
  useGrouping: false,
});
const success = {
  score: 100,
  passed: true,
};
const fail = {
  score: 30,
  passed: false,
};
const cl = "test-class";

describe("EvaluationHeader", () => {
  it("renders challengeName, levelIdx and score", () => {
    const wrapper = shallow(<EvaluationHeader challengeName={challengeName} levelIdx={Number(levelIdx)} score={fail.score} passed={fail.passed} />);

    expect(wrapper.text()).toContain(challengeName);
    expect(wrapper.text()).toContain(levelIdx);
    expect(wrapper.text()).toContain(`${fail.score}%`);
  });

  it("renders check on success", () => {
    const wrapper = shallow(
      <EvaluationHeader challengeName={challengeName} levelIdx={Number(levelIdx)} score={success.score} passed={success.passed} />,
    );

    expect(wrapper.exists(Check)).toBeTruthy();
    expect(wrapper.exists(X)).toBeFalsy();
  });

  it("renders X on fail", () => {
    const wrapper = shallow(<EvaluationHeader challengeName={challengeName} levelIdx={Number(levelIdx)} score={fail.score} passed={fail.passed} />);

    expect(wrapper.exists(X)).toBeTruthy();
    expect(wrapper.exists(Check)).toBeFalsy();
  });

  it("className is added", () => {
    const wrapper = shallow(
      <EvaluationHeader challengeName={challengeName} levelIdx={Number(levelIdx)} score={fail.score} passed={fail.passed} className={cl} />,
    );

    expect(wrapper.hasClass(cl)).toBeTruthy();
  });
});
