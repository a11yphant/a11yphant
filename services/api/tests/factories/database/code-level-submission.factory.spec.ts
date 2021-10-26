import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { CODE_LEVEL_SUBMISSION } from "./constants";
import { Factory } from "./factory";
import { CodeLevelSubmissionData } from "./types";

describe("code level submission factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a rule record with default options", async () => {
    const prisma = getPrismaService();

    const submission = await prisma.codeLevelSubmission.create({
      data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION),
    });

    expect(submission).toBeTruthy();
  });
});
