import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import { ResultStatus } from "app/generated/graphql";
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
  it("renders the 'Retry' button", async () => {
    render(<CompleteEvaluationButton status={ResultStatus.Fail} isLastLevel={false} />);

    const retryButton = screen.getByRole("button", { name: "Retry" });
    expect(retryButton).toBeInTheDocument();

    await userEvent.click(retryButton);
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("renders the 'Finish Challenge' button", async () => {
    render(<CompleteEvaluationButton status={ResultStatus.Success} isLastLevel={true} />);

    const finishButton = screen.getByRole("button", { name: "Finish Challenge" });
    expect(finishButton).toBeInTheDocument();

    await userEvent.click(finishButton);
    expect(router.asPath).toBe("/challenges");
  });

  it("renders the 'Next Level' button", async () => {
    render(<CompleteEvaluationButton status={ResultStatus.Success} isLastLevel={false} />);

    const finishButton = screen.getByRole("button", { name: "Next Level" });
    expect(finishButton).toBeInTheDocument();

    await userEvent.click(finishButton);
    expect(router.asPath).toBe(`/challenges/${mockChallengeSlug}/level/0${mockNthLevel + 1}`);
  });
});
