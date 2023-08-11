import { Injectable, Logger } from "@nestjs/common";
import { CodeLevelSubmission as SubmissionRecord, Prisma } from "@prisma/client";

import { RequirementStatus } from "@/challenge/enums/requirement-status.enum";
import { PrismaService } from "@/prisma/prisma.service";

import { SubmissionAlreadyHasCheckResultException } from "../exceptions/submission-already-has-check-result.exception";
import { SubmissionNotFoundException } from "../exceptions/submission-not-found.exception";
import { CodeLevelSubmission } from "../graphql/models/code-level-submission.model";
import { Result } from "../graphql/models/result.model";
import { ResultStatus } from "../graphql/models/result-status.enum";
import { CodeLevelSubmissionCreateData } from "../interfaces/code-level-submission-create-data.interface";
import { CodeLevelSubmissionUpdateData } from "../interfaces/code-level-submission-update-data.interface";
import { RuleCheckResult } from "../interfaces/rule-check-result.interface";
import { CheckSubmissionService } from "./check-submission.service";
import { CodeLevelResultService } from "./code-level-result.service";
import { RequirementResultService } from "./requirement-result.service";

@Injectable()
export class CodeLevelSubmissionService {
  constructor(
    private prisma: PrismaService,
    private submissionChecker: CheckSubmissionService,
    private resultService: CodeLevelResultService,
    private requirementResultService: RequirementResultService,
    private logger: Logger,
  ) {}

  public async findOne(id: string): Promise<CodeLevelSubmission> {
    const submission = await this.prisma.codeLevelSubmission.findUnique({
      where: { id },
    });

    return submission ? CodeLevelSubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  public async findLastForUserAndLevel(userId: string, levelId: string): Promise<CodeLevelSubmission> {
    const submission = await this.prisma.codeLevelSubmission.findFirst({
      where: {
        userId,
        levelId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return submission ? CodeLevelSubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  public async create(data: CodeLevelSubmissionCreateData): Promise<CodeLevelSubmission> {
    const submission = await this.prisma.codeLevelSubmission.create({
      data,
    });

    return submission ? CodeLevelSubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  public async update(data: CodeLevelSubmissionUpdateData): Promise<CodeLevelSubmission> {
    try {
      const submission = await this.prisma.codeLevelSubmission.update({
        where: { id: data.id },
        data,
      });

      return submission ? CodeLevelSubmissionService.createModelFromDatabaseRecord(submission) : null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new SubmissionNotFoundException();
        }
      }
      throw error;
    }
  }

  public async requestCheck(submissionId: string): Promise<Result> {
    if ((await this.prisma.codeLevelResult.count({ where: { submissionId } })) === 1) {
      throw new SubmissionAlreadyHasCheckResultException();
    }

    const { result } = await this.prisma.codeLevelSubmission.update({
      where: { id: submissionId },
      data: {
        result: {
          create: { status: ResultStatus.PENDING },
        },
      },
      include: { result: true },
    });

    const submission = await this.prisma.codeLevelSubmission.findUnique({
      where: { id: submissionId },
      include: { level: { include: { requirements: { include: { rule: true } } } } },
    });

    const { ruleCheckResults } = await this.submissionChecker.check(
      submission,
      submission.level.requirements.map((requirement) => ({
        id: requirement.id,
        key: requirement.rule.key,
        options: requirement.options as Record<string, string>,
      })),
    );

    await this.handleResults(ruleCheckResults, submissionId);

    return result ? CodeLevelResultService.createModelFromRecord(result) : null;
  }

  private async handleResults(results: RuleCheckResult[], submissionId: string): Promise<void> {
    const result = await this.resultService.findOneForSubmission(submissionId);
    await this.resultService.update(result.id, {
      status: this.getSubmissionStatus(results),
    });

    for (const checkResult of results) {
      await this.requirementResultService.create(result.id, checkResult.id, this.getRequirementStatus(checkResult.status));
    }
  }

  private getRequirementStatus(status: string): RequirementStatus {
    switch (status) {
      case "success":
        return RequirementStatus.SUCCESS;
      case "failed":
        return RequirementStatus.FAIL;
      case "error":
        return RequirementStatus.ERROR;
      default:
        this.logger.error(`The result contained the unknown status ${status}`);
        return RequirementStatus.ERROR;
    }
  }

  private getSubmissionStatus(results: RuleCheckResult[]): ResultStatus {
    if (results.filter((result) => this.getRequirementStatus(result.status) === RequirementStatus.FAIL).length > 0) {
      return ResultStatus.FAIL;
    }

    if (results.filter((result) => this.getRequirementStatus(result.status) === RequirementStatus.ERROR).length > 0) {
      return ResultStatus.ERROR;
    }

    return ResultStatus.SUCCESS;
  }

  static createModelFromDatabaseRecord(record: SubmissionRecord): CodeLevelSubmission {
    const submission = new CodeLevelSubmission({ ...record });

    return submission;
  }
}
