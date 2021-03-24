import { PrismaModule } from "@a11y-challenges/prisma";
import { Module } from "@nestjs/common";

import { ChallengeModule } from "../challenge/challenge.module";
import { ResultResolver } from "./result.resolver";
import { SubmissionResolver } from "./submission.resolver";
import { SubmissionService } from "./submission.service";

@Module({
  imports: [PrismaModule, ChallengeModule],
  providers: [SubmissionResolver, SubmissionService, ResultResolver],
})
export class SubmissionModule {}
