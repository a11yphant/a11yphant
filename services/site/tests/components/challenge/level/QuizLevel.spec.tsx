import "@testing-library/jest-dom/extend-expect";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoadingButton from "app/components/buttons/LoadingButton";
import ChallengeCompletedFlashMessage from "app/components/challenge/ChallengeCompletedFlashMessage";
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
  return null;
});

const mockShowFlashMessage = jest.fn();
jest.mock("app/components/common/flashMessage/FlashMessageContext", () => ({
  useFlashMessageApi: () => ({
    show: mockShowFlashMessage,
  }),
}));

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
        input: {
          levelId: "1",
          answers: ["1"],
        },
      },
    },
    result: {
      data: {
        submitQuizLevelAnswer: {
          result: { id: "1", status: ResultStatus.Success },
        },
      },
    },
  },
];

beforeEach(() => {
  jest.resetAllMocks();
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

    expect(wrapper.exists("section")).toBeTruthy();
  });

  it("renders heading", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.exists("h2")).toBeTruthy();
    expect(wrapper.find("h2").text()).toBe(mockHeading);
  });

  it("renders quiz question as html", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find("h3").html()).toContain(mockText);
  });

  it("renders quiz answers", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.exists(SingleAnswer)).toBeTruthy();
  });

  it("renders fail animation when quiz status is fail", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find(Lottie).length).toBe(0);
    // expect(wrapper.find(Lottie).props().options.animationData).toBe(failAnimation);
  });

  it("renders success animation when quiz status is success", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.find(Lottie).length).toBe(0);
    // expect(wrapper.find(Lottie).props().options.animationData).toBe(correctAnimation);
  });

  it("shows the success message on the last level if it was successful", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={true} levelId={"1"} />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByText(mockAnswers[0].text));
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => expect(mockShowFlashMessage).toHaveBeenCalledWith(<ChallengeCompletedFlashMessage />));
  });

  it("renders submit button with loading animation", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.exists(LoadingButton)).toBeTruthy();
  });

  it("renders no retry / next level button if the quiz status is undefined", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(wrapper.exists(CompleteEvaluationButton)).toBeFalsy();
  });
});
