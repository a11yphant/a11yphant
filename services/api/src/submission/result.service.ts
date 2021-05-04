import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { Result } from "./models/result.model";

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService) {}

  async findOneForSubmission(id: string): Promise<Result> {
    const record = await this.prisma.result.findFirst({
      where: {
        submissionId: id,
      },
    });

    return record ? new Result({ id: record.id, status: record.status, submissionId: record.submissionId }) : null;
  }
}
