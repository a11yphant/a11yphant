import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { SubmissionFactory } from "./submission.factory";

describe("submission factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a rule record with default options", async () => {
    const prisma = getPrismaService();

    const submission = await prisma.submission.create({
      data: SubmissionFactory.build(),
    });

    expect(submission).toBeTruthy();
  });
});
