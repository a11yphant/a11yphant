import { AwsMessagingModule } from "@a11yphant/nestjs-aws-messaging";
import { Module } from "@nestjs/common";

import { ChallengeModule } from "../challenge/challenge.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ResultResolver } from "./result.resolver";
import { SubmissionResolver } from "./submission.resolver";
import { SubmissionService } from "./submission.service";

@Module({
  imports: [PrismaModule, AwsMessagingModule, ChallengeModule],
  providers: [SubmissionResolver, SubmissionService, ResultResolver],
})
export class SubmissionModule {}
