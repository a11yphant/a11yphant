import { render, screen } from "@testing-library/react";
import TopChallenge from "app/components/homepage/TopChallenge";
import { ChallengeDifficulty, ChallengeStatus } from "app/generated/graphql";
import React from "react";

const challenge = {
  id: "28a5117b-84d7-43d7-a5fb-58b4db507e0a",
  slug: "semantic-html",
  name: "Semantic HTML",
  status: ChallengeStatus.Open,
  difficulty: ChallengeDifficulty.Easy,
  numberOfLevels: 2,
  numberOfFinishedLevels: 0,
  isMobileFriendly: false,
};

describe("Top Challenge", () => {
  it("renders times completed", () => {
    render(<TopChallenge challenge={challenge} timesCompleted="1500" />);

    expect(screen.getByText("1500+ times completed", { selector: "p" })).toBeInTheDocument();
  });
});
