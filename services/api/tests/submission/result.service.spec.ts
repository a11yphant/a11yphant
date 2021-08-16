import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CHECK_RESULT, RESULT, ResultData } from "@tests/factories/database";
import { Factory } from "@tests/factories/database";
import { useDatabase } from "@tests/helpers";

import { ResultStatus } from "@/submission/models/result-status.enum";
import { ResultService } from "@/submission/result.service";

describe("result service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("returns the result for a submission", async () => {
    const prisma = getPrismaService();

    const expectedResult = await prisma.result.create({ data: Factory.build<ResultData>(RESULT), include: { submission: true } });

    const resultService = new ResultService(prisma);

    const foundResult = await resultService.findOneForSubmission(expectedResult.submission.id);

    expect(foundResult).toBeTruthy();
    expect(foundResult.id).toEqual(expectedResult.id);
  });

  it("returns the number of failed requirements for the result", async () => {
    const prisma = getPrismaService();

    const result = await prisma.result.create({
      data: {
        ...Factory.build<ResultData>(RESULT, { status: ResultStatus.SUCCESS }),
        checkResults: {
          create: Factory.buildList<Prisma.CheckResultCreateWithoutResultInput>(
            CHECK_RESULT,
            2,
            { status: ResultStatus.FAIL },
            { createResultIfMissing: false },
          ),
        },
      },
    });

    await prisma.result.create({
      data: Factory.build<ResultData>(RESULT, { status: ResultStatus.SUCCESS }, { numberOfCheckResults: 2 }),
    });

    const resultService = new ResultService(prisma);

    expect(await resultService.countNumberOfFailedRequirementChecks(result.id)).toBe(2);
  });

  it("returns the number of requirement checks for the result", async () => {
    const prisma = getPrismaService();

    const result = await prisma.result.create({
      data: Factory.build<ResultData>(RESULT, { status: ResultStatus.SUCCESS }, { numberOfCheckResults: 2 }),
    });
    await prisma.result.create({
      data: Factory.build<ResultData>(RESULT, { status: ResultStatus.SUCCESS }, { numberOfCheckResults: 2 }),
    });

    const resultService = new ResultService(prisma);

    expect(await resultService.countNumberOfCheckedRequirements(result.id)).toBe(2);
  });

  it("can update the status of a result", async () => {
    const prisma = getPrismaService();
    const result = await prisma.result.create({ data: Factory.build<ResultData>(RESULT, { status: ResultStatus.SUCCESS }) });

    const resultService = new ResultService(prisma);

    expect(
      await resultService.update(result.id, {
        status: ResultStatus.SUCCESS,
      }),
    ).toHaveProperty("status", ResultStatus.SUCCESS);
  });
});
