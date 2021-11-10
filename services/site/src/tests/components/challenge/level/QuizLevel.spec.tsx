import "@testing-library/jest-dom/extend-expect";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { cleanup } from "@testing-library/react";
import ButtonLoading from "app/components/buttons/ButtonLoading";
import QuizLevel from "app/components/challenge/level/QuizLevel";
import SingleAnswer from "app/components/challenge/quiz/SingleAnswer";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import Lottie, { LottieProps } from "app/components/Lottie";
import { ResultStatus, SubmitQuizLevelAnswerDocument } from "app/generated/graphql";
import { mount } from "enzyme";
import router from "next/router";
import React from "react";

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("app/components/Lottie", () => (): React.FunctionComponent<LottieProps> => {
  return;
});

afterEach(cleanup);

const mockChallengeSlug = "mock-slug";
const mockNthLevel = 2;
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

const mocks: MockedResponse[] = [
  {
    request: {
      query: SubmitQuizLevelAnswerDocument,
      variables: {
        levelId: "1",
        answers: ["This is an answer id."],
      },
    },
    result: {
      data: {
        result: { id: "1", status: ResultStatus.Success },
      },
    },
  },
];

beforeEach(() => {
  router.query = { challengeSlug: mockChallengeSlug, nthLevel: String(mockNthLevel) };
  router.back = jest.fn();
});

describe("Quiz Level", () => {
  it("renders wrapper elements", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find("section").length).toBe(1);
  });

  it("renders heading", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find("h2").length).toBe(1);
    expect(wrapper.find("h2").text()).toBe(mockHeading);
  });

  it("renders question as html", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find("h3").html()).toContain(mockText);
  });

  it("renders answers", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find(SingleAnswer).length).toBe(1);
  });

  // TODO: add quizStatus
  it("renders fail animation when quiz status is fail", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find(Lottie).length).toBe(0);
    // expect(wrapper.find(Lottie).props().options.animationData).toBe(failAnimation);
  });

  // TODO: add quizStatus
  it("renders success animation when quiz status is success", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find(Lottie).length).toBe(0);
    // expect(wrapper.find(Lottie).props().options.animationData).toBe(correctAnimation);
  });

  it("renders submit button", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find(ButtonLoading).length).toBe(1);
  });

  // TODO: add quizStatus
  it("renders retry / next level button when quiz status is defined", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find(CompleteEvaluationButton).length).toBe(0);
  });
});
