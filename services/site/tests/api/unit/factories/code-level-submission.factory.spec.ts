/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { CODE_LEVEL_SUBMISSION, CodeLevelSubmissionData, Factory } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

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
