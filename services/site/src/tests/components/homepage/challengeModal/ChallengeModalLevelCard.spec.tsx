import { cleanup } from "@testing-library/react";
import { ChallengeModalLevelCard } from "app/components/homepage/challengeModal/ChallengeModalLevelCard";
import Check from "app/components/icons/Check";
import { LevelStatus } from "app/generated/graphql";
import { shallow } from "enzyme";
import Link from "next/link";
import React from "react";

const mockChallengeSlug = "mocked-challenge-slug";
const mockLevelNumber = "03";

afterEach(cleanup);

describe("ChallengeModalLevelCard", () => {
  it("renders heading", () => {
    const wrapper = shallow(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Open}
        isFirstUnfinishedLevel={false}
      />,
    );

    expect(wrapper.find("h3").text()).toBe(`Level ${mockLevelNumber}`);
  });

  it("renders check icon if finished", () => {
    const wrapper = shallow(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Finished}
        isFirstUnfinishedLevel={false}
      />,
    );

    expect(wrapper.exists(Check)).toBeTruthy();
  });

  it("doesn't render check icon if open", () => {
    const wrapper = shallow(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Open}
        isFirstUnfinishedLevel={false}
      />,
    );

    expect(wrapper.exists(Check)).toBeFalsy();
  });

  it("doesn't render check icon if in progress", () => {
    const wrapper = shallow(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.InProgress}
        isFirstUnfinishedLevel={false}
      />,
    );

    expect(wrapper.exists(Check)).toBeFalsy();
  });

  it("has background color primary if is first unfinished level", () => {
    const wrapper = shallow(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Open}
        isFirstUnfinishedLevel={true}
      />,
    );

    expect(wrapper.find("a").hasClass("bg-primary")).toBeTruthy();
  });

  it("hasn't background color primary if is NOT first unfinished level", () => {
    const wrapper = shallow(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Open}
        isFirstUnfinishedLevel={false}
      />,
    );

    expect(wrapper.find("a").hasClass("bg-primary")).toBeFalsy();
  });

  it("links to correct url", () => {
    const wrapper = shallow(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Open}
        isFirstUnfinishedLevel={false}
      />,
    );

    expect(wrapper.find(Link).props().href).toBe(`/challenge/${mockChallengeSlug}/level/${mockLevelNumber}`);
  });
});
