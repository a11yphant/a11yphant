import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { SUBMISSION } from "./constants";
import { Factory } from "./factory";
import { SubmissionData } from "./types";

describe("submission factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a rule record with default options", async () => {
    const prisma = getPrismaService();

    const submission = await prisma.submission.create({
      data: Factory.build<SubmissionData>(SUBMISSION),
    });

    expect(submission).toBeTruthy();
  });
});
