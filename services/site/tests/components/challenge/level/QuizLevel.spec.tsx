import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChallengeCompletedFlashMessage from "app/components/challenge/ChallengeCompletedFlashMessage";
import QuizLevel from "app/components/challenge/level/QuizLevel";
import { ResultStatus, SubmitQuizLevelAnswerDocument } from "app/generated/graphql";
import router from "next/router";
import React from "react";

jest.mock("next/router", () => require("next-router-mock"));

jest.mock(
  "app/components/Lottie",
  (): React.FunctionComponent => () => {
    return <div data-testid="lottie" />;
  },
);

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

const mockedResponsesForSuccess: MockedResponse[] = [
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

const mockedResponsesForIncorrect: MockedResponse[] = [
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
          result: { id: "1", status: ResultStatus.Fail },
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
  it("renders heading", () => {
    render(
      <MockedProvider mocks={mockedResponsesForSuccess}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(screen.getByRole("heading", { level: 2, name: mockHeading })).toBeInTheDocument();
  });

  it("renders quiz question as html", () => {
    render(
      <MockedProvider mocks={mockedResponsesForSuccess}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(screen.getByRole("heading", { level: 3 }).innerHTML).toContain(mockText);
  });

  it("renders quiz answers", () => {
    render(
      <MockedProvider mocks={mockedResponsesForSuccess}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(screen.getByText(mockAnswers.at(0).text)).toBeInTheDocument();
  });

  it("renders fail animation when quiz status is fail", async () => {
    render(
      <MockedProvider mocks={mockedResponsesForIncorrect}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    await userEvent.click(screen.getByText(mockAnswers[0].text));
    await userEvent.click(screen.getByText("Submit"));
    expect(await screen.findByTestId("lottie")).toBeInTheDocument();
  });

  it("renders success animation when quiz status is success", async () => {
    render(
      <MockedProvider mocks={mockedResponsesForSuccess}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    await userEvent.click(screen.getByText(mockAnswers[0].text));
    await userEvent.click(screen.getByText("Submit"));
    expect(await screen.findByTestId("lottie")).toBeInTheDocument();
  });

  it("shows the success message on the last level if it was successful", async () => {
    render(
      <MockedProvider mocks={mockedResponsesForSuccess}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={true} levelId={"1"} />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByText(mockAnswers[0].text));
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => expect(mockShowFlashMessage).toHaveBeenCalledWith(<ChallengeCompletedFlashMessage />));
  });

  it("renders submit button", () => {
    render(
      <MockedProvider mocks={mockedResponsesForSuccess}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("renders no retry / next level button if the quiz status is undefined", () => {
    render(
      <MockedProvider mocks={mockedResponsesForSuccess}>
        <QuizLevel question={mockText} answers={mockAnswers} isLastLevel={false} levelId={"1"} />
      </MockedProvider>,
    );

    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next Level" })).not.toBeInTheDocument();
  });
});
