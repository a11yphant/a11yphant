import "@testing-library/jest-dom/extend-expect";

import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import Lottie, { LottieProps } from "app/components/Lottie";
import correctAnimation from "app/lotties/correct_lottie.json";
import failAnimation from "app/lotties/fail_lottie.json";
import { shallow } from "enzyme";
import React from "react";

jest.mock("app/components/Lottie", () => (): React.FunctionComponent<LottieProps> => {
  return;
});

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
  it("renders wrapper element with classes", () => {
    const wrapper = shallow(
      <EvaluationHeader challengeName={challengeName} levelIdx={Number(levelIdx)} score={fail.score} passed={fail.passed} className={cl} />,
    );

    expect(wrapper.hasClass(cl)).toBeTruthy();
  });

  it("renders the challengeName, levelIdx and score", () => {
    const wrapper = shallow(<EvaluationHeader challengeName={challengeName} levelIdx={Number(levelIdx)} score={fail.score} passed={fail.passed} />);

    expect(wrapper.text()).toContain(challengeName);
    expect(wrapper.text()).toContain(levelIdx);
    expect(wrapper.text()).toContain(`${fail.score}%`);
  });

  it("renders the Check SVG if the user passed", () => {
    const wrapper = shallow(
      <EvaluationHeader challengeName={challengeName} levelIdx={Number(levelIdx)} score={success.score} passed={success.passed} />,
    );

    expect(wrapper.find(Lottie).length).toBe(1);
    expect(wrapper.find(Lottie).props().options.animationData).toBe(correctAnimation);
  });

  it("renders the X animation if the user failed", () => {
    const wrapper = shallow(<EvaluationHeader challengeName={challengeName} levelIdx={Number(levelIdx)} score={fail.score} passed={fail.passed} />);

    expect(wrapper.find(Lottie).length).toBe(1);
    expect(wrapper.find(Lottie).props().options.animationData).toBe(failAnimation);
  });
});
