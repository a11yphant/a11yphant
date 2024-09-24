import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlashMessageContextProvider } from "app/components/common/flashMessage/FlashMessageContext";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import { ResultStatus } from "app/generated/graphql";
import { useParams } from "next/navigation";
import React from "react";

const mockedBack = jest.fn();
const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    back: mockedBack,
    push: mockedPush,
  })),
  useParams: jest.fn(),
}));

const mockChallengeSlug = "mock-slug";
const mockNthLevel = 2;

beforeEach(() => {
  (useParams as jest.Mock).mockImplementation(() => ({ challengeSlug: mockChallengeSlug, nthLevel: String(mockNthLevel) }));
});

describe("CompleteEvaluationButton", () => {
  it("renders the 'Retry' button", async () => {
    render(<CompleteEvaluationButton status={ResultStatus.Fail} isLastLevel={false} />);

    const retryButton = screen.getByRole("button", { name: "Retry" });
    expect(retryButton).toBeInTheDocument();

    await userEvent.click(retryButton);
    expect(mockedBack).toHaveBeenCalledTimes(1);
  });

  it("renders the 'Finish Challenge' button", async () => {
    render(<CompleteEvaluationButton status={ResultStatus.Success} isLastLevel={true} />, { wrapper: FlashMessageContextProvider });

    const finishButton = screen.getByRole("button", { name: "Finish Challenge" });
    expect(finishButton).toBeInTheDocument();

    await userEvent.click(finishButton);
    expect(mockedPush).toHaveBeenCalledWith("/challenges");
  });

  it("renders the 'Next Level' button", async () => {
    render(<CompleteEvaluationButton status={ResultStatus.Success} isLastLevel={false} />);

    const finishButton = screen.getByRole("button", { name: "Next Level" });
    expect(finishButton).toBeInTheDocument();

    await userEvent.click(finishButton);
    expect(mockedPush).toHaveBeenCalledWith(`/challenges/${mockChallengeSlug}/level/0${mockNthLevel + 1}`);
  });
});
