import { AwsMessagingModule } from "@a11yphant/nestjs-aws-messaging";
import { Logger, Module } from "@nestjs/common";

import { ChallengeModule } from "../challenge/challenge.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ResultResolver } from "./result.resolver";
import { SubmissionController } from "./submission.controller";
import { SubmissionResolver } from "./submission.resolver";
import { SubmissionService } from "./submission.service";

@Module({
  imports: [PrismaModule, AwsMessagingModule, ChallengeModule],
  controllers: [SubmissionController],
  providers: [SubmissionResolver, SubmissionService, ResultResolver, Logger],
})
export class SubmissionModule {}
