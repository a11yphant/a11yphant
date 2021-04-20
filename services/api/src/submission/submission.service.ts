import { Injectable } from "@nestjs/common";
import { Submission as SubmissionRecord } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { PrismaService } from "../prisma/prisma.service";
import { Submission } from "./models/submission.model";
import { SubmissionInput } from "./submission.input";

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

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

    return submission ? SubmissionService.createModelFromDatabaseRecord(submission) : null;
  }

  static createModelFromDatabaseRecord(record: SubmissionRecord): Submission {
    const submission = new Submission({ id: record.id, html: record.html, css: record.css, js: record.js, levelId: record.levelId });

    return submission;
  }
}
