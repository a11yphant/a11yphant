import { AwsMessagingClient } from "@a11yphant/nestjs-aws-messaging";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Prisma, Submission as SubmissionRecord } from "@prisma/client";

import { PrismaService } from "@/prisma/prisma.service";

import { SubmissionAlreadyHasCheckResultException } from "../exceptions/submission-already-has-check-result.exception";
import { SubmissionNotFoundException } from "../exceptions/submission-not-found.exception";
import { Result } from "../graphql/models/result.model";
import { ResultStatus } from "../graphql/models/result-status.enum";
import { Submission } from "../graphql/models/submission.model";
import { SubmissionCreateData } from "../interfaces/submission-create-data.interface";
import { SubmissionUpdateData } from "../interfaces/submission-update-data.interface";
import { ResultService } from "./result.service";

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService, @Inject(AwsMessagingClient) private clientProxy: ClientProxy) {}

  public async findOne(id: string): Promise<Submission> {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    });

    return submission ? SubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  public async findLastForUserAndLevel(userId: string, levelId: string): Promise<Submission> {
    const submission = await this.prisma.submission.findFirst({
      where: {
        userId,
        levelId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return submission ? SubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  public async create(data: SubmissionCreateData): Promise<Submission> {
    const submission = await this.prisma.submission.create({
      data,
    });

    return submission ? SubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  public async update(data: SubmissionUpdateData): Promise<Submission> {
    try {
      const submission = await this.prisma.submission.update({
        where: { id: data.id },
        data,
      });

      return submission ? SubmissionService.createModelFromDatabaseRecord(submission) : null;
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
    if ((await this.prisma.result.count({ where: { submissionId } })) === 1) {
      throw new SubmissionAlreadyHasCheckResultException();
    }

    const { result } = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        result: {
          create: { status: ResultStatus.PENDING },
        },
      },
      include: { result: true },
    });

    const submission = await this.prisma.submission.findUnique({
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

    return result ? ResultService.createModelFromRecord(result) : null;
  }

  static createModelFromDatabaseRecord(record: SubmissionRecord): Submission {
    const submission = new Submission({ ...record });

    return submission;
  }
}
