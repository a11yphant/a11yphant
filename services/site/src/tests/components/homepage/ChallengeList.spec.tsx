import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import ChallengeList from "app/components/homepage/ChallengeList";
import { ChallengeDifficulty } from "app/generated/graphql";

afterEach(cleanup);

const headingText = "Easy";

const challenges = [
  {
    id: "28a5117b-84d7-43d7-a5fb-58b4db507e0a",
    slug: "semantic-html",
    name: "Semantic HTML",
    difficulty: ChallengeDifficulty.Easy,
    levels: [
      {
        id: "f0a71757-3e7d-4a88-988e-17d857e547a1",
      },
      {
        id: "959b4d8f-77bb-4f55-a84d-1765630b0979",
      },
    ],
  },
];

describe("ChallengeList", () => {
  it("renders correctly", () => {
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
        completedLevel={0}
        openLevel={1}
        challenges={challenges}
      />,
    );

    expect(screen.getByText(headingText, { selector: "h3" })).toBeTruthy();
    expect(screen.getByText("(0/1)", { selector: "p" })).toBeTruthy();
  });
});
