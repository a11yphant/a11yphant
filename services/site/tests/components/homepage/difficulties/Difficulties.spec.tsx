import "@testing-library/jest-dom/extend-expect";

import {
  DifficultyEasy,
  DifficultyHard,
  DifficultyMedium,
  getDifficultyIconByChallengeDifficulty,
} from "app/components/homepage/difficulties/Difficulties";
import { ChallengeDifficulty } from "app/generated/graphql";
import { shallow } from "enzyme";
import React from "react";

describe("Difficulties", () => {
  it("renders the difficulty `Easy` correctly", () => {
    const wrapper = shallow(<DifficultyEasy />);

    expect(wrapper.find("span").length).toBe(3);

    expect(wrapper.find(".bg-grey").length).toBe(1);
    expect(wrapper.find("span").first().hasClass("bg-grey")).toBeTruthy();
  });

  it("renders the difficulty `Medium` correctly", () => {
    const wrapper = shallow(<DifficultyMedium />);

    expect(wrapper.find("span").length).toBe(3);

    expect(wrapper.find(".bg-grey").length).toBe(2);
    expect(wrapper.find("span").first().hasClass("bg-grey")).toBeTruthy();
    expect(wrapper.find("span").at(1).hasClass("bg-grey")).toBeTruthy();
  });

  it("renders the difficulty `Hard` correctly", () => {
    const wrapper = shallow(<DifficultyHard />);

    expect(wrapper.find("span").length).toBe(3);

    expect(wrapper.find(".bg-grey").length).toBe(3);
    expect(wrapper.find("span").first().hasClass("bg-grey")).toBeTruthy();
    expect(wrapper.find("span").at(1).hasClass("bg-grey")).toBeTruthy();
    expect(wrapper.find("span").at(2).hasClass("bg-grey")).toBeTruthy();
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
