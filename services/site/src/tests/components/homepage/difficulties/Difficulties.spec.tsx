import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import {
  DifficultyEasy,
  DifficultyHard,
  DifficultyMedium,
  getDifficultyIconByChallengeDifficulty,
} from "app/components/homepage/difficulties/Difficulties";
import { ChallengeDifficulty } from "app/generated/graphql";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

describe("Difficulties", () => {
  it("renders Easy correctly", () => {
    const wrapper = shallow(<DifficultyEasy />);

    expect(wrapper.find("div").length).toBe(3);

    expect(wrapper.find(".bg-grey").length).toBe(1);
    expect(wrapper.find("div").first().hasClass("bg-grey")).toBeTruthy();
  });

  it("renders Medium correctly", () => {
    const wrapper = shallow(<DifficultyMedium />);

    expect(wrapper.find("div").length).toBe(3);

    expect(wrapper.find(".bg-grey").length).toBe(2);
    expect(wrapper.find("div").first().hasClass("bg-grey")).toBeTruthy();
    expect(wrapper.find("div").at(1).hasClass("bg-grey")).toBeTruthy();
  });

  it("renders Hard correctly", () => {
    const wrapper = shallow(<DifficultyHard />);

    expect(wrapper.find("div").length).toBe(3);

    expect(wrapper.find(".bg-grey").length).toBe(3);
    expect(wrapper.find("div").first().hasClass("bg-grey")).toBeTruthy();
    expect(wrapper.find("div").at(1).hasClass("bg-grey")).toBeTruthy();
    expect(wrapper.find("div").at(2).hasClass("bg-grey")).toBeTruthy();
  });
});

describe("getDifficultyIconByChallengeDifficulty", () => {
  it("returns DifficultyEasy component if difficulty is easy", () => {
    const DifficultyIcon = getDifficultyIconByChallengeDifficulty(ChallengeDifficulty.Easy);

    expect(DifficultyIcon).toEqual(DifficultyEasy);
  });

  it("returns DifficultyMedium component if difficulty is medium", () => {
    const DifficultyIcon = getDifficultyIconByChallengeDifficulty(ChallengeDifficulty.Medium);

    expect(DifficultyIcon).toEqual(DifficultyMedium);
  });

  it("returns DifficultyHard component if difficulty is hard", () => {
    const DifficultyIcon = getDifficultyIconByChallengeDifficulty(ChallengeDifficulty.Hard);

    expect(DifficultyIcon).toEqual(DifficultyHard);
  });
});
