import { createMock } from "@golevelup/ts-jest";

import { LevelResolver } from "./level.resolver";
import { Level } from "./models/level.model";
import { Requirement } from "./models/requirement.model";
import { RequirementService } from "./requirement.service";

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
    );
    const level = new Level();
    level.id = "uuid";

    expect((await resolver.requirements(level)).length).toEqual(2);
  });
});
