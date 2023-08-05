import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CodeLevelSubmission as SubmissionRecord, Prisma } from "@prisma/client";

import { PrismaService } from "@/prisma/prisma.service";

import { SUBMISSIONS_CLIENT } from "../constants";
import { SubmissionAlreadyHasCheckResultException } from "../exceptions/submission-already-has-check-result.exception";
import { SubmissionNotFoundException } from "../exceptions/submission-not-found.exception";
import { CodeLevelSubmission } from "../graphql/models/code-level-submission.model";
import { Result } from "../graphql/models/result.model";
import { ResultStatus } from "../graphql/models/result-status.enum";
import { CodeLevelSubmissionCreateData } from "../interfaces/code-level-submission-create-data.interface";
import { CodeLevelSubmissionUpdateData } from "../interfaces/code-level-submission-update-data.interface";
import { CodeLevelResultService } from "./code-level-result.service";

@Injectable()
export class CodeLevelSubmissionService {
  constructor(
    private prisma: PrismaService,
    @Inject(SUBMISSIONS_CLIENT) private clientProxy: ClientProxy,
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

    this.clientProxy.emit("submission.created", {
      submission: {
        id: submission.id,
        html: submission.html,
        css: submission.css,
        js: submission.js,
      },
      rules: submission.level.requirements.map((requirement) => ({
        id: requirement.id,
        key: requirement.rule.key,
        options: requirement.options,
      })),
    });

    return result ? CodeLevelResultService.createModelFromRecord(result) : null;
  }

  static createModelFromDatabaseRecord(record: SubmissionRecord): CodeLevelSubmission {
    const submission = new CodeLevelSubmission({ ...record });

    return submission;
  }
}
