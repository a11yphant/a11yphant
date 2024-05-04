/* eslint-disable testing-library/no-node-access, testing-library/no-container */

import { render } from "@testing-library/react";
import {
  DifficultyEasy,
  DifficultyHard,
  DifficultyMedium,
  getDifficultyIconByChallengeDifficulty,
} from "app/components/challengePage/difficulties/Difficulties";
import { ChallengeDifficulty } from "app/generated/graphql";
import React from "react";

describe("Difficulties", () => {
  it("renders the difficulty `Easy` correctly", () => {
    const { container } = render(<DifficultyEasy />);

    const spans = container.querySelectorAll("span");
    expect(spans).toHaveLength(4);

    expect(container.querySelectorAll(".bg-grey")).toHaveLength(1);
    expect(spans[1].classList).toContain("bg-grey");
  });

  it("renders the difficulty `Medium` correctly", () => {
    const { container } = render(<DifficultyMedium />);

    const spans = container.querySelectorAll("span");
    expect(spans).toHaveLength(4);

    expect(container.querySelectorAll(".bg-grey")).toHaveLength(2);
    expect(spans[1].classList).toContain("bg-grey");
    expect(spans[2].classList).toContain("bg-grey");
  });

  it("renders the difficulty `Hard` correctly", () => {
    const { container } = render(<DifficultyHard />);

    const spans = container.querySelectorAll("span");
    expect(spans).toHaveLength(4);

    expect(container.querySelectorAll(".bg-grey")).toHaveLength(3);
    expect(spans[1].classList).toContain("bg-grey");
    expect(spans[2].classList).toContain("bg-grey");
    expect(spans[3].classList).toContain("bg-grey");
  });
});

describe("getDifficultyIconByChallengeDifficulty", () => {
  it("renders the `DifficultyEasy` component if the difficulty is easy", () => {
    const DifficultyIcon = getDifficultyIconByChallengeDifficulty(ChallengeDifficulty.Easy);

    expect(DifficultyIcon).toEqual(DifficultyEasy);
  });

  it("renders the `DifficultyMedium` component if the difficulty is medium", () => {
    const DifficultyIcon = getDifficultyIconByChallengeDifficulty(ChallengeDifficulty.Medium);

    expect(DifficultyIcon).toEqual(DifficultyMedium);
  });

  it("renders the `DifficultyHard` component if the difficulty is hard", () => {
    const DifficultyIcon = getDifficultyIconByChallengeDifficulty(ChallengeDifficulty.Hard);

    expect(DifficultyIcon).toEqual(DifficultyHard);
  });
});
