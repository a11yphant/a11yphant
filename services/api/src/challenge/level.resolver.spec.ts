import { createMock } from "@golevelup/ts-jest";

import { HintService } from "./hint.service";
import { LevelResolver } from "./level.resolver";
import { Hint } from "./models/hint.model";
import { Level } from "./models/level.model";
import { Requirement } from "./models/requirement.model";
import { Resource } from "./models/resource.model";
import { RequirementService } from "./requirement.service";
import { ResourceService } from "./resource.service";

describe("level resolver", () => {
  it("resolves the requirements for a level", async () => {
    const resolver = new LevelResolver(
      createMock<RequirementService>({
        findForLevel: jest
          .fn()
          .mockResolvedValue([
            Requirement.fromDatabaseRecord({ id: "uuid-1", title: "Requirement 1", levelId: "uuid-3" }),
            Requirement.fromDatabaseRecord({ id: "uuid-2", title: "Requirement 2", levelId: "uuid-3" }),
          ]),
      }),
      createMock<HintService>(),
      createMock<ResourceService>(),
    );
    const level = new Level();
    level.id = "uuid";

    expect((await resolver.requirements(level)).length).toEqual(2);
  });

  it("resolves the hints for a level", async () => {
    const resolver = new LevelResolver(
      createMock<RequirementService>(),
      createMock<HintService>({
        findForLevel: jest
          .fn()
          .mockResolvedValue([
            Hint.fromDatabaseRecord({ id: "id-0", content: "Hint 1", levelId: "id-1" }),
            Hint.fromDatabaseRecord({ id: "id-4", content: "Hint 2", levelId: "id-2" }),
          ]),
      }),
      createMock<ResourceService>(),
    );
    const level = new Level();
    level.id = "uuid";

    expect((await resolver.hints(level)).length).toEqual(2);
  });

  it("resolves the resources for a level", async () => {
    const resolver = new LevelResolver(
      createMock<RequirementService>(),
      createMock<HintService>(),
      createMock<ResourceService>({
        findForLevel: jest
          .fn()
          .mockResolvedValue([
            Resource.fromDatabaseRecord({ id: "1", title: "Title 1", link: "Link 1", levelId: "0" }),
            Resource.fromDatabaseRecord({ id: "2", title: "Title 2", link: "Link 2", levelId: "0" }),
          ]),
      }),
    );
    const level = new Level();
    level.id = "uuid";

    expect((await resolver.resources(level)).length).toEqual(2);
  });
});
