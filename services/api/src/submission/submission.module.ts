import { PrismaModule } from "@a11y-challenges/prisma";
import { Module } from "@nestjs/common";

import { SubmissionResolver } from "./submission.resolver";
import { SubmissionService } from "./submission.service";

@Module({
  imports: [PrismaModule],
  providers: [SubmissionResolver, SubmissionService],
})
export class SubmissionModule {}
