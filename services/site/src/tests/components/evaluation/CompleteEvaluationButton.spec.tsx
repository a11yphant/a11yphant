import "@testing-library/jest-dom/extend-expect";

import ButtonLoading from "app/components/buttons/ButtonLoading";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import { ResultStatus } from "app/generated/graphql";
import { shallow } from "enzyme";
import router from "next/router";
import React from "react";

jest.mock("next/router", () => require("next-router-mock"));

const mockChallengeSlug = "mock-slug";
const mockNthLevel = 2;

beforeEach(() => {
  router.query = { challengeSlug: mockChallengeSlug, nthLevel: String(mockNthLevel) };
  router.back = jest.fn();
});

describe("CompleteEvaluationButton", () => {
  it("renders the 'Retry' button", () => {
    const wrapper = shallow(<CompleteEvaluationButton status={ResultStatus.Fail} isLastLevel={false} />);

    expect(wrapper.exists(ButtonLoading)).toBeTruthy();
    expect(wrapper.find(ButtonLoading).render().text()).toBe("Retry");

    wrapper.find(ButtonLoading).simulate("click");
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("renders the 'Finish Challenge' button", () => {
    const wrapper = shallow(<CompleteEvaluationButton status={ResultStatus.Success} isLastLevel={true} />);

    expect(wrapper.exists(ButtonLoading)).toBeTruthy();
    expect(wrapper.find(ButtonLoading).render().text()).toBe("Finish Challenge");

    wrapper.find(ButtonLoading).simulate("click");
    expect(router.asPath).toBe("/");
  });

  it("renders the 'Next Level' button", () => {
    const wrapper = shallow(<CompleteEvaluationButton status={ResultStatus.Success} isLastLevel={false} />);

    expect(wrapper.exists(ButtonLoading)).toBeTruthy();
    expect(wrapper.find(ButtonLoading).render().text()).toBe("Next Level");

    wrapper.find(ButtonLoading).simulate("click");
    expect(router.asPath).toBe(`/challenge/${mockChallengeSlug}/level/0${mockNthLevel + 1}`);
  });
});
