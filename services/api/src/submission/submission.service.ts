import { AwsMessagingClient } from "@a11y-challenges/nestjs-aws-messaging";
import { PrismaService, Submission as SubmissionRecord } from "@a11y-challenges/prisma";
import { Inject } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { v4 as uuidv4 } from "uuid";

import { Submission } from "./models/submission.model";
import { SubmissionInput } from "./SubmissionInput";

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService, @Inject(AwsMessagingClient) private clientProxy: ClientProxy) {}

  public async findOne(id: string): Promise<Submission> {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    });

    return submission ? SubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  public async save(input: SubmissionInput): Promise<Submission> {
    const submission = await this.prisma.submission.create({
      data: {
        id: uuidv4(),
        ...input,
      },
    });

    this.clientProxy.emit("submission.created", {
      submission: {
        id: submission.id,
        html: submission.html,
        css: submission.css,
        js: submission.js,
      },
      rules: [
        {
          id: "3d90d8e6-5dce-4684-9aec-f05b6551aa43",
          key: "axe-link-name",
          options: {},
        },
      ],
    });

    return submission ? SubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  static createModelFromDatabaseRecord(record: SubmissionRecord): Submission {
    const submission = new Submission({ id: record.id, html: record.html, css: record.css, js: record.js, levelId: record.levelId });

    return submission;
  }
}
