import { AwsMessagingClient } from "@a11yphant/nestjs-aws-messaging";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Submission as SubmissionRecord } from "@prisma/client";

import { PrismaService } from "@/prisma/prisma.service";

import { ResultStatus } from "./models/result-status.enum";
import { Submission } from "./models/submission.model";
import { SubmissionCreateData } from "./submission-create-data.interface";

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService, @Inject(AwsMessagingClient) private clientProxy: ClientProxy) {}

  public async findOne(id: string): Promise<Submission> {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    });

    return submission ? SubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  public async save(input: SubmissionCreateData): Promise<Submission> {
    const submission = await this.prisma.submission.create({
      data: {
        ...input,
        result: { create: { status: ResultStatus.PENDING } },
      },
      include: { level: { include: { requirements: { include: { rule: true } } } } },
    });

    await this.clientProxy
      .emit("submission.created", {
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
      })
      .toPromise();

    return submission ? SubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  static createModelFromDatabaseRecord(record: SubmissionRecord): Submission {
    const submission = new Submission({ id: record.id, html: record.html, css: record.css, js: record.js, levelId: record.levelId });

    return submission;
  }
}
