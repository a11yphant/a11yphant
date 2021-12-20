import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";
import ChallengeList from "app/components/homepage/ChallengeList";
import { ChallengeDifficulty, ChallengeStatus } from "app/generated/graphql";

const headingText = "Easy";

const challenges = [
  {
    id: "28a5117b-84d7-43d7-a5fb-58b4db507e0a",
    slug: "semantic-html",
    name: "Semantic HTML",
    difficulty: ChallengeDifficulty.Easy,
    numberOfLevels: 2,
    numberOfFinishedLevels: 0,
    status: ChallengeStatus.Finished,
  },
];

describe("ChallengeList", () => {
  it("renders the heading and description text", () => {
    render(
      <ChallengeList
        heading={
          <>
            Easy
            <div className="w-3 h-5 border-2 rounded border-primary bg-primary ml-4" />
            <div className="w-3 h-5 border-2 rounded border-primary bg-white ml-1" />
            <div className="w-3 h-5 border-2 rounded border-primary bg-white ml-1" />
          </>
        }
        challenges={challenges}
      />,
    );

    expect(screen.getByText(headingText, { selector: "h3" })).toBeInTheDocument();
    expect(screen.getByText("(1/1)", { selector: "p" })).toBeInTheDocument();
  });
});
