import { createMock } from "@golevelup/ts-jest";

import { HintService } from "../../src/challenge/hint.service";
import { LevelResolver } from "../../src/challenge/level.resolver";
import { LevelService } from "../../src/challenge/level.service";
import { Hint } from "../../src/challenge/models/hint.model";
import { Level } from "../../src/challenge/models/level.model";
import { Requirement } from "../../src/challenge/models/requirement.model";
import { Resource } from "../../src/challenge/models/resource.model";
import { RequirementService } from "../../src/challenge/requirement.service";
import { ResourceService } from "../../src/challenge/resource.service";

describe("level resolver", () => {
  it("resolves a level by challenge slug and index", async () => {
    const findOneForChallengeAtIndex = jest.fn().mockResolvedValue(new Level({ id: "second-id", tldr: "hi", instructions: "difficult", order: 0 }));
    const resolver = new LevelResolver(
      createMock<LevelService>({
        findOneForChallengeAtIndex,
      }),
      createMock<RequirementService>(),
      createMock<HintService>(),
      createMock<ResourceService>(),
    );

    expect(await resolver.levelByChallengeSlug({ challengeSlug: "level", nth: 2 })).toHaveProperty("id", "second-id");
    expect(findOneForChallengeAtIndex).toHaveBeenCalledWith("level", 1);
  });

  it("resolves the requirements for a level", async () => {
    const resolver = new LevelResolver(
      createMock<LevelService>(),
      createMock<RequirementService>({
        findForLevel: jest
          .fn()
          .mockResolvedValue([new Requirement({ id: "uuid-1", title: "Requirement 1" }), new Requirement({ id: "uuid-2", title: "Requirement 2" })]),
      }),
      createMock<HintService>(),
      createMock<ResourceService>(),
    );

    const level = new Level({ id: "uuid", instructions: "instructions", tldr: "tldr", order: 0 });

    expect((await resolver.requirements(level)).length).toEqual(2);
  });

  it("resolves the hints for a level", async () => {
    const resolver = new LevelResolver(
      createMock<LevelService>(),
      createMock<RequirementService>(),
      createMock<HintService>({
        findForLevel: jest.fn().mockResolvedValue([new Hint({ id: "id-0", content: "Hint 1" }), new Hint({ id: "id-4", content: "Hint 2" })]),
      }),
      createMock<ResourceService>(),
    );
    const level = new Level({ id: "uuid", instructions: "instructions", tldr: "tldr", order: 0 });
    level.id = "uuid";

    expect((await resolver.hints(level)).length).toEqual(2);
  });

  it("resolves the resources for a level", async () => {
    const resolver = new LevelResolver(
      createMock<LevelService>(),
      createMock<RequirementService>(),
      createMock<HintService>(),
      createMock<ResourceService>({
        findForLevel: jest
          .fn()
          .mockResolvedValue([
            new Resource({ id: "1", title: "Title 1", link: "Link 1" }),
            new Resource({ id: "2", title: "Title 2", link: "Link 2" }),
          ]),
      }),
    );
    const level = new Level({ id: "uuid", instructions: "instructions", tldr: "tldr", order: 0 });
    level.id = "uuid";

    expect((await resolver.resources(level)).length).toEqual(2);
  });
});
