import { useDatabase } from "@a11y-challenges/prisma";
import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { SubmissionService } from "../../src/submission/submission.service";

describe("submission service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can save a submission to a given level", async () => {
    const html = "<div>good morning :)</div>";

    const prisma = getPrismaService();
    const service = new SubmissionService(prisma);

    const { id: challengeId } = await prisma.challenge.create({
      data: {
        name: "submission service test",
      },
    });

    const { id: levelId } = await prisma.level.create({
      data: {
        instructions: "testing the submission service",
        tldr: "testing stuff",
        challengeId,
      },
    });

    const createdSub = await service.save({
      levelId,
      html,
      css: null,
      js: null,
    });

    expect(createdSub).toBeTruthy();
    expect(createdSub.html).toBe(html);

    const queriedSub = await prisma.submission.findUnique({
      where: {
        id: createdSub.id,
      },
    });

    expect(queriedSub).toBeTruthy();
    expect(queriedSub.html).toBe(html);
  });

  it("throws error if no level is found for id", () => {
    const prisma = getPrismaService();
    const service = new SubmissionService(prisma);

    expect(async () =>
      service.save({
        levelId: "badId",
      }),
    ).rejects.toBeTruthy();
  });
});
