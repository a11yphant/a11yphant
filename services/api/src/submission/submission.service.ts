import { PrismaService, Submission as SubmissionRecord } from "@a11y-challenges/prisma";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

import { Submission } from "./models/submission.model";
import { SubmissionInput } from "./SubmissionInput";

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

  public async save(input: SubmissionInput): Promise<Submission> {
    const submission = await this.prisma.submission.create({
      data: {
        id: uuidv4(),
        ...input,
      },
    });

    return submission ? SubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  static createModelFromDatabaseRecord(record: SubmissionRecord): Submission {
    const submission = new Submission({ id: record.id, html: record.html, css: record.css, js: record.js });

    return submission;
  }
}